import { readInput, mod } from "./util.ts";

class State {
  width: number;
  height: number;
  grid: number[][];
  robots: [number, number, number, number][];

  constructor(width: number, height: number) {
    const initRow = () => Array<number>(width).fill(0);
    this.grid = Array.from({ length: height }, initRow);
    this.robots = [];
    this.width = width;
    this.height = height;
  }
  addRobot(x: number, y: number, dx: number, dy: number) {
    this.robots.push([x, y, dx, dy]);
    this.grid[y][x]++;
  }
  log() {
    for (const row of this.grid) console.log(row.join(""));
  }
  step() {
    for (let i = 0; i < this.robots.length; i++) {
      let [x, y, dx, dy] = this.robots[i];
      this.grid[y][x]--;
      this.robots[i][0] = x = mod(x + dx, this.width);
      this.robots[i][1] = y = mod(y + dy, this.height);
      this.grid[y][x]++;
    }
  }
  safetyFactor() {
    const count = (x0: number, y0: number, x1: number, y1: number) => {
      let n = 0;
      for (let x = x0; x < x1; x++)
        for (let y = y0; y < y1; y++) n += this.grid[y][x];
      return n;
    };
    const [xmid, ymid] = [
      Math.floor(this.width / 2),
      Math.floor(this.height / 2),
    ];
    let safetyFactor = count(0, 0, xmid, ymid);
    safetyFactor *= count(xmid + 1, 0, this.width, ymid);
    safetyFactor *= count(0, ymid + 1, xmid, this.height);
    safetyFactor *= count(xmid + 1, ymid + 1, this.width, this.height);
    return safetyFactor;
  }
  triangles() {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (
          [
            this.grid[y][x],
            this.grid[y + 1]?.[x - 1],
            this.grid[y + 1]?.[x],
            this.grid[y + 1]?.[x + 1],
          ].every((n) => n && n > 0)
        ) {
          count++;
        }
      }
    }
    return count;
  }
}

function main(input: string, width: number, height: number): [number, number] {
  const inputRegex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/gm;

  const state = new State(width, height);
  for (const match of input.matchAll(inputRegex)) {
    const [_, x, y, dx, dy] = match.map(Number);
    state.addRobot(x, y, dx, dy);
  }

  const maxStep = Math.max(101, width * height);
  let [safetyFactor100, i] = [0, 0];
  for (i = 0; i < maxStep; i++) {
    if (i === 100) safetyFactor100 = state.safetyFactor();
    if (state.triangles() > 30) {
      state.log();
      break;
    }
    state.step();
  }

  return [safetyFactor100, i];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput(), 101, 103);
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

const example = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

Deno.test("Part 1: ", () => {
  const [out, _] = main(example, 11, 7);
  assertEquals(out, 12);
});
