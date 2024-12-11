// Template
import { readInput } from "./util.ts";

function addTo(object: Record<string, number>, stone: string, count: number) {
  if (stone in object) object[stone] += count;
  else object[stone] = count;
}

function main(input: string): [number, number] {
  let stones = input
    .split(" ")
    .reduce<Record<string, number>>((o, num) => ((o[num] = 1), o), {});
  const answer: number[] = [];

  for (let i = 0; i < 75; i++) {
    const newStones: Record<string, number> = {};
    for (const stone in stones) {
      const count = stones[stone];
      if (stone === "0") addTo(newStones, "1", count);
      else if (stone.length % 2 === 0) {
        const left = stone.slice(0, stone.length / 2);
        const right = Number(stone.slice(stone.length / 2)).toString();
        addTo(newStones, left, count);
        addTo(newStones, right, count);
      } else {
        const newstone = (Number(stone) * 2024).toString();
        addTo(newStones, newstone, count);
      }
    }
    stones = newStones;

    if (i === 24 || i === 74) {
      let length = 0;
      for (const stone in stones) length += stones[stone];
      answer.push(length);
    }
  }

  return [answer[0], answer[1]];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("25 Blinks", () => {
  const [out, _] = main(`125 17`);
  assertEquals(out, 55312);
});
