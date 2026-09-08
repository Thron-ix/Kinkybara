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
  soft_collar: { asset: asset("leather-collar"), wear: [{ x: 31, y: 12, width: 13, height: 18 }] },
  pack_bandana: { asset: asset("pack-bandana"), wear: [{ x: 30, y: 15, width: 15, height: 13 }] },
  soft_harness: { asset: asset("ring-harness"), wear: harnessFit },
  cross_harness: { asset: asset("cross-harness"), wear: harnessFit },
  reflective_harness: { asset: asset("reflective-harness"), wear: harnessFit },
  paw_warmers: { asset: asset("paw-warmer"), wear: [{ x: 8.5, y: 26, width: 8.5, height: 6.5 }, { x: 30.5, y: 26, width: 8.5, height: 6.5 }] },
  sturdy_boots: { asset: asset("leather-boot"), wear: [{ x: 8, y: 26, width: 9.5, height: 8 }, { x: 30, y: 26, width: 9.5, height: 8 }] },
  ankle_cuffs: { asset: asset("leather-cuff"), wear: ankles },
  thigh_cuffs: { asset: asset("leather-cuff"), wear: [{ x: 7.5, y: 23, width: 10, height: 6.5 }, { x: 29.5, y: 23, width: 10, height: 6.5 }] },
});
