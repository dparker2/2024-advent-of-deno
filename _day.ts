// Template
import { readInput } from "./util.ts";

function main(input: string): [number, number] {
  console.log(input);
  return [0, 0];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const [out, _] = main(``);
  assertEquals(out, 0);
});

Deno.test("Part 2: ", () => {
  const [_, out] = main(``);
  assertEquals(out, 0);
});
