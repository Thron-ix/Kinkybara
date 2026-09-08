import test from "node:test";
import assert from "node:assert/strict";
import { questGameVariation, shuffleQuestCards } from "../public/app/quest-games.js";
import { QUEST_DEFINITIONS, localizedQuest } from "../public/app/quest-core.js";

test("each mini-game has three bounded variants, with the middle set most common", () => {
  const expected = {
    sparkles: ["lifeMs", 2000, 1650, 1300], memory: ["pairs", 4, 6, 8],
    coffee: ["speed", 1.8, 2.4, 3], grill: ["seconds", 8, 6, 4.5],
    route: ["stops", 3, 4, 5], rhythm: ["rounds", 4, 5, 6],
  };
  for (const [game, [key, gentle, regular, brisk]] of Object.entries(expected)) {
    assert.equal(questGameVariation(game, () => 0)[key], gentle);
    for (const roll of [0.25, 0.5, 0.799]) assert.equal(questGameVariation(game, () => roll)[key], regular);
    assert.equal(questGameVariation(game, () => 0.999)[key], brisk);
    const config = questGameVariation(game, () => 0);
    config[key] = -1;
    assert.equal(questGameVariation(game, () => 0)[key], gentle);
  }
  assert.throws(() => questGameVariation("missing"));
});

test("shuffles retain every card and do not mutate the source", () => {
  const input = [1, 2, 3, 4, 5, 6];
  for (const roll of [0, 0.3, 0.8, 0.999]) {
    const shuffled = shuffleQuestCards(input, () => roll);
    assert.deepEqual([...shuffled].sort(), input);
    assert.notEqual(shuffled, input);
  }
  assert.deepEqual(input, [1, 2, 3, 4, 5, 6]);
});

test("variable boards have accurate instructions in both languages", () => {
  for (const lang of ["de", "en"]) {
    for (const id of ["board-memory", "city-tour"]) {
      const instruction = localizedQuest(QUEST_DEFINITIONS[id], lang).instruction;
      assert.doesNotMatch(instruction, /six|sechs|five|fünf/);
    }
    assert.match(localizedQuest(QUEST_DEFINITIONS["onion-free-grill"], lang).instruction, /Zeit|time/);
  }
});
