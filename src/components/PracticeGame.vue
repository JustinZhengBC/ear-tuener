<template>
  <div class="practice-game">
    <ChordsDisplay />
    <InputPanel
      @onPlayChord="playChord"
      @onPlayProgression="playTrueChords"
      @onPlayTonic="playTonic"
    />
  </div>
</template>

<script lang="ts">
import ChordsDisplay from "@/components/ChordsDisplay.vue";
import InputPanel from "@/components/InputPanel.vue";
import FunctionalChord from "@/models/functional-chord";
import Settings, { Range } from "@/models/settings";
import Note from "@/models/note";
import Pitch from "@/models/pitch";
import { session } from "@/store";
import * as Tone from "tone";
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";

const SYNTH = new Tone.PolySynth().toDestination();
SYNTH.set({ oscillator: { type: "sine5" }, volume: -10 });

@Options({
  components: {
    ChordsDisplay,
    InputPanel,
  },
})
export default class PracticeGame extends Vue {
  @session.State("activeSettings") activeSettings!: Settings | null;
  @session.State("currentKey") currentKey!: Pitch;
  @session.State("currentPivotNote") currentPivotNote!: Note;
  @session.State("trueChords") trueChords!: FunctionalChord[];
  @session.Action("generateNewProgression") generateNewProgression!: () => void;

  toneStarted = false;

  mounted() {
    this.generateNewProgression();
    Tone.start();
  }

  setToneStarted() {
    this.toneStarted = true;
  }

  @Watch("trueChords") onTrueChordsChanged() {
    this.playTrueChords();
  }

  get chordNotesByKey(): ReadonlyMap<number, ReadonlyArray<Note>> {
    if (!this.activeSettings) {
      return new Map();
    }
    const result: Map<number, ReadonlyArray<Note>> = new Map();
    this.activeSettings.chords.forEach((chord) =>
      result.set(
        chord.getKey(),
        chord.randomlyGetNotes(this.currentKey, this.currentPivotNote)
      )
    );
    return result;
  }

  get trueChordNotes(): ReadonlyArray<ReadonlyArray<Note>> {
    return this.trueChords.map(
      (chord) => this.chordNotesByKey.get(chord.getKey()) ?? []
    );
  }

  playTonic(): void {
    this.playNote(new Note(Range.CENTER, this.currentKey));
  }

  playChord(chord: FunctionalChord): void {
    this.playNotes(this.chordNotesByKey.get(chord.getKey()) ?? []);
  }

  playTrueChords(): void {
    this.playProgression(this.trueChordNotes);
  }

  playNote(note: Note) {
    this.playNotes([note]);
  }

  playNotes(notes: ReadonlyArray<Note>) {
    this.playProgression([notes]);
  }

  playProgression(progression: ReadonlyArray<ReadonlyArray<Note>>) {
    if (this.activeSettings) {
      const timeBetweenNotes = this.activeSettings.speed;
      const duration = timeBetweenNotes * 0.8;
      progression.forEach((notes, index) => {
        SYNTH.triggerAttackRelease(
          notes.map((note) => note.getName()),
          duration,
          Tone.now() + timeBetweenNotes * index
        );
      });
    }
  }
}
</script>

<style scoped lang="scss">
.practice-game {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
</style>
