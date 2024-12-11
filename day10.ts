import { readInput, gridLocations, bfs } from "./util.ts";

function main(input: string): [number, number] {
  const grid = input.split("\n");
  const trailheads = gridLocations(grid, "123456789")["0"];

  let score = 0;
  let rating = 0;
  for (const start of trailheads) {
    const pathcount = grid.map((row) => Array<number>(row.length).fill(0));
    pathcount[start[1]][start[0]] = 1;

    const explored = bfs(grid, [start], (x0, y0, x1, y1) => {
      const reachable = Number(grid[y1][x1]) - Number(grid[y0][x0]) === 1;
      if (reachable) pathcount[y1][x1] += pathcount[y0][x0];
      return reachable;
    });

    const ends = explored.filter(([x, y]) => grid[y][x] === "9");
    score += ends.length;
    for (const [x, y] of ends) rating += pathcount[y][x];
  }

  return [score, rating];
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

Deno.test("Part 2: Large", () => {
  const [_, out] = main(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`);
  assertEquals(out, 81);
});
