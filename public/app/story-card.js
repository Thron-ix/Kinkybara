import { CAPY_HEIGHT, CAPY_PIXELS, CAPY_WIDTH, drawCapyFur } from "./pet-art.js";
import { GEAR_ART, tintedGearSource } from "./gear-art.js";
import { WORLD_ART, availableStoryDecorations, selectedStoryDecoration } from "./world-art.js";
import { t } from "./i18n.js";

export const STORY_SIZE = Object.freeze({ width: 1080, height: 1920 });
export const STORY_LOOKS = Object.freeze({
  studio: { background: "#19181d", foreground: "#f3eee5", panel: "#26242c", muted: "#b5adb8" },
  neon: { background: "#161525", foreground: "#f8f0ff", panel: "#242038", muted: "#bfb2d0" },
  print: { background: "#eee7dc", foreground: "#24212a", panel: "#ded5c8", muted: "#645963" },
});
export function normalizeStoryOptions(value) {
  return { look: Object.hasOwn(STORY_LOOKS, value?.look) ? value.look : "studio", mirrored: value?.mirrored === true, decoration: Object.hasOwn(WORLD_ART, value?.decoration) ? value.decoration : "none" };
}
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
    dirty: state.clean < 38,
    decorations: availableStoryDecorations(state.inventory),
  };
}

export function storyAssetPaths(appearance, options = {}) {
  const decoration = selectedStoryDecoration(appearance, options);
  return [...new Set([
    ...appearance.gear.map((id) => GEAR_ART[id].asset),
    ...(appearance.hood ? HOOD_ASSETS : []),
    ...(decoration && decoration !== "neon_lamp" ? [WORLD_ART[decoration].asset] : []),
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
export async function renderStoryCard(canvas, appearance, options = {}) {
  const normalized = normalizeStoryOptions(options);
  const { look, mirrored } = normalized;
  const decoration = selectedStoryDecoration(appearance, normalized);
  const theme = STORY_LOOKS[look];
  const paths = storyAssetPaths(appearance, normalized);
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
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
  rect(0, 0, 1080, 1920, theme.background);
  rect(76, 135, 42, 8, appearance.primary);
  rect(126, 135, 42, 8, appearance.secondary);
  text(ctx, t(appearance.language, "story.eyebrow"), 76, 211, 39, theme.foreground);
  text(ctx, appearance.name, 70, 350, 138, theme.foreground, 932);
  rect(76, 390, 928, 2, theme.muted);

  if (look === "print") {
    // Two offset screen-print slabs; deliberately chunky rather than scenery.
    rect(112, 492, 798, 563, theme.foreground);
    rect(148, 456, 798, 563, appearance.primary);
    rect(148, 456, 798, 12, theme.foreground);
    rect(934, 456, 12, 563, theme.foreground);
    ctx.save(); ctx.globalAlpha = .25;
    for (let y = 488; y < 1010; y += 24) for (let x = 176; x < 930; x += 24) rect(x, y, 4, 4, theme.foreground);
    ctx.restore();
  } else {
    const halo = ctx.createRadialGradient(620, 805, 25, 620, 805, 510);
    halo.addColorStop(0, look === "neon" ? "#695779" : "#51464b");
    halo.addColorStop(.58, theme.panel);
    halo.addColorStop(1, theme.background);
    ctx.fillStyle = halo; ctx.fillRect(0, 420, 1080, 760);
    ctx.save();
    ctx.strokeStyle = look === "neon" ? appearance.primary : "#77717d";
    ctx.lineWidth = look === "neon" ? 7 : 2;
    if (look === "neon") { ctx.shadowBlur = 28; ctx.shadowColor = appearance.primary; }
    ctx.strokeRect(117, 496, 846, 552);
    ctx.restore();
    if (look === "neon") {
      ctx.save(); ctx.globalAlpha = .15;
      for (let y = 474; y < 1090; y += 28) rect(76, y, 928, 2, theme.foreground);
      ctx.restore();
      rect(965, 684, 11, 190, appearance.secondary);
    }
  }
  ctx.fillStyle = look === "print" ? "#c3baad" : "#100f15";
  ctx.beginPath(); ctx.ellipse(540, 1118, 420, 31, 0, 0, Math.PI * 2); ctx.fill();
  if (decoration === "neon_lamp") {
    ctx.save(); ctx.strokeStyle = appearance.primary; ctx.lineWidth = 8;
    ctx.shadowBlur = 25; ctx.shadowColor = appearance.primary;
    ctx.strokeRect(103, 479, 874, 654); ctx.restore();
  }

  ctx.save();
  ctx.translate(mirrored ? 950 : 130, 650);
  ctx.scale(mirrored ? -14 : 14, 14);
  const drawGear = (layer) => {
    for (const id of appearance.gear) {
      const art = GEAR_ART[id];
      if ((art.gearLayer || "body") !== layer) continue;
      ctx.save();
      ctx.imageSmoothingEnabled = !["soft_collar", "sturdy_boots", "sport_socks", "signature_socks"].includes(id);
      for (const fit of art.wear) ctx.drawImage(gearImages[id], fit.x, fit.y, fit.width, fit.height);
      ctx.restore();
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
  drawCapyFur(ctx, appearance.palette, appearance.dirty);
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
  if (decoration && decoration !== "neon_lamp") {
    const size = decoration === "tiny_speaker" ? { width: 195, height: 100 } : decoration === "juice_bar" ? { width: 172, height: 122 } : { width: 90, height: 130 };
    const x = mirrored ? 76 : 1004 - size.width;
    contain(ctx, images[WORLD_ART[decoration].asset], { x, y: 1158 - size.height, ...size });
    if (decoration === "tiny_speaker") { text(ctx, "♪", x + 16, 1036, 27, theme.foreground); text(ctx, "♫", x + 136, 1020, 25, theme.foreground); }
  }
  // No prompts or decorations in the editing space: y=1180…1610 stays clear.
  rect(0, 1180, 1080, 740, theme.background);
  rect(76, 1660, 928, 2, theme.muted);
  text(ctx, "KINKYBARA", 76, 1730, 47, theme.foreground);
  text(ctx, "thron-ix.github.io/Kinkybara", 76, 1780, 28, theme.muted);
  rect(908, 1698, 42, 16, appearance.primary);
  rect(962, 1698, 42, 16, appearance.secondary);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("Story export unavailable"));
  }, "image/png"));
}
