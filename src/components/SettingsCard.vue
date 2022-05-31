<template>
  <div class="settings-card">
    <div class="top-row">
      <div class="link">
        <router-link :to="link"
          ><h3>
            {{ settings.name }}
          </h3></router-link
        >
      </div>
      <button class="delete-button" @click="onDelete">Delete</button>
    </div>
    <div class="chord-badges">
      <div
        class="chord-badge"
        v-for="(chord, index) in settings.chords"
        :key="index"
      >
        {{ chord.getName() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Settings from "@/models/settings";
import { Vue } from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";

export default class SettingsCard extends Vue {
  @Prop(String) readonly link!: string;
  @Prop() readonly settings!: Settings;

  @Emit() onDelete() {
    return;
  }
}
</script>

<style scoped lang="scss">
.settings-card {
  background-color: $theme-dark;
  border-radius: 1rem;
  min-height: 7rem;
  padding: 0.1rem 1.75rem 1.25rem 1.75rem;
  .top-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .link {
      margin-bottom: 2rem;
    }
    .delete-button {
      height: 1.5rem;
    }
  }
  .chord-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    .chord-badge {
      background-color: $theme-darker;
      border-radius: 0.5rem;
      min-width: 0.2rem;
      padding: 0rem 0.5rem;
      text-align: center;
    }
  }
}
</style>
