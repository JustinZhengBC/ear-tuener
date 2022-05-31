<template>
  <div class="practice-view">
    <div v-if="activeSettings">
      <SettingsEditor
        v-if="isEditingSettings"
        :settings="activeSettings"
        @onSave="saveSettings"
        @onSaveAs="saveSettingsAs"
      />
      <div v-else>
        <div class="settings-header">
          <h2>{{ activeSettings.name }}</h2>
          <button class="edit-button" @click="startEditingSettings">
            Edit
          </button>
        </div>
        <PracticeGame />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PracticeGame from "@/components/PracticeGame.vue";
import SettingsEditor from "@/components/SettingsEditor.vue";
import Settings from "@/models/settings";
import { session, settings } from "@/store";
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";

@Options({
  components: {
    PracticeGame,
    SettingsEditor,
  },
})
export default class PracticeView extends Vue {
  @session.State("activeSettings") activeSettings!: Settings;
  @session.Mutation("setActiveSettings") setActiveSettings!: (
    settings: Settings
  ) => void;
  @settings.State("settings") settings!: Settings[] | null;
  @settings.Getter("setting") getSettingById!: (id: number) => Settings | null;
  @settings.Action("save") save!: (payload: {
    index: number;
    settings: Settings;
  }) => void;
  @settings.Action("saveAs") saveAs!: (settings: Settings) => void;

  isEditingSettings = false;

  get settingsIndex(): number {
    return parseInt(this.$route.params.settingsIndex as string, 10);
  }

  mounted() {
    this.onSettingsIndexChanged(this.settingsIndex);
  }

  @Watch("settingsIndex") onSettingsIndexChanged(newSettingsIndex: number) {
    if (Number.isNaN(newSettingsIndex)) {
      if (this.settings) {
        this.goHome();
      }
      return;
    }
    const settings = this.getSettingById(newSettingsIndex);
    if (!settings) {
      this.goHome();
      return;
    }
    this.setActiveSettings(settings);
  }

  goHome() {
    this.$router.push({ path: "/" });
  }

  saveSettings(settings: Settings) {
    this.isEditingSettings = false;
    this.setActiveSettings(settings);
    this.save({ index: this.settingsIndex, settings });
  }

  saveSettingsAs(settings: Settings) {
    this.isEditingSettings = false;
    this.setActiveSettings(settings);
    this.saveAs(settings);
  }

  startEditingSettings() {
    this.isEditingSettings = true;
  }
}
</script>

<style scoped lang="scss">
.practice-view {
  .settings-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
    .edit-button {
      margin-left: 1rem;
    }
  }
}
</style>
