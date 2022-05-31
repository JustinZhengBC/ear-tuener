<template>
  <div class="home-view">
    <div class="cards" v-if="settingsList">
      <SettingsCard
        v-for="(settings, index) in settingsList"
        :key="index"
        :link="'/' + index"
        :settings="settings"
        @onDelete="remove(index)"
      />
    </div>
    <CardButton class="add-settings-button" label="+" @onClick="addNew()" />
    <div class="footer">
      <a href="https://github.com/justinzhengbc/ear-tuener">GitHub Repo</a>
    </div>
  </div>
</template>

<script lang="ts">
import CardButton from "@/components/CardButton.vue";
import SettingsCard from "@/components/SettingsCard.vue";
import Settings from "@/models/settings";
import { settings } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    CardButton,
    SettingsCard,
  },
})
export default class HomeView extends Vue {
  @settings.State("settingsList") settingsList!: Settings[] | null;
  @settings.Action("addNew") addNew!: () => void;
  @settings.Action("remove") remove!: (index: number) => void;
}
</script>

<style scoped lang="scss">
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .add-settings-button {
    margin-bottom: 60vh;
  }
  .card-button {
    font-size: 5rem;
    height: 7rem;
  }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
