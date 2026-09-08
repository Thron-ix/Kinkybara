export const CAPY_WIDTH = 56;
export const CAPY_HEIGHT = 34;

function ellipse(x, y, cx, cy, rx, ry) {
  return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
}

function bodyMask(x, y) {
  const back = ellipse(x, y, 20.5, 18.4, 19.5, 10.7);
  const shoulder = ellipse(x, y, 33, 17.6, 11.8, 10.5);
  const head = ellipse(x, y, 42.2, 13.8, 10.8, 10.6);
  const muzzle = ellipse(x, y, 50, 18.1, 7.5, 5.7);
  const ear = ellipse(x, y, 37.5, 5.1, 4.1, 3.9);
  const rearLeg = x >= 9 && x <= 15 && y >= 23 && y <= 32;
  const frontLeg = x >= 31 && x <= 37 && y >= 23 && y <= 32;
  return back || shoulder || head || muzzle || ear || rearLeg || frontLeg;
}

function isOutline(x, y) {
  if (!bodyMask(x, y)) return false;
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !bodyMask(x + dx, y + dy));
}

export function capyPixelAt(x, y) {
  if (!bodyMask(x, y)) return ".";
  if ((x === 45 || x === 46) && (y === 10 || y === 11)) return x === 45 && y === 10 ? "g" : "e";
  if ((x === 45 || x === 46) && (y === 15 || y === 16)) return "b";
  if (x >= 53 && x <= 55 && y >= 17 && y <= 19) return "n";
  if (x >= 49 && x <= 53 && y === 22) return "k";
  if (x >= 36 && x <= 39 && y >= 4 && y <= 7) return "i";
  if ((x >= 10 && x <= 15 && y >= 30) || (x >= 32 && x <= 37 && y >= 30)) return "p";
  if (isOutline(x, y)) return "d";
  if (x >= 43 && y >= 14 && y <= 22) return "q";
  if ((y >= 10 && y <= 12 && x >= 9 && x <= 34) || (x >= 34 && x <= 41 && y >= 8 && y <= 10)) return "l";
  if (ellipse(x, y, 47, 17, 2.6, 2.3)) return "r";
  if ((x + y) % 17 === 0 && x < 39) return "s";
  if ((x * 3 + y) % 23 === 0 && x < 40 && y < 24) return "h";
  return "m";
}

export const CAPY_PIXELS = Object.freeze(
  Array.from({ length: CAPY_HEIGHT }, (_, y) =>
    Array.from({ length: CAPY_WIDTH }, (_, x) => capyPixelAt(x, y)).join(""),
  ),
);

// Finer fur lives INSIDE the original grid mask. Face cells stay untouched so
// existing expressions, hood alignment and every equipment anchor still fit.
const FUR_CODES = new Set(["m", "l", "s", "h", "r", "q", "d", "p", "i"]);
export const FUR_SCALE = 4;
export function furCellAt(x, y) {
  const code = CAPY_PIXELS[Math.floor(y)]?.[Math.floor(x)];
  return FUR_CODES.has(code) ? code : null;
}

export function drawCapyFur(ctx, palette, dirty = false) {
  ctx.save();
  // Retain the finer base, then bring back the familiar blocky coat markings.
  for (let y = 0; y < CAPY_HEIGHT; y += 1) for (let x = 0; x < CAPY_WIDTH; x += 1) {
    const code = furCellAt(x, y);
    if (!code) continue;
    ctx.fillStyle = palette[["l", "s", "h", "r"].includes(code) ? "m" : code];
    ctx.fillRect(x, y, 1, 1);
  }
  for (let y = 0; y < CAPY_HEIGHT; y += 1) for (let x = 0; x < CAPY_WIDTH; x += 1) {
    const code = furCellAt(x, y);
    if (code === "l") {
      ctx.globalAlpha = .78; ctx.fillStyle = palette.l;
      ctx.fillRect(x, y, 1, 1);
    } else if (code === "s") {
      ctx.globalAlpha = .27; ctx.fillStyle = palette.d;
      ctx.fillRect(x + .25, y, .75, 1);
    } else if (code === "h") {
      ctx.globalAlpha = .7; ctx.fillStyle = palette.l;
      ctx.fillRect(x + .25, y + .25, .5, .5);
    }
  }
  // Four subpixels per source pixel, deterministic short tufts, no random flicker.
  for (let sy = 0; sy < CAPY_HEIGHT * FUR_SCALE; sy += 1) for (let sx = 0; sx < CAPY_WIDTH * FUR_SCALE; sx += 1) {
    const x = sx / FUR_SCALE, y = sy / FUR_SCALE;
    const code = furCellAt(x, y);
    if (!code || ["d", "p", "i"].includes(code)) continue;
    const hash = ((sx * 73856093) ^ (sy * 19349663)) >>> 0;
    const light = Math.max(0, 1 - Math.abs(y - (10.5 + Math.sin(x / 10))) / 7);
    ctx.globalAlpha = light * .2;
    ctx.fillStyle = palette.l;
    ctx.fillRect(x, y, .25, .25);
    if (hash % 11 === 0) {
      ctx.globalAlpha = .12;
      ctx.fillStyle = hash % 2 ? palette.l : palette.d;
      ctx.fillRect(x, y, .25, .25);
    }
    if (hash % 43 === 0) {
      // Short staggered hairs follow the flank, not a uniform noise texture.
      ctx.globalAlpha = dirty ? .29 : .19;
      ctx.fillStyle = hash % 2 ? palette.l : palette.d;
      for (const [dx, dy] of [[0, 0], [.25, .25], [.25, .5]]) {
        const next = furCellAt(x + dx, y + dy);
        if (next && !["d", "p", "i"].includes(next)) ctx.fillRect(x + dx, y + dy, .25, .25);
      }
    }
    if (dirty) {
      const muddy = Math.sin(x * .7 + y * .4) + Math.cos(y * .8 - x * .3) > .9 && y > 14;
      if (muddy || hash % 19 < 3) {
        ctx.globalAlpha = muddy ? .27 : .4;
        ctx.fillStyle = palette.d;
        ctx.fillRect(x, y, .25, .25);
      }
    }
  }
  // Small directional clumps suggest ruffled fur without changing the outline.
  if (dirty) {
    ctx.globalAlpha = .42; ctx.fillStyle = palette.d;
    for (let y = 11; y < 28; y += 3) for (let x = 6 + y % 4; x < 40; x += 5) {
      for (const [dx, dy] of [[0, .5], [.25, .25], [.5, 0], [.75, .25]]) {
        if (furCellAt(x + dx, y + dy) && !["d", "p"].includes(furCellAt(x + dx, y + dy))) ctx.fillRect(x + dx, y + dy, .25, .5);
      }
    }
  }
  ctx.restore();
}
