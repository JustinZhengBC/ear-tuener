<template>
  <div class="input-panel">
    <table class="chord-grid">
      <tr v-for="(row, rowIndex) in chordGrid" :key="rowIndex">
        <td v-for="(chord, columnIndex) in row" :key="columnIndex">
          <CardButton
            v-if="chord"
            :label="chord.getName()"
            @onClick="onPress(chord)"
          />
        </td>
      </tr>
    </table>
    <div class="button-row">
      <CardButton
        :disabled="!activeSettings?.isHardMode"
        label="Delete"
        @onClick="inputChord(null)"
      />
      <CardButton label="Hear Progression" @onClick="onPlayProgression()" />
      <CardButton label="Hear Tonic" @onClick="onPlayTonic()" />
      <CardButton
        :disabled="!canGetNextProgression"
        label="Next"
        @onClick="generateNewProgression"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CardButton from "@/components/CardButton.vue";
import ChordQuality from "@/models/chord-quality";
import Degree from "@/models/degree";
import FunctionalChord from "@/models/functional-chord";
import Settings from "@/models/settings";
import { session } from "@/store";
import { Options, Vue } from "vue-class-component";
import { Emit } from "vue-property-decorator";

const MAX_COLUMNS = 10;

@Options({
  components: {
    CardButton,
  },
})
export default class ChordsInput extends Vue {
  @session.State("activeSettings") activeSettings!: Settings | null;
  @session.State("trueChords") trueChords!: FunctionalChord[];
  @session.State("userChords") userChords!: FunctionalChord[];
  @session.Action("generateNewProgression") generateNewProgression!: () => void;
  @session.Action("inputChord") inputChord!: (
    chord: FunctionalChord | null
  ) => void;

  @Emit() onPlayChord(chord: FunctionalChord) {
    return chord;
  }

  @Emit() onPlayProgression() {
    return;
  }

  @Emit() onPlayTonic() {
    return;
  }

  get canGetNextProgression(): boolean {
    return (
      this.trueChords.length === this.userChords.length &&
      this.trueChords.every(
        (chord, index) => chord.getKey() === this.userChords[index].getKey()
      )
    );
  }

  get chordGrid(): ReadonlyArray<ReadonlyArray<FunctionalChord | undefined>> {
    if (!this.activeSettings) {
      return [];
    }
    const chordsByQualityAndDegree: Map<
      ChordQuality,
      Map<Degree, FunctionalChord>
    > = new Map();
    const chordDegrees: Set<Degree> = new Set();
    this.activeSettings.chords.forEach((chord) => {
      const chordsByDegree = chordsByQualityAndDegree.get(chord.getQuality());
      if (chordsByDegree) {
        chordsByDegree.set(chord.getDegree(), chord);
      } else {
        chordsByQualityAndDegree.set(
          chord.getQuality(),
          new Map([[chord.getDegree(), chord]])
        );
      }
      chordDegrees.add(chord.getDegree());
    });
    const numColumns = Math.ceil(
      chordDegrees.size / Math.ceil(chordDegrees.size / MAX_COLUMNS)
    );
    const sortedChordQualities = Array.from(
      chordsByQualityAndDegree.keys()
    ).sort((left, right) => left.getKey() - right.getKey());
    const sortedChordDegrees = Array.from(chordDegrees).sort(
      (left, right) => left.getKey() - right.getKey()
    );
    return sortedChordQualities.flatMap((chordQuality) => {
      const chordsByDegree = chordsByQualityAndDegree.get(chordQuality);
      if (!chordsByDegree) {
        throw new Error();
      }
      const rows: (FunctionalChord | undefined)[][] = [];
      let row: (FunctionalChord | undefined)[] = [];
      for (const chordDegree of sortedChordDegrees) {
        row.push(chordsByDegree.get(chordDegree));
        if (row.length === numColumns) {
          rows.push(row);
          row = [];
        }
      }
      if (row.length) {
        while (row.length < numColumns) {
          row.push(undefined);
        }
        rows.push(row);
      }
      return rows;
    });
  }

  onPress(chord: FunctionalChord) {
    this.onPlayChord(chord);
    this.inputChord(chord);
  }
}
</script>

<style scoped lang="scss">
.input-panel {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  .chord-grid {
    tr {
      height: 3rem;
      margin-bottom: 1rem;
      .card-button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;
        width: 4rem;
      }
    }
  }
  .button-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .card-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3rem;
      width: 24%;
    }
  }
}
</style>
