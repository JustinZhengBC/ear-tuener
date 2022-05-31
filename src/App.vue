<template>
  <Header />
  <router-view />
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { settings } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {
  @settings.Action("load") load!: () => void;

  mounted() {
    this.load();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  width: 50%;
}
</style>
