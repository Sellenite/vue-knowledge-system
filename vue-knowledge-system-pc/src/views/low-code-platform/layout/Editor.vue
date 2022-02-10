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
        watingIndex: 0
      }
    },
    methods: {
      _getWaitingModel() {
        return {
          type: 'waiting',
          id: getRandomCode()
        }
      },
      _getAttributeElement(target, attribute) {
        let parent = target.parentElement
        let ret = null

        while (parent != null && !ret) {
          const type = parent.getAttribute('type')
          if (type === 'component') {
            ret = parent
          } else {
            parent = parent.parentElement
          }
        }

        return ret
      },
      handleDragOver(e) {
        e.preventDefault()
        e.stopPropagation()

        // 移动Editor排序时也会触发dragover
        if (!this.platform.dragComponent) {
          return
        }

        const type = e.target.getAttribute('type')

        if (type === 'waiting') return

        const haveWaiting = this.platform.currentComponentList.find(item => item.type === 'waiting')

        if (type === 'editor') {
          if (this.platform.isDragging && !haveWaiting) {
            this.watingIndex = this.platform.currentComponentList.length
            this.platform.currentComponentList.push(this._getWaitingModel())
          }
          return
        }

        const componentTarget = this._getAttributeElement(e.target, 'component')

        if (componentTarget) {
          const [offsetY, offsetHeight, curIndex] = [e.offsetY, componentTarget.offsetHeight, componentTarget.dataset.index]

          if (offsetY >= 0) {
            let direction = offsetY < offsetHeight / 2 ? 'top' : 'down'

            if (!haveWaiting) {
              if (direction === 'top') {
                if (curIndex == 0) {
                  this.platform.currentComponentList.unshift(this._getWaitingModel())
                } else {
                  this.platform.currentComponentList.splice(curIndex, 0, this._getWaitingModel())
                }
                this.watingIndex = curIndex
              } else {
                const nextIndex = +curIndex + 1
                this.platform.currentComponentList.splice(nextIndex, 0, this._getWaitingModel())
                this.watingIndex = nextIndex
              }
            } else {
              let isWaiting
              if (direction === 'top') {
                let i = curIndex == 0 ? 0 : curIndex - 1
                isWaiting = this.platform.currentComponentList[i].type == 'waiting'
              } else {
                let i = +curIndex + 1
                isWaiting = this.platform.currentComponentList.length > i && this.platform.currentComponentList[i].type == 'waiting'
              }

              if (isWaiting) return

              const temp = this.platform.currentComponentList.splice(this.watingIndex, 1)
              this.platform.currentComponentList.splice(curIndex, 0, temp[0])

              this.watingIndex = curIndex
            }
          }
          return
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