<template>
  <div class="editor" @dragover="handleDragOver" @drop="handleDrop">
    <div class="phone-head"></div>
    <div class="scroll-area" type="editor">
      <draggable v-model="platform.currentComponentList">
        <template v-for="(item, index) in platform.currentComponentList">
          <div :key="index">
            <!-- waiting -->
            <div class="waiting" v-if="item.type == 'waiting'" type="waiting">
              <span class="waiting-text">组件放置区域</span>
            </div>

            <!-- component -->
            <div v-else type="component" :data-index="index" class="component-wrapper" @click="setActivatedComponent(item)">
              <div :class="[platform.dragComponent ? 'event-none' : '']">
                <component :is="item.component" v-bind="item.props"></component>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Editor',
    inject: ['platform'],
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
      setActivatedComponent(item) {
        this.platform.activatedComponent = item
      },
      handleDragOver(e) {
        e.preventDefault()
        e.stopPropagation()

        const type = e.target.getAttribute('type')
        const waitingModel = {
          type: 'waiting'
        }

        if (type === 'waiting') return

        const haveWaiting = this.platform.currentComponentList.find(item => item.type === 'waiting')

        if (type === 'editor') {
          if (this.platform.isDragging && !haveWaiting) {
            this.waitingIndex = this.platform.currentComponentList.length
            this.platform.currentComponentList.push(waitingModel)
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
    font-size: 0;
    display: flex;
    flex-direction: column;
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
          pointer-events: none;
          line-height: 1;
        }
      }
    }
  }
</style>