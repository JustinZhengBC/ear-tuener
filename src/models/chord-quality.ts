import Degree from "@/models/degree";
import Pitch from "@/models/pitch";

const DIATONIC_OFFSET_BETWEEN_STEPS = 2;
const MINOR_THIRD_CHROMATIC_OFFSET = 3;

class ChordQuality {
  private readonly chromaticOffsets: ReadonlyArray<number>;
  private readonly index: number;
  private readonly name: string;
  private readonly suffix: string;

  private static readonly chordQualities: ChordQuality[] = [];

  public static readonly MAJOR: ChordQuality = new ChordQuality(
    [4, 3],
    "Major",
    ""
  );
  public static readonly MINOR: ChordQuality = new ChordQuality(
    [3, 4],
    "Minor",
    ""
  );
  public static readonly AUGMENTED: ChordQuality = new ChordQuality(
    [4, 4],
    "Augmented",
    "+"
  );
  public static readonly DIMINISHED: ChordQuality = new ChordQuality(
    [3, 3],
    "Diminished",
    "°"
  );
  public static readonly MAJOR_SEVENTH: ChordQuality = new ChordQuality(
    [4, 3, 4],
    "Major 7th",
    "maj7"
  );
  public static readonly MINOR_SEVENTH: ChordQuality = new ChordQuality(
    [3, 4, 3],
    "Minor 7th",
    "7"
  );
  public static readonly DOMINANT_SEVENTH: ChordQuality = new ChordQuality(
    [4, 3, 3],
    "Dominant 7th",
    "7"
  );

  private static readonly STRING_MAP: ReadonlyMap<string, ChordQuality> =
    new Map(
      ChordQuality.chordQualities.map((quality) => [quality.getName(), quality])
    );

  private constructor(
    chromaticOffsets: ReadonlyArray<number>,
    name: string,
    suffix: string
  ) {
    this.chromaticOffsets = chromaticOffsets;
    this.index = ChordQuality.chordQualities.length;
    this.name = name;
    this.suffix = suffix;
    ChordQuality.chordQualities.push(this);
  }

  public build(root: Pitch): ReadonlyArray<Pitch> {
    const pitches: Pitch[] = [root];
    let pitch: Pitch = root;
    for (const chromaticOffset of this.chromaticOffsets) {
      pitch = pitch.shift(DIATONIC_OFFSET_BETWEEN_STEPS, chromaticOffset);
      pitches.push(pitch);
    }
    return pitches;
  }

  public static getAllChordQualities(): ReadonlyArray<ChordQuality> {
    return this.chordQualities;
  }

  public getKey(): number {
    return this.index;
  }

  public getName(): string {
    return this.name;
  }

  public static byName(name: string): ChordQuality {
    const quality = ChordQuality.STRING_MAP.get(name);
    if (quality) {
      return quality;
    }
    throw new Error();
  }

  public getNameWithDegree(degree: Degree): string {
    const degreeName =
      this.chromaticOffsets[0] === MINOR_THIRD_CHROMATIC_OFFSET
        ? degree.getName().toLowerCase()
        : degree.getName();
    return degreeName + this.suffix;
  }
}

export default ChordQuality;
