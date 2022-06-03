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

  notesBeingPlayed: string[] = [];
  nextPlayTimeoutId: number | undefined = undefined;
  nextStopTimeoutId: number | undefined = undefined;
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
    if (!this.activeSettings) {
      return;
    }
    if (this.notesBeingPlayed.length) {
      SYNTH.triggerRelease(this.notesBeingPlayed, Tone.now());
      this.notesBeingPlayed = [];
    }
    if (!progression.length) {
      return;
    }
    this.clearFutureEvents();
    const timeBetweenNotes = this.activeSettings.speed * 1000;
    const duration = timeBetweenNotes * 0.8;
    const [firstNotes, ...remainingNotes] = progression;
    const notes = firstNotes.map((note) => note.getName());
    SYNTH.triggerAttack(notes, Tone.now());
    this.notesBeingPlayed = notes;
    this.nextStopTimeoutId = setTimeout(
      (that: PracticeGame) => that.playProgression([]),
      duration,
      this
    );
    if (remainingNotes.length) {
      this.nextPlayTimeoutId = setTimeout(
        (that: PracticeGame) => that.playProgression(remainingNotes),
        timeBetweenNotes,
        this
      );
    }
  }

  clearFutureEvents() {
    if (this.nextPlayTimeoutId !== undefined) {
      clearTimeout(this.nextPlayTimeoutId);
      this.nextPlayTimeoutId = undefined;
    }
    if (this.nextStopTimeoutId !== undefined) {
      clearTimeout(this.nextStopTimeoutId);
      this.nextStopTimeoutId = undefined;
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
