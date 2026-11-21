#!/usr/bin/env node
// Converts a photo into the character grid that the hero draws.
//
//   node scripts/build-portrait.mjs path/to/photo.jpg
//   node scripts/build-portrait.mjs path/to/photo.jpg --cols 100 --gamma 1.2
//   node scripts/build-portrait.mjs --placeholder
//
// The photo stays on your machine. Only the grid (src/data/portrait.ts) goes into the repo.
// Needs macOS: scripts/portrait-cutout.swift uses the Vision framework to cut the person
// out of the background and to find the face.
//
// The script shows only what the photo has. The frame starts a little above the hair and
// ends where a shoulder reaches the side of the photo, so no edge of the photo cuts the figure.
// The page puts the bottom of the frame on the bottom of the screen.
//
// Options
//   --cols N        characters per row (default 90)
//   --bottom N      where the frame ends, as a part of the photo height from 0 to 1
//                   (default: where a shoulder reaches the side of the photo)
//   --gamma N       above 1 lightens the midtones, below 1 darkens them (default 1)
//   --sharpen N     local contrast (default 0.7)
//   --keep-background   do not remove the background

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, '../src/data/portrait.ts');
const CELL = 0.6; // width / height of one character cell. The renderer uses the same value.
const LEVELS = 16;
const VALUE_OPTIONS = ['cols', 'bottom', 'gamma', 'sharpen'];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(argv[i + 1]);
};
const photo = argv.find((a, i) => !a.startsWith('--') && !VALUE_OPTIONS.includes((argv[i - 1] ?? '').slice(2)));

const cols = option('cols', 90);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const percentile = (sorted, p) => sorted[clamp(Math.round(p * (sorted.length - 1)), 0, sorted.length - 1)];

function readPGM(path) {
  const file = readFileSync(path);
  // Header: "P5\n<width> <height>\n255\n", then raw bytes.
  let offset = 0;
  const fields = [];
  while (fields.length < 4) {
    let end = offset;
    while (file[end] !== 0x0a && file[end] !== 0x20) end++;
    fields.push(file.subarray(offset, end).toString('ascii'));
    offset = end + 1;
  }
  const [, width, height] = fields.map(Number);
  return { width, height, pixels: file.subarray(offset) };
}

/** The part of the photo to show: { x, y, w, h } in pixels. */
function frameOf(mask, hasMask) {
  const { width: W, height: H } = mask;
  if (!hasMask) return { x: 0, y: 0, w: W, h: H };
  const on = (x, y) => mask.pixels[y * W + x] > 128;
  const rowHasPerson = (y) => {
    for (let x = 0; x < W; x++) if (on(x, y)) return true;
    return false;
  };

  // Top of the hair.
  let top = 0;
  while (top < H - 1 && !rowHasPerson(top)) top++;

  // The row where a shoulder reaches the side of the photo. The mask is weak on the
  // outermost pixels, so the test column is a few pixels inside.
  const inset = Math.max(2, Math.round(W * 0.015));
  const reaches = (x) => {
    if (!on(x, H - 1)) return H;
    let y = H - 1;
    while (y > top && on(x, y - 1)) y--;
    return y;
  };
  let bottom = Math.min(reaches(inset), reaches(W - 1 - inset));
  if (argv.includes('--bottom')) bottom = Math.round(option('bottom', 1) * H);
  bottom = clamp(bottom, top + 1, H);

  // The width of the person between those rows, with a small margin.
  let left = W;
  let right = 0;
  for (let y = top; y < bottom; y++) {
    for (let x = 0; x < W; x++) {
      if (!on(x, y)) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
    }
  }
  const side = Math.round((right - left) * 0.03);
  const x = Math.max(0, left - side);
  const y = Math.max(0, top - Math.round((bottom - top) * 0.07));
  return { x, y, w: Math.min(W, right + 1 + side) - x, h: bottom - y };
}

function fromPhoto(path) {
  const work = mkdtempSync(join(tmpdir(), 'portrait-'));
  try {
    const prefix = join(work, 'p');
    const report = JSON.parse(
      execFileSync('swift', [join(here, 'portrait-cutout.swift'), resolve(path), prefix, '1100'], {
        encoding: 'utf8',
      }),
    );
    const gray = readPGM(`${prefix}.gray.pgm`);
    const mask = readPGM(`${prefix}.mask.pgm`);
    const W = gray.width;
    const keepBackground = flag('keep-background') || !report.hasMask;
    if (!report.face) console.warn('No face found. The tones use the full figure.');

    const frame = frameOf(mask, report.hasMask);
    const rows = Math.round((cols * CELL * frame.h) / frame.w);

    // Each cell is the mean of 4 x 4 samples of the photo.
    const STEPS = 4;
    const ink = new Float32Array(cols * rows);
    const alpha = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let inkSum = 0;
        let alphaSum = 0;
        for (let j = 0; j < STEPS; j++) {
          for (let i = 0; i < STEPS; i++) {
            const px = Math.floor(frame.x + ((x + (i + 0.5) / STEPS) / cols) * frame.w);
            const py = Math.floor(frame.y + ((y + (j + 0.5) / STEPS) / rows) * frame.h);
            const a = keepBackground ? 1 : mask.pixels[py * W + px] / 255;
            inkSum += (1 - gray.pixels[py * W + px] / 255) * a;
            alphaSum += a;
          }
        }
        ink[y * cols + x] = alphaSum ? inkSum / alphaSum : 0;
        alpha[y * cols + x] = alphaSum / (STEPS * STEPS);
      }
    }

    // Tone range. It comes from the face only, so that skin stays light and the eyes,
    // brows and mouth stay dark. Hair and clothes then go to the ends of the range.
    const inFace = (x, y) => {
      if (!report.face) return true;
      const f = report.face;
      const px = frame.x + ((x + 0.5) / cols) * frame.w;
      const py = frame.y + ((y + 0.5) / rows) * frame.h;
      return px > f.x && px < f.x + f.w && py > f.y && py < f.y + f.h;
    };
    const tones = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (alpha[y * cols + x] > 0.5 && inFace(x, y)) tones.push(ink[y * cols + x]);
      }
    }
    tones.sort((a, b) => a - b);
    const lo = percentile(tones, 0.06);
    const hi = percentile(tones, 0.985);
    const gamma = option('gamma', 1);
    for (let i = 0; i < ink.length; i++) {
      ink[i] = Math.pow(clamp((ink[i] - lo) / (hi - lo || 1), 0, 1), gamma);
    }

    // Local contrast, so the eyes, nose and mouth stay readable at this size.
    const amount = option('sharpen', 0.7);
    const sharp = new Float32Array(ink.length);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0;
        let count = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue;
            sum += ink[yy * cols + xx];
            count++;
          }
        }
        const i = y * cols + x;
        sharp[i] = clamp(ink[i] + amount * (ink[i] - sum / count), 0, 1);
      }
    }

    return { source: 'photo', rows, value: (i) => sharp[i] * alpha[i] };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

// A lit bust made from two ellipsoids. It holds the place of the photo.
function placeholder() {
  const aspect = 0.78;
  const rows = Math.round((cols * CELL) / aspect);
  const light = [-0.52, -0.56, 0.64];
  const shade = (px, py, cx, cy, rx, ry) => {
    const nx = (px - cx) / rx;
    const ny = (py - cy) / ry;
    const d = nx * nx + ny * ny;
    if (d > 1) return null;
    const nz = Math.sqrt(1 - d);
    return Math.max(0, nx * light[0] + ny * light[1] + nz * light[2]);
  };
  const values = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = ((x + 0.5) / cols - 0.5) * aspect;
      const py = (y + 0.5) / rows - 0.5;
      const head = shade(px, py, 0, -0.15, 0.16, 0.21);
      const body = shade(px, py, 0, 0.53, 0.43, 0.37);
      const neck = Math.abs(px) < 0.066 && py > 0 && py < 0.24 ? 0.42 : null;
      const lit = head ?? neck ?? body;
      values[y * cols + x] = lit === null ? 0 : 0.18 + 0.82 * (1 - lit);
    }
  }
  return { source: 'placeholder', rows, value: (i) => values[i] };
}

if (!photo && !flag('placeholder')) {
  console.error('Give a photo path, or --placeholder. See the top of this file for the options.');
  process.exit(1);
}

const { source, rows, value } = photo ? fromPhoto(photo) : placeholder();

const lines = [];
for (let y = 0; y < rows; y++) {
  let line = '';
  for (let x = 0; x < cols; x++) {
    line += Math.round(value(y * cols + x) * (LEVELS - 1)).toString(LEVELS);
  }
  lines.push(line);
}

writeFileSync(
  OUT,
  `// Generated by scripts/build-portrait.mjs. Do not edit by hand.
// Each character is one cell: 0 is blank paper, f is the darkest ink.

export const portrait: { source: 'photo' | 'placeholder'; cols: number; rows: number; data: string[] } = {
  source: '${source}',
  cols: ${cols},
  rows: ${rows},
  data: [
${lines.map((l) => `    '${l}',`).join('\n')}
  ],
};
`,
);
console.log(`Wrote ${OUT} (${cols} x ${rows} = ${cols * rows} characters, source: ${source})`);
