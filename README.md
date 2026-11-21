# Portfolio

The personal site of Samyak Gupta. Live at https://samyakgupta04.github.io/Portfolio/.

Vite, React and TypeScript. No UI library and no animation library. The fonts are bundled with the site.

## Run it

```bash
npm ci
npm run dev      # http://localhost:5173/Portfolio/
npm run build    # type-check, then build to dist/
```

## Deploy

A push to `main` starts `.github/workflows/deploy.yml`. The workflow builds the site and publishes it to GitHub Pages.

The site is served from `/Portfolio/`, so two rules apply:

- Do not write absolute asset paths such as `/resume.pdf`. Use `import.meta.env.BASE_URL` or an import.
- Keep the site static. GitHub Pages does not run server code.

## Change the words

All the text is in `src/data/content.ts`.

## Change the portrait

The hero draws a portrait from characters. The grid is in `src/data/portrait.ts`, and a script makes that file from a photo:

```bash
node scripts/build-portrait.mjs photo.local/source.jpg
```

- The script needs macOS. It uses the Vision framework to remove the background and to find the face.
- The script shows only what the photo has. The frame ends where a shoulder reaches the side of the photo, and the page puts that edge on the bottom of the screen.
- The photo does not go into the repository. `photo.local/` is in `.gitignore` (the `*.local` rule).
- The options for size, crop and contrast are at the top of the script.

## Design rules

- Two colors: black and white. No grays and no gradients. One accent color, for the role line in the hero only.
- Hierarchy comes from size and weight, not from color.
- Glass is used for things that float: the nav, the caption plate, and the contact section, which inverts the page behind it.
