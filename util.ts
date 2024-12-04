export async function readInput() {
  const decoder = new TextDecoderStream();
  const reader = Deno.stdin.readable.pipeThrough(decoder).getReader();

  let input = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    input += value;
  }

  return input;
}

export function* slidingWindow(
  grid: string[],
  width: number = 1,
  height: number = 1
): Generator<string[], void, void> {
  for (let row1 = 0, row2 = height; row2 <= grid.length; row1++, row2++) {
    for (let col1 = 0, col2 = width; col2 <= grid[0].length; col1++, col2++) {
      yield grid.slice(row1, row2).map((row) => row.slice(col1, col2));
    }
  }
}
