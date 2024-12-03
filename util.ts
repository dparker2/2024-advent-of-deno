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
