const AMBIENCE_COPY = Object.freeze({
  clear: { icon: "C", label: "Clear glow", phrase: "The Den feels bright and ready for a small adventure." },
  partly: { icon: "P", label: "Soft lights", phrase: "Soft light moves across the world. A good moment to check in with the pack." },
  cloud: { icon: "Q", label: "Quiet mood", phrase: "The world feels a little quieter — perfect for cards, care or a calm break." },
  night: { icon: "N", label: "Night lights", phrase: "The signature colors glow while the Pack Lounge settles into its night rhythm." },
});

export function localAmbience(now = Date.now()) {
  const hour = new Date(now).getHours();
  const cycle = Math.floor(now / 21_600_000) % 3;
  const kind = hour < 7 || hour >= 21 ? "night" : ["partly", "cloud", "clear"][cycle];
  const temperature = [18, 20, 22][cycle];
  return {
    version: 2,
    fetchedAt: now,
    source: "local",
    kind,
    temperature,
    precipitation: 0,
    cloudCover: kind === "cloud" ? 72 : kind === "partly" ? 42 : 12,
    isDay: kind !== "night",
    ...AMBIENCE_COPY[kind],
  };
}
