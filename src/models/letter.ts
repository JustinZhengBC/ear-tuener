import { DEGREES_PER_OCTAVE, modPositive } from "@/models/utils";

class Letter {
  private readonly index: number;
  private readonly chromaticOffset: number;
  private readonly name: string;

  private static readonly letters: Letter[] = [];

  public static readonly C: Letter = new Letter(0, "C");
  public static readonly D: Letter = new Letter(2, "D");
  public static readonly E: Letter = new Letter(4, "E");
  public static readonly F: Letter = new Letter(5, "F");
  public static readonly G: Letter = new Letter(7, "G");
  public static readonly A: Letter = new Letter(9, "A");
  public static readonly B: Letter = new Letter(11, "B");

  private constructor(chromaticOffset: number, name: string) {
    this.index = Letter.letters.length;
    this.chromaticOffset = chromaticOffset;
    this.name = name;
    Letter.letters.push(this);
  }

  public getChromaticOffset(): number {
    return this.chromaticOffset;
  }

  public getName(): string {
    return this.name;
  }

  public shift(diatonicOffset: number): Letter {
    if (DEGREES_PER_OCTAVE <= Math.abs(diatonicOffset)) {
      throw new RangeError(`Invalid diatonic offset: ${diatonicOffset}`);
    }
    return Letter.letters[
      modPositive(this.index + diatonicOffset, DEGREES_PER_OCTAVE)
    ];
  }
}

export default Letter;
