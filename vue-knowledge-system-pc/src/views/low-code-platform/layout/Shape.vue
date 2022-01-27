<template>
  <div class="shape" @click="setActivatedComponent">
    <div v-if="platform.activatedComponent && platform.activatedComponent.id === item.id" class="border"></div>
    <div class="dash-border"></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Shape',
    inject: ['platform'],
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {

      }
    },
    methods: {
      setActivatedComponent() {
        console.log(this.item)
        if (this.platform.activatedComponent && this.platform.activatedComponent.id === this.item.id) {
          this.platform.activatedComponent = null
        } else {
          this.platform.activatedComponent = this.item
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/element-variables.scss';
  .shape {
    position: relative;
    .border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid $--color-primary;
      z-index: 2;
    }
    .dash-border {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed $--color-primary;
      z-index: 1;
    }
    &:hover {
      .dash-border {
        display: block;
      }
    }
  }
</style>