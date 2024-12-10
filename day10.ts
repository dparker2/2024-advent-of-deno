import { readInput, gridLocations, bfs } from "./util.ts";

function main(input: string): [number, number] {
  const grid = input.split("\n");
  const trailheads = gridLocations(grid, "123456789")["0"];

  let score = 0;
  for (const start of trailheads) {
    const path = bfs(grid, [start], (x0, y0, x1, y1) => {
      return Number(grid[y1][x1]) - Number(grid[y0][x0]) === 1;
    });
    score += path.filter(([x, y]) => grid[y][x] === "9").length;
    // console.log(path.map(([x, y]) => grid[y][x]));
  }

  return [score, 0];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: Single", () => {
  const [out, _] = main(`0123
1234
8765
9876`);
  assertEquals(out, 1);
});

Deno.test("Part 1: Multiple", () => {
  const [out, _] = main(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`);
  assertEquals(out, 36);
});

Deno.test("Part 2: Simple", () => {
  const [_, out] = main(`9999909
9943219
9959929
9965439
1171141
1187651
1191111`);
  assertEquals(out, 3);
});
