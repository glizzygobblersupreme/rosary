# Rosary

A phone-first companion for praying and learning the Rosary. It opens on the
mysteries for the day, puts a whole decade on one screen, and remembers where
you stopped so you can split the Rosary across the day.

Live at **https://glizzygobblersupreme.github.io/rosary/**

## On your phone

Open the address above, then add it to your home screen (Safari: Share → Add to
Home Screen; Chrome: menu → Add to Home screen / Install). After the first
visit everything is cached on the phone, so it opens and runs with no network.
When a new version has been published, the start screen offers to update; nothing
reloads on its own while you are praying.

Settings and today's place are stored in the phone's browser, per phone.

## While praying

- Tap anywhere to move one step: mystery, Our Father, each Hail Mary, Glory Be, Fatima Prayer.
  The current prayer is marked and scrolled into view. Android vibrates on each bead,
  longer when the ten are done.
- Using your own beads? Turn off the on-screen counter in settings and swipe left (or press the
  button at the bottom right) once per decade. Each prayer still notes when to move along the beads.
- The bar at the top opens the list of all seven parts; tap any to jump there.
- Settings: mark prayers you know by heart to shrink them to their first words, turn
  optional prayers and the bead strip on or off, text size, light or dark.

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`: tests, build, deploy to
GitHub Pages. The repository must have Pages set to deploy from GitHub Actions
(Settings → Pages → Source). The app is built for the `/rosary/` path; change
`BASE` in `vite.config.ts` if the repository is renamed or a custom domain is used.

## Develop

    npm install
    npm run dev       # http://localhost:5173/rosary/
    npm test          # schedule, sequence, bead-guide and progress logic
    npm run build     # typecheck + production build into dist/
    npm run preview   # serve dist/ locally, service worker included
    node scripts/make-icons.mjs   # regenerate icons

All wording lives in `src/data/prayers.ts` and `src/data/mysteries.ts`.
Scripture is from the Douay-Rheims Bible (public domain).
