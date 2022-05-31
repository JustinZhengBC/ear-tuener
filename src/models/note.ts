import Pitch from "@/models/pitch";
import { DEGREES_PER_OCTAVE, PITCHES_PER_OCTAVE } from "@/models/utils";

class Note {
  private readonly octave: number;
  private readonly pitch: Pitch;

  constructor(octave: number, pitch: Pitch) {
    this.octave = octave;
    this.pitch = pitch;
  }

  public getKey(): number {
    return PITCHES_PER_OCTAVE * this.octave + this.pitch.getChromaticOffset();
  }

  public getName(): string {
    return this.pitch.getName() + this.octave.toString();
  }

  public getOctave(): number {
    return this.octave;
  }

  public getPitch() {
    return this.pitch;
  }

  public shift(diatonicOffset: number, chromaticOffset: number): Note {
    const newPitch = this.pitch.shift(diatonicOffset, chromaticOffset);

    const diatonicOffsetSign = Math.sign(diatonicOffset);
    const octaveChange =
      Math.floor(Math.abs(diatonicOffset) / DEGREES_PER_OCTAVE) *
      diatonicOffsetSign;
    const octaveRollover =
      Math.sign(
        newPitch.getChromaticOffset() - this.pitch.getChromaticOffset()
      ) === diatonicOffsetSign
        ? 0
        : diatonicOffsetSign;
    const newOctave = this.octave + octaveChange + octaveRollover;

    return new Note(newOctave, newPitch);
  }
}

export default Note;
