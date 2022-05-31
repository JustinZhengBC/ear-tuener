<template>
  <div class="settings-editor">
    <div class="name-editor">
      <input
        :value="editedSettingsIfPresent.name"
        @input="(event) => setName((event?.target as HTMLInputElement)?.value)"
      />
    </div>
    <div class="chords-editor">
      <span class="section-header">Chords:</span>
      <table>
        <template
          v-for="(chord, chordIndex) in allChordQualities"
          :key="chordIndex"
          ><tr>
            <td rowspan="2">{{ chord.getName() }}:</td>
            <td
              class="chord-toggle"
              v-for="(_, degreeIndex) in allDegrees.slice(
                0,
                allDegrees.length / 2
              )"
              :key="degreeIndex"
            >
              <input
                type="checkbox"
                :checked="
                  chordSet.has(
                    allFunctionalChords[degreeIndex][chordIndex].getKey()
                  )
                "
                @click="
                  toggleChord(allFunctionalChords[degreeIndex][chordIndex])
                "
              /><label>{{
                allFunctionalChords[degreeIndex][chordIndex].getName()
              }}</label>
            </td>
          </tr>
          <tr>
            <td
              class="chord-toggle"
              v-for="(_, degreeIndex) in allDegrees.slice(
                allDegrees.length / 2
              )"
              :key="degreeIndex"
            >
              <input
                type="checkbox"
                :checked="
                  chordSet.has(
                    allFunctionalChords[degreeIndex + allDegrees.length / 2][
                      chordIndex
                    ].getKey()
                  )
                "
                @click="
                  toggleChord(
                    allFunctionalChords[degreeIndex + allDegrees.length / 2][
                      chordIndex
                    ]
                  )
                "
              /><label>{{
                allFunctionalChords[degreeIndex + allDegrees.length / 2][
                  chordIndex
                ].getName()
              }}</label>
            </td>
          </tr>
        </template>
      </table>
    </div>
    <div class="spaced-edit-row">
      <span class="section-header">Ranges:</span>
      <span v-for="(rangeIncluded, index) in rangesIncluded" :key="index">
        <input
          type="checkbox"
          :checked="rangeIncluded"
          @click="setRangeInclusion(allRanges[index].value, !rangeIncluded)"
        /><label>{{ allRanges[index].name }}</label>
      </span>
    </div>
    <div class="spaced-edit-row">
      <span class="section-header">Key change rate:</span>
      <span
        v-for="keyChangeRate in allKeyChangeRates"
        :key="keyChangeRate.name"
      >
        <input
          type="radio"
          name="KeyChangeRate"
          :checked="
            keyChangeRate.value === editedSettingsIfPresent.keyChangeRate
          "
          @click="setKeyChangeRate(keyChangeRate.value)"
        />
        <label>{{ keyChangeRate.name }}</label>
      </span>
    </div>
    <div class="spaced-edit-row">
      <span class="section-header">Progression length:</span>
      <span
        v-for="progressionLength in allProgressionLengths"
        :key="progressionLength"
      >
        <input
          type="radio"
          name="ProgressionLength"
          :checked="
            progressionLength === editedSettingsIfPresent.progressionLength
          "
          @click="setProgressionLength(progressionLength)"
        />
        <label>{{ progressionLength }}</label>
      </span>
    </div>
    <div class="spaced-edit-row">
      <span class="section-header">Speed:</span>
      <span v-for="speed in allSpeeds" :key="speed.name">
        <input
          type="radio"
          name="Speed"
          :checked="speed.value === editedSettingsIfPresent.speed"
          @click="setSpeed(speed.value)"
        />
        <label>{{ speed.name }}</label>
      </span>
    </div>
    <div class="centered-edit-row">
      <div class="first-note-tonic-editor">
        <label>Is first note always tonic:</label>
        <input
          type="checkbox"
          :checked="editedSettingsIfPresent.isFirstNoteAlwaysTonic"
          @change="
            setIsFirstNoteAlwaysTonic(
              !editedSettingsIfPresent.isFirstNoteAlwaysTonic
            )
          "
        />
      </div>
      <div class="hard-mode-editor">
        <label>Is hard mode:</label>
        <input
          type="checkbox"
          :checked="editedSettingsIfPresent.isHardMode"
          @change="setIsHardMode(!editedSettingsIfPresent.isHardMode)"
        />
      </div>
    </div>
    <div class="error-message-row" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="centered-edit-row">
      <button
        @click="editedSettings && onSave(editedSettings)"
        :disabled="!editedSettings || !!errorMessage"
      >
        Save
      </button>
      <button
        @click="editedSettings && onSaveAs(editedSettings)"
        :disabled="!editedSettings || !!errorMessage"
      >
        Save As
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ChordQuality from "@/models/chord-quality";
import Degree from "@/models/degree";
import FunctionalChord from "@/models/functional-chord";
import Settings, {
  checkSettingsValid,
  KeyChangeRate,
  Range,
  Speed,
} from "@/models/settings";
import { Vue } from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";

const ALL_FUNCTIONAL_CHORDS: ReadonlyArray<ReadonlyArray<FunctionalChord>> =
  Degree.getAllDegrees().map((degree) =>
    ChordQuality.getAllChordQualities().map(
      (quality) => new FunctionalChord(degree, quality)
    )
  );

const ALL_KEY_CHANGE_RATES: ReadonlyArray<KeyChangeRate> = [
  KeyChangeRate.ONE,
  KeyChangeRate.FIVE,
  KeyChangeRate.TEN,
  KeyChangeRate.NEVER,
];

const ALL_PROGRESSION_LENGTHS: ReadonlyArray<number> = [3, 4, 5, 6, 7, 8];

const ALL_RANGES: ReadonlyArray<Range> = [
  Range.LOWEST,
  Range.LOWER,
  Range.LOW,
  Range.CENTER,
  Range.HIGH,
  Range.HIGHER,
  Range.HIGHEST,
];

const ALL_SPEEDS: ReadonlyArray<Speed> = [Speed.SLOW, Speed.MEDIUM, Speed.FAST];

interface Label<T> {
  name: string;
  value: T;
}

function makeLabels<T>(
  values: ReadonlyArray<T>,
  nameGetter: (value: T) => string
): ReadonlyArray<Label<T>> {
  return values.map((value) => ({ name: nameGetter(value), value }));
}

export default class SettingsEditor extends Vue {
  @Prop() readonly settings!: Settings;

  editedSettings: Settings | null = null;

  @Emit() onSave(updatedSettings: Settings) {
    return updatedSettings;
  }

  @Emit() onSaveAs(updatedSettings: Settings) {
    return updatedSettings;
  }

  readonly allChordQualities = ChordQuality.getAllChordQualities();
  readonly allDegrees = Degree.getAllDegrees();
  readonly allFunctionalChords = ALL_FUNCTIONAL_CHORDS;
  readonly allKeyChangeRates: ReadonlyArray<Label<KeyChangeRate>> = makeLabels(
    ALL_KEY_CHANGE_RATES,
    (keyChangeRate) => KeyChangeRate[keyChangeRate]
  );
  readonly allProgressionLengths: ReadonlyArray<number> =
    ALL_PROGRESSION_LENGTHS;
  readonly allRanges: ReadonlyArray<Label<Range>> = makeLabels(
    ALL_RANGES,
    (range) => Range[range]
  );
  readonly allSpeeds: ReadonlyArray<Label<Speed>> = makeLabels(
    ALL_SPEEDS,
    (speed) => Speed[speed]
  );

  get chordSet(): Set<number> {
    return new Set(
      this.editedSettingsIfPresent.chords.map((chord) => chord.getKey())
    );
  }

  get editedSettingsIfPresent(): Settings {
    return this.editedSettings || this.settings;
  }

  get errorMessage(): string | null {
    return this.editedSettings && checkSettingsValid(this.editedSettings);
  }

  get rangesIncluded(): ReadonlyArray<boolean> {
    return this.allRanges.map((range) =>
      this.editedSettingsIfPresent.ranges.includes(range.value)
    );
  }

  setName(name: string) {
    this.editedSettings = { ...this.editedSettingsIfPresent, name };
  }

  setIsFirstNoteAlwaysTonic(isFirstNoteAlwaysTonic: boolean) {
    this.editedSettings = {
      ...this.editedSettingsIfPresent,
      isFirstNoteAlwaysTonic,
    };
  }

  setIsHardMode(isHardMode: boolean) {
    this.editedSettings = { ...this.editedSettingsIfPresent, isHardMode };
  }

  setKeyChangeRate(keyChangeRate: KeyChangeRate) {
    this.editedSettings = { ...this.editedSettingsIfPresent, keyChangeRate };
  }

  setProgressionLength(progressionLength: number) {
    this.editedSettings = {
      ...this.editedSettingsIfPresent,
      progressionLength,
    };
  }

  setRangeInclusion(range: Range, isIncluded: boolean) {
    const newRanges = isIncluded
      ? [...this.editedSettingsIfPresent.ranges, range]
      : this.editedSettingsIfPresent.ranges.filter(
          (existingRange) => existingRange !== range
        );
    this.editedSettings = {
      ...this.editedSettingsIfPresent,
      ranges: newRanges,
    };
  }

  setSpeed(speed: Speed) {
    this.editedSettings = { ...this.editedSettingsIfPresent, speed };
  }

  toggleChord(chord: FunctionalChord) {
    const key = chord.getKey();
    const newChords = this.chordSet.has(chord.getKey())
      ? this.editedSettingsIfPresent.chords.filter(
          (existingChord) => existingChord.getKey() !== key
        )
      : [...this.editedSettingsIfPresent.chords, chord];
    this.editedSettings = {
      ...this.editedSettingsIfPresent,
      chords: newChords,
    };
  }
}
</script>

<style scoped lang="scss">
.settings-editor {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  .name-editor {
    input {
      background-color: $theme-dark;
      color: $theme-lightest;
    }
  }
  .section-header {
    font-size: x-large;
    font-weight: bold;
  }
  .chords-editor {
    display: flex;
    flex-direction: column;
    .section-header {
      align-self: center;
      margin-bottom: 0.5rem;
    }
  }
  .centered-edit-row {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .spaced-edit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .error-message-row {
    color: red;
    font-weight: bold;
  }
}
</style>
