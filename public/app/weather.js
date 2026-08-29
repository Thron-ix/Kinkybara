const AMBIENCE_COPY = Object.freeze({
  clear: { icon: "C", label: "Clear glow", phrase: "The Den feels bright and ready for a small adventure." },
  partly: { icon: "P", label: "Soft lights", phrase: "Soft light moves across the world. A good moment to check in with the pack." },
  cloud: { icon: "Q", label: "Quiet mood", phrase: "The world feels a little quieter — perfect for cards, care or a calm break." },
  night: { icon: "N", label: "Night lights", phrase: "The signature colors glow while the Pack Lounge settles into its night rhythm." },
});

const AMBIENCE_COPY_DE = Object.freeze({
  clear: { icon: "C", label: "Klares Leuchten", phrase: "Die Höhle wirkt hell und bereit für ein kleines Abenteuer." },
  partly: { icon: "P", label: "Sanftes Licht", phrase: "Sanftes Licht wandert durch die Welt. Ein guter Moment, beim Pack nachzusehen." },
  cloud: { icon: "Q", label: "Ruhige Stimmung", phrase: "Die Welt wirkt etwas ruhiger — perfekt für Karten, Pflege oder eine entspannte Pause." },
  night: { icon: "N", label: "Nachtlichter", phrase: "Die Signaturfarben leuchten, während die Pack Lounge ihren Nachtrhythmus findet." },
});

export function localAmbience(now = Date.now(), language = "en") {
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
    ...(language === "de" ? AMBIENCE_COPY_DE[kind] : AMBIENCE_COPY[kind]),
  };
}
