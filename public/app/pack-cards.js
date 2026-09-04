const STATS = Object.freeze(["trust", "style", "energy", "pack"]);

export const PACK_CARD_DIFFICULTIES = Object.freeze({
  soft: Object.freeze({ id: "soft", rounds: 5, rivalBonus: 0, specials: false, xp: 8 }),
  switch: Object.freeze({ id: "switch", rounds: 7, rivalBonus: 3, specials: true, xp: 12 }),
  alpha: Object.freeze({ id: "alpha", rounds: 7, rivalBonus: 7, specials: true, xp: 16 }),
});

export const PACK_CARD_DECK = Object.freeze([
  { id: "neon-scout", name: "Neon Sniffer", role: "Nose down. Tail up.", stats: { trust: 82, style: 76, energy: 68, pack: 88 } },
  { id: "gentle-guard", name: "Leash Tease", role: "Pulls just hard enough.", stats: { trust: 91, style: 64, energy: 72, pack: 86 } },
  { id: "karaoke-pup", name: "Karaoke Pup", role: "Howls till the collars jingle.", stats: { trust: 78, style: 86, energy: 94, pack: 84 } },
  { id: "night-runner", name: "Night Runner", role: "Still bouncing at sunrise.", stats: { trust: 70, style: 88, energy: 93, pack: 72 }, special: "boost" },
  { id: "juice-mixer", name: "Juicy Pup", role: "Brings pineapple. Keeps it juicy.", stats: { trust: 88, style: 72, energy: 76, pack: 92 } },
  { id: "gear-maker", name: "Gear Gremlin", role: "More straps. Better silhouette.", stats: { trust: 84, style: 94, energy: 66, pack: 80 }, special: "shield" },
  { id: "quiet-friend", name: "Shy Biter", role: "Quiet stare. Cheeky teeth.", stats: { trust: 92, style: 70, energy: 58, pack: 90 }, special: "lowball" },
  { id: "pack-host", name: "Pack Flirt", role: "Wags first. Steals the room.", stats: { trust: 90, style: 82, energy: 84, pack: 94 } },
  { id: "soft-dom", name: "Soft Dom", role: "Firm voice. Soft landing.", stats: { trust: 91, style: 85, energy: 74, pack: 89 }, special: "shield" },
  { id: "bratty-sub", name: "Bratty Sub", role: "Says ‘make me’ with excellent posture.", stats: { trust: 73, style: 92, energy: 89, pack: 90 }, special: "boost" },
  { id: "switch-hitter", name: "Switch Hitter", role: "Changes sides before you blink.", stats: { trust: 87, style: 90, energy: 91, pack: 83 }, special: "switch" },
  { id: "rubber-rascal", name: "Rubber Rascal", role: "Shines louder than the strobes.", stats: { trust: 68, style: 94, energy: 86, pack: 81 } },
  { id: "furry-menace", name: "Furry Menace", role: "All fluff. Questionable intentions.", stats: { trust: 89, style: 78, energy: 83, pack: 92 }, special: "lowball" },
  { id: "worship-pup", name: "Worship Pup", role: "Devotion with dramatic eye contact.", stats: { trust: 94, style: 87, energy: 62, pack: 90 } },
  { id: "edge-runner", name: "Edge Runner", role: "Stops one beat before the drop.", stats: { trust: 76, style: 91, energy: 93, pack: 85 }, special: "switch" },
  { id: "chill-handler", name: "Chill Handler", role: "Owns the remote. Negotiates the rest.", stats: { trust: 92, style: 80, energy: 69, pack: 91 } },
  { id: "bubble-blower", name: "Bubble Blower", role: "Blow … bubbles. Obviously.", stats: { trust: 79, style: 84, energy: 88, pack: 90 }, special: "boost" },
]);

const LABELS = Object.freeze({
  en: { trust: "BARK", style: "GEAR", energy: "STAMINA", pack: "CHEEK", choose: "Pick a stat — read the special card first", next: "DEAL ANOTHER", draw: "SHOW THE SCORE", win: "You take the trick", lose: "Kinkybara takes the trick", tie: "Same heat. No point.", you: "YOU", special: "SPECIAL" },
  de: { trust: "WUFF", style: "GEAR", energy: "AUSDAUER", pack: "FRECHHEIT", choose: "Wähl einen Wert – lies vorher die Sonderkarte", next: "NOCH EINE KARTE", draw: "ZEIG DEN ENDSCORE", win: "Du holst den Stich", lose: "Kinkybara holt den Stich", tie: "Gleich heiß. Kein Punkt.", you: "DU", special: "SONDERKARTE" },
});

const SPECIALS = Object.freeze({
  boost: Object.freeze({ en: ["POWER PLAY", "+8 on the chosen stat"], de: ["POWER PLAY", "+8 auf den gewählten Wert"] }),
  shield: Object.freeze({ en: ["SAFE WORD", "Cancels the rival bonus"], de: ["SAFE WORD", "Stoppt den Rivalen-Bonus"] }),
  lowball: Object.freeze({ en: ["SUB SPACE", "Lower number wins this trick"], de: ["SUB SPACE", "Der kleinere Wert gewinnt"] }),
  switch: Object.freeze({ en: ["SWITCH", "The next stat is compared"], de: ["SWITCH", "Der nächste Wert wird verglichen"] }),
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
});

function seedNumber(value) { return [...String(value)].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261); }
function shuffledDeck(seed) { return PACK_CARD_DECK.map((card, index) => ({ card, order: seedNumber(`${seed}:${index}:${card.id}`) })).sort((a, b) => a.order - b.order).map(({ card }) => card); }
function activeSpecial(card, difficulty) { return difficulty.specials ? card.special : null; }

export function resolvePackCardRound({ playerCard, rivalCard, stat, difficulty = "switch" }) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch;
  const playerSpecial = activeSpecial(playerCard, mode);
  const rivalSpecial = activeSpecial(rivalCard, mode);
  const switchCard = playerSpecial === "switch" ? playerCard : rivalSpecial === "switch" ? rivalCard : null;
  const currentIndex = Math.max(0, STATS.indexOf(stat));
  const comparisonStat = switchCard ? STATS[(currentIndex + 1) % STATS.length] : STATS[currentIndex];
  const lowerWins = playerSpecial === "lowball" || rivalSpecial === "lowball";
  const playerValue = playerCard.stats[comparisonStat] + (playerSpecial === "boost" ? 8 : 0);
  const rivalValue = rivalCard.stats[comparisonStat] + (rivalSpecial === "boost" ? 8 : 0) + (playerSpecial === "shield" ? 0 : mode.rivalBonus);
  const winner = playerValue === rivalValue ? "tie" : ((playerValue < rivalValue) === lowerWins ? "player" : "rival");
  return { comparisonStat, playerValue, rivalValue, winner, lowerWins, playerSpecial, rivalSpecial };
}

function cardView(card, owner, labels, language, difficulty, hidden = false) {
  const article = document.createElement("article");
  article.className = `pack-card ${hidden ? "is-hidden" : ""}`;
  article.dataset.owner = owner;
  if (hidden) { article.innerHTML = '<div class="pack-card-back"><strong>KINKYBARA</strong><span>PACK CARDS</span></div>'; return article; }
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
  const lang = language === "de" ? "de" : "en"; const labels = LABELS[lang]; const mode = PACK_CARD_DIFFICULTIES[difficulty] || PACK_CARD_DIFFICULTIES.switch; const deck = shuffledDeck(seed);
  let round = 0; let playerWins = 0; let kinkybaraWins = 0; let stopped = false;
  const updateStatus = () => { status.textContent = `${Math.min(round + 1, mode.rounds)}/${mode.rounds} · ${labels.you} ${playerWins} · KINKYBARA ${kinkybaraWins}`; };
  const renderRound = () => {
    if (stopped) return;
    stage.replaceChildren(); stage.className = "pack-cards-stage";
    const playerCard = deck[(round * 2) % deck.length]; const rivalCard = deck[(round * 2 + 1) % deck.length];
    const cards = document.createElement("div"); cards.className = "pack-card-table";
    const playerView = cardView(playerCard, "you", labels, lang, mode); let rivalView = cardView(rivalCard, "kinkybara", labels, lang, mode, true);
    cards.append(playerView, rivalView); message.textContent = labels.choose; updateStatus();
    playerView.querySelectorAll("button[data-stat]").forEach((button) => button.addEventListener("click", () => {
      if (stopped || playerView.classList.contains("is-played")) return;
      const result = resolvePackCardRound({ playerCard, rivalCard, stat: button.dataset.stat, difficulty: mode.id }); playerView.classList.add("is-played");
      const revealed = cardView(rivalCard, "kinkybara", labels, lang, mode); rivalView.replaceWith(revealed); rivalView = revealed;
      playerView.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen"); revealed.querySelector(`[data-stat="${result.comparisonStat}"]`)?.classList.add("is-chosen");
      if (result.winner === "player") playerWins += 1; if (result.winner === "rival") kinkybaraWins += 1;
      const baseMessage = result.winner === "player" ? labels.win : result.winner === "rival" ? labels.lose : labels.tie;
      const rule = result.comparisonStat !== button.dataset.stat ? ` · SWITCH → ${labels[result.comparisonStat]}` : result.lowerWins ? ` · ${lang === "de" ? "KLEINER GEWINNT" : "LOWER WINS"}` : "";
      message.textContent = `${baseMessage} · ${result.playerValue}:${result.rivalValue}${rule}`; updateStatus();
      const next = document.createElement("button"); next.type = "button"; next.className = "primary-button pack-card-next"; next.textContent = round === mode.rounds - 1 ? labels.draw : labels.next;
      next.addEventListener("click", () => { round += 1; if (round >= mode.rounds) { stopped = true; onFinish({ playerWins, kinkybaraWins, difficulty: mode.id, score: Math.max(35, 50 + (playerWins - kinkybaraWins) * 10), xp: mode.xp }); } else renderRound(); }); stage.append(next);
    }, { once: true }));
    stage.append(cards);
  };
  renderRound(); return () => { stopped = true; };
}
