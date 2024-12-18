import { readInput, gridLocations, doubleSplit } from "./util.ts";

const movements = {
  "^": [0, -1],
  v: [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
};

const expansion = {
  "#": ["#", "#"],
  O: ["[", "]"],
  ".": [".", "."],
  "@": ["@", "."],
};

type Mover = (
  grid: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number
) => boolean;

const doMove: Mover = function (grid, x, y, dx, dy) {
  if (grid[y]?.[x] === ".") return true;
  if (grid[y]?.[x] === "#") return false;

  if (doMove(grid, x + dx, y + dy, dx, dy)) {
    grid[y + dy][x + dx] = grid[y][x];
    grid[y][x] = ".";
    return true;
  }
  return false;
};

const doMove2: Mover = function (grid, x, y, dx, dy) {
  // console.log(x, y, dx, dy, grid[y][x]);
  if (dy === 0) return doMove(grid, x, y, dx, dy);

  const canMove = (x1: number, y1: number): boolean => {
    if (grid[y1]?.[x1] === ".") return true;
    if (grid[y1]?.[x1] === "#") return false;
    const [x2, y2] = [x1 + dx, y1 + dy];
    if (grid[y1]?.[x1] === "[") {
      return canMove(x2, y2) && canMove(x2 + 1, y2);
    } else if (grid[y1]?.[x1] === "]") {
      return canMove(x2, y2) && canMove(x2 - 1, y2);
    }
    return canMove(x2, y2);
  };

  const doMove2_ = (x1: number, y1: number): void => {
    if (grid[y1]?.[x1] === ".") return;
    if (grid[y1]?.[x1] === "#") throw Error("Hit a wall?");
    const [x2, y2] = [x1 + dx, y1 + dy];
    doMove2_(x2, y2);
    if (grid[y1]?.[x1] === "[") {
      doMove2_(x2 + 1, y2);
      grid[y2][x2] = grid[y1][x1];
      grid[y2][x2 + 1] = grid[y1][x1 + 1];
      grid[y1][x1] = ".";
      grid[y1][x1 + 1] = ".";
    } else if (grid[y1]?.[x1] === "]") {
      doMove2_(x2 - 1, y2);
      grid[y2][x2] = grid[y1][x1];
      grid[y2][x2 - 1] = grid[y1][x1 - 1];
      grid[y1][x1] = ".";
      grid[y1][x1 - 1] = ".";
    } else {
      grid[y2][x2] = grid[y1][x1];
      grid[y1][x1] = ".";
    }
  };

  if (canMove(x, y)) {
    doMove2_(x, y);
    return true;
  }
  return false;
};

function _visualize(move: string, grid: string[][]) {
  console.log("Move", move);
  for (const row of grid) {
    console.log(row.join(""));
  }
  console.log(`\x1b[${grid.length + 2}A`);
  // const end = Date.now() + 1000;
  // while (Date.now() < end);
}

function simulate(
  grid: string[][],
  moves: string,
  mover: Mover,
  box: "O" | "["
) {
  const locations = gridLocations(grid);
  let [posx, posy] = locations["@"][0];

  for (const move of moves) {
    const [dx, dy] = movements[move as keyof typeof movements];
    if (mover(grid, posx, posy, dx, dy)) {
      posx += dx;
      posy += dy;
    }
    // _visualize(move, grid);
  }

  const newLocations = gridLocations(grid);
  let gpsSum = 0;
  for (const [x, y] of newLocations[box]) gpsSum += 100 * y + x;
  return gpsSum;
}

function main(input: string): [number, number] {
  const [top, bottom] = input.trim().split("\n\n");
  const grid1 = doubleSplit(top);
  const grid2 = grid1.map((row) =>
    row.flatMap((char) => expansion[char as keyof typeof expansion])
  );
  const moves = bottom.replaceAll("\n", "");

  return [
    simulate(grid1, moves, doMove, "O"),
    simulate(grid2, moves, doMove2, "["),
  ];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

function doubleJoin(grid: string[][]) {
  return grid.map((row) => row.join("")).join("\n");
}

Deno.test("Simulation", async (t) => {
  await t.step("Double wide staggered downwards first blocked", () => {
    const input = `
#########
##.@...##
##.[]..##
##.#[].##
##.....##
#########`.trim();
    const grid = doubleSplit(input);
    simulate(grid, "v", doMove2, "[");
    assertEquals(doubleJoin(grid), input);
  });
  await t.step("Double wide staggered downwards second blocked", () => {
    const input = `
#########
##.@...##
##.[]..##
##..[].##
##...#.##
#########`.trim();
    const grid = doubleSplit(input);
    simulate(grid, "v", doMove2, "[");
    assertEquals(doubleJoin(grid), input);
  });
  await t.step("Double wide staggered downwards partial blockage", () => {
    const input = `
#########
##.@...##
##.[]..##
##[][].##
##...#.##
#########`.trim();
    const grid = doubleSplit(input);
    simulate(grid, "v", doMove2, "[");
    assertEquals(doubleJoin(grid), input);
  });
  await t.step("Double wide staggered downwards", () => {
    const input = `
#########
##.@[].##
##.[]..##
##.....##
##.....##
#########`.trim();
    const expected = `
#########
##..[].##
##.@...##
##.[]..##
##.....##
#########`.trim();
    const grid = doubleSplit(input);
    simulate(grid, "v", doMove2, "[");
    assertEquals(doubleJoin(grid), expected);
  });
});

Deno.test("Small Example", async (t) => {
  const [part1, part2] = main(
    `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`.trim()
  );
  await t.step("Part 1", () => assertEquals(part1, 2028));
  await t.step("Part 2", () => assertEquals(part2, 1751));
});

Deno.test("Large Example", async (t) => {
  const [part1, part2] = main(
    `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.trim()
  );
  await t.step("Part 1", () => assertEquals(part1, 10092));
  await t.step("Part 2", () => assertEquals(part2, 9021));
});
