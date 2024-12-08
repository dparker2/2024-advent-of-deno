import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function isPossible(
  testvalue: number,
  nums: number[],
  part2: boolean
): boolean {
  if (nums.length === 1) return nums[0] === testvalue;

  const rest = nums.slice(1);
  if (isPossible(testvalue - nums[0], rest, part2)) return true;
  if (isPossible(testvalue / nums[0], rest, part2)) return true;
  if (part2) {
    const aStr = testvalue.toString();
    const bStr = nums[0].toString();
    if (aStr.endsWith(bStr))
      return isPossible(Number(aStr.slice(0, -bStr.length)), rest, part2);
  }

  return false;
}

function calibrationResult(input: string, part2: boolean) {
  let sum = 0;

  for (const line of input.split("\n")) {
    const [left, right] = line.split(": ");
    const testvalue = Number(left);
    const nums = right.split(" ").map(Number).reverse();
    if (isPossible(testvalue, nums, part2)) sum += testvalue;
  }

  return sum;
}

function part1(input: string): number {
  return calibrationResult(input, false);
}

function part2(input: string): number {
  return calibrationResult(input, true);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`);
  assertEquals(out, 3749);
});

Deno.test("Part 2: ", () => {
  const out = part2(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`);
  assertEquals(out, 11387);
});
