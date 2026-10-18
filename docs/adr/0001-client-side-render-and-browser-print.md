# Render the CV in the browser and export PDF with the browser's print

The CV lives on GitHub Pages as plain static files: `index.html` fetches `cv.json` and renders it with vanilla JS, and "Download PDF" calls `window.print()` against a print stylesheet. We chose this over a static site generator (Astro/Eleventy) plus a CI job that renders a PDF with Playwright, because the CV is one page edited a few times a year: editing `cv.json` and pushing should be the whole workflow, with no npm, no Actions and no build to keep alive.

## Consequences

- The page is blank without JavaScript, and link previews/crawlers see little content. Accepted: the CV is reached by links Peerapob sends, not by search.
- The PDF depends on the viewer's browser print engine, so margins and page breaks can differ slightly between Chrome and Safari. Print CSS is tuned for Chrome, and any PDF that gets sent out is produced by Peerapob from Chrome.
- Reversible later: a build step or CI-generated PDF can be added on top of the same `cv.json` without changing the data.
