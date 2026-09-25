# Rosary

A phone-first companion for praying and learning the Rosary. It opens on the
mysteries for the day, puts a whole decade on one screen, and remembers where
you stopped so you can split the Rosary across the day.

## Use it on your phone

1. Build (from WSL, in this folder): `npm install` once, then `npm run build`
2. Serve (from Windows): double-click `start.bat`
3. Open the address it prints (or scan the QR code) on a phone on the same Wi-Fi.
   The first time, Windows Firewall asks about Node: allow it on private networks.

The server has to run on the Windows side because a phone cannot reach WSL's
network. `npm start` inside WSL still works for checking on this computer.

`dist/` is a plain static site. Put it on any HTTPS host (GitHub Pages, Netlify)
and it becomes installable to the home screen and works offline; no code changes.

## While praying

- Tap anywhere to move one step: mystery, Our Father, each Hail Mary, Glory Be, Fatima Prayer.
  The current prayer is marked and scrolled into view. Android vibrates on each bead,
  longer when the ten are done.
- Using your own beads? Ignore the counter and swipe left (or press the button at the
  bottom right) once per decade.
- The bar at the top opens the list of all seven parts; tap any to jump there.
- Settings: mark prayers you know by heart to shrink them to their first words, turn
  optional prayers on or off, text size, light or dark.

Progress and settings are stored in the phone's browser and reset each new day.

## Develop

    npm run dev     # Vite dev server
    npm test        # schedule, sequence and progress logic
    npm run build   # typecheck + production build
    node scripts/make-icons.mjs   # regenerate icons

All wording lives in `src/data/prayers.ts` and `src/data/mysteries.ts`.
Scripture is from the Douay-Rheims Bible (public domain).
