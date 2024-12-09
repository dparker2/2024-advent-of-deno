import { readInput } from "./util.ts";

function compact1(disk: number[][]) {
  const compacted = disk.flatMap((l) => l);
  let j = compacted.length - 1;
  for (let i = 0; i < j; i++) {
    if (Number.isNaN(compacted[i])) {
      if (Number.isNaN(compacted[j])) break;
      compacted[i] = compacted[j];
      compacted[j] = NaN;
      while (Number.isNaN(compacted[--j]));
    }
  }
  compacted.splice(j + 1, compacted.length - j);
  return compacted;
}

function compact2(disk: number[][]) {
  const compacted = disk.map((l) => [...l]);

  for (let j = compacted.length - 1; j >= 0; j -= 2) {
    for (let i = 1; i < j; i += 2) {
      if (compacted[i].length >= compacted[j].length) {
        compacted[i].splice(0, compacted[j].length);
        compacted.splice(i, 0, [], [...compacted[j]]);
        compacted[j + 1].push(...Array(compacted[j + 2].length).fill(NaN));
        compacted[j + 2] = [];
        j += 2;
        break;
      }
    }
  }
  return compacted.flatMap((l) => l);
}

function main(input: string): [number, number] {
  const diskmap = input.split("").map(Number);
  const checksum = (acc: number, val: number, i: number) =>
    Number.isNaN(val) ? acc : acc + val * i;

  const disk: number[][] = [];
  for (let i = 0; i < diskmap.length; i++) {
    const val = i % 2 === 0 ? i / 2 : NaN;
    disk.push(Array(diskmap[i]).fill(val));
  }

  return [
    compact1(disk).reduce(checksum, 0),
    compact2(disk).reduce(checksum, 0),
  ];
}

if (import.meta.main) {
  const [part1, part2] = main(await readInput());
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const [out, _] = main(`2333133121414131402`);
  assertEquals(out, 1928);
});

Deno.test("Part 2: ", () => {
  const [_, out] = main(`2333133121414131402`);
  assertEquals(out, 2858);
});
