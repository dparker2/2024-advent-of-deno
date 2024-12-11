// Template
import { readInput } from "./util.ts";

function main(input: string): [number, number] {
  let stones = input.split(" ").map(Number);
  for (let i = 0; i < 25; i++) {
    stones = stones.flatMap((stone) => {
      const stoneStr = stone.toString();
      if (stone === 0) return [1];
      if (stoneStr.length % 2 === 0)
        return [
          Number(stoneStr.slice(0, stoneStr.length / 2)),
          Number(stoneStr.slice(stoneStr.length / 2)),
        ];
      return stone * 2024;
    });
  }

  return [stones.length, 0];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const [out, _] = main(`125 17`);
  assertEquals(out, 55312);
});

Deno.test("Part 2: ", () => {
  const [_, out] = main(``);
  assertEquals(out, 0);
});
