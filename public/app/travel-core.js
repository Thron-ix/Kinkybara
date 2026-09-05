const HOUR = 3_600_000;

export const TRAVEL_DESTINATIONS = Object.freeze([
  {
    id: "folsom", kind: "COMMUNITY WEEKEND", place: "Berlin", title: "Folsom Weekend", icon: "F", palette: "folsom",
    fact: "A big community weekend can feel much smaller when you start with one hello, one smile and your own pace.",
    doing: "meets colorful packs, admires carefully designed outfits and takes friendly breaks between the crowds",
    souvenir: "a bright little friendship tag",
  },
  {
    id: "laboratory", kind: "CLUB NIGHT", place: "Berlin", title: "Laboratory Night", icon: "L", palette: "laboratory",
    fact: "Clear boundaries, mutual respect and an easy way to leave are good ingredients for any unfamiliar night out.",
    doing: "checks the vibe, keeps its boundaries clear and dances only where it feels comfortable",
    souvenir: "a reflective locker token",
  },
  {
    id: "berghain", kind: "CLUB NIGHT", place: "Berlin", title: "Berghain Night", icon: "B", palette: "berghain",
    fact: "Comfortable shoes, water, a charged phone and respect for everyone around you make a good dance-floor plan.",
    doing: "finds a steady beat, guards its energy and compliments a particularly elegant harness",
    souvenir: "a tiny concrete-gray dance token",
  },
  {
    id: "ruhr_pack", kind: "PACK PARTY", place: "Ruhrgebiet", title: "Zechen Pack Night", icon: "R", palette: "ruhr",
    fact: "Old industrial spaces and new community energy make a bold setting for music, outfits and pack photos.",
    doing: "follows the lights through brick halls, joins a group chorus and finds the quietest corner for juice",
    souvenir: "a polished little coal-black badge",
  },
  {
    id: "mannheim", kind: "COMMUNITY NIGHT", place: "Mannheim", title: "Mannheim Pack Party", icon: "M", palette: "mannheim",
    fact: "Smaller nights are often the easiest place to learn names, ask questions and find familiar faces.",
    doing: "starts a karaoke duet, shares pineapple juice and learns three new pack names",
    souvenir: "a square little karaoke pass",
  },
  {
    id: "csd_berlin", kind: "PRIDE DAY", place: "Berlin", title: "Berlin CSD", icon: "P", palette: "pride",
    fact: "Pride can be loud, political, joyful and tiring at once. Breaks and looking after your pack belong to the day.",
    doing: "walks with the pack, spots signature colors in the crowd and remembers to take a water break",
    souvenir: "a small two-color pride ribbon",
  },
  {
    id: "csd_cologne", kind: "PRIDE DAY", place: "Cologne", title: "Cologne CSD", icon: "P", palette: "pride",
    fact: "A friendly wave or compliment can open a conversation; a polite no should close it just as easily.",
    doing: "waves from the route, trades outfit compliments and rests its paws by the river",
    souvenir: "a bright little friendship band",
  },
  {
    id: "csd_hamburg", kind: "PRIDE DAY", place: "Hamburg", title: "Hamburg CSD", icon: "P", palette: "pride",
    fact: "Community is not a dress code. Curiosity, kindness and consent matter more than owning particular gear.",
    doing: "joins the parade, sings at a bar stop and takes a quiet harbor walk before heading home",
    souvenir: "a tiny harbor-blue pack pin",
  },
]);

const DESTINATION_COPY_DE = Object.freeze({
  folsom: ["COMMUNITY-WOCHENENDE", "Berlin", "Folsom-Wochenende", "Ein großes Community-Wochenende fühlt sich mit einem Hallo, einem Lächeln und dem eigenen Tempo schnell kleiner an.", "trifft farbenfrohe Packs, bewundert aufwendig gestaltete Outfits und macht freundliche Pausen zwischen den Menschen", "ein leuchtender kleiner Freundschaftsanhänger"],
  laboratory: ["CLUBNACHT", "Berlin", "Laboratory-Nacht", "Klare Grenzen, gegenseitiger Respekt und ein einfacher Heimweg sind gute Zutaten für jede neue Nacht.", "prüft die Stimmung, wahrt klare Grenzen und tanzt nur dort, wo es sich wohlfühlt", "eine reflektierende Schrankmarke"],
  berghain: ["CLUBNACHT", "Berlin", "Berghain-Nacht", "Bequeme Schuhe, Wasser, ein geladenes Handy und Respekt für alle um dich herum sind ein guter Tanzflächenplan.", "findet einen gleichmäßigen Beat, achtet auf seine Energie und bewundert ein besonders elegantes Harness", "ein winziger betongrauer Tanztaler"],
  ruhr_pack: ["PACK-PARTY", "Ruhrgebiet", "Zechen-Pack-Nacht", "Alte Industrieorte und neue Community-Energie sind eine starke Kulisse für Musik, Outfits und Packfotos.", "folgt den Lichtern durch Backsteinhallen, singt im Gruppenchor und findet die ruhigste Ecke für einen Saft", "ein poliertes, kohlschwarzes Abzeichen"],
  mannheim: ["COMMUNITY-NACHT", "Mannheim", "Mannheim-Pack-Party", "Kleinere Abende sind oft der einfachste Ort, um Namen zu lernen, Fragen zu stellen und vertraute Gesichter zu finden.", "startet ein Karaoke-Duett, teilt Ananassaft und lernt drei neue Pack-Namen", "ein kleiner quadratischer Karaoke-Pass"],
  csd_berlin: ["PRIDE-TAG", "Berlin", "Berliner CSD", "Pride kann zugleich laut, politisch, fröhlich und anstrengend sein. Pausen und gegenseitige Fürsorge gehören dazu.", "läuft mit dem Pack, entdeckt Signaturfarben in der Menge und denkt an eine Wasserpause", "ein kleines zweifarbiges Pride-Band"],
  csd_cologne: ["PRIDE-TAG", "Köln", "Kölner CSD", "Ein freundliches Winken oder Kompliment kann ein Gespräch öffnen; ein höfliches Nein sollte es genauso leicht beenden.", "winkt an der Strecke, tauscht Outfit-Komplimente und lässt die Pfoten am Rhein ruhen", "ein leuchtendes Freundschaftsband"],
  csd_hamburg: ["PRIDE-TAG", "Hamburg", "Hamburger CSD", "Community ist kein Dresscode. Neugier, Freundlichkeit und Konsens zählen mehr als bestimmte Ausrüstung.", "zieht bei der Parade mit, singt bei einem Barstopp und macht vor dem Heimweg einen ruhigen Hafenspaziergang", "ein kleiner hafenblauer Pack-Pin"],
});

export function localizedDestination(destination, language = "en") {
  if (!destination || language !== "de") return destination;
  const copy = DESTINATION_COPY_DE[destination.id];
  if (!copy) return destination;
  const [kind, place, title, fact, doing, souvenir] = copy;
  return { ...destination, kind, place, title, fact, doing, souvenir };
}

function seedNumber(value) {
  return [...String(value)].reduce((total, character) => ((total * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
}

function tripPlan(departedAt, seed, completedTrips = 0, initiatedBy = "auto") {
  const value = seedNumber(`${seed}:${departedAt}:${completedTrips}`);
  const durationMinutes = initiatedBy === "player" ? 120 + (value % 61) : 180 + (value % 61);
  const duration = durationMinutes * 60_000;
  const destination = TRAVEL_DESTINATIONS[(value >>> 5) % TRAVEL_DESTINATIONS.length];
  return { destination, duration };
}

function homeDuration(returnedAt, seed, completedTrips) {
  const value = seedNumber(`${seed}:home:${returnedAt}:${completedTrips}`);
  return (6 + (value % 5)) * HOUR;
}

function initialTravel(adoptedAt, seed) {
  const firstWait = (3 + (seedNumber(`${seed}:first-trip`) % 4)) * HOUR;
  return {
    version: 4,
    status: "home",
    destinationId: null,
    departedAt: 0,
    returnsAt: 0,
    nextDepartureAt: Number(adoptedAt || Date.now()) + firstWait,
    completedTrips: 0,
    visitedIds: [],
    lastReturnAt: 0,
    lastDestinationId: null,
    lastSouvenir: "",
    rewardId: null,
    lastRewardId: null,
    companionId: null,
    lastCompanionId: null,
    companionChoice: "auto",
    lastCompanionChoice: "auto",
    lastTripProgress: 1,
    lastRecalled: false,
    initiatedBy: "auto",
    returnPending: false,
    recallPending: false,
    recallProgress: 0,
  };
}

export function destinationById(id) {
  return TRAVEL_DESTINATIONS.find((destination) => destination.id === id) || null;
}

export function normalizeTravel(candidate, adoptedAt, now = Date.now(), seed = "capy", options = {}) {
  const base = initialTravel(adoptedAt, seed);
  const hadTravel = Boolean(candidate && typeof candidate === "object");
  const travel = hadTravel ? {
    ...base,
    ...candidate,
    version: 4,
    status: candidate.status === "away" && destinationById(candidate.destinationId) ? "away" : "home",
    destinationId: destinationById(candidate.destinationId) ? candidate.destinationId : null,
    departedAt: Math.max(0, Number(candidate.departedAt) || 0),
    returnsAt: Math.max(0, Number(candidate.returnsAt) || 0),
    nextDepartureAt: Math.max(0, Number(candidate.nextDepartureAt) || base.nextDepartureAt),
    completedTrips: Math.max(0, Number(candidate.completedTrips) || 0),
    visitedIds: Array.isArray(candidate.visitedIds) ? [...new Set(candidate.visitedIds.filter((id) => destinationById(id)))].slice(-20) : [],
    rewardId: typeof candidate.rewardId === "string" ? candidate.rewardId : null,
    lastRewardId: typeof candidate.lastRewardId === "string" ? candidate.lastRewardId : null,
    companionId: typeof candidate.companionId === "string" ? candidate.companionId : null,
    lastCompanionId: typeof candidate.lastCompanionId === "string" ? candidate.lastCompanionId : null,
    companionChoice: ["auto", "chosen", "solo"].includes(candidate.companionChoice) ? candidate.companionChoice : "auto",
    lastCompanionChoice: ["auto", "chosen", "solo"].includes(candidate.lastCompanionChoice) ? candidate.lastCompanionChoice : "auto",
    lastTripProgress: candidate.lastTripProgress === undefined ? 1 : Math.max(0, Math.min(1, Number(candidate.lastTripProgress) || 0)),
    lastRecalled: Boolean(candidate.lastRecalled),
    initiatedBy: candidate.initiatedBy === "player" ? "player" : "auto",
    returnPending: Boolean(candidate.returnPending),
    recallPending: Boolean(candidate.recallPending),
    recallProgress: Math.max(0, Math.min(1, Number(candidate.recallProgress) || 0)),
  } : base;

  if (travel.status === "away" && now >= travel.returnsAt) {
    const destination = destinationById(travel.destinationId);
    const completedProgress = travel.recallPending ? travel.recallProgress : 1;
    const countsAsTrip = !travel.recallPending || completedProgress >= 0.25;
    travel.status = "home";
    if (countsAsTrip) travel.completedTrips += 1;
    if (countsAsTrip) travel.visitedIds = [...new Set([...travel.visitedIds, travel.destinationId])].slice(-20);
    travel.lastReturnAt = travel.returnsAt;
    travel.lastDestinationId = travel.destinationId;
    travel.lastSouvenir = destination?.souvenir || "a warm memory";
    travel.lastRewardId = countsAsTrip ? travel.rewardId : null;
    travel.lastCompanionId = travel.companionId;
    travel.lastCompanionChoice = travel.companionChoice;
    travel.lastTripProgress = travel.recallPending ? travel.recallProgress : 1;
    travel.lastRecalled = travel.recallPending;
    travel.destinationId = null;
    travel.rewardId = null;
    travel.companionId = null;
    travel.companionChoice = "auto";
    travel.departedAt = 0;
    travel.nextDepartureAt = travel.returnsAt + homeDuration(travel.returnsAt, seed, travel.completedTrips);
    travel.returnsAt = 0;
    travel.returnPending = hadTravel;
    travel.recallPending = false;
    travel.recallProgress = 0;
  }

  // A trip that was entirely missed while the app was closed starts on reopen
  // instead of being silently fast-forwarded. This guarantees a visible away
  // period and avoids replaying an arbitrary number of catch-up trips.
  if (!options.suppressAutoDeparture && travel.status === "home" && !travel.returnPending && now >= travel.nextDepartureAt) {
    const scheduledAt = travel.nextDepartureAt || now;
    const scheduledPlan = tripPlan(scheduledAt, seed, travel.completedTrips, "auto");
    const departedAt = now >= scheduledAt + scheduledPlan.duration ? now : scheduledAt;
    const plan = departedAt === scheduledAt ? scheduledPlan : tripPlan(departedAt, seed, travel.completedTrips, "auto");
    travel.status = "away";
    travel.destinationId = plan.destination.id;
    travel.departedAt = departedAt;
    travel.returnsAt = departedAt + plan.duration;
    travel.nextDepartureAt = 0;
    travel.rewardId = null;
    travel.companionId = null;
    travel.companionChoice = "auto";
    travel.initiatedBy = "auto";
    travel.returnPending = false;
    travel.recallPending = false;
    travel.recallProgress = 0;
  }
  return travel;
}

export function departNow(candidate, adoptedAt, now = Date.now(), seed = "capy", options = {}) {
  const travel = normalizeTravel(candidate, adoptedAt, now, seed, { suppressAutoDeparture: true });
  // A finished trip must be settled by the app before another departure can
  // begin, otherwise its return, find and XP could be overwritten here.
  if (travel.returnPending || isTraveling(travel, now)) return travel;
  const plan = tripPlan(now, `${seed}:player`, travel.completedTrips, "player");
  const hasCompanionChoice = options && typeof options === "object" && Object.hasOwn(options, "companionId");
  const companionId = hasCompanionChoice && typeof options.companionId === "string" ? options.companionId : null;
  const companionChoice = hasCompanionChoice ? (companionId ? "chosen" : "solo") : "auto";
  return {
    ...travel,
    version: 4,
    status: "away",
    destinationId: plan.destination.id,
    departedAt: now,
    returnsAt: now + plan.duration,
    nextDepartureAt: 0,
    rewardId: null,
    companionId,
    companionChoice,
    initiatedBy: "player",
    returnPending: false,
    recallPending: false,
    recallProgress: 0,
  };
}

export function recallTravel(candidate, adoptedAt, now = Date.now(), seed = "capy") {
  const travel = normalizeTravel(candidate, adoptedAt, now, seed);
  if (!isTraveling(travel, now)) return travel;
  const duration = Math.max(1, travel.returnsAt - travel.departedAt);
  const progress = Math.max(0, Math.min(1, (now - travel.departedAt) / duration));
  return normalizeTravel({ ...travel, returnsAt: now, recallPending: true, recallProgress: progress }, adoptedAt, now, seed, { suppressAutoDeparture: true });
}

export function isTraveling(travel, now = Date.now()) {
  return Boolean(travel?.status === "away" && now < travel.returnsAt && destinationById(travel.destinationId));
}

export function travelTimeLabel(travel, now = Date.now(), language = "en") {
  const de = language === "de";
  if (!isTraveling(travel, now)) return de ? "ZU HAUSE" : "AT HOME";
  const minutes = Math.max(1, Math.ceil((travel.returnsAt - now) / 60_000));
  if (minutes < 60) return de ? `NOCH ETWA ${minutes} MIN` : `ABOUT ${minutes} MIN LEFT`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return de ? `NOCH ${hours} H ${rest ? `${rest} MIN` : ""}`.trim() : `${hours} H ${rest ? `${rest} MIN` : ""} LEFT`.trim();
}

export function travelProgress(travel, now = Date.now()) {
  if (!isTraveling(travel, now)) return 100;
  const duration = Math.max(1, travel.returnsAt - travel.departedAt);
  return Math.max(0, Math.min(100, ((now - travel.departedAt) / duration) * 100));
}
