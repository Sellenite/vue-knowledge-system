<template>
  <div class="editor" @dragover="handleDragOver" @drop="handleDrop">
    <div class="phone-head"></div>
    <div class="scroll-area" type="editor">
      <draggable v-model="platform.currentComponentList">
        <template v-for="(item, index) in platform.currentComponentList">
          <div :key="item.id" :id="item.id" class="draggable-item">
            <!-- waiting -->
            <div class="waiting" v-if="item.type == 'waiting'" type="waiting">
              <span class="waiting-text">组件放置区域</span>
            </div>

            <!-- component -->
            <shape v-else type="component" :data-index="index" :item="item">
              <component :is="item.component" v-bind="item.props"></component>
            </shape>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
  import Shape from '@/views/low-code-platform/layout/Shape.vue';
  import { getRandomCode } from '@/utils/index.js'

  export default {
    name: 'Editor',
    inject: ['platform'],
    components: {
      Shape
    },
    data() {
      return {
        waitingIndex: 0,
        fn: this._throttle(this.handleDragOver, 200)
      }
    },
    methods: {
      // 节流
      _throttle (fn, delay) {
        let prev = Date.now()

        return function () {
          let now = Date.now()
          let args = arguments
          if (now - prev > delay) {
            fn(...args)
            prev = Date.now()
          }
        }
      },
      _getWaitingModel() {
        return {
          type: 'waiting',
          id: getRandomCode()
        }
      },
      handleDragOver(e) {
        e.preventDefault()
        e.stopPropagation()

        const type = e.target.getAttribute('type')

        if (type === 'waiting') return

        const haveWaiting = this.platform.currentComponentList.find(item => item.type === 'waiting')

        if (type === 'editor') {
          if (this.platform.isDragging && !haveWaiting) {
            this.waitingIndex = this.platform.currentComponentList.length
            this.platform.currentComponentList.push(this._getWaitingModel())
          }
        }

        if (type === 'component') {

        }
      },
      handleDrop(e) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor {
    width: 375px;
    height: 667px;
    position: relative;
    margin: 10px auto 50px auto;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    line-height: 1;
    .phone-head {
      width: 100%;
      height: 64px;
      background-image: url('~@/assets/low-code-platform/phone-head.png');
      background-size: cover;
    }
    .scroll-area {
      flex: 1;
      overflow: auto;
      .waiting {
        width: 100%;
        height: 40px;
        background-color: #5487df20;
        display: flex;
        justify-content: center;
        align-items: center;
        .waiting-text {
          padding: 8px 30px;
          background: #5487df;
          color: #fff;
          font-size: 12px;
          line-height: 1;
        }
      }
    }
  }
</style>