export function randomInteger(limit: number): number {
  return Math.floor(Math.random() * limit);
}

export function randomlySample<T>(items: ReadonlyArray<T>): T {
  return items[randomInteger(items.length)];
}
