import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function sumMuls(input: string) {
  return input
    .matchAll(/mul\((\d+),(\d+)\)/g)
    .reduce((sum, execArr) => sum + Number(execArr[1]) * Number(execArr[2]), 0);
}

function part1(input: string): number {
  return sumMuls(input);
}

function part2(input: string): number {
  return input
    .split(/(?=do\(\))|(?=don't\(\))/)
    .reduce(
      (sum, substr) =>
        substr.startsWith("don't()") ? sum : sum + sumMuls(substr),
      0
    );
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: mul Sums", () => {
  const out = part1(
    `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`
  );
  assertEquals(out, 161);
});

Deno.test("Part 2: ", () => {
  const out = part2(
    `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
  );
  assertEquals(out, 48);
});
