/* =====================================================================================
   The catalogue. One list of games, rendered into the hero chips and the tile wall.
   =====================================================================================
   Everything on the page comes from GAMES below, so adding a game is one entry here and
   one image in assets/. Every number is a real one — levels are counted from the
   shipping builds, not rounded up for the page.
   ===================================================================================== */

const GAMES = [
  {
    id: 'nyandoku',
    name: 'Nyandoku',
    cn: '貓咪數獨',
    colour: '#45c0ae',
    art: 'assets/key_nyandoku.webp',
    blurb:
      'One cat per row, per column and per colour, and no two cats may touch — not even ' +
      'at the corners. Fifty boards from a gentle 4×4 up to a 9×9 that takes real thought.',
    specs: { Levels: '50', Kind: 'Logic', Where: 'TikTok' },
    playable: true,
  },
  {
    id: 'savedoge',
    name: 'Save Doge',
    cn: '畫線救狗',
    colour: '#f2922f',
    art: 'assets/key_savedoge.webp',
    blurb:
      'Draw one line to shield a dog from a swarm of bees for six seconds. The line is ' +
      'not a wall — it is a rigid body with mass and spin, so every sting moves it.',
    specs: { Levels: '5', Kind: 'Physics', Where: 'TikTok' },
    playable: true,
  },
  {
    id: 'appleworm',
    name: 'Apple Worm',
    cn: '貪吃蘋果蟲',
    colour: '#5fbf57',
    art: 'assets/key_appleworm.webp',
    blurb:
      'A snake with gravity. Eat to grow longer, then use your own body as the bridge ' +
      'across the gap you could not cross a moment ago.',
    specs: { Levels: '5', Kind: 'Puzzle', Where: 'TikTok' },
    playable: true,
  },
  {
    id: 'parabox',
    name: 'Paradox Box',
    cn: '無限套盒',
    colour: '#6a8bf0',
    art: 'assets/key_parabox.webp',
    blurb:
      'Sokoban that folds into itself. Push the box across the room, or step inside the ' +
      'box and push the room instead.',
    specs: { Levels: '5', Kind: 'Mind-bend', Where: 'TikTok' },
    playable: true,
  },
  {
    id: 'isleofglass',
    name: 'Isle of Glass',
    cn: '琉璃之島',
    colour: '#a878e6',
    art: 'assets/key_isleofglass.webp',
    blurb:
      'Cut a pane of stained glass into pieces, each holding one number, each exactly ' +
      'that many squares in size. No timer, no fail state.',
    specs: { Levels: '5', Kind: 'Zen', Where: 'TikTok' },
    playable: true,
  },
];

const FEATURE = {
  id: 'bunnyescape',
  name: 'Bunny Escape',
  sub: 'Forest Rescue',
  cn: '兔兔大逃亡',
  colour: '#b06ab3',
  art: 'assets/bunny-hero.webp',
  blurb:
    'Monsters keep taking Doudou. You are Bubu: sneak into the house without waking ' +
    'anything, break the trap, and run for the rainbow together. Twenty houses across ' +
    'forests, the sea floor, mountains, desert and sky — on foot, swimming, and finally ' +
    'on a dragon.',
  specs: { Levels: '20', Kind: '3D adventure', Where: 'App Store' },
  href: 'https://apps.apple.com/app/id6817218343',
  site: 'https://bunny-escape-2026.web.app/',
};

const el = (tag, attrs = {}, kids = []) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' || k === 'class') n.setAttribute(k, v);
    else if (k.startsWith('aria-') || k === 'role' || k === 'href' || k === 'src' || k === 'alt' || k === 'loading' || k === 'rel' || k === 'type')
      n.setAttribute(k, v);
    else n[k] = v;
  }
  for (const kid of [].concat(kids)) n.append(kid);
  return n;
};

function specList(specs) {
  const dl = el('dl', { class: 'specs' });
  for (const [k, v] of Object.entries(specs)) {
    const cell = el('div');
    cell.append(el('dt', {}, k), el('dd', {}, v));
    dl.append(cell);
  }
  return dl;
}

/* --- the hero phone, and the chips that change what is in it ------------------------- */

const frame = document.getElementById('stagePhone');
const swap = document.getElementById('swap');

function showInPhone(game) {
  frame.src = `play/?game=${game.id}&chrome=0`;
  frame.title = `${game.name}, playable`;
  for (const b of swap.children) b.setAttribute('aria-pressed', String(b.dataset.id === game.id));
}

for (const g of GAMES) {
  const b = el('button', { type: 'button', style: `--dot:${g.colour}` });
  b.dataset.id = g.id;
  b.setAttribute('aria-pressed', String(g.id === 'nyandoku'));
  b.append(el('b', { 'aria-hidden': 'true' }), g.name);
  b.addEventListener('click', () => showInPhone(g));
  swap.append(b);
}

/* --- the wall -------------------------------------------------------------------------- */

const wall = document.getElementById('wall');

function gameTile(g, wide) {
  const tile = el('article', {
    // Five games in a two-up grid would leave the last one stranded, so the last one
    // takes the whole row — and being the calm, no-fail-state game, it suits the space.
    class: 'tile game' + (wide ? ' feature flip' : ''),
    style: `--dot:${g.colour}`,
  });

  const art = el('div', { class: 'art' });
  art.append(el('img', { src: g.art, alt: `Key art for ${g.name}`, loading: 'lazy' }));

  const body = el('div', { class: 'body' });
  const h = el('h3', {}, g.name);
  h.append(el('span', { lang: 'zh-Hant' }, g.cn));
  body.append(h, el('p', {}, g.blurb), specList(g.specs));

  const row = el('div', { class: 'row' });
  row.append(el('a', { class: 'btn', href: `play/?game=${g.id}` }, 'Play it here'));
  row.append(el('span', { class: 'flag' }, 'Coming to TikTok'));
  body.append(row);

  tile.append(art, body);
  return tile;
}

function featureTile(g) {
  const tile = el('article', { class: 'tile game feature', style: `--dot:${g.colour}` });

  const art = el('div', { class: 'art' });
  art.append(el('img', { src: g.art, alt: 'Bubu and Doudou in the forest', loading: 'lazy' }));

  const body = el('div', { class: 'body' });
  const h = el('h3', {}, `${g.name}: ${g.sub}`);
  h.append(el('span', { lang: 'zh-Hant' }, g.cn));
  body.append(h, el('p', {}, g.blurb), specList(g.specs));

  const row = el('div', { class: 'row' });
  row.append(el('a', { class: 'btn', href: g.href, rel: 'noopener' }, 'Get it on the App Store'));
  row.append(el('a', { class: 'btn ghost', href: g.site, rel: 'noopener' }, 'Game site'));
  body.append(row);

  tile.append(art, body);
  return tile;
}

wall.append(featureTile(FEATURE));
GAMES.forEach((g, i) => wall.append(gameTile(g, i === GAMES.length - 1)));
wall.append(
  el(
    'p',
    { class: 'note' },
    'The five TikTok games are built and playable; their TikTok listings are in review.'
  )
);
