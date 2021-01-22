<template>
  <span class="checkbox" :class="{'checked': value}"></span>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped="">
.checkbox {
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  color: transparent;
  line-height: 1.25;
  text-align: center;
  border: 1px solid #c8c9cc;
  position: relative;
  top: 1px;
  &:before {
    content: " ";
    display: inline-block;
    position: absolute;
    border: 2px solid;
    border-color: transparent;
    width: 9px;
    height: 3px;
    top: 1px;
    left: 1px;
    transform: rotate(310deg);
  }
  &.checked {
    color: #fff;
    background-color: #1989fa;
    border-color: #1989fa;
    &:before {
      border-color: transparent transparent #FFF #FFF;
    }
  }
}
</style>