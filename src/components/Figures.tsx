import type { ReactNode } from 'react';
import type { FigureId } from '../data/content';

/*
  One small diagram for each item in the Work section.
  All of them use the same 400 x 260 grid and the same four parts:
  Box, Arrow, Tag and Metric. Lines draw themselves when a figure appears.
*/

type Point = [number, number];

/** A box with one or two centered lines. `solid` marks the part that does the main work. */
function Box({ at, size, lines, solid }: { at: Point; size: Point; lines: string[]; solid?: boolean }) {
  const [x, y] = at;
  const [w, h] = size;
  return (
    <g className={solid ? 'fig-solid' : undefined}>
      <rect className="fig-box" x={x} y={y} width={w} height={h} pathLength={1} />
      {lines.map((line, i) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + (i - (lines.length - 1) / 2) * 13} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  );
}

/** A line through the points, with a head at the end. */
function Arrow({ points, dashed }: { points: Point[]; dashed?: boolean }) {
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <polyline
        className={dashed ? 'fig-dash' : 'fig-stroke'}
        points={points.map((p) => p.join(',')).join(' ')}
        pathLength={dashed ? undefined : 1}
      />
      <path className="fig-fill" d="M-7,-3.5 L0,0 L-7,3.5 Z" transform={`translate(${x2},${y2}) rotate(${angle})`} />
    </g>
  );
}

/** A label that sits on a line. The paper-colored backing cuts the line behind it. */
function Tag({ at, children }: { at: Point; children: string }) {
  const width = children.length * 6.1 + 12;
  return (
    <g>
      <rect className="fig-paper" x={at[0] - width / 2} y={at[1] - 8} width={width} height={16} />
      <text x={at[0]} y={at[1]} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** A large number with its label on the same line. Sits below the rule at the foot of a figure. */
function Metric({ row = 0, value, label }: { row?: number; value: string; label: string }) {
  // The number and its label are one line of text. A second metric goes on the next line.
  return (
    <text x={20} y={216 + row * 28}>
      <tspan className="fig-num">{value}</tspan>
      <tspan dx={7}>{label}</tspan>
    </text>
  );
}

const Rule = () => <line className="fig-stroke" x1={20} y1={192} x2={380} y2={192} pathLength={1} />;

/* ---------- The seven figures ---------- */

function Funnel() {
  // One number and one label for each stage of the funnel.
  const stages: [number, string, string][] = [
    [43, '100K+', 'tokens'],
    [107, '200', 'hotspots'],
    [169, '20', 'candidates'],
  ];
  return (
    <>
      <polygon className="fig-stroke" points="20,20 380,20 250,206 150,206" pathLength={1} />
      <line className="fig-stroke" x1={63.3} y1={82} x2={336.7} y2={82} pathLength={1} />
      <line className="fig-stroke" x1={106.7} y1={144} x2={293.3} y2={144} pathLength={1} />
      {stages.map(([y, value, label]) => (
        <g key={label}>
          <text className="fig-num" x={200} y={y} textAnchor="middle">
            {value}
          </text>
          <text x={200} y={y + 17} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
      <Tag at={[200, 82]}>Regex</Tag>
      <Tag at={[200, 144]}>Semantic search</Tag>
      <Tag at={[200, 206]}>Local LLM</Tag>
      <Arrow
        points={[
          [200, 215],
          [200, 230],
        ]}
      />
      <Box at={[140, 232]} size={[120, 26]} lines={['Verdict']} solid />
    </>
  );
}

function Guardrails() {
  return (
    <>
      <text x={65} y={14} textAnchor="middle">
        User input
      </text>
      <Arrow
        points={[
          [65, 23],
          [65, 50],
        ]}
      />
      <Box at={[20, 52]} size={[90, 40]} lines={['Mask PII']} solid />
      <Arrow
        points={[
          [110, 72],
          [140, 72],
        ]}
      />
      <rect className="fig-dash" x={142} y={40} width={116} height={64} />
      <text x={200} y={29} textAnchor="middle">
        Agent nodes
      </text>
      <line className="fig-stroke" x1={177} y1={72} x2={189} y2={72} pathLength={1} />
      <line className="fig-stroke" x1={211} y1={72} x2={223} y2={72} pathLength={1} />
      {[166, 200, 234].map((cx) => (
        <circle key={cx} className="fig-box" cx={cx} cy={72} r={11} pathLength={1} />
      ))}
      <Arrow
        points={[
          [258, 72],
          [288, 72],
        ]}
      />
      <Box at={[290, 52]} size={[90, 40]} lines={['Govern', 'output']} solid />
      <Arrow
        points={[
          [335, 92],
          [335, 118],
        ]}
      />
      <text x={335} y={129} textAnchor="middle">
        Response
      </text>

      {/* The canary: a marker planted in the agent. If it leaks, something injected a prompt. */}
      <line className="fig-dash" x1={200} y1={83} x2={200} y2={140} />
      <path className="fig-fill" d="M200,140 L210,150 L200,160 L190,150 Z" />
      <text x={200} y={173} textAnchor="middle">
        Canary token
      </text>
      <Arrow
        points={[
          [212, 150],
          [296, 150],
        ]}
        dashed
      />
      <text x={304} y={150}>
        A leak means
      </text>
      <text x={304} y={164}>
        injection
      </text>

      <Rule />
      <Metric value="6+" label="products" />
      <Metric row={1} value="−40%" label="latency, ONNX Runtime" />
    </>
  );
}

function Agent() {
  return (
    <>
      <Arrow
        points={[
          [320, 44],
          [320, 20],
          [60, 20],
          [60, 44],
        ]}
        dashed
      />
      <Tag at={[190, 20]}>Numbers checked against source</Tag>
      <Box at={[20, 46]} size={[80, 40]} lines={['Flight', 'data']} />
      <Arrow
        points={[
          [100, 66],
          [128, 66],
        ]}
      />
      <Box at={[130, 46]} size={[110, 40]} lines={['Rules', 'diagnose']} solid />
      <Arrow
        points={[
          [240, 66],
          [258, 66],
        ]}
      />
      <Box at={[260, 46]} size={[120, 40]} lines={['LLM', 'narrates']} />
      <Arrow
        points={[
          [320, 86],
          [320, 128],
        ]}
      />
      <Box at={[240, 130]} size={[140, 44]} lines={['Rank fixes', 'Thompson sampling']} />
      <Box at={[20, 130]} size={[110, 44]} lines={['Analyst']} />
      <Arrow
        points={[
          [240, 142],
          [132, 142],
        ]}
      />
      <Arrow
        points={[
          [130, 162],
          [238, 162],
        ]}
      />
      <text x={185} y={132} textAnchor="middle">
        Top fixes
      </text>
      <text x={185} y={174} textAnchor="middle">
        Feedback
      </text>
      <Rule />
      <Metric value="+3%" label="revenue, national airline" />
    </>
  );
}

function Optimizer() {
  return (
    <>
      <Box at={[20, 30]} size={[90, 40]} lines={['Traces']} />
      <Arrow
        points={[
          [110, 50],
          [138, 50],
        ]}
      />
      <Box at={[140, 30]} size={[120, 40]} lines={['GEPA', 'tunes prompts']} solid />
      <Arrow
        points={[
          [260, 50],
          [288, 50],
        ]}
      />
      <Box at={[290, 30]} size={[90, 40]} lines={['Model', 'per task']} />
      <Arrow
        points={[
          [335, 70],
          [335, 130],
          [262, 130],
        ]}
      />
      <Box at={[140, 110]} size={[120, 40]} lines={['Evaluate', 'on dev set']} />
      <Arrow
        points={[
          [140, 130],
          [65, 130],
          [65, 72],
        ]}
      />
      <Rule />
      <Metric value="~20%" label="lower estimated cost" />
      <Metric row={1} value="+25 pts" label="dev-set accuracy" />
    </>
  );
}

function Evals() {
  // Four arrow heads on the circle, each turned along its direction of travel.
  const heads: [number, number, number][] = [
    [259.4, 66.6, 45],
    [259.4, 185.4, 135],
    [140.6, 185.4, 225],
    [140.6, 66.6, 315],
  ];
  return (
    <>
      <circle className="fig-stroke" cx={200} cy={126} r={84} pathLength={1} />
      {heads.map(([x, y, turn]) => (
        <path
          key={turn}
          className="fig-fill"
          d="M-7,-3.5 L0,0 L-7,3.5 Z"
          transform={`translate(${x},${y}) rotate(${turn})`}
        />
      ))}
      <Box at={[130, 24]} size={[140, 36]} lines={['Production', 'traffic']} solid />
      <Box at={[226, 108]} size={[116, 36]} lines={['Human review']} />
      <Box at={[136, 192]} size={[128, 36]} lines={['Golden dataset']} />
      <Box at={[56, 106]} size={[120, 40]} lines={['Re-validate', 'model + prompt']} />
    </>
  );
}

function Serving() {
  return (
    <>
      <text x={14} y={22}>
        Requests
      </text>
      {[42, 54, 66].map((y) => (
        <Arrow
          key={y}
          points={[
            [14, y],
            [46, y],
          ]}
        />
      ))}
      <Box at={[48, 34]} size={[108, 40]} lines={['Single-flight', 'merges copies']} />
      <Arrow
        points={[
          [156, 54],
          [188, 54],
        ]}
      />
      <text x={245} y={16} textAnchor="middle">
        3-layer cache
      </text>
      {[28, 47, 66].map((y) => (
        <rect key={y} className="fig-fill" x={190} y={y} width={110} height={14} />
      ))}
      <Arrow
        points={[
          [300, 54],
          [334, 54],
        ]}
      />
      <text x={340} y={54}>
        Response
      </text>

      {/* The slow query runs off the request path. */}
      <Box at={[30, 128]} size={[110, 40]} lines={['Databricks', '12-min query']} />
      <Arrow
        points={[
          [140, 148],
          [188, 148],
        ]}
      />
      <Box at={[190, 128]} size={[120, 40]} lines={['Prefetch worker', 'rate-limited']} />
      <Arrow
        points={[
          [245, 128],
          [245, 84],
        ]}
      />
      <text x={254} y={106}>
        Fills
      </text>

      <Rule />
      <text x={20} y={212}>
        Bounded semaphore
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => (
        <rect key={slot} className="fig-fill" x={20 + slot * 18} y={226} width={12} height={12} />
      ))}
      <text x={176} y={232}>
        8 model calls at once
      </text>
    </>
  );
}

function Geospatial() {
  // Tree crowns in one 110 x 110 tile: x, y, radius.
  const crowns: [number, number, number][] = [
    [20, 22, 8],
    [48, 18, 6],
    [80, 25, 9],
    [28, 52, 7],
    [60, 50, 8],
    [90, 58, 6],
    [22, 85, 8],
    [52, 88, 7],
    [84, 90, 8],
  ];
  // The corridor is the band between two parallel lines.
  const inCorridor = ([x, y]: [number, number, number]) => y - 0.36 * x > 25 && y - 0.36 * x < 55;
  const tile = (x: number, body: ReactNode, label: string, note: string) => (
    <g>
      <g transform={`translate(${x},24)`}>
        <rect className="fig-box" width={110} height={110} pathLength={1} />
        {body}
      </g>
      <text x={x + 55} y={150} textAnchor="middle">
        {label}
      </text>
      <text x={x + 55} y={164} textAnchor="middle">
        {note}
      </text>
    </g>
  );
  // A drawn line needs pathLength 1. A dashed line must keep its real length.
  const corridor = (className: 'fig-stroke' | 'fig-dash') => {
    const pathLength = className === 'fig-stroke' ? 1 : undefined;
    return (
      <>
        <line className={className} x1={0} y1={25} x2={110} y2={64.6} pathLength={pathLength} />
        <line className={className} x1={0} y1={55} x2={110} y2={94.6} pathLength={pathLength} />
      </>
    );
  };
  return (
    <>
      {tile(
        20,
        <>
          {corridor('fig-dash')}
          {crowns.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} className="fig-fill" cx={x} cy={y} r={r} />
          ))}
        </>,
        'Orthomosaic',
        'UAV image',
      )}
      <Arrow
        points={[
          [132, 79],
          [144, 79],
        ]}
      />
      {tile(
        145,
        crowns.map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle className="fig-fill" cx={x} cy={y} r={r} />
            <rect
              className="fig-stroke"
              x={x - r - 3}
              y={y - r - 3}
              width={2 * r + 6}
              height={2 * r + 6}
              pathLength={1}
            />
          </g>
        )),
        'Crowns found',
        'YOLOv8',
      )}
      <Arrow
        points={[
          [257, 79],
          [269, 79],
        ]}
      />
      {tile(
        270,
        <>
          {corridor('fig-stroke')}
          {crowns.map((crown) => (
            <circle
              key={`${crown[0]}-${crown[1]}`}
              className={inCorridor(crown) ? 'fig-fill' : 'fig-box'}
              cx={crown[0]}
              cy={crown[1]}
              r={crown[2]}
              pathLength={1}
            />
          ))}
        </>,
        'Corridor impact',
        'scored',
      )}
      <Rule />
      <Metric value="0.94" label="F1, crown segmentation" />
    </>
  );
}

function Restoration() {
  // A small monument in one 110 x 110 tile: a hall with an arch, a dome and two towers.
  const solids = [
    'M38,44 Q38,22 55,18 Q72,22 72,44 Z', // dome
    'M22,44 H88 V98 H22 Z', // hall
    'M10,98 V36 H18 V98 Z', // left tower
    'M8,36 Q14,24 20,36 Z',
    'M92,98 V36 H100 V98 Z', // right tower
    'M90,36 Q96,24 102,36 Z',
  ];
  const arch = 'M42,98 V70 Q42,54 55,49 Q68,54 68,70 V98 Z';
  const monument = (lines: boolean) => (
    <>
      {solids.map((d) => (
        <path key={d} className={lines ? 'fig-stroke' : 'fig-fill'} d={d} pathLength={lines ? 1 : undefined} />
      ))}
      <path className={lines ? 'fig-stroke' : 'fig-paper'} d={arch} pathLength={lines ? 1 : undefined} />
      <line className="fig-stroke" x1={55} y1={18} x2={55} y2={9} pathLength={1} />
      <line className="fig-stroke" x1={4} y1={98} x2={106} y2={98} pathLength={1} />
    </>
  );
  // The missing region.
  const hole = (filled: boolean) => (
    <>
      {filled && <rect className="fig-paper" x={56} y={28} width={36} height={36} />}
      <rect className="fig-dash" x={56} y={28} width={36} height={36} />
    </>
  );
  const tile = (x: number, body: ReactNode, label: string, note: string) => (
    <g>
      <g transform={`translate(${x},24)`}>
        <rect className="fig-box" width={110} height={110} pathLength={1} />
        {body}
      </g>
      <text x={x + 55} y={150} textAnchor="middle">
        {label}
      </text>
      <text x={x + 55} y={164} textAnchor="middle">
        {note}
      </text>
    </g>
  );
  return (
    <>
      {tile(
        20,
        <>
          {monument(false)}
          {hole(true)}
        </>,
        'Damaged photo',
        'a region is missing',
      )}
      <Arrow
        points={[
          [132, 79],
          [144, 79],
        ]}
      />
      {tile(
        145,
        <>
          {monument(true)}
          {hole(false)}
        </>,
        'Edge map',
        'Canny, ControlNet',
      )}
      <Arrow
        points={[
          [257, 79],
          [269, 79],
        ]}
      />
      {tile(270, monument(false), 'Restored', 'LoRA-tuned model')}
      <Rule />
      <Metric value="33.26 dB" label="PSNR, faces, 5% mask" />
      <Metric row={1} value="0.955" label="SSIM" />
    </>
  );
}

const figures: Record<FigureId, { caption: string; draw: () => ReactNode }> = {
  funnel: { caption: 'Only 20 passages reach the LLM', draw: Funnel },
  guardrails: { caption: 'A gate on each side of the agent', draw: Guardrails },
  agent: { caption: 'Rules decide, the LLM explains', draw: Agent },
  optimizer: { caption: 'A loop that tunes prompts and models', draw: Optimizer },
  evals: { caption: 'Real traffic becomes the test set', draw: Evals },
  serving: { caption: 'The slow query leaves the request path', draw: Serving },
  geospatial: { caption: 'From drone image to corridor score', draw: Geospatial },
  restoration: { caption: 'A drawing of the method, not model output', draw: Restoration },
};

const order = Object.keys(figures) as FigureId[];

export default function Figure({ id }: { id: FigureId }) {
  const { caption, draw: Draw } = figures[id];
  const number = order.indexOf(id) + 1;
  return (
    <figure className="figure">
      <svg viewBox="0 0 400 260" role="img" aria-label={caption}>
        <Draw />
      </svg>
      <figcaption className="meta">
        Figure {number}. {caption}.
      </figcaption>
    </figure>
  );
}
