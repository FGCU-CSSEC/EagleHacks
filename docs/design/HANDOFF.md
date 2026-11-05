# EagleHacks 2027 homepage redesign: handoff

## What's in here

Unzip this at the root of the EagleHacks repo. It drops files into:

- `public/brand/`: white logos (eagle, wordmark, 2027, CSSEC, INIT FGCU) plus dark-ink versions of the eagle and wordmark
- `public/photos/`: four EagleHacks 2026 photos, already resized and converted to WebP (65–150 KB each)
- `docs/design/homepage-desktop.html`: the desktop mockup source (visual spec, not production code)
- `docs/design/homepage-mobile.html`: the 390px mobile mockup source, with the menu and FAQ accordion behavior
- `docs/design/HANDOFF.md`: this file

Also add two screenshots of the mockups from the design canvas, for example `docs/design/desktop.png` and `docs/design/mobile.png`.

## Prompt for Claude Code

Paste this into Claude Code from the repo root:

```
Re-skin the homepage to match the design in docs/design/: homepage-desktop.html,
homepage-mobile.html, and the screenshots. Treat those files as a visual spec,
not code to copy. They use inline styles and a mockup runtime (x-dc, sc-for,
sc-if); rebuild them as normal Next.js + Tailwind components.

Work on a new branch. Do the hero and photo mosaic first, then stop so I can
review before you do the rest.

Keep the existing architecture:
- Content stays in src/config/site.ts (dates, FAQ, organizers, sponsors, links).
  Update links: Instagram https://www.instagram.com/init.fgcu/ and LinkedIn
  https://www.linkedin.com/company/init-fgcu. Remove Discord everywhere.
  Sync the FAQ answers with the mockup ("valid ID", no Discord mention).
- Colors and fonts go in the tokens at the top of src/app/globals.css:
  ink #111111, paper #F3F0E8, body text on dark #D9D4C8, muted #A9A397 (on dark)
  and #5C5850 (on light), rules on dark #4A4741, accent #2F6FD6.
  Swap fonts to Archivo using @fontsource-variable/archivo (it includes the
  width axis). Headlines: font-stretch 62.5%, weight 800 to 900, uppercase,
  tight line-height (about 0.86). Small labels: 12px, bold, uppercase,
  letter-spacing 0.14em.
- Keep RegisterButton and its registration states. In the hero the primary CTA
  is "Sponsor EagleHacks"; the application status sits next to it as plain text.
- Keep the MLH trust badge comment and reserve the top-right corner for it.
- Use next/image for every image in public/brand and public/photos.

Sections, in order:
1. Dark hero: wordmark image + 2027 image, date line, venue line, CTA.
   The eagle is oversized and cropped off the right edge (desktop); on mobile it
   sits below the copy, cropped off the right and bottom.
2. Photo mosaic on dark: 12-column grid, two 300px rows. Crowd photo spans 5
   columns and both rows, team photo top middle, a paper-colored
   "36 hours. 200 hackers. One weekend." tile bottom middle, and the portrait
   award photo spans 3 columns and both rows on the right.
3. About on paper: "Build. Learn. Meet." headline, intro, three columns.
4. Dark sponsors band with the sponsor-booth photo and "Request the sponsor
   packet" button (mailto fgcu.cssec@gmail.com).
5. FAQ: two columns on desktop, an accordion on mobile (one open at a time,
   buttons with aria-expanded).
6. Team: placeholder names until the 2027 board is set.
7. Dark footer: eagle + wordmark, "Organized by" with the CSSEC and INIT FGCU
   logos, then links.

Mobile (follow homepage-mobile.html): under 760px the nav becomes a working
"Menu" button that opens a full-screen dark menu; CTAs go full width; the
mosaic becomes 2 columns (crowd across the top, award tall on the left);
section padding drops to about 72px; side margins 20px. Tap targets are at
least 44px.

Don't touch the backend: no changes to Supabase, src/lib, the admin routes,
or the migrations. When done, run lint and build and fix any errors.
```

## Tips

- Review one section at a time in the browser at both desktop and phone width.
- Open a PR so the backend owner can check that nothing outside the frontend changed.
- The 2027 graphic is about 560px wide. Swap in an SVG or a larger export if it looks soft on high-res screens.
