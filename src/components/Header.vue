<template>
  <router-link to="/" class="header">
    <h1>Ear Tuener</h1>
    <img src="@/assets/logo.png" alt="logo" />
  </router-link>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Header extends Vue {}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  text-decoration: none !important;
  h1 {
    color: $theme-lightest;
    margin-right: 1rem;
  }
  img {
    height: 4rem;
    width: 4rem;
  }
}
</style>
