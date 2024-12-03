// Template
import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function part1(input: string): number {
  console.log(input);
  return 0;
}

function part2(input: string): number {
  console.log(input);
  return 0;
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(``);
  assertEquals(out, 0);
});

Deno.test("Part 2: ", () => {
  const out = part2(``);
  assertEquals(out, 0);
});
