<template>
  <div class="selector-list">
    <div v-for="(item, index) in platform.listComponents" :key="index" class="selector-list-item" draggable @dragstart="handleDragStart($event, item)" @dragend="handleDragEnd($event, item)">
      <span>{{ item.desc }}</span>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { getRandomCode } from '@/utils/index.js'

  export default {
    name: 'SelectorList',
    inject: ['platform'],
    data() {
      return {

      }
    },
    methods: {
      handleDragStart(event, item) {
        const component = this._getNewComponentJson(item)
        this.platform.dragComponent = component
        this.platform.isDragging = true
      },
      handleDragEnd(event, item) {
        const waitingIndex = this.platform.currentComponentList.findIndex(item => item.type === 'waiting')
        if (waitingIndex != null) {
          this.platform.currentComponentList.splice(waitingIndex, 1, this.platform.dragComponent)
        }

        this.platform.dragComponent = null
        this.platform.isDragging = false
      },
      _getNewComponentJson(item) {
        const obj = _.cloneDeep(item)
        obj.id = getRandomCode()
        return obj
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/element-variables.scss';
  .selector-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .selector-list-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 48%;
      margin-bottom: 8px;
      padding: 30px 0;
      font-size: 12px;
      color: #666;
      border: 1px solid $--color-primary;
      margin-right: 4%;
      &:nth-child(2) {
        margin-right: 0;
      }
      &:hover {
        color: #fff;
        background: $--color-primary;
      }
    }
  }
</style>