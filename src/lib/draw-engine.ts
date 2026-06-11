import { shuffle } from "./shuffle";

export function buildDrawSequence(names: string[]): string[] {
  return shuffle(names);
}
