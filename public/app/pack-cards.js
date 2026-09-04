const STATS = Object.freeze(["trust", "style", "energy", "pack"]);

export const PACK_CARD_DIFFICULTIES = Object.freeze({
  soft: Object.freeze({ id: "soft", rounds: 5, rivalBonus: 0, rivalChoices: 1, counterChance: 0, repeatPenalty: 0, specials: false, xp: 8 }),
  switch: Object.freeze({ id: "switch", rounds: 7, rivalBonus: 2, rivalChoices: 2, counterChance: 60, repeatPenalty: 6, specials: true, xp: 14 }),
  alpha: Object.freeze({ id: "alpha", rounds: 7, rivalBonus: 4, rivalChoices: 3, counterChance: 100, repeatPenalty: 10, specials: true, xp: 20 }),
});

export const PACK_CARD_DECK = Object.freeze([
  { id: "neon-scout", name: "Neon Sniffer", role: "Nose down. Tail up.", stats: { trust: 64, style: 77, energy: 52, pack: 85 } },
  { id: "gentle-guard", name: "Leash Tease", role: "Pulls just hard enough.", stats: { trust: 88, style: 48, energy: 61, pack: 75 } },
  { id: "karaoke-pup", name: "Karaoke Pup", role: "Howls till the collars jingle.", stats: { trust: 57, style: 81, energy: 89, pack: 72 } },
  { id: "night-runner", name: "Night Runner", role: "Still bouncing at sunrise.", stats: { trust: 45, style: 76, energy: 88, pack: 60 }, special: "boost" },
  { id: "juice-mixer", name: "Juicy Pup", role: "Brings pineapple. Keeps it juicy.", stats: { trust: 73, style: 62, energy: 68, pack: 86 } },
  { id: "gear-maker", name: "Gear Gremlin", role: "More straps. Better silhouette.", stats: { trust: 69, style: 89, energy: 49, pack: 66 }, special: "shield" },
  { id: "quiet-friend", name: "Shy Biter", role: "Quiet stare. Cheeky teeth.", stats: { trust: 87, style: 53, energy: 41, pack: 70 }, special: "lowball" },
  { id: "pack-host", name: "Pack Flirt", role: "Wags first. Steals the room.", stats: { trust: 65, style: 80, energy: 74, pack: 88 } },
  { id: "soft-dom", name: "Soft Dom", role: "Firm voice. Soft landing.", stats: { trust: 89, style: 71, energy: 57, pack: 82 }, special: "shield" },
  { id: "bratty-sub", name: "Bratty Sub", role: "Says ‘make me’ with excellent posture.", stats: { trust: 51, style: 87, energy: 79, pack: 73 }, special: "brat" },
  { id: "switch-hitter", name: "Switch Hitter", role: "Changes sides before you blink.", stats: { trust: 76, style: 73, energy: 85, pack: 68 }, special: "switch" },
  { id: "rubber-rascal", name: "Rubber Rascal", role: "Shines louder than the strobes.", stats: { trust: 54, style: 88, energy: 75, pack: 63 } },
  { id: "furry-menace", name: "Furry Menace", role: "All fluff. Questionable intentions.", stats: { trust: 72, style: 60, energy: 69, pack: 87 }, special: "lowball" },
  { id: "worship-pup", name: "Worship Pup", role: "Devotion with dramatic eye contact.", stats: { trust: 88, style: 78, energy: 43, pack: 83 } },
  { id: "edge-runner", name: "Edge Runner", role: "Stops one beat before the drop.", stats: { trust: 62, style: 82, energy: 86, pack: 67 }, special: "edge" },
  { id: "chill-handler", name: "Chill Handler", role: "Owns the remote. Negotiates the rest.", stats: { trust: 86, style: 67, energy: 46, pack: 80 } },
  { id: "bubble-blower", name: "Bubble Blower", role: "Blow … bubbles. Obviously.", stats: { trust: 59, style: 72, energy: 84, pack: 89 }, special: "boost" },
  { id: "cuddle-bandit", name: "Cuddle Bandit", role: "Steals blankets. Returns affection.", stats: { trust: 89, style: 55, energy: 47, pack: 79 }, special: "brat" },
  { id: "latex-legend", name: "Latex Legend", role: "Polished, squeaky and impossible to ignore.", stats: { trust: 56, style: 87, energy: 71, pack: 65 }, special: "shield" },
  { id: "couch-wolf", name: "Couch Wolf", role: "Looks harmless until the lights go low.", stats: { trust: 82, style: 61, energy: 44, pack: 88 }, special: "lowball" },
  { id: "sniff-inspector", name: "Sniff Inspector", role: "Checks every corner twice.", stats: { trust: 68, style: 75, energy: 87, pack: 81 }, special: "edge" },
]);

const LABELS = Object.freeze({
  en: { trust: "BARK", style: "GEAR", energy: "STAMINA", pack: "CHEEK", choose: "Pick a stat — the rival has a hidden hand", next: "DEAL ANOTHER", draw: "SHOW THE SCORE", win: "You take the trick", lose: "Kinkybara takes the trick", tie: "Same heat. No point.", you: "YOU", special: "SPECIAL", hidden: "HIDDEN", read: "READ", matchPoint: "MATCH POINT" },
  de: { trust: "WUFF", style: "GEAR", energy: "AUSDAUER", pack: "FRECHHEIT", choose: "Wähl einen Wert – dein Gegenüber hält verdeckte Karten", next: "NOCH EINE KARTE", draw: "ZEIG DEN ENDSCORE", win: "Du holst den Stich", lose: "Kinkybara holt den Stich", tie: "Gleich heiß. Kein Punkt.", you: "DU", special: "SONDERKARTE", hidden: "VERDECKT", read: "GELESEN", matchPoint: "MATCHBALL" },
});

const SPECIALS = Object.freeze({
  boost: Object.freeze({ en: ["POWER PLAY", "+8 on the chosen stat"], de: ["POWER PLAY", "+8 auf den gewählten Wert"] }),
  shield: Object.freeze({ en: ["SAFE WORD", "Cancels rival bonus and power"], de: ["SAFE WORD", "Stoppt Rivalenbonus und Power"] }),
  lowball: Object.freeze({ en: ["SUB SPACE", "Lower number wins this trick"], de: ["SUB SPACE", "Der kleinere Wert gewinnt"] }),
  switch: Object.freeze({ en: ["SWITCH", "The next stat is compared"], de: ["SWITCH", "Der nächste Wert wird verglichen"] }),
  brat: Object.freeze({ en: ["BRAT MODE", "+24 when you dare the weakest stat"], de: ["BRAT MODE", "+24, wenn du den schwächsten Wert wagst"] }),
  edge: Object.freeze({ en: ["EDGING", "+12 on a value from 65 to 79"], de: ["EDGING", "+12 auf einen Wert von 65 bis 79"] }),
});

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
  if (special === "brat" && value === Math.min(...Object.values(card.stats))) return 24;
  if (special === "edge" && value >= 65 && value <= 79) return 12;
  return 0;
}

export function resolvePackCardRound({ playerCard, rivalCard, stat, difficulty = "switch", previousStat = null }) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const playerSpecial = activeSpecial(playerCard, mode);
  const rivalSpecial = activeSpecial(rivalCard, mode);
  const switchCard = playerSpecial === "switch" ? playerCard : rivalSpecial === "switch" ? rivalCard : null;
  const currentIndex = Math.max(0, STATS.indexOf(stat));
  const comparisonStat = switchCard ? STATS[(currentIndex + 1) % STATS.length] : STATS[currentIndex];
  const lowerWins = playerSpecial === "lowball" || rivalSpecial === "lowball";
  const repeatPenalty = previousStat === stat ? mode.repeatPenalty : 0;
  const playerPower = rivalSpecial === "shield" ? 0 : specialBonus(playerCard, playerSpecial, comparisonStat);
  const rivalPower = playerSpecial === "shield" ? 0 : specialBonus(rivalCard, rivalSpecial, comparisonStat);
  const playerValue = Math.max(0, playerCard.stats[comparisonStat] + playerPower - repeatPenalty);
  const rivalValue = rivalCard.stats[comparisonStat] + rivalPower + (playerSpecial === "shield" ? 0 : mode.rivalBonus);
  const winner = playerValue === rivalValue ? "tie" : ((playerValue < rivalValue) === lowerWins ? "player" : "rival");
  return { comparisonStat, playerValue, rivalValue, winner, lowerWins, playerSpecial, rivalSpecial, repeatPenalty, playerPower, rivalPower };
}

export function choosePackCardRival({ playerCard, rivalCards, stat, difficulty = "switch", previousStat = null }) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const candidates = rivalCards.slice(0, mode.rivalChoices);
  const ranked = candidates.map((card, index) => ({
    card,
    index,
    result: resolvePackCardRound({ playerCard, rivalCard: card, stat, difficulty: mode.id, previousStat }),
  }));
  const outcome = Object.freeze({ player: 0, tie: 1, rival: 2 });
  ranked.sort((left, right) => outcome[right.result.winner] - outcome[left.result.winner]
    || right.result.rivalValue - left.result.rivalValue
    || left.index - right.index);
  return ranked[0];
}

function cardView(card, owner, labels, language, difficulty, hidden = false, hiddenCount = 1) {
  const article = document.createElement("article");
  article.className = `pack-card ${hidden ? "is-hidden" : ""}`;
  article.dataset.owner = owner;
  if (hidden) { article.innerHTML = `<div class="pack-card-back"><strong>KINKYBARA</strong><span>${hiddenCount} ${labels.hidden}</span></div>`; return article; }
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
  const playerDeck = shuffledDeck(`${seed}:player`); const rivalDeck = shuffledDeck(`${seed}:rival`); const targetWins = Math.floor(mode.rounds / 2) + 1;
  let round = 0; let playerWins = 0; let kinkybaraWins = 0; let previousStat = null; let stopped = false;
  const updateStatus = () => {
    const matchPoint = playerWins === targetWins - 1 || kinkybaraWins === targetWins - 1;
    status.textContent = `${Math.min(round + 1, mode.rounds)}/${mode.rounds} · ${labels.you} ${playerWins} · KINKYBARA ${kinkybaraWins}${matchPoint ? ` · ${labels.matchPoint}` : ""}`;
  };
  const renderRound = () => {
    if (stopped) return;
    stage.replaceChildren(); stage.className = "pack-cards-stage";
    const playerCard = playerDeck[round % playerDeck.length];
    const rivalCards = Array.from({ length: mode.rivalChoices }, (_, offset) => rivalDeck[(round * mode.rivalChoices + offset) % rivalDeck.length]);
    const cards = document.createElement("div"); cards.className = "pack-card-table";
    const playerView = cardView(playerCard, "you", labels, lang, mode); let rivalView = cardView(rivalCards[0], "kinkybara", labels, lang, mode, true, mode.rivalChoices);
    cards.append(playerView, rivalView); message.textContent = labels.choose; updateStatus();
    playerView.querySelectorAll("button[data-stat]").forEach((button) => button.addEventListener("click", () => {
      if (stopped || playerView.classList.contains("is-played")) return;
      const countersPerfectly = seedNumber(`${seed}:counter:${round}`) % 100 < mode.counterChance;
      const chosenRival = choosePackCardRival({ playerCard, rivalCards: countersPerfectly ? rivalCards : rivalCards.slice(0, 1), stat: button.dataset.stat, difficulty: mode.id, previousStat });
      const { card: rivalCard, result } = chosenRival; playerView.classList.add("is-played");
      const revealed = cardView(rivalCard, "kinkybara", labels, lang, mode); rivalView.replaceWith(revealed); rivalView = revealed;
      playerView.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen"); revealed.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen");
      if (result.winner === "player") playerWins += 1; if (result.winner === "rival") kinkybaraWins += 1;
      const baseMessage = result.winner === "player" ? labels.win : result.winner === "rival" ? labels.lose : labels.tie;
      const rules = [];
      if (result.comparisonStat !== button.dataset.stat) rules.push(`SWITCH → ${labels[result.comparisonStat]}`);
      if (result.lowerWins) rules.push(lang === "de" ? "KLEINER GEWINNT" : "LOWER WINS");
      if (result.repeatPenalty) rules.push(`${labels.read} −${result.repeatPenalty}`);
      message.textContent = `${baseMessage} · ${result.playerValue}:${result.rivalValue}${rules.length ? ` · ${rules.join(" · ")}` : ""}`; previousStat = button.dataset.stat; updateStatus();
      const decisive = playerWins >= targetWins || kinkybaraWins >= targetWins;
      const next = document.createElement("button"); next.type = "button"; next.className = "primary-button pack-card-next"; next.textContent = decisive || round === mode.rounds - 1 ? labels.draw : labels.next;
      next.addEventListener("click", () => {
        if (decisive || round === mode.rounds - 1) { stopped = true; onFinish({ playerWins, kinkybaraWins, difficulty: mode.id, roundsPlayed: round + 1, score: Math.max(35, 50 + (playerWins - kinkybaraWins) * 10), xp: mode.xp }); }
        else { round += 1; renderRound(); }
      }); stage.append(next);
    }, { once: true }));
    stage.append(cards);
  };
  renderRound(); return () => { stopped = true; };
}
