import Accidental from "@/models/accidental";
import Letter from "@/models/letter";
import { modPositive, PITCHES_PER_OCTAVE } from "@/models/utils";

class Pitch {
  private readonly letter: Letter;
  private readonly accidental: Accidental;

  constructor(letter: Letter, accidental: Accidental) {
    this.letter = letter;
    this.accidental = accidental;
  }

  public getChromaticOffset(): number {
    return modPositive(
      this.accidental.getChromaticOffset() + this.letter.getChromaticOffset(),
      PITCHES_PER_OCTAVE
    );
  }

  public getName(): string {
    return this.letter.getName() + this.accidental.getName();
  }

  public shift(diatonicOffset: number, chromaticOffset: number): Pitch {
    const newLetter = this.letter.shift(diatonicOffset);

    const chromaticOffsetSoFar = modPositive(
      newLetter.getChromaticOffset() - this.getChromaticOffset(),
      PITCHES_PER_OCTAVE
    );
    const newAccidental = Accidental.getByOffset(
      chromaticOffset - chromaticOffsetSoFar
    );

    return new Pitch(newLetter, newAccidental);
  }
}

export default Pitch;
