import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function buildGrid(input: string): [string[][], number, number] {
  const grid = input.split("\n").map((row) => row.split(""));
  let startY = -1;
  let startX = -1;
  findGuard: for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "^") {
        startY = i;
        startX = j;
        break findGuard;
      }
    }
  }
  return [grid, startX, startY];
}

function part1(input: string): number {
  let [grid, posX, posY] = buildGrid(input);
  const visited = new Set();
  for (
    let dY = -1, dX = 0;
    grid[posY]?.[posX] !== undefined;
    posX += dX, posY += dY
  ) {
    visited.add(`${posX},${posY}`);
    if (grid[posY + dY]?.[posX + dX] === "#") [dX, dY] = [-dY, dX];
  }

  return visited.size;
}

function part2(input: string): number {
  let [grid, posX, posY] = buildGrid(input);
  const newObstacles = new Set();
  const visited = new Set([`${posX},${posY}`]);
  for (
    let dY = -1, dX = 0;
    grid[posY]?.[posX] !== undefined;
    posX += dX, posY += dY
  ) {
    while (grid[posY + dY]?.[posX + dX] === "#") {
      [dX, dY] = [-dY, dX];
    }

    // Does turning right form a loop?
    const vectors = new Set();
    const [newX, newY] = [posX + dX, posY + dY];
    if (visited.has(`${newX},${newY}`)) {
      // Already been here so don't try an obstacle!
      continue;
    }
    if (grid[newY]?.[newX] === undefined) continue;

    for (
      let dX2 = dX, dY2 = dY, posY2 = posY, posX2 = posX;
      grid[posY2]?.[posX2] !== undefined;
      posX2 += dX2, posY2 += dY2
    ) {
      while (
        grid[posY2 + dY2]?.[posX2 + dX2] === "#" ||
        (posY2 + dY2 === newY && posX2 + dX2 === newX)
      ) {
        [dX2, dY2] = [-dY2, dX2];
      }
      if (vectors.has(`${posX2},${posY2},${dX2},${dY2}`)) {
        // We have a loop, store location in front of actual path
        newObstacles.add(`${newX},${newY}`);
        break;
      }
      vectors.add(`${posX2},${posY2},${dX2},${dY2}`);
    }
    // console.log(posX, posY, newX, newY, vectors);
    visited.add(`${posX},${posY}`);
  }
  // console.log(newObstacles);

  return newObstacles.size;
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`);
  assertEquals(out, 41);
});

Deno.test("Part 2: ", () => {
  const out = part2(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`);
  assertEquals(out, 6);
});

Deno.test("Part 2: Straight loop", () => {
  const out = part2(`......#...
.......#..
..........
.....#....
....^.#...`);
  assertEquals(out, 1);
});

Deno.test("Part 2: None", () => {
  const out = part2(`......#...
.......#..
..........
..........
....^.#...`);
  assertEquals(out, 0);
});

Deno.test("Part 2: False Positive!", () => {
  const out = part2(`...##.....
.........#
........#.
..........
...^......`);
  assertEquals(out, 1);
});

Deno.test("Part 2: Out of Bounds", () => {
  const out = part2(`.........#
..#.......
........#.
..........
...^......`);
  assertEquals(out, 0);
});

Deno.test("Part 2: Another test", () => {
  const out = part2(`...........
.#.........
.........#.
..#........
.......#...
....#......
...#...#...
......#....
...........
........#..
.^.........`);
  assertEquals(out, 4);
});

Deno.test("Part 2: Electric boogaloo", () => {
  const out = part2(`.#..
#..#
....
^...
#...
.#..`);
  assertEquals(out, 1);
});

Deno.test("Part 2: The guard strikes back", () => {
  const out = part2(`.#....
.....#
...^..
#.....
....#.`);
  assertEquals(out, 1);
});

Deno.test("Part 2: Return of the guard", () => {
  const out = part2(`.#..
#..#
#...
#...
#...
#...
.^..
..#.`);
  assertEquals(out, 6);
});

Deno.test("Part 2: Return of the guard 2", () => {
  const out = part2(`.##........
#.........#
#..........
#.....#....
#....#.....
#...#......
..^........
.........#.`);
  assertEquals(out, 7);
});

Deno.test("Part 2: The 2 guards", () => {
  const out = part2(`...........
.#.........
.........#.
..#........
.......#...
....#......
...#...#...
......#....
...........
........#..
.^.........`);
  assertEquals(out, 4);
});
