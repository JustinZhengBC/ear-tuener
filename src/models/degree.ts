import Accidental from "@/models/accidental";
import Pitch from "@/models/pitch";

const ROMAN_NUMERALS: ReadonlyArray<string> = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
];

class Degree {
  private readonly chromaticOffset: number;
  private readonly diatonicOffset: number;
  private readonly name: string;

  private static readonly degrees: Degree[] = [];

  public static readonly I: Degree = new Degree(Accidental.NATURAL, 0);
  public static readonly II_FLAT: Degree = new Degree(Accidental.FLAT, 1);
  public static readonly II: Degree = new Degree(Accidental.NATURAL, 1);
  public static readonly III_FLAT: Degree = new Degree(Accidental.FLAT, 2);
  public static readonly III: Degree = new Degree(Accidental.NATURAL, 2);
  public static readonly IV: Degree = new Degree(Accidental.NATURAL, 3);
  public static readonly IV_SHARP: Degree = new Degree(Accidental.SHARP, 3);
  public static readonly V: Degree = new Degree(Accidental.NATURAL, 4);
  public static readonly VI_FLAT: Degree = new Degree(Accidental.FLAT, 5);
  public static readonly VI: Degree = new Degree(Accidental.NATURAL, 5);
  public static readonly VII_FLAT: Degree = new Degree(Accidental.FLAT, 6);
  public static readonly VII: Degree = new Degree(Accidental.NATURAL, 6);

  private static readonly STRING_MAP: ReadonlyMap<string, Degree> = new Map(
    Degree.degrees.map((degree) => [degree.getName(), degree])
  );

  private constructor(accidental: Accidental, diatonicOffset: number) {
    this.chromaticOffset = Degree.degrees.length;
    this.diatonicOffset = diatonicOffset;
    this.name = ROMAN_NUMERALS[diatonicOffset] + accidental.getName();
    Degree.degrees.push(this);
  }

  public calculate(tonic: Pitch): Pitch {
    return tonic.shift(this.diatonicOffset, this.chromaticOffset);
  }

  public static getAllDegrees(): ReadonlyArray<Degree> {
    return this.degrees;
  }

  public getKey(): number {
    return this.chromaticOffset;
  }

  public getName(): string {
    return this.name;
  }

  public static byName(name: string): Degree {
    const degree = Degree.STRING_MAP.get(name);
    if (degree) {
      return degree;
    }
    throw new Error();
  }
}

export default Degree;
