# Small Games — the catalogue site

The studio site: every game in one place, each one playable in the browser without
installing anything.

Live at **https://jiawenzhu.github.io/small-games-site/**

## What is here

| Path | What it is |
|---|---|
| `index.html` | The catalogue. Every game comes from the `GAMES` list in `site.js`. |
| `site.js` | The game list, and the code that renders the hero chips and the tile wall. |
| `styles.css` | The whole design. Tokens are lifted from the games' own `LightShell.ts`. |
| `play/` | The playable build — the five TikTok games running in a browser. |
| `privacy/`, `terms/` | Required before TikTok silent login will work. See below. |
| `assets/` | Key art, and the Bunny Escape hero image. |

No build step, no dependencies. It is HTML, one stylesheet and one script.

## Adding or changing a game

Edit the `GAMES` array in `site.js` and drop a 512×512 WebP in `assets/`. The hero chip,
the tile, the spec table and the play link all come from that one entry.

Keep the numbers honest — level counts are taken from the shipping builds.

## Refreshing the playable build

The games live in the `small-games-tiktok` repo. After a change there:

```bash
cp "<games repo>/web-preview/bundle.js" play/bundle.js && cp "<games repo>"/web-preview/art/* play/art/
```

`play/index.html` boots that bundle, reads `?game=<id>`, and with `chrome=0` drops the
back-to-site chip and skips the how-to card — that is the mode the hero iframe uses.

## Why privacy/ and terms/ exist

They are not boilerplate. TikTok requires a Terms of Service URL and a Privacy Policy URL
in each mini game's app settings, and silent login fails with error 102102 without them.
These two pages are what those fields point at.

**They describe what the games actually do** — on-device save data, no backend, no
analytics, ads served by TikTok. If the games ever gain a server, a leaderboard or an
analytics call, these pages have to change in the same commit.

## Deploying

GitHub Pages, from `main` at the repository root. `.nojekyll` is there so Pages serves
the directories as they are.
