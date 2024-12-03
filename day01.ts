import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function toLists(input: string): [number[], number[]] {
  const left: number[] = [],
    right: number[] = [];
  for (const line of input.split("\n")) {
    const [l, r] = line.split(/\W+/);
    left.push(Number(l)), right.push(Number(r));
  }
  return [left, right];
}

function part1(input: string): number {
  const [left, right] = toLists(input);
  left.sort(), right.sort();

  return left.reduce((acc, l, i) => Math.abs(right[i] - l) + acc, 0);
}

function part2(input: string): number {
  const [left, right] = toLists(input);
  const counts = right.reduce<Record<number, number>>((acc, num) => {
    if (num in acc) acc[num]++;
    else acc[num] = 1;
    return acc;
  }, {});

  return left.reduce(
    (acc, val) => (val in counts ? acc + val * counts[val] : acc),
    0
  );
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: Total Distance", () => {
  const out = part1(`3   4
4   3
2   5
1   3
3   9
3   3`);
  assertEquals(out, 11);
});

Deno.test("Part 2: Similarity Score", () => {
  const out = part2(`3   4
4   3
2   5
1   3
3   9
3   3`);
  assertEquals(out, 31);
});
