class Accidental {
  private readonly chromaticOffset: number;
  private readonly name: string;

  private static readonly accidentals: Accidental[] = [];

  public static readonly DOUBLE_FLAT: Accidental = new Accidental(-2, "bb");
  public static readonly FLAT: Accidental = new Accidental(-1, "b");
  public static readonly NATURAL: Accidental = new Accidental(0, "");
  public static readonly SHARP: Accidental = new Accidental(1, "#");
  public static readonly DOUBLE_SHARP: Accidental = new Accidental(2, "##");

  private static readonly centerOffset: number = Accidental.accidentals.indexOf(
    Accidental.NATURAL
  );

  private constructor(chromaticOffset: number, name: string) {
    this.chromaticOffset = chromaticOffset;
    this.name = name;
    Accidental.accidentals.push(this);
  }

  public getChromaticOffset(): number {
    return this.chromaticOffset;
  }

  public getName(): string {
    return this.name;
  }

  public static getByOffset(offset: number): Accidental {
    const centeredIndex = offset + Accidental.centerOffset;
    if (!(centeredIndex in Accidental.accidentals)) {
      throw new RangeError(`Invalid natural offset: ${offset}`);
    }
    return Accidental.accidentals[centeredIndex];
  }
}

export default Accidental;
