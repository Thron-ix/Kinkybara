const AMBIENCE_COPY = Object.freeze({
  clear: { label: "Sunny", phrase: "Berlin reference: sunny and clear." },
  partly: { label: "Partly cloudy", phrase: "Berlin reference: bright with a few clouds." },
  cloud: { label: "Cloudy", phrase: "Berlin reference: cloudy." },
  night: { label: "Night", phrase: "Berlin reference: night-time conditions." },
});

const AMBIENCE_COPY_DE = Object.freeze({
  clear: { label: "Sonnig", phrase: "Berlin-Referenz: sonnig und klar." },
  partly: { label: "Heiter", phrase: "Berlin-Referenz: heiter bis leicht bewölkt." },
  cloud: { label: "Bewölkt", phrase: "Berlin-Referenz: bewölkt." },
  night: { label: "Nacht", phrase: "Berlin-Referenz: nächtliche Bedingungen." },
});

const BERLIN_SEASONAL_TEMPERATURE = Object.freeze([3, 4, 7, 11, 15, 18, 20, 20, 16, 11, 7, 4]);

export function localAmbience(now = Date.now(), language = "en") {
  const date = new Date(now);
  const hour = date.getHours();
  const cycle = (date.getDate() + Math.floor(hour / 6)) % 3;
  const kind = hour < 7 || hour >= 21 ? "night" : ["partly", "cloud", "clear"][cycle];
  const daytimeOffset = hour < 9 || hour >= 20 ? -2 : hour >= 12 && hour < 18 ? 2 : 0;
  const temperature = BERLIN_SEASONAL_TEMPERATURE[date.getMonth()] + daytimeOffset;
  return {
    version: 3,
    fetchedAt: now,
    source: "local",
    reference: "Berlin",
    kind,
    temperature,
    precipitation: 0,
    cloudCover: kind === "cloud" ? 72 : kind === "partly" ? 42 : 12,
    isDay: kind !== "night",
    ...(language === "de" ? AMBIENCE_COPY_DE[kind] : AMBIENCE_COPY[kind]),
  };
}
