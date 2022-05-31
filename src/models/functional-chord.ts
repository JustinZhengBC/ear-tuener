import ChordQuality from "@/models/chord-quality";
import Degree from "@/models/degree";
import Note from "@/models/note";
import Pitch from "@/models/pitch";
import { PITCHES_PER_OCTAVE } from "@/models/utils";

class FunctionalChord {
  private readonly degree: Degree;
  private readonly quality: ChordQuality;

  constructor(degree: Degree, quality: ChordQuality) {
    this.degree = degree;
    this.quality = quality;
  }

  public getQuality(): ChordQuality {
    return this.quality;
  }

  public getDegree(): Degree {
    return this.degree;
  }

  public getKey(): number {
    return this.degree.getKey() * 1000 + this.quality.getKey();
  }

  public getName(): string {
    return this.quality.getNameWithDegree(this.degree);
  }

  public isTonic(): boolean {
    return this.degree.getKey() === Degree.I.getKey();
  }

  public randomlyGetNotes(key: Pitch, pivotNote: Note): ReadonlyArray<Note> {
    const pivotChromaticOffset = pivotNote.getPitch().getChromaticOffset();
    const root = this.degree.calculate(key);
    const pitches = this.quality.build(root);
    const pivotOffsets = pitches.map(
      (pitch) => pitch.getChromaticOffset() - pivotChromaticOffset
    );
    const octaveOffsets = pivotOffsets.map(
      (offset) => offset / (PITCHES_PER_OCTAVE / 2)
    );
    const closestOctaves = octaveOffsets.map(
      (offset) =>
        pivotNote.getOctave() - Math.sign(offset) * Math.floor(Math.abs(offset))
    );
    if (Math.random() > 0.5) {
      return pitches.map(
        (pitch, index) => new Note(closestOctaves[index], pitch)
      );
    }
    let farthestPitchDistance = Number.NEGATIVE_INFINITY;
    let farthestPitchIndex = -1;
    for (let index = 0; index < pitches.length; ++index) {
      const offset = pivotOffsets[index];
      const distance = Math.abs(offset);
      if (distance > farthestPitchDistance) {
        farthestPitchDistance = distance;
        farthestPitchIndex = index;
      }
    }
    return pitches.map(
      (pitch, index) =>
        new Note(
          closestOctaves[index] -
            (index === farthestPitchIndex
              ? Math.sign(
                  new Note(closestOctaves[index], pitch).getKey() -
                    pivotNote.getKey()
                )
              : 0),
          pitch
        )
    );
  }

  public stringify(): string {
    return this.degree.getName() + "|" + this.quality.getName();
  }

  public static parse(functionalChord: string): FunctionalChord {
    const [degree, chordQuality] = functionalChord.split("|");
    return new FunctionalChord(
      Degree.byName(degree),
      ChordQuality.byName(chordQuality)
    );
  }
}

export default FunctionalChord;
