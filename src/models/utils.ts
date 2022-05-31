export const DEGREES_PER_OCTAVE = 7;
export const PITCHES_PER_OCTAVE = 12;

export function modPositive(dividend: number, divisor: number): number {
  const result = dividend % divisor;
  return result >= 0 ? result : result + divisor;
}
