import { readInput, gridLocations, bfs } from "./util.ts";

function main(input: string): [number, number] {
  const grid = input.split("\n");
  const explored = grid.map((row) => Array<boolean>(row.length).fill(false));
  const plots = gridLocations(grid);
  let [price, discountedPrice] = [0, 0];

  for (const plot in plots) {
    const isCorner = (x: number, y: number, dx: number, dy: number) =>
      (grid[y + dy]?.[x] !== plot && grid[y]?.[x + dx] !== plot) ||
      (grid[y + dy]?.[x] === plot &&
        grid[y]?.[x + dx] === plot &&
        grid[y + dy]?.[x + dx] !== plot);

    for (const [sx, sy] of plots[plot]) {
      if (explored[sy][sx]) continue;
      const section = bfs(
        grid,
        [[sx, sy]],
        (x0, y0, x1, y1) => grid[y0][x0] === grid[y1][x1]
      );

      let perimeter = 0;
      for (const [x, y] of section) {
        explored[y][x] = true;
        if (grid[y + 1]?.[x] !== plot) perimeter++;
        if (grid[y - 1]?.[x] !== plot) perimeter++;
        if (grid[y]?.[x + 1] !== plot) perimeter++;
        if (grid[y]?.[x - 1] !== plot) perimeter++;
      }

      let corners = 0;
      for (const [x, y] of section) {
        if (isCorner(x, y, 1, 1)) corners++;
        if (isCorner(x, y, 1, -1)) corners++;
        if (isCorner(x, y, -1, 1)) corners++;
        if (isCorner(x, y, -1, -1)) corners++;
      }

      price += section.length * perimeter;
      discountedPrice += section.length * corners;
    }
  }

  return [price, discountedPrice];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: Simple Price", () => {
  const [out, _] = main(`AAAA
BBCD
BBCC
EEEC`);
  assertEquals(out, 140);
});

Deno.test("Part 2: Discounted", () => {
  const [_, out] = main(`AAAA
BBCD
BBCC
EEEC`);
  assertEquals(out, 80);
});

Deno.test("Part 2: X and Os", () => {
  const [_, out] = main(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`);
  assertEquals(out, 436);
});

Deno.test("Part 2: A and Bs", () => {
  const [_, out] = main(`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`);
  assertEquals(out, 368);
});
