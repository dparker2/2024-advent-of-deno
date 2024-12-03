import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function toReports(input: string): number[][] {
  return input.split("\n").map((line) => line.split(" ").map(Number));
}

function isSafe(levels: number[]) {
  const steps = [];
  for (let i = 1; i < levels.length; i++) {
    steps.push(levels[i] - levels[i - 1]);
  }
  steps.sort();
  if (steps[0] < 0 && steps.at(-1)! > 0) return false;
  if (steps.some((val) => val === 0 || val < -3 || val > 3)) return false;
  return true;
}

function part1(input: string): number {
  return toReports(input).reduce(
    (numSafe, report) => (isSafe(report) ? numSafe + 1 : numSafe),
    0
  );
}

function part2(input: string): number {
  const reports = toReports(input);

  let numSafe = 0;
  countSafe: for (const report of reports) {
    if (isSafe(report)) {
      numSafe++;
      continue;
    }
    for (let i = 0; i < report.length; i++) {
      if (isSafe(report.toSpliced(i, 1))) {
        numSafe++;
        continue countSafe;
      }
    }
  }
  return numSafe;
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: Safe Levels", () => {
  const out = part1(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`);
  assertEquals(out, 2);
});

Deno.test("Part 2: Safe Levels with Tolerance", () => {
  const out = part2(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`);
  assertEquals(out, 4);
});
