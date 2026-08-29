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

function seedNumber(value) {
  return [...String(value)].reduce((total, character) => ((total * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
}

function tripPlan(departedAt, seed, completedTrips = 0) {
  const value = seedNumber(`${seed}:${departedAt}:${completedTrips}`);
  const duration = (120 + (value % 61)) * 60_000;
  const destination = TRAVEL_DESTINATIONS[(value >>> 5) % TRAVEL_DESTINATIONS.length];
  return { destination, duration };
}

function homeDuration(returnedAt, seed, completedTrips) {
  const value = seedNumber(`${seed}:home:${returnedAt}:${completedTrips}`);
  return (8 + (value % 11)) * HOUR;
}

function initialTravel(adoptedAt, seed) {
  const firstWait = (5 + (seedNumber(`${seed}:first-trip`) % 4)) * HOUR;
  return {
    version: 2,
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
    initiatedBy: "auto",
    returnPending: false,
  };
}

export function destinationById(id) {
  return TRAVEL_DESTINATIONS.find((destination) => destination.id === id) || null;
}

export function normalizeTravel(candidate, adoptedAt, now = Date.now(), seed = "capy") {
  const base = initialTravel(adoptedAt, seed);
  const hadTravel = Boolean(candidate && typeof candidate === "object");
  const travel = hadTravel ? {
    ...base,
    ...candidate,
    version: 2,
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
    initiatedBy: candidate.initiatedBy === "player" ? "player" : "auto",
    returnPending: Boolean(candidate.returnPending),
  } : base;

  if (travel.status === "away" && now >= travel.returnsAt) {
    const destination = destinationById(travel.destinationId);
    travel.status = "home";
    travel.completedTrips += 1;
    travel.visitedIds = [...new Set([...travel.visitedIds, travel.destinationId])].slice(-20);
    travel.lastReturnAt = travel.returnsAt;
    travel.lastDestinationId = travel.destinationId;
    travel.lastSouvenir = destination?.souvenir || "a warm memory";
    travel.lastRewardId = travel.rewardId;
    travel.lastCompanionId = travel.companionId;
    travel.destinationId = null;
    travel.rewardId = null;
    travel.companionId = null;
    travel.departedAt = 0;
    travel.nextDepartureAt = travel.returnsAt + homeDuration(travel.returnsAt, seed, travel.completedTrips);
    travel.returnsAt = 0;
    travel.returnPending = hadTravel;
  }

  let loops = 0;
  while (travel.status === "home" && now >= travel.nextDepartureAt && loops < 180) {
    const departedAt = travel.nextDepartureAt;
    const plan = tripPlan(departedAt, seed, travel.completedTrips);
    const returnsAt = departedAt + plan.duration;
    if (now < returnsAt) {
      travel.status = "away";
      travel.destinationId = plan.destination.id;
      travel.departedAt = departedAt;
      travel.returnsAt = returnsAt;
      travel.rewardId = null;
      travel.companionId = null;
      travel.initiatedBy = "auto";
      travel.returnPending = false;
      break;
    }
    travel.completedTrips += 1;
    travel.visitedIds = [...new Set([...travel.visitedIds, plan.destination.id])].slice(-20);
    travel.lastReturnAt = returnsAt;
    travel.lastDestinationId = plan.destination.id;
    travel.lastSouvenir = plan.destination.souvenir;
    travel.lastRewardId = null;
    travel.lastCompanionId = null;
    travel.nextDepartureAt = returnsAt + homeDuration(returnsAt, seed, travel.completedTrips);
    loops += 1;
  }

  if (hadTravel && loops > 0 && travel.status === "home") travel.returnPending = true;

  if (loops >= 180 && now >= travel.nextDepartureAt) travel.nextDepartureAt = now + 3 * HOUR;
  return travel;
}

export function departNow(candidate, adoptedAt, now = Date.now(), seed = "capy") {
  const travel = normalizeTravel(candidate, adoptedAt, now, seed);
  if (isTraveling(travel, now)) return travel;
  const plan = tripPlan(now, `${seed}:player`, travel.completedTrips);
  return {
    ...travel,
    version: 2,
    status: "away",
    destinationId: plan.destination.id,
    departedAt: now,
    returnsAt: now + plan.duration,
    nextDepartureAt: 0,
    rewardId: null,
    companionId: null,
    initiatedBy: "player",
    returnPending: false,
  };
}

export function isTraveling(travel, now = Date.now()) {
  return Boolean(travel?.status === "away" && now < travel.returnsAt && destinationById(travel.destinationId));
}

export function travelTimeLabel(travel, now = Date.now()) {
  if (!isTraveling(travel, now)) return "AT HOME";
  const minutes = Math.max(1, Math.ceil((travel.returnsAt - now) / 60_000));
  if (minutes < 60) return `ABOUT ${minutes} MIN LEFT`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} H ${rest ? `${rest} MIN` : ""} LEFT`.trim();
}

export function travelProgress(travel, now = Date.now()) {
  if (!isTraveling(travel, now)) return 100;
  const duration = Math.max(1, travel.returnsAt - travel.departedAt);
  return Math.max(0, Math.min(100, ((now - travel.departedAt) / duration) * 100));
}
