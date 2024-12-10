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

export function gridLocations(grid: string[], ignore: string = ".") {
  const locations: Record<string, [number, number][]> = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (ignore.includes(grid[i][j])) continue;
      if (grid[i][j] in locations) locations[grid[i][j]].push([j, i]);
      else locations[grid[i][j]] = [[j, i]];
    }
  }
  return locations;
}

export function bfs(
  grid: string[],
  starts: [number, number][],
  isReachable: (x0: number, y0: number, x1: number, y1: number) => boolean
) {
  const visited = grid.map((row) => Array<boolean>(row.length).fill(false));
  const queue: [number, number][] = [...starts];
  const path: [number, number][] = [];

  for (const [x0, y0] of starts) {
    visited[y0][x0] = true;
  }

  let current;
  while ((current = queue.shift())) {
    const [x, y] = current;
    path.push(current);

    for (const [nx, ny] of [
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
    ]) {
      if (
        grid[ny]?.[nx] !== undefined &&
        !visited[ny][nx] &&
        isReachable(x, y, nx, ny)
      ) {
        visited[ny][nx] = true;
        queue.push([nx, ny]);
      }
    }
  }
  return path;
}
