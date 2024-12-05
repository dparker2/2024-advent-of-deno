import { readInput } from "./util.ts";

if (import.meta.main) {
  const input = await readInput();

  console.log("Part 1:", part1(input));
  console.log("Part 2:", part2(input));
}

function splitInput(input: string): [string, string[]] {
  const [rules, updates] = input.split("\n\n");
  return [rules, updates.split("\n")];
}

function sortUpdates(rules: string, updates: string[]) {
  const sorter = (a: string, b: string) => {
    if (a === b) return 0;
    else if (rules.includes(`${a}|${b}`)) return -1;
    else return 1;
  };
  return updates.map((update) => update.split(",").sort(sorter).join(","));
}

function sumMiddle(updates: string[]): number {
  return updates.reduce((sum, update) => {
    const nums = update.split(",");
    return sum + Number(nums[Math.floor(nums.length / 2)]);
  }, 0);
}

function part1(input: string): number {
  const [rules, updates] = splitInput(input);
  const sorted = sortUpdates(rules, updates);
  return sumMiddle(sorted.filter((update) => updates.includes(update)));
}

function part2(input: string): number {
  const [rules, updates] = splitInput(input);
  const sorted = sortUpdates(rules, updates);
  return sumMiddle(sorted.filter((update) => !updates.includes(update)));
}

// Test
import { assertEquals } from "jsr:@std/assert@1.0.8";

Deno.test("Part 1: ", () => {
  const out = part1(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`);
  assertEquals(out, 143);
});

Deno.test("Part 2: ", () => {
  const out = part2(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`);
  assertEquals(out, 123);
});
