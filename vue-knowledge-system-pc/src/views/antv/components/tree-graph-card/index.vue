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
      relationData: {}
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
            id: Math.random() + '',
            collapsed: node.cardType === 'host' ? false : true,
            children: [],
            __level: level,
            __isShowDetails: node.cardType === 'host',
            __cardType: node.cardType,
            __eventTargetName: null,
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
        }
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
          model.__eventTargetName = 'details'
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
          model.__eventTargetName = 'collapsed'
          model.collapsed = !model.collapsed
          graph.updateItem(e.item, model)
          graph.layout()
        }
      })

      graph.data(this.relationData)
      graph.render()
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
