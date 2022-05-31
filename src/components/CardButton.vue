<template>
  <div :class="{ 'card-button': true, disabled }" @click="onClickIfEnabled()">
    {{ label }}
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";

export default class CardButton extends Vue {
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop(String) readonly label!: string;

  @Emit() onClick() {
    return;
  }

  onClickIfEnabled() {
    if (!this.disabled) {
      this.onClick();
    }
  }
}
</script>

<style scoped lang="scss">
.card-button {
  background-color: $theme-dark;
  border-radius: 1rem;
  text-align: center;
  &.disabled {
    background-color: $theme-darker;
    color: $theme-lighter;
  }
  &:hover:not(.disabled) {
    background-color: $theme-light;
  }
}
</style>
