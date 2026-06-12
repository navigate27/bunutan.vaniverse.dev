/** Deranged draw order — drawSequence[i] !== names[i] for all i */

function sattoloShuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildDrawSequence(names: string[]): string[] {
  if (names.length <= 1) return [...names];
  return sattoloShuffle(names);
}
