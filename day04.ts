import { readInput, slidingWindow } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function part1(input: string): number {
  const grid = input.split("\n");
  let count = 0;

  // Vertical
  for (const window of slidingWindow(grid, 1, 4)) {
    const str = window.join("");
    if (str === "XMAS" || str === "SAMX") count++;
  }
  // Horizontal
  for (const window of slidingWindow(grid, 4, 1)) {
    if (window[0] === "XMAS" || window[0] === "SAMX") count++;
  }
  // Diagonals
  for (const win of slidingWindow(grid, 4, 4)) {
    const diag1 = win.map((row, i) => row[i]).join("");
    const diag2 = win.map((row, i) => row[row.length - i - 1]).join("");
    if (diag1 === "XMAS" || diag1 === "SAMX") count++;
    if (diag2 === "XMAS" || diag2 === "SAMX") count++;
  }

  return count;
}

function part2(input: string): number {
  const grid = input.split("\n");
  let count = 0;

  for (const win of slidingWindow(grid, 3, 3)) {
    const diag1 = win.map((row, i) => row[i]).join("");
    const diag2 = win.map((row, i) => row[row.length - i - 1]).join("");
    if (
      (diag1 === "MAS" || diag1 === "SAM") &&
      (diag2 === "MAS" || diag2 === "SAM")
    )
      count++;
  }

  return count;
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`);
  assertEquals(out, 18);
});

Deno.test("Part 2: ", () => {
  const out = part2(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`);
  assertEquals(out, 9);
});
