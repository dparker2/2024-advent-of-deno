import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function antinodeLocations(x1: number, y1: number, x2: number, y2: number) {
  const rise = y2 - y1;
  const run = x2 - x1;
  return [x1 - run, y1 - rise, x2 + run, y2 + rise];
}

function part1(input: string): number {
  const antinodes = new Set<string>();

  const antennas: Record<string, [number, number][]> = {};
  const grid = input.split("\n");
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] !== ".") {
        if (grid[i][j] in antennas) antennas[grid[i][j]].push([j, i]);
        else antennas[grid[i][j]] = [[j, i]];
      }
    }
  }

  for (const locations of Object.values(antennas)) {
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i === j) continue;
        const [x1, y1] = locations[i];
        const [x2, y2] = locations[j];
        const [an1x, an1y, an2x, an2y] = antinodeLocations(x1, y1, x2, y2);
        if (grid[an1y]?.[an1x] !== undefined) antinodes.add(`${an1x},${an1y}`);
        if (grid[an2y]?.[an2x] !== undefined) antinodes.add(`${an2x},${an2y}`);
      }
    }
  }

  return antinodes.size;
}

function part2(input: string): number {
  return 0;
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
  const out = part2(``);
  assertEquals(out, 0);
});
