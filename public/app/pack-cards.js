const STATS = Object.freeze(["trust", "style", "energy", "pack"]);

export const PACK_CARD_DIFFICULTIES = Object.freeze({
  soft: Object.freeze({ id: "soft", rounds: 5, rivalBonus: 5, rivalChoices: 1, counterChance: 0, repeatPenalty: 0, specials: false, xp: 8 }),
  switch: Object.freeze({ id: "switch", rounds: 7, rivalBonus: 2, rivalChoices: 2, counterChance: 60, repeatPenalty: 6, specials: true, xp: 14 }),
  alpha: Object.freeze({ id: "alpha", rounds: 7, rivalBonus: 4, rivalChoices: 3, counterChance: 80, repeatPenalty: 10, specials: true, xp: 20 }),
});

export const PACK_CARD_DECK = Object.freeze([
  { id: "neon-scout", name: "Neon Sniffer", role: "Nose down. Tail up.", stats: { trust: 64, style: 77, energy: 52, pack: 81 } },
  { id: "gentle-guard", name: "Leash Tease", role: "Pulls just hard enough.", stats: { trust: 83, style: 48, energy: 61, pack: 75 } },
  { id: "karaoke-pup", name: "Karaoke Pup", role: "Howls till the collars jingle.", stats: { trust: 57, style: 78, energy: 84, pack: 72 } },
  { id: "night-runner", name: "Night Runner", role: "Still bouncing at sunrise.", stats: { trust: 45, style: 76, energy: 82, pack: 60 }, special: "boost" },
  { id: "juice-mixer", name: "Juicy Pup", role: "Brings pineapple. Keeps it juicy.", stats: { trust: 73, style: 62, energy: 68, pack: 86 } },
  { id: "gear-maker", name: "Gear Gremlin", role: "More straps. Better silhouette.", stats: { trust: 69, style: 89, energy: 49, pack: 66 }, special: "shield" },
  { id: "quiet-friend", name: "Shy Biter", role: "Quiet stare. Cheeky teeth.", stats: { trust: 82, style: 53, energy: 41, pack: 70 }, special: "lowball" },
  { id: "pack-host", name: "Pack Flirt", role: "Wags first. Steals the room.", stats: { trust: 65, style: 80, energy: 74, pack: 83 }, special: "double" },
  { id: "soft-dom", name: "Soft Dom", role: "Firm voice. Soft landing.", stats: { trust: 85, style: 71, energy: 57, pack: 82 }, special: "shield" },
  { id: "bratty-sub", name: "Bratty Sub", role: "Says ‘make me’ with excellent posture.", stats: { trust: 51, style: 84, energy: 79, pack: 73 }, special: "brat" },
  { id: "switch-hitter", name: "Switch Hitter", role: "Changes sides before you blink.", stats: { trust: 76, style: 73, energy: 83, pack: 68 }, special: "switch" },
  { id: "rubber-rascal", name: "Rubber Rascal", role: "Shines louder than the strobes.", stats: { trust: 54, style: 84, energy: 75, pack: 63 }, special: "reverse" },
  { id: "furry-menace", name: "Furry Menace", role: "All fluff. Questionable intentions.", stats: { trust: 72, style: 60, energy: 69, pack: 81 }, special: "lowball" },
  { id: "worship-pup", name: "Worship Pup", role: "Devotion with dramatic eye contact.", stats: { trust: 84, style: 78, energy: 43, pack: 80 } },
  { id: "edge-runner", name: "Edge Runner", role: "Stops one beat before the drop.", stats: { trust: 62, style: 82, energy: 85, pack: 67 }, special: "edge" },
  { id: "chill-handler", name: "Chill Handler", role: "Owns the remote. Negotiates the rest.", stats: { trust: 83, style: 67, energy: 46, pack: 80 }, special: "reverse" },
  { id: "bubble-blower", name: "Bubble Blower", role: "Blow … bubbles. Obviously.", stats: { trust: 59, style: 72, energy: 83, pack: 87 }, special: "boost" },
  { id: "cuddle-bandit", name: "Cuddle Bandit", role: "Steals blankets. Returns affection.", stats: { trust: 84, style: 55, energy: 47, pack: 79 }, special: "brat" },
  { id: "latex-legend", name: "Latex Legend", role: "Polished, squeaky and impossible to ignore.", stats: { trust: 56, style: 85, energy: 71, pack: 65 }, special: "shield" },
  { id: "couch-wolf", name: "Couch Wolf", role: "Looks harmless until the lights go low.", stats: { trust: 82, style: 61, energy: 44, pack: 84 }, special: "lowball" },
  { id: "sniff-inspector", name: "Sniff Inspector", role: "Checks every corner twice.", stats: { trust: 68, style: 75, energy: 84, pack: 81 }, special: "edge" },
]);

const LABELS = Object.freeze({
  en: { trust: "BARK", style: "GEAR", energy: "STAMINA", pack: "CHEEK", next: "DEAL ANOTHER", draw: "SHOW THE SCORE", win: "You take the trick", lose: "takes the trick", tie: "Same heat. No point.", you: "YOU", special: "SPECIAL", hidden: "HIDDEN", read: "READ", matchPoint: "MATCH POINT", reverse: "REVERSE", clockwise: "CLOCKWISE", counterclockwise: "REVERSED", repeat: "repeat" },
  de: { trust: "WUFF", style: "GEAR", energy: "AUSDAUER", pack: "FRECHHEIT", next: "NOCH EINE KARTE", draw: "ZEIG DEN ENDSCORE", win: "Du holst den Stich", lose: "holt den Stich", tie: "Gleich heiß. Kein Punkt.", you: "DU", special: "SONDERKARTE", hidden: "VERDECKT", read: "GELESEN", matchPoint: "MATCHBALL", reverse: "RICHTUNGSWECHSEL", clockwise: "IM UHRZEIGERSINN", counterclockwise: "UMGEDREHT", repeat: "nochmal" },
});

const SPECIALS = Object.freeze({
  boost: Object.freeze({ en: ["POWER PLAY", "+8 on the chosen stat"], de: ["POWER PLAY", "+8 auf den gewählten Wert"] }),
  shield: Object.freeze({ en: ["SAFE WORD", "Cancels rival bonus and power"], de: ["SAFE WORD", "Stoppt Rivalenbonus und Power"] }),
  lowball: Object.freeze({ en: ["SUB SPACE", "Lower number wins this trick"], de: ["SUB SPACE", "Der kleinere Wert gewinnt"] }),
  switch: Object.freeze({ en: ["SWITCH", "Direction picks the neighbouring stat"], de: ["SWITCH", "Die Richtung wählt den Nachbarwert"] }),
  reverse: Object.freeze({ en: ["TURN AROUND", "Reverses play; the rival stays"], de: ["UMDREHEN", "Dreht das Spiel; der Rivale bleibt"] }),
  double: Object.freeze({ en: ["DOUBLE TROUBLE", "This trick is worth two points"], de: ["DOPPELT ÄRGER", "Dieser Stich zählt zwei Punkte"] }),
  brat: Object.freeze({ en: ["BRAT MODE", "+20 when you dare the weakest stat"], de: ["BRAT MODE", "+20, wenn du den schwächsten Wert wagst"] }),
  edge: Object.freeze({ en: ["EDGING", "+12 on a value from 65 to 79"], de: ["EDGING", "+12 auf einen Wert von 65 bis 79"] }),
});

export const PACK_CARD_RULES = Object.freeze({
  high: Object.freeze({
    en: ["TOP WINS", "Higher value takes it"],
    de: ["OBEN GEWINNT", "Der höhere Wert holt den Stich"],
  }),
  low: Object.freeze({
    en: ["BOTTOM WINS", "Lower value takes it"],
    de: ["UNTEN GEWINNT", "Der kleinere Wert holt den Stich"],
  }),
  target: Object.freeze({
    en: ["SWEET SPOT 60", "Closest to 60 takes it"],
    de: ["SWEET SPOT 60", "Am nächsten an 60 holt den Stich"],
  }),
});

export const PACK_CARD_RIVALS = Object.freeze([
  Object.freeze({ id: "roxy", name: "ROXY" }),
  Object.freeze({ id: "jinx", name: "JINX" }),
]);

const RULE_ROTATION = Object.freeze(["high", "target", "low", "high", "target", "low", "high"]);

const CARD_COPY_DE = Object.freeze({
  "neon-scout": ["Neon-Schnüffler", "Nase runter. Rute hoch."], "gentle-guard": ["Leinen-Tease", "Zieht genau stark genug."],
  "karaoke-pup": ["Karaoke-Pup", "Heult, bis die Halsbänder klingeln."], "night-runner": ["Nachtläufer", "Hüpft noch bei Sonnenaufgang."],
  "juice-mixer": ["Saftiger Pup", "Bringt Ananas. Macht’s extra saftig."], "gear-maker": ["Gear-Gremlin", "Mehr Riemen. Bessere Silhouette."],
  "quiet-friend": ["Schüchterner Beißer", "Leiser Blick. Freche Zähne."], "pack-host": ["Pack-Flirt", "Wedelt zuerst. Klaut die Show."],
  "soft-dom": ["Soft Dom", "Feste Stimme. Weiche Landung."], "bratty-sub": ["Bratty Sub", "Sagt ‚zwing mich‘ in perfekter Haltung."],
  "switch-hitter": ["Switch Hitter", "Wechselt die Seite, bevor du blinzelst."], "rubber-rascal": ["Rubber-Racker", "Glänzt lauter als das Stroboskop."],
  "furry-menace": ["Furry-Bedrohung", "Nur Flausch. Fragwürdige Absichten."], "worship-pup": ["Worship-Pup", "Hingabe mit dramatischem Blickkontakt."],
  "edge-runner": ["Edge Runner", "Stoppt einen Beat vor dem Drop."], "chill-handler": ["Chill-Handler", "Hat die Fernbedienung. Verhandelt den Rest."],
  "bubble-blower": ["Bubble Blower", "Blow … bubbles. Natürlich."],
  "cuddle-bandit": ["Kuschel-Bandit", "Klaut Decken. Gibt Zuneigung zurück."], "latex-legend": ["Latex-Legende", "Poliert, quietschig und nicht zu übersehen."],
  "couch-wolf": ["Sofa-Wolf", "Sieht harmlos aus, bis das Licht ausgeht."], "sniff-inspector": ["Schnüffel-Inspektor", "Prüft jede Ecke zweimal."],
});

function seedNumber(value) { return [...String(value)].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261); }
function shuffledDeck(seed) { return PACK_CARD_DECK.map((card, index) => ({ card, order: seedNumber(`${seed}:${index}:${card.id}`) })).sort((a, b) => a.order - b.order).map(({ card }) => card); }
function activeSpecial(card, difficulty) { return difficulty.specials ? card.special : null; }
function specialBonus(card, special, stat) {
  const value = card.stats[stat];
  if (special === "boost") return 8;
  if (special === "brat" && value === Math.min(...Object.values(card.stats))) return 20;
  if (special === "edge" && value >= 65 && value <= 79) return 12;
  return 0;
}

function normalizedRule(rule) { return PACK_CARD_RULES[rule] ? rule : "high"; }
function ruleScore(value, rule) {
  if (rule === "low") return -value;
  if (rule === "target") return -Math.abs(value - 60);
  return value;
}

export function packCardRuleForRound(seed, round, difficulty = "switch") {
  const offset = seedNumber(`${seed}:${difficulty}:rules`) % RULE_ROTATION.length;
  return RULE_ROTATION[(Math.max(0, round) + offset) % RULE_ROTATION.length];
}

export function resolvePackCardRound({ playerCard, rivalCard, stat, difficulty = "switch", previousStat = null, rule = "high", direction = 1 }) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const playerSpecial = activeSpecial(playerCard, mode);
  const rivalSpecial = activeSpecial(rivalCard, mode);
  const switchCard = playerSpecial === "switch" ? playerCard : rivalSpecial === "switch" ? rivalCard : null;
  const playDirection = direction < 0 ? -1 : 1;
  const currentIndex = Math.max(0, STATS.indexOf(stat));
  const comparisonStat = switchCard ? STATS[(currentIndex + playDirection + STATS.length) % STATS.length] : STATS[currentIndex];
  const lowerWins = playerSpecial === "lowball" || rivalSpecial === "lowball";
  const repeatPenalty = previousStat === stat ? mode.repeatPenalty : 0;
  const playerPower = rivalSpecial === "shield" ? 0 : specialBonus(playerCard, playerSpecial, comparisonStat);
  const rivalPower = playerSpecial === "shield" ? 0 : specialBonus(rivalCard, rivalSpecial, comparisonStat);
  const rivalBonus = playerSpecial === "shield" ? 0 : mode.rivalBonus;
  const playerValue = Math.min(99, Math.max(0, playerCard.stats[comparisonStat] + playerPower));
  const rivalValue = Math.min(99, rivalCard.stats[comparisonStat] + rivalPower);
  const roundRule = lowerWins ? "low" : normalizedRule(rule);
  const playerRank = ruleScore(playerValue, roundRule) - repeatPenalty;
  const rivalRank = ruleScore(rivalValue, roundRule) + rivalBonus;
  const winner = playerRank === rivalRank ? "tie" : playerRank > rivalRank ? "player" : "rival";
  const reverseCount = [playerSpecial, rivalSpecial].filter((special) => special === "reverse").length;
  const reversed = reverseCount === 1;
  const points = playerSpecial === "double" || rivalSpecial === "double" ? 2 : 1;
  return {
    comparisonStat,
    playerValue,
    rivalValue,
    winner,
    lowerWins,
    rule: roundRule,
    direction: playDirection,
    nextDirection: reversed ? -playDirection : playDirection,
    reversed,
    points,
    playerSpecial,
    rivalSpecial,
    repeatPenalty,
    playerPower,
    rivalPower,
    rivalBonus,
    playerRank,
    rivalRank,
  };
}

export function choosePackCardRival({ playerCard, rivalCards, stat, difficulty = "switch", previousStat = null, rule = "high", direction = 1 }) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const candidates = rivalCards.slice(0, mode.rivalChoices);
  const ranked = candidates.map((card, index) => ({
    card,
    index,
    result: resolvePackCardRound({ playerCard, rivalCard: card, stat, difficulty: mode.id, previousStat, rule, direction }),
  }));
  const outcome = Object.freeze({ player: 0, tie: 1, rival: 2 });
  ranked.sort((left, right) => outcome[right.result.winner] - outcome[left.result.winner]
    || right.result.rivalRank - left.result.rivalRank
    || left.index - right.index);
  return ranked[0];
}

function cardView(card, owner, labels, language, difficulty, hidden = false, hiddenCount = 1, ownerName = "KINKYBARA") {
  const article = document.createElement("article");
  article.className = `pack-card ${hidden ? "is-hidden" : ""}`;
  article.dataset.owner = owner;
  if (hidden) { article.innerHTML = `<div class="pack-card-back"><strong>${ownerName}</strong><span>${hiddenCount} ${labels.hidden}</span></div>`; return article; }
  const displayCard = language === "de" && CARD_COPY_DE[card.id] ? { ...card, name: CARD_COPY_DE[card.id][0], role: CARD_COPY_DE[card.id][1] } : card;
  const portrait = document.createElement("div"); portrait.className = "pack-card-portrait"; portrait.textContent = displayCard.name.split(" ").map((part) => part[0]).join("");
  const title = document.createElement("div"); title.className = "pack-card-title"; title.innerHTML = `<strong>${displayCard.name}</strong><small>${displayCard.role}</small>`;
  const specialId = activeSpecial(card, difficulty);
  if (specialId) { const special = document.createElement("div"); special.className = "pack-card-special"; special.innerHTML = `<b>${labels.special} · ${SPECIALS[specialId][language][0]}</b><small>${SPECIALS[specialId][language][1]}</small>`; title.append(special); }
  const stats = document.createElement("div"); stats.className = "pack-card-stats";
  Object.entries(card.stats).forEach(([key, value]) => { const row = document.createElement(owner === "you" ? "button" : "div"); if (row instanceof HTMLButtonElement) row.type = "button"; row.dataset.stat = key; row.innerHTML = `<span>${labels[key]}</span><strong>${value}</strong>`; stats.append(row); });
  article.append(portrait, title, stats); return article;
}

export function startPackCards({ stage, status, message, language = "en", seed = Date.now(), difficulty = "switch", onFinish }) {
  const lang = language === "de" ? "de" : "en"; const labels = LABELS[lang]; const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const playerDeck = shuffledDeck(`${seed}:player`);
  const rivals = PACK_CARD_RIVALS.map((profile) => ({ ...profile, wins: 0, deck: shuffledDeck(`${seed}:${profile.id}`) }));
  const targetWins = Math.floor(mode.rounds / 2) + 1;
  let round = 0; let playerWins = 0; let previousStat = null; let rivalCursor = seedNumber(`${seed}:first-rival`) % rivals.length; let direction = 1; let stopped = false;
  const totalRivalWins = () => rivals.reduce((sum, rival) => sum + rival.wins, 0);
  const strongestRivalWins = () => Math.max(0, ...rivals.map((rival) => rival.wins));
  const updateStatus = () => {
    const matchPointThreshold = targetWins - 1;
    const matchPoint = playerWins >= matchPointThreshold || rivals.some((rival) => rival.wins >= matchPointThreshold);
    const rivalScore = rivals.map((rival) => `${rival.name} ${rival.wins}`).join(" · ");
    status.textContent = `${Math.min(round + 1, mode.rounds)}/${mode.rounds} · ${labels.you} ${playerWins} · ${rivalScore} · ${direction > 0 ? "↻" : "↺"}${matchPoint ? ` · ${labels.matchPoint}` : ""}`;
  };
  const renderRound = () => {
    if (stopped) return;
    stage.replaceChildren(); stage.className = "pack-cards-stage";
    const playerCard = playerDeck[round % playerDeck.length];
    const activeRival = rivals[rivalCursor];
    const roundRule = packCardRuleForRound(seed, round, mode.id);
    const rivalCards = Array.from({ length: mode.rivalChoices }, (_, offset) => activeRival.deck[(round * mode.rivalChoices + offset) % activeRival.deck.length]);
    const cards = document.createElement("div"); cards.className = "pack-card-table";
    const playerView = cardView(playerCard, "you", labels, lang, mode); let rivalView = cardView(rivalCards[0], "kinkybara", labels, lang, mode, true, mode.rivalChoices, activeRival.name);
    const ruleCopy = PACK_CARD_RULES[roundRule][lang];
    const repeatHint = previousStat && mode.repeatPenalty ? ` · ${labels[previousStat]} ${labels.repeat}: −${mode.repeatPenalty}` : "";
    cards.append(playerView, rivalView); message.textContent = `${activeRival.name} · ${ruleCopy[0]} · ${ruleCopy[1]} · ${direction > 0 ? labels.clockwise : labels.counterclockwise}${repeatHint}`; updateStatus();
    playerView.querySelectorAll("button[data-stat]").forEach((button) => button.addEventListener("click", () => {
      if (stopped || playerView.classList.contains("is-played")) return;
      const countersPerfectly = seedNumber(`${seed}:counter:${round}`) % 100 < mode.counterChance;
      const chosenRival = choosePackCardRival({ playerCard, rivalCards: countersPerfectly ? rivalCards : rivalCards.slice(0, 1), stat: button.dataset.stat, difficulty: mode.id, previousStat, rule: roundRule, direction });
      const { card: rivalCard, result } = chosenRival; playerView.classList.add("is-played");
      playerView.querySelectorAll("button[data-stat]").forEach((statButton) => {
        statButton.disabled = true;
        statButton.setAttribute("aria-disabled", "true");
      });
      const revealed = cardView(rivalCard, "kinkybara", labels, lang, mode); rivalView.replaceWith(revealed); rivalView = revealed;
      playerView.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen"); revealed.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen");
      if (result.winner === "player") playerWins += result.points; if (result.winner === "rival") activeRival.wins += result.points;
      const baseMessage = result.winner === "player" ? labels.win : result.winner === "rival" ? `${activeRival.name} ${labels.lose}` : labels.tie;
      const rules = [PACK_CARD_RULES[result.rule][lang][0]];
      if (result.comparisonStat !== button.dataset.stat) rules.push(`SWITCH → ${labels[result.comparisonStat]}`);
      if (result.repeatPenalty) rules.push(`${labels.read} −${result.repeatPenalty}`);
      if (result.reversed) rules.push(labels.reverse);
      if (result.points > 1) rules.push("×2");
      message.textContent = `${baseMessage} · ${result.playerValue}:${result.rivalValue} · ${rules.join(" · ")}`;
      previousStat = button.dataset.stat;
      direction = result.nextDirection;
      if (!result.reversed) rivalCursor = (rivalCursor + 1) % rivals.length;
      updateStatus();
      const rivalWins = totalRivalWins();
      const strongestRival = strongestRivalWins();
      const decisive = playerWins >= targetWins || strongestRival >= targetWins;
      const next = document.createElement("button"); next.type = "button"; next.className = "primary-button pack-card-next"; next.textContent = decisive || round === mode.rounds - 1 ? labels.draw : labels.next;
      next.addEventListener("click", () => {
        if (stopped) return;
        if (decisive || round === mode.rounds - 1) { stopped = true; onFinish({ playerWins, kinkybaraWins: strongestRival, rivalPackWins: rivalWins, rivals: rivals.map(({ id, name, wins }) => ({ id, name, wins })), difficulty: mode.id, roundsPlayed: round + 1, score: Math.min(100, Math.max(20, 50 + (playerWins - strongestRival) * 12)), xp: mode.xp }); }
        else { round += 1; renderRound(); }
      }, { once: true }); stage.append(next); next.focus();
    }, { once: true }));
    stage.append(cards);
    window.requestAnimationFrame(() => playerView.querySelector("button[data-stat]")?.focus());
  };
  renderRound(); return () => { stopped = true; };
}
