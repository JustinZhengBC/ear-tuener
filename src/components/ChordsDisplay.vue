<template>
  <div class="chords-display">
    <div
      v-for="(trueChord, index) in trueChords"
      :class="getClass(trueChord, index)"
      :key="index"
    >
      {{ index >= userChords.length ? "?" : userChords[index].getName() }}
    </div>
  </div>
</template>

<script lang="ts">
import FunctionalChord from "@/models/functional-chord";
import Settings from "@/models/settings";
import { session } from "@/store";
import { Vue } from "vue-class-component";

export default class ChordsDisplay extends Vue {
  @session.State("activeSettings") activeSettings!: Settings | null;
  @session.State("trueChords") trueChords!: FunctionalChord[];
  @session.State("userChords") userChords!: FunctionalChord[];

  get isAllCorrect(): boolean {
    return (
      this.trueChords.length === this.userChords.length &&
      this.trueChords.every(
        (chord, index) => chord.getKey() === this.userChords[index].getKey()
      )
    );
  }

  getClass(trueChord: FunctionalChord, index: number) {
    if (this.activeSettings?.isHardMode) {
      return this.isAllCorrect ? "correct" : "unknown";
    }
    if (index >= this.userChords.length) {
      return "unknown";
    }
    return trueChord.getKey() === this.userChords[index].getKey()
      ? "correct"
      : "wrong";
  }
}
</script>

<style scoped lang="scss">
.chords-display {
  display: flex;
  flex-direction: row;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 2rem;
  }
  .unknown {
    color: $theme-lighter;
  }
  .correct {
    color: green;
  }
  .wrong {
    color: darkred;
  }
}
</style>
