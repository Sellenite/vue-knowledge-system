<template>
  <div ref="container" class="container"></div>
</template>
<script>
import { TreeGraph } from '@antv/g6'
import { treeData } from './data.js'
import { TREE_GRAPH_CARD_CARD_NAME } from './register-tree-graph-node.js'
export default {
  data() {
    return {
      relationData: {},
      activeNo: 'xq20220329001804'
    }
  },
  created() {
    this.relationData = this._formatData()
  },
  mounted() {
    this._initAntv()
  },
  methods: {
    _formatData() {
      const originData = treeData

      const traverse = (data) => {
        const fn = (node, level) => {
          const targetNode = {
            ...node,
            id: Math.random() + '', // 重要，没了id会有各种各样的问题，必须定义
            collapsed: true,
            children: [],
            __level: level,
            __isActiveNode: this.activeNo === node.no,
            __isShowDetails: false,
            __cardType: node.cardType,
            __eventCollapsedFlag: false,
            __eventDetailsFlag: false,
            __nodeHeight: 0,
          }
          if (node.children && node.children.length > 0) {
            node.children.forEach((item) => {
              targetNode.children.push(fn(item, level + 1))
            })
          }
          return targetNode
        }
        return fn(data, 0)
      }

      const data = traverse(originData)

      return data
    },
    _initAntv() {
      const container = this.$refs.container
      const graphWidth = container.scrollWidth
      const graphHeight = container.scrollHeight

      const graph = new TreeGraph({
        container: container,
        width: graphWidth,
        height: graphHeight,
        animate: false,
        defaultNode: {
          type: TREE_GRAPH_CARD_CARD_NAME,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ]
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: 'rgba(0, 0, 0, 0.25)'
          }
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas']
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: (node) => {
            return node.id
          },
          getWidth: () => {
            return 244
          },
          getHeight: () => {
            return 46
          },
          getVGap: () => {
            return 20
          },
          getHGap: () => {
            return 30
          }
        },
        maxZoom: 1,
        minZoom: 0.7
      })

      window.__treeGraph = graph

      graph.on('node:click', (e) => {
        // 点击展开/隐藏详情
        const expandNameGroup = [
          'node-expand-btn-box',
          'node-expand-btn-text'
        ]
        if (expandNameGroup.includes(e.target.cfg.name)) {
          const model = e.item.getModel()
          model.__eventDetailsFlag = true
          model.__isShowDetails = !model.__isShowDetails
          graph.updateItem(e.item, model)
        }
        // 点击展开/隐藏子树
        const collapsedNameGroup = [
          'node-collapsed-btn-box',
          'node-collapsed-btn-text',
          'node-collapsed-btn-show-text',
        ]
        if (collapsedNameGroup.includes(e.target.cfg.name)) {
          const model = e.item.getModel()
          model.__eventCollapsedFlag = true
          model.collapsed = !model.collapsed
          graph.updateItem(e.item, model)
          // 有子项的时候才重新渲染布局，避免闪烁
          if (model.children.length) {
            graph.layout()
          }
        }
      })

      graph.data(this.relationData)
      graph.render()
      graph.fitView()

      // 找到树中指定id的所有父节点(或包括自己)
      let relateNodes = []

      const getRelateNodes = (his = [], targetId = null, tree = []) => {
        for (const item of tree) {
          const children = item.children || []
          if (item.no === targetId) {
            // 如果只要返回父元素们，就写成relateNodes = his
            relateNodes = [...his, item]
            return true
          } else if (children.length > 0) {
            const history = [...his]
            history.push(item)
            // 终止递归的条件
            if (getRelateNodes(history, targetId, children)) {
              break
            }
          }
        }
      }

      getRelateNodes([], this.activeNo, [this.relationData])

      const activeNode = relateNodes.splice(-1, 1)[0]
      const hostNode = relateNodes.splice(0, 1)[0]

      hostNode.collapsed = false
      hostNode.__eventCollapsedFlag = true

      relateNodes.forEach((model) => {
        model.collapsed = false
        model.__eventCollapsedFlag = true
      })

      activeNode.collapsed = false
      activeNode.__eventCollapsedFlag = true
      
      // 要先等ollapsed执行完创建了关键元素才能执行expandDetails
      graph.changeData()

      hostNode.__isShowDetails = true
      hostNode.__eventDetailsFlag = true
      activeNode.__isShowDetails = true
      activeNode.__eventDetailsFlag = true

      graph.changeData()

      graph.fitView()
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  width: 900px;
  height: 600px;
  margin: 20px auto;
}

</style>
