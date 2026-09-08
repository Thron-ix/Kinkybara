const icons = ["✦", "♥", "☕", "●", "▲", "♫"];

// Familiar rules, three bounded variations. Most rounds use the middle set.
const VARIATIONS = {
  sparkles: [{ spawnMs: 530, lifeMs: 2000, target: 16 }, { spawnMs: 460, lifeMs: 1650, target: 20 }, { spawnMs: 400, lifeMs: 1300, target: 24 }],
  memory: [{ pairs: 4 }, { pairs: 6 }, { pairs: 8 }],
  coffee: [{ speed: 1.8, width: 24 }, { speed: 2.4, width: 20 }, { speed: 3, width: 16 }],
  grill: [{ count: 8, seconds: 8 }, { count: 10, seconds: 6 }, { count: 12, seconds: 4.5 }],
  route: [{ stops: 3, decoys: 1 }, { stops: 4, decoys: 2 }, { stops: 5, decoys: 3 }],
  rhythm: [{ rounds: 4, beatMs: 620 }, { rounds: 5, beatMs: 520 }, { rounds: 6, beatMs: 440 }],
};

export function questGameVariation(game, random = Math.random) {
  if (!VARIATIONS[game]) throw new Error(`Unknown quest game: ${game}`);
  const roll = random();
  return { ...VARIATIONS[game][roll < 0.25 ? 0 : roll < 0.8 ? 1 : 2] };
}

export function shuffleQuestCards(values, random = Math.random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function button(label, className = "quest-game-button") {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  return element;
}

function emptyStage(stage, className) {
  stage.className = `quest-stage ${className}`;
  stage.replaceChildren();
}

function sparkleGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "sparkle-game");
  let caught = 0;
  let left = 22;
  let ended = false;
  const field = document.createElement("div");
  field.className = "sparkle-field";
  stage.append(field);

  const update = () => { status.textContent = en ? `✦ ${caught} CAUGHT · ${left} SEC` : `✦ ${caught} GEFANGEN · ${left} SEK`; };
  const spawn = () => {
    if (ended) return;
    const target = button(icons[Math.floor(random() * 2)], "sparkle-target");
    target.setAttribute("aria-label", en ? "Catch glitter star" : "Funkelstern fangen");
    target.style.setProperty("--left", `${5 + random() * 82}%`);
    target.style.setProperty("--top", `${6 + random() * 72}%`);
    target.style.setProperty("--hue", `${Math.floor(random() * 300)}deg`);
    target.addEventListener("click", () => {
      if (ended || target.disabled) return;
      caught += 1;
      target.classList.add("is-caught");
      target.disabled = true;
      update();
      timers.setTimeout(() => target.remove(), 260);
    });
    field.append(target);
    timers.setTimeout(() => target.remove(), variation.lifeMs);
  };
  update();
  onMessage(en ? "Quick — I see glitter everywhere!" : "Schnell – ich sehe überall Glitzer!");
  const spawnTimer = timers.setInterval(spawn, variation.spawnMs);
  spawn(); spawn();
  const clock = timers.setInterval(() => {
    left -= 1;
    update();
    if (left <= 0) {
      ended = true;
      timers.clearInterval(clock);
      timers.clearInterval(spawnTimer);
      onFinish(Math.min(100, Math.round((caught / variation.target) * 100)));
    }
  }, 1000);
  return () => { ended = true; timers.clearInterval(clock); timers.clearInterval(spawnTimer); };
}

function memoryGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "memory-game");
  const symbols = shuffleQuestCards(["☕", "✦", "▲", "♥", "♫", "●", "◆", "☀"], random).slice(0, variation.pairs);
  const deck = shuffleQuestCards([...symbols, ...symbols], random);
  let open = [];
  let matches = 0;
  let moves = 0;
  let locked = false;
  let stopped = false;
  const board = document.createElement("div");
  board.className = "memory-board";
  board.style.gridTemplateRows = `repeat(${variation.pairs / 2}, 1fr)`;
  const update = () => { status.textContent = en ? `${matches}/${variation.pairs} PAIRS · ${moves} MOVES` : `${matches}/${variation.pairs} PAARE · ${moves} ZÜGE`; };
  deck.forEach((symbol, index) => {
    const card = button("?", "memory-card");
    card.dataset.symbol = symbol;
    card.setAttribute("aria-label", en ? `Hidden card ${index + 1}` : `Verdeckte Karte ${index + 1}`);
    card.addEventListener("click", () => {
      if (stopped || locked || card.classList.contains("is-open") || card.classList.contains("is-matched")) return;
      card.textContent = symbol;
      card.classList.add("is-open");
      open.push(card);
      if (open.length < 2) return;
      moves += 1;
      locked = true;
      update();
      if (open[0].dataset.symbol === open[1].dataset.symbol) {
        open.forEach((item) => item.classList.add("is-matched"));
        matches += 1;
        open = [];
        locked = false;
        update();
        if (matches === variation.pairs) { stopped = true; onFinish(Math.max(35, 100 - (moves - variation.pairs) * 5)); }
      } else {
        timers.setTimeout(() => {
          if (stopped) return;
          open.forEach((item) => { item.textContent = "?"; item.classList.remove("is-open"); });
          open = [];
          locked = false;
        }, 720);
      }
    });
    board.append(card);
  });
  stage.append(board);
  update();
  onMessage(en ? "I am team glitter card. Which ones will you remember?" : "Ich bin Team Glitzerkarte. Welche merkst du dir?");
  return () => { stopped = true; };
}

function coffeeGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "coffee-game");
  let position = 0;
  let direction = 1;
  let rounds = 0;
  let points = 0;
  let stopped = false;
  let locked = false;
  let center = 50;
  const cup = document.createElement("div");
  cup.className = "coffee-cup";
  cup.innerHTML = "<span>☕</span><i></i><i></i><i></i>";
  const meter = document.createElement("div");
  meter.className = "coffee-meter";
  meter.innerHTML = '<span class="coffee-sweetspot"></span><i class="coffee-marker"></i>';
  const marker = meter.querySelector(".coffee-marker");
  const sweetspot = meter.querySelector(".coffee-sweetspot");
  const stop = button(en ? "STOP NOW" : "JETZT STOPPEN", "quest-game-action");
  const update = () => { status.textContent = en ? `${rounds}/5 MIXES · ${points} POINTS` : `${rounds}/5 MISCHUNGEN · ${points} PUNKTE`; };
  stop.addEventListener("click", () => {
    if (stopped || locked) return;
    rounds += 1;
    const distance = Math.abs(position - center);
    points += distance <= variation.width / 2 ? 20 : distance <= variation.width ? 12 : 5;
    cup.classList.remove("is-perfect");
    void cup.offsetWidth;
    cup.classList.add("is-perfect");
    update();
    if (rounds === 5) {
      stopped = true;
      stop.disabled = true;
      onFinish(points);
    } else {
      locked = true;
      stop.disabled = true;
      timers.setTimeout(() => { nextMix(); locked = false; stop.disabled = false; }, 350);
    }
  });
  const nextMix = () => {
    center = 32 + random() * 36;
    sweetspot.style.left = `${center - variation.width / 2}%`;
    sweetspot.style.width = `${variation.width}%`;
    position = rounds % 2 ? 100 : 0;
    direction = rounds % 2 ? -1 : 1;
    marker.style.left = `${position}%`;
  };
  nextMix();
  const animation = timers.setInterval(() => {
    if (locked || stopped) return;
    position += direction * variation.speed;
    if (position >= 100 || position <= 0) direction *= -1;
    position = Math.max(0, Math.min(100, position));
    marker.style.left = `${position}%`;
  }, 30);
  stage.append(cup, meter, stop);
  update();
  onMessage(en ? "Perfect when it is golden brown. Ready?" : "Genau goldbraun ist er perfekt. Bereit?");
  return () => { stopped = true; timers.clearInterval(animation); };
}

function grillGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "grill-game");
  const ingredients = shuffleQuestCards([
    [en ? "Corn" : "Mais", "🌽", true], [en ? "Onion" : "Zwiebel", "◉", false], [en ? "Pepper" : "Paprika", "◆", true], [en ? "Mushroom" : "Pilz", "♠", true],
    [en ? "Onion ring" : "Zwiebelring", "◎", false], ["Zucchini", "●", true], [en ? "Pumpkin" : "Kürbis", "▲", true], [en ? "Red onion" : "Rote Zwiebel", "◉", false],
    [en ? "Potato" : "Kartoffel", "●", true], [en ? "Melon" : "Melone", "♥", true], [en ? "Onion" : "Zwiebel", "◎", false], ["Tofu", "■", true],
  ], random).slice(0, variation.count);
  let index = 0;
  let correct = 0;
  let stopped = false;
  let remaining = variation.seconds;
  const plate = document.createElement("div");
  plate.className = "grill-plate";
  const choices = document.createElement("div");
  choices.className = "grill-choices";
  const yes = button(en ? "ONTO THE GRILL" : "AUF DEN GRILL", "quest-game-action");
  const no = button(en ? "LEAVE IT OUT" : "WEGLASSEN", "quest-game-action danger-choice");
  choices.append(yes, no);
  const clock = document.createElement("progress");
  clock.className = "grill-clock";
  clock.max = variation.seconds;
  clock.setAttribute("aria-label", en ? "Time remaining" : "Verbleibende Zeit");
  const update = () => {
    const [name, symbol] = ingredients[index] || [en ? "Done" : "Fertig", "✦"];
    plate.innerHTML = `<span>${symbol}</span><strong>${name}</strong>`;
    status.textContent = en ? `${index}/${ingredients.length} SORTED · ${correct} RIGHT` : `${index}/${ingredients.length} SORTIERT · ${correct} RICHTIG`;
    clock.value = remaining;
  };
  const choose = (grill) => {
    if (stopped) return;
    const right = ingredients[index][2] === grill;
    if (right) correct += 1;
    plate.classList.remove("is-right", "is-wrong");
    void plate.offsetWidth;
    plate.classList.add(right ? "is-right" : "is-wrong");
    index += 1;
    remaining = variation.seconds;
    update();
    if (index === ingredients.length) {
      stopped = true;
      yes.disabled = true; no.disabled = true;
      onFinish(Math.round((correct / ingredients.length) * 100));
    }
  };
  yes.addEventListener("click", () => choose(true));
  no.addEventListener("click", () => choose(false));
  stage.append(plate, clock, choices);
  timers.setInterval(() => {
    if (stopped) return;
    remaining = Math.max(0, remaining - 0.1);
    clock.value = remaining;
    if (remaining <= 0) choose(null);
  }, 100);
  update();
  onMessage(en ? "Everything smells good — except those suspicious onions." : "Alles riecht gut – außer diese verdächtigen Zwiebeln.");
  return () => { stopped = true; };
}

function routeGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "route-game");
  const places = shuffleQuestCards([
    { id: "cafe", icon: "☕", label: "Café" },
    { id: "park", icon: "♣", label: "Park" },
    { id: "game", icon: "▦", label: en ? "Game shop" : "Spieleladen" },
    { id: "view", icon: "▲", label: en ? "Viewpoint" : "Aussicht" },
    { id: "pond", icon: "≈", label: en ? "Pond" : "Teich" },
  ], random).slice(0, variation.stops);
  const decoys = shuffleQuestCards([{ icon: "◆", label: en ? "Market" : "Markt" }, { icon: "■", label: en ? "Station" : "Bahnhof" }, { icon: "●", label: en ? "Square" : "Platz" }], random).slice(0, variation.decoys);
  let next = 0;
  let mistakes = 0;
  let stopped = false;
  const update = () => { status.textContent = en ? `${next}/${places.length} STOPS · ${mistakes} DETOURS` : `${next}/${places.length} ZIELE · ${mistakes} UMWEGE`; };
  const route = document.createElement("div");
  route.className = "route-order";
  route.innerHTML = places.map((place, index) => `<span data-route="${index}">${place.icon}<small>${index + 1}</small></span>`).join("");
  const map = document.createElement("div");
  map.className = "route-map";
  shuffleQuestCards([...places, ...decoys], random).forEach((place, index) => {
    const marker = button(place.icon, "route-marker");
    marker.style.setProperty("--x", `${8 + (index % 3) * 30}%`);
    marker.style.setProperty("--y", `${8 + Math.floor(index / 3) * 30}%`);
    marker.setAttribute("aria-label", place.label);
    marker.addEventListener("click", () => {
      if (stopped || marker.disabled) return;
      if (place.id === places[next]?.id) {
        marker.classList.add("is-visited");
        marker.disabled = true;
        route.querySelector(`[data-route="${next}"]`).classList.add("is-visited");
        next += 1;
        update();
        if (next === places.length) { stopped = true; onFinish(Math.max(35, 100 - mistakes * 12)); }
      } else {
        mistakes += 1;
        marker.classList.add("is-wrong");
        timers.setTimeout(() => marker.classList.remove("is-wrong"), 300);
        update();
      }
    });
    map.append(marker);
  });
  stage.append(route, map);
  update();
  onMessage(en ? "I know a shortcut. Probably." : "Ich kenne eine Abkürzung. Glaube ich.");
  return () => { stopped = true; };
}

function rhythmGame({ stage, status, onFinish, onMessage, language, variation, random, timers }) {
  const en = language === "en";
  emptyStage(stage, "rhythm-game");
  const colors = ["rose", "gold", "green", "blue"];
  const sequence = [Math.floor(random() * 4)];
  let inputIndex = 0;
  let round = 1;
  let mistakes = 0;
  let accepting = false;
  let stopped = false;
  const pads = document.createElement("div");
  pads.className = "rhythm-pads";
  const padButtons = colors.map((color, index) => {
    const pad = button(String(index + 1), `rhythm-pad pad-${color}`);
    pad.addEventListener("click", () => {
      if (!accepting || stopped) return;
      flash(index);
      if (index === sequence[inputIndex]) {
        inputIndex += 1;
        if (inputIndex === sequence.length) {
          accepting = false;
          round += 1;
          if (round > variation.rounds) {
            stopped = true;
            onFinish(Math.max(40, 100 - mistakes * 15));
            return;
          }
          sequence.push(Math.floor(random() * 4));
          timers.setTimeout(showSequence, 650);
        }
      } else {
        mistakes += 1;
        accepting = false;
        inputIndex = 0;
        status.textContent = en ? `ROUND ${round}/${variation.rounds} · ${mistakes} MISSES` : `RUNDE ${round}/${variation.rounds} · ${mistakes} PATZER`;
        timers.setTimeout(showSequence, 650);
      }
    });
    pads.append(pad);
    return pad;
  });
  const flash = (index) => {
    padButtons[index].classList.add("is-lit");
    timers.setTimeout(() => padButtons[index]?.classList.remove("is-lit"), variation.beatMs * 0.6);
  };
  const showSequence = () => {
    if (stopped) return;
    accepting = false;
    inputIndex = 0;
    status.textContent = en ? `ROUND ${round}/${variation.rounds} · WATCH CLOSELY` : `RUNDE ${round}/${variation.rounds} · GUT AUFPASSEN`;
    sequence.forEach((value, index) => timers.setTimeout(() => flash(value), variation.beatMs * index));
    timers.setTimeout(() => {
      if (stopped) return;
      accepting = true;
      status.textContent = en ? `ROUND ${round}/${variation.rounds} · YOUR TURN` : `RUNDE ${round}/${variation.rounds} · JETZT DU`;
    }, sequence.length * variation.beatMs + 250);
  };
  stage.append(pads);
  onMessage(en ? "Psst, the water lilies are playing something for us." : "Psst, die Seerosen spielen uns etwas vor.");
  timers.setTimeout(showSequence, 450);
  return () => { stopped = true; };
}

const GAMES = { sparkles: sparkleGame, memory: memoryGame, coffee: coffeeGame, grill: grillGame, route: routeGame, rhythm: rhythmGame };

export function startQuestGame(options) {
  const game = GAMES[options.quest?.game];
  if (!game) throw new Error(`Unknown quest game: ${options.quest?.game}`);
  const random = options.random || Math.random;
  const variation = questGameVariation(options.quest.game, random);
  const timeouts = new Set();
  const intervals = new Set();
  let active = true;
  let stopGame = () => {};
  const timers = {
    setTimeout(fn, ms) {
      const id = window.setTimeout(() => { timeouts.delete(id); if (active) fn(); }, ms);
      timeouts.add(id);
      return id;
    },
    setInterval(fn, ms) {
      const id = window.setInterval(() => { if (active) fn(); }, ms);
      intervals.add(id);
      return id;
    },
    clearInterval(id) { window.clearInterval(id); intervals.delete(id); },
  };
  const cleanup = () => {
    active = false;
    for (const id of timeouts) window.clearTimeout(id);
    for (const id of intervals) window.clearInterval(id);
    timeouts.clear(); intervals.clear();
    stopGame();
  };
  try {
    stopGame = game({ ...options, variation, random, timers, onFinish(score) {
      if (!active) return;
      cleanup();
      options.onFinish(Math.max(0, Math.min(100, Math.round(score))));
    } });
  } catch (error) { cleanup(); throw error; }
  return cleanup;
}
