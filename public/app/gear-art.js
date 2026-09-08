// Wear positions use the same 56 × 34 coordinate grid as pet-art.js. They scale
// with the actual sprite (including small screens), not a second growth scale.
// Body gear sits below the hood; eyewear sits above it. Each leg gets its own
// piece instead of stretching a single strip across the space between legs.
const asset = (name) => `./assets/gear-${name}.png`;
const harnessFit = [{ x: 10, y: 7, width: 32, height: 23 }];
const ankles = [{ x: 8.5, y: 27, width: 8.5, height: 5.5 }, { x: 30.5, y: 27, width: 8.5, height: 5.5 }];

export const GEAR_ART = Object.freeze({
  round_glasses: { asset: asset("round-glasses"), gearLayer: "face", wear: [{ x: 32.5, y: 7, width: 19, height: 8 }] },
  neon_visors: { asset: asset("neon-visor"), gearLayer: "face", wear: [{ x: 32, y: 6.5, width: 20, height: 8 }] },
  soft_collar: { asset: asset("leather-collar-v4"), wear: [{ x: 31.5, y: 12.5, width: 12, height: 14 }] },
  pack_bandana: { asset: asset("pack-bandana"), wear: [{ x: 30, y: 15, width: 15, height: 13 }] },
  soft_harness: { asset: asset("ring-harness"), wear: harnessFit },
  cross_harness: { asset: asset("cross-harness"), wear: harnessFit },
  reflective_harness: { asset: asset("reflective-harness"), wear: harnessFit },
  paw_warmers: { asset: asset("paw-warmer-v2"), wear: [{ x: 9, y: 29, width: 7, height: 4 }, { x: 31, y: 29, width: 7, height: 4 }] },
  sturdy_boots: { asset: asset("pixel-boot"), wear: [{ x: 8, y: 24.5, width: 10, height: 9.5 }, { x: 30, y: 24.5, width: 10, height: 9.5 }] },
  ankle_cuffs: { asset: asset("leather-cuff"), wear: ankles },
  thigh_cuffs: { asset: asset("leather-cuff"), wear: [{ x: 7.5, y: 23, width: 10, height: 6.5 }, { x: 29.5, y: 23, width: 10, height: 6.5 }] },
  sport_socks: { asset: asset("pixel-sock"), wear: [{ x: 8.5, y: 24, width: 9, height: 10 }, { x: 30.5, y: 24, width: 9, height: 10 }] },
  signature_socks: { asset: asset("pixel-sock"), tint: "primary", wear: [{ x: 8.5, y: 24, width: 9, height: 10 }, { x: 30.5, y: 24, width: 9, height: 10 }] },
  signature_tail: { asset: asset("pup-tail"), tint: "primary", gearLayer: "back", wear: [{ x: -8, y: 10, width: 16, height: 17 }] },
});

const tintedSources = new Map();

// Multiply preserves the drawn fabric, seams and dark outline; destination-in
// restores the original alpha. Both the game and the Story use this same image.
export function tintedGearSource(assetPath, color) {
  const key = `${assetPath}:${color}`;
  if (!tintedSources.has(key)) {
    const result = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(image, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) { reject(error); }
      };
      image.onerror = () => reject(new Error("Gear artwork unavailable"));
      image.src = assetPath;
    }).catch((error) => { tintedSources.delete(key); throw error; });
    tintedSources.set(key, result);
  }
  return tintedSources.get(key);
}
