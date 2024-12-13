import { readInput } from "./util.ts";

/**
 * A*axStep + B*bxStep = xTarget
 * A*ayStep + B*byStep = yTarget
 *
 * ==> B = (xTarget - A*axStep) / bxStep
 * ==> A*ayStep + byStep*((xTarget - A*axStep) / bxStep) = yTarget
 * ==> A*ayStep + (byStep*xTarget - byStep*A*axStep) / bxStep = yTarget
 * ==> bxStep*A*ayStep + byStep*xTarget - byStep*A*axStep = yTarget*bxStep
 * ==> bxStep*A*ayStep - byStep*A*axStep = yTarget*bxStep - byStep*xTarget
 * ==> A*(bxStep*ayStep - byStep*axStep) = yTarget*bxStep - byStep*xTarget
 * ==> A = (yTarget*bxStep - byStep*xTarget) / (bxStep*ayStep - byStep*axStep)
 */
function main(input: string): [number, number] {
  const inputRegex =
    /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/gm;
  let [tokens1, tokens2] = [0, 0];

  for (const problem of input.matchAll(inputRegex)) {
    const [_, axStep, ayStep, bxStep, byStep, x, y] = problem.map(Number);
    const calcTokens = (xTarget: number, yTarget: number) => {
      const a =
        (yTarget * bxStep - byStep * xTarget) /
        (bxStep * ayStep - byStep * axStep);
      if (!Number.isInteger(a)) return 0;
      const b = (xTarget - a * axStep) / bxStep;
      return a * 3 + b;
    };

    tokens1 += calcTokens(x, y);
    tokens2 += calcTokens(x + 10000000000000, y + 10000000000000);
  }

  return [tokens1, tokens2];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

const example = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

Deno.test("Part 1", () => {
  const [out, _] = main(example);
  assertEquals(out, 480);
});
