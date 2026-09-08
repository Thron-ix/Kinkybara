import { CAPY_HEIGHT, CAPY_PIXELS, CAPY_WIDTH } from "./pet-art.js";
import { GEAR_ART, tintedGearSource } from "./gear-art.js";
import { t } from "./i18n.js";

export const STORY_SIZE = Object.freeze({ width: 1080, height: 1920 });
const HOOD_ASSETS = ["base", "primary-mask", "secondary-mask"].map((name) => `./assets/pup-hood-${name}.png`);

// Capture appearance only, never needs, travel history, friends or the save itself.
// Computed styles retain the same fur colors and hood fit even while the pet is away.
export function captureStoryAppearance(state, capy) {
  const palette = {};
  for (const code of new Set(CAPY_PIXELS.join(""))) {
    if (code === ".") continue;
    const pixel = capy.querySelector(`.pixel-${code}`);
    if (pixel) palette[code] = getComputedStyle(pixel).backgroundColor;
  }
  const style = getComputedStyle(capy);
  const hoodElement = capy.querySelector('.outfit-piece[data-slot="hood"]');
  let hood = null;
  if (hoodElement) {
    const layer = getComputedStyle(hoodElement.parentElement);
    const piece = getComputedStyle(hoodElement);
    const scale = new DOMMatrix(layer.transform).a;
    const px = parseFloat(style.width) / CAPY_WIDTH;
    hood = {
      x: (parseFloat(style.width) / 2 + (parseFloat(layer.width) / 2 - parseFloat(piece.right) - parseFloat(piece.width)) * scale) / px,
      y: (parseFloat(style.height) + (parseFloat(piece.top) - parseFloat(layer.height)) * scale) / px,
      width: parseFloat(piece.width) * scale / px,
      height: parseFloat(piece.height) * scale / px,
      primary: getComputedStyle(hoodElement, "::before").backgroundColor,
      secondary: getComputedStyle(hoodElement, "::after").backgroundColor,
    };
  }
  return {
    name: state.name,
    language: state.language,
    primary: style.getPropertyValue("--accent-primary").trim(),
    secondary: style.getPropertyValue("--accent-secondary").trim(),
    palette,
    hood,
    gear: Object.values(state.inventory.equipped).filter((id) => Object.hasOwn(GEAR_ART, id)),
  };
}

export function storyAssetPaths(appearance) {
  return [...new Set([
    ...appearance.gear.map((id) => GEAR_ART[id].asset),
    ...(appearance.hood ? HOOD_ASSETS : []),
  ])];
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Story artwork unavailable: ${src}`));
    image.src = src;
  });
}

function contain(ctx, image, box) {
  const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(image, box.x + (box.width - width) / 2, box.y + (box.height - height) / 2, width, height);
}

function tintMask(image, color) {
  const mask = document.createElement("canvas");
  mask.width = image.naturalWidth;
  mask.height = image.naturalHeight;
  const ctx = mask.getContext("2d");
  ctx.drawImage(image, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, mask.width, mask.height);
  return mask;
}

function text(ctx, value, x, y, size, color, maxWidth = 880) {
  ctx.fillStyle = color;
  do {
    ctx.font = `bold ${size}px "Courier New", monospace`;
    size -= 1;
  } while (ctx.measureText(value).width > maxWidth && size > 16);
  ctx.fillText(value, x, y);
}

// One local PNG is both the preview and the export. No DOM serialization,
// third-party renderer, remote font, upload or platform account is needed.
export async function renderStoryCard(canvas, appearance) {
  const paths = storyAssetPaths(appearance);
  const loaded = await Promise.all(paths.map(loadImage));
  const images = Object.fromEntries(paths.map((path, index) => [path, loaded[index]]));
  const gearImages = Object.fromEntries(await Promise.all(appearance.gear.map(async (id) => {
    const art = GEAR_ART[id];
    return [id, art.tint ? await loadImage(await tintedGearSource(art.asset, appearance.primary)) : images[art.asset]];
  })));
  canvas.width = STORY_SIZE.width;
  canvas.height = STORY_SIZE.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const ink = "#251c27";
  const cream = "#fff6e5";
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

  rect(0, 0, 1080, 1920, cream);
  rect(0, 0, 1080, 1110, "#343849");
  rect(0, 0, 1080, 26, appearance.primary);
  rect(540, 0, 540, 26, appearance.secondary);
  text(ctx, t(appearance.language, "story.eyebrow"), 84, 227, 34, cream);
  text(ctx, appearance.name, 78, 360, 132, cream, 920);
  rect(84, 403, 58, 12, appearance.primary);
  rect(150, 403, 58, 12, appearance.secondary);

  // Pixel sun and quiet hills echo the world without carrying its controls over.
  rect(823, 477, 126, 150, "#f2cb6d");
  rect(799, 501, 174, 102, "#f2cb6d");
  rect(823, 501, 102, 78, "#ffde85");
  for (const [x, y] of [[99, 559], [234, 485], [721, 428]]) {
    rect(x, y + 9, 30, 10, cream);
    rect(x + 10, y, 10, 30, cream);
  }
  ctx.fillStyle = "#718b69";
  ctx.beginPath(); ctx.ellipse(123, 974, 460, 251, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#587b61";
  ctx.beginPath(); ctx.ellipse(1070, 985, 512, 284, 0, 0, Math.PI * 2); ctx.fill();
  rect(0, 1002, 1080, 108, "#52644a");
  ctx.fillStyle = "#40573e";
  ctx.beginPath(); ctx.ellipse(540, 1030, 414, 34, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(130, 563);
  ctx.scale(14, 14);
  const drawGear = (layer) => {
    for (const id of appearance.gear) {
      const art = GEAR_ART[id];
      if ((art.gearLayer || "body") !== layer) continue;
      for (const fit of art.wear) ctx.drawImage(gearImages[id], fit.x, fit.y, fit.width, fit.height);
    }
  };
  drawGear("back");
  for (let y = 0; y < CAPY_HEIGHT; y += 1) {
    for (let x = 0; x < CAPY_WIDTH; x += 1) {
      const code = CAPY_PIXELS[y][x];
      if (!appearance.palette[code]) continue;
      // A small smile for the portrait, without changing the pet's actual mood.
      const offset = code === "k" ? (x === 49 || x === 53 ? -0.45 : x === 51 ? 0.45 : 0) : 0;
      rect(x, y + offset, 1, 1, appearance.palette[code]);
    }
  }
  drawGear("body");
  if (appearance.hood) {
    const hood = appearance.hood;
    const base = images[HOOD_ASSETS[0]];
    contain(ctx, base, hood);
    // All three hood assets share the same transparent canvas and contain fit.
    const width = base.naturalWidth;
    const height = base.naturalHeight;
    const scale = Math.min(hood.width / width, hood.height / height);
    for (const [index, color] of [[1, hood.primary], [2, hood.secondary]]) {
      const mask = tintMask(images[HOOD_ASSETS[index]], color);
      ctx.drawImage(mask, hood.x + (hood.width - width * scale) / 2, hood.y + (hood.height - height * scale) / 2, width * scale, height * scale);
    }
  }
  drawGear("face");
  ctx.restore();
  rect(0, 1110, 1080, 810, cream);
  rect(0, 1094, 1080, 16, "#789463");
  // Intentionally empty: y=1110…1640 is reserved for the owner's Story text.
  text(ctx, "KINKYBARA", 84, 1710, 62, ink);
  text(ctx, "thron-ix.github.io/Kinkybara", 84, 1760, 28, ink);
  rect(84, 1791, 56, 10, appearance.primary);
  rect(148, 1791, 56, 10, appearance.secondary);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("Story export unavailable"));
  }, "image/png"));
}
