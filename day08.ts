import { readInput, gridLocations } from "./util.ts";

type antinodeGenerator = (
  grid: string[],
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => Generator<number[], void, unknown>;

const allAntinodes: antinodeGenerator = function* (grid, x1, y1, x2, y2) {
  const [rise, run] = [y2 - y1, x2 - x1];
  while (grid[y1]?.[x1] !== undefined) {
    yield [x1, y1];
    (x1 -= run), (y1 -= rise);
  }
  while (grid[y2]?.[x2] !== undefined) {
    yield [x2, y2];
    (x2 += run), (y2 += rise);
  }
};

const closestAntinodes: antinodeGenerator = function* (_grid, x1, y1, x2, y2) {
  const [rise, run] = [y2 - y1, x2 - x1];
  yield [x1 - run, y1 - rise];
  yield [x2 + run, y2 + rise];
};

function countAntinodes(input: string, iterAntinodes: antinodeGenerator) {
  const antinodes = new Set<string>();

  const grid = input.split("\n");
  const antennas = gridLocations(grid);

  for (const locations of Object.values(antennas)) {
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i === j) continue;
        for (const [x, y] of iterAntinodes(
          grid,
          ...locations[i],
          ...locations[j]
        )) {
          if (grid[y]?.[x] !== undefined) antinodes.add(`${x},${y}`);
        }
      }
    }
  }

  return antinodes.size;
}

function part1(input: string): number {
  return countAntinodes(input, closestAntinodes);
}

function part2(input: string): number {
  return countAntinodes(input, allAntinodes);
}

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`);
  assertEquals(out, 14);
});

Deno.test("Part 2: ", () => {
  const out = part2(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`);
  assertEquals(out, 34);
});
