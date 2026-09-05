import assert from "node:assert/strict";
import test from "node:test";
import {
  PACK_CARD_DECK,
  PACK_CARD_DIFFICULTIES,
  PACK_CARD_RIVALS,
  choosePackCardRival,
  packCardRuleForRound,
  resolvePackCardRound,
} from "../public/app/pack-cards.js";

const STATS = ["trust", "style", "energy", "pack"];

function seedNumber(value) {
  return [...String(value)].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
}

function shuffledDeck(seed) {
  return PACK_CARD_DECK
    .map((card, index) => ({ card, order: seedNumber(`${seed}:${index}:${card.id}`) }))
    .sort((left, right) => left.order - right.order)
    .map(({ card }) => card);
}

function selectedStat(card, rule, previousStat, mode, strategy) {
  if (strategy === "blind-high") {
    return STATS.reduce((best, stat) => card.stats[stat] > card.stats[best] ? stat : best);
  }
  const score = (stat) => (rule === "low" ? -card.stats[stat] : card.stats[stat])
    - (previousStat === stat ? mode.repeatPenalty : 0);
  return STATS.reduce((best, stat) => score(stat) > score(best) ? stat : best);
}

function simulateMatch(seed, difficulty, strategy) {
  const mode = PACK_CARD_DIFFICULTIES[difficulty];
  const playerDeck = shuffledDeck(`${seed}:player`);
  const rivals = PACK_CARD_RIVALS.map((profile) => ({
    ...profile,
    wins: 0,
    deck: shuffledDeck(`${seed}:${profile.id}`),
  }));
  const targetWins = Math.floor(mode.rounds / 2) + 1;
  let round = 0;
  let playerWins = 0;
  let previousStat = null;
  let rivalCursor = seedNumber(`${seed}:first-rival`) % rivals.length;

  for (; round < mode.rounds; round += 1) {
    const playerCard = playerDeck[round % playerDeck.length];
    const activeRival = rivals[rivalCursor];
    const rule = packCardRuleForRound(seed, round, mode.id);
    const rivalCards = Array.from(
      { length: mode.rivalChoices },
      (_, offset) => activeRival.deck[(round * mode.rivalChoices + offset) % activeRival.deck.length],
    );
    const stat = selectedStat(playerCard, rule, previousStat, mode, strategy);
    const counters = seedNumber(`${seed}:counter:${round}`) % 100 < mode.counterChance;
    const { result } = choosePackCardRival({
      playerCard,
      rivalCards: counters ? rivalCards : rivalCards.slice(0, 1),
      stat,
      difficulty: mode.id,
      previousStat,
      rule,
    });

    if (result.winner === "player") playerWins += result.points;
    if (result.winner === "rival") activeRival.wins += result.points;
    if (!result.reversed) rivalCursor = (rivalCursor + 1) % rivals.length;
    previousStat = stat;

    const rivalPackWins = rivals.reduce((sum, rival) => sum + rival.wins, 0);
    if (playerWins >= targetWins || rivalPackWins >= targetWins) break;
  }

  const rivalPackWins = rivals.reduce((sum, rival) => sum + rival.wins, 0);
  return playerWins === rivalPackWins ? 0.5 : playerWins > rivalPackWins ? 1 : 0;
}

test("elite Pack Card values are exceptional instead of appearing on every hand", () => {
  const values = PACK_CARD_DECK.flatMap((card) => Object.values(card.stats));
  const cardMaxima = PACK_CARD_DECK.map((card) => Math.max(...Object.values(card.stats)));

  assert.equal(Math.max(...values), 89);
  assert.ok(values.filter((value) => value > 85).length <= 3);
  assert.ok(cardMaxima.filter((value) => value > 85).length <= 3);
  assert.ok(cardMaxima.filter((value) => value <= 84).length / cardMaxima.length >= 0.7);
});

test("ordinary cards clearly outnumber the two simple special-card types", () => {
  const specialCards = PACK_CARD_DECK.filter((card) => card.special);
  const ordinaryCards = PACK_CARD_DECK.filter((card) => !card.special);

  assert.equal(specialCards.length, 3);
  assert.ok(ordinaryCards.length / PACK_CARD_DECK.length >= 0.85);
  assert.deepEqual(new Set(specialCards.map((card) => card.special)), new Set(["reverse", "double"]));
  assert.equal(specialCards.filter((card) => card.special === "reverse").length, 2);
  assert.equal(specialCards.filter((card) => card.special === "double").length, 1);
});

test("every match alternates only the two visible Quartett rules", () => {
  for (let seed = 0; seed < 100; seed += 1) {
    const rules = Array.from({ length: 7 }, (_, round) => packCardRuleForRound(`switch-${seed}`, round, "switch"));
    const softRules = Array.from({ length: 5 }, (_, round) => packCardRuleForRound(`soft-${seed}`, round, "soft"));

    assert.deepEqual(new Set(rules), new Set(["high", "low"]));
    assert.equal(rules.filter((rule) => rule === "high").length, 4);
    assert.equal(rules.filter((rule) => rule === "low").length, 3);
    assert.deepEqual(new Set(softRules), new Set(["high", "low"]));
  }
});

test("blindly choosing the largest number loses under a low-wins contract", () => {
  const playerCard = { stats: { trust: 84, style: 61, energy: 47, pack: 79 } };
  const rivalCard = { stats: { trust: 80, style: 64, energy: 50, pack: 70 } };

  assert.equal(resolvePackCardRound({ playerCard, rivalCard, stat: "trust", difficulty: "soft", rule: "low" }).winner, "rival");
  assert.equal(resolvePackCardRound({ playerCard: { stats: { ...playerCard.stats, energy: 40 } }, rivalCard, stat: "energy", difficulty: "soft", rule: "low" }).winner, "player");
});

test("reading the round rule decisively outperforms blindly tapping the largest number", () => {
  const rules = Array.from({ length: 7 }, (_, round) => packCardRuleForRound("balance-check", round, "switch"));
  let blindScore = 0;
  let awareScore = 0;
  let comparisons = 0;

  for (const rule of rules) {
    for (const playerCard of PACK_CARD_DECK) {
      for (const rivalCard of PACK_CARD_DECK) {
        const blindStat = selectedStat(playerCard, rule, null, PACK_CARD_DIFFICULTIES.switch, "blind-high");
        const awareStat = selectedStat(playerCard, rule, null, PACK_CARD_DIFFICULTIES.switch, "rule-aware");
        const blind = resolvePackCardRound({ playerCard, rivalCard, stat: blindStat, difficulty: "switch", rule });
        const aware = resolvePackCardRound({ playerCard, rivalCard, stat: awareStat, difficulty: "switch", rule });
        blindScore += blind.winner === "player" ? 1 : blind.winner === "tie" ? 0.5 : 0;
        awareScore += aware.winner === "player" ? 1 : aware.winner === "tie" ? 0.5 : 0;
        comparisons += 1;
      }
    }
  }

  const blindRate = blindScore / comparisons;
  const awareRate = awareScore / comparisons;
  assert.ok(blindRate < 0.57, `blind rate ${blindRate}`);
  assert.ok(awareRate > 0.68, `aware rate ${awareRate}`);
  assert.ok(awareRate - blindRate > 0.25, `strategy lift ${awareRate - blindRate}`);
});

test("difficulty simulations leave room for wins and losses without rewarding blind play", () => {
  const matchCount = 2_000;
  const score = (difficulty, strategy) => Array.from(
    { length: matchCount },
    (_, index) => simulateMatch(`balance-${index}`, difficulty, strategy),
  ).reduce((sum, outcome) => sum + outcome, 0) / matchCount;

  const softAware = score("soft", "rule-aware");
  const switchAware = score("switch", "rule-aware");
  const alphaAware = score("alpha", "rule-aware");
  const switchBlind = score("switch", "blind-high");

  assert.ok(softAware > 0.94 && softAware < 0.99, `soft aware ${softAware}`);
  assert.ok(switchAware > 0.52 && switchAware < 0.66, `switch aware ${switchAware}`);
  assert.ok(alphaAware > 0.3 && alphaAware < 0.45, `alpha aware ${alphaAware}`);
  assert.ok(switchBlind < 0.2, `switch blind ${switchBlind}`);
  assert.ok(switchAware - switchBlind > 0.4, `switch strategy lift ${switchAware - switchBlind}`);
  assert.ok(softAware > switchAware && switchAware > alphaAware);
});

test("repeat reads reduce rank while the rare effects stay UNO-simple", () => {
  const ordinary = { stats: { trust: 40, style: 55, energy: 70, pack: 80 } };
  const repeated = resolvePackCardRound({ playerCard: ordinary, rivalCard: ordinary, stat: "trust", previousStat: "trust", difficulty: "switch", rule: "low" });
  const fresh = resolvePackCardRound({ playerCard: ordinary, rivalCard: ordinary, stat: "trust", difficulty: "switch", rule: "low" });
  assert.equal(repeated.playerRank, fresh.playerRank - 8);

  const reverseCard = { special: "reverse", stats: ordinary.stats };
  const reversed = resolvePackCardRound({ playerCard: reverseCard, rivalCard: ordinary, stat: "style", difficulty: "switch", direction: 1 });
  assert.equal(reversed.reversed, true);
  assert.equal(reversed.nextDirection, -1);
  assert.equal(resolvePackCardRound({ playerCard: reverseCard, rivalCard: reverseCard, stat: "style", difficulty: "switch", direction: 1 }).nextDirection, 1);

  const doubleCard = { special: "double", stats: ordinary.stats };
  assert.equal(resolvePackCardRound({ playerCard: doubleCard, rivalCard: ordinary, stat: "style", difficulty: "switch" }).points, 2);

  const retiredSpecial = { special: "switch", stats: ordinary.stats };
  const retiredResult = resolvePackCardRound({ playerCard: retiredSpecial, rivalCard: ordinary, stat: "style", difficulty: "switch", direction: -1 });
  assert.equal(retiredResult.playerSpecial, null);
  assert.equal(retiredResult.comparisonStat, "style");
});

test("Pack Cards has two persistent named NPC rivals", () => {
  assert.deepEqual(PACK_CARD_RIVALS.map(({ id }) => id), ["roxy", "jinx"]);
  assert.equal(PACK_CARD_DIFFICULTIES.switch.rivalChoices, 3);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.rivalChoices, 4);
  assert.equal(PACK_CARD_DIFFICULTIES.switch.counterChance, 100);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.counterChance, 100);
  assert.equal(PACK_CARD_DIFFICULTIES.soft.rivalBonus, 0);
  assert.equal(PACK_CARD_DIFFICULTIES.switch.rivalBonus, 0);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.rivalBonus, 0);
});
