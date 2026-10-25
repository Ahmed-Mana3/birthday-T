# ✦ Ebtehal · Twenty

A curious little birthday universe for **Ebtehal Mansour**, who turned 20 on **25 October 2026**.

No build step, no dependencies. Just open `index.html` in a browser.

## The experience

| # | Chapter | What happens |
|---|---------|--------------|
| 0 | **The Gate** | A sealed envelope from "the Universe". Press and hold the wax seal to break it. |
| — | **Hero** | A giant **20** made of star particles. Move through it and they scatter; click it and it explodes. |
| I | **The Name** | ابتهال: what her name means, plus an acrostic of E‑b‑t‑e‑h‑a‑l. |
| II | **The Odometer** | Live counters since her birth: seconds, heartbeats, km travelled around the Sun, laps (to 8 decimals), plus a countdown to lap 21. |
| III | **The Day You Arrived** | A ticket for Wednesday 25 Oct 2006 that renders the real moon phase of that night, plus a mini 2006 timeline. |
| IV | **Cabinet of Curiosities** | 20 drawers, one for each year, each hiding a wish. |
| V | **The Wish** | A cake with 20 candles. Blow into the microphone, tap the candles, or press the button. |
| VI | **The Letter** | Sealed until every candle is out, then it types itself out in handwriting. |
| — | **Finale** | Fireworks on demand. |

**3 hidden secrets** (counter in the bottom-left; click it for hints):
1. Type `ebtehal` anywhere, or tap her name 7 times, for a meteor shower.
2. Click the moon 3 times to make it full.
3. Open all 20 drawers.

There's also a music-box "Happy Birthday" synthesised live with Web Audio (toggle in the bottom-right).

## Personalise it

Everything you'd want to change is in the `CONFIG` block at the top of `script.js`:

- `curiosities`: the 20 drawer messages (add inside jokes and shared memories here)
- `letter`: the letter text
- `acrostic`: the word for each letter of her name

To change the letter's signature, edit `— with love, always` in `index.html`.

## Share it

The site is fully static, so any free host works:

- **Netlify Drop**: drag this folder onto <https://app.netlify.com/drop>
- **GitHub Pages**: push the repo, then go to Settings → Pages → deploy from `main`
- **Vercel**: `npx vercel` in this folder

> The microphone feature needs HTTPS (all of the hosts above provide it). When it isn't available, tapping the candles or pressing the button still works.

## Notes

- Respects `prefers-reduced-motion`.
- Fonts: Fraunces, Space Mono, Caveat and Amiri (Google Fonts), with system fallbacks if offline.
