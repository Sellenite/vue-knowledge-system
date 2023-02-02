<template>
  <div ref="container" class="container">
    <div id="graph-contextmenu">
      <div class="graph-contextmenu-item" @click="handleCopyText">复制</div>
    </div>
  </div>
</template>
<script>
import { TreeGraph, Util } from '@antv/g6'
import { treeData } from './data.js'
import treeGraphInstance from './instance.js'
import { TREE_GRAPH_CARD_CARD_NAME } from './register-tree-graph-node.js'

let currentGraphEvent = null

const getRelateNodes = (targetId, data) => {
  let relateNodes = []

  const _getRelateNodes = (his = [], targetId = null, tree = []) => {
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
        if (_getRelateNodes(history, targetId, children)) {
          break
        }
      }
    }
  }

  _getRelateNodes([], targetId, data)

  return relateNodes
}

export default {
  data() {
    return {
      relationData: {},
      activeNo: 'xq20220329001006'
      // activeNo: 'xq20220329002000'
      // activeNo: ''
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
      // 初始状态数据
      const traverse = (data) => {
        const fn = (node, level) => {
          const targetNode = {
            ...node,
            id: Math.random() + '', // 重要，没了id会有各种各样的问题，必须定义
            collapsed: true,
            children: [],
            __level: level,
            __isActiveNode: false,
            __isShowDetails: false,
            __cardType: node.cardType,
            __eventCollapsedFlag: false,
            __eventDetailsFlag: false,
            __nodeHeight: 0,
            __tempNodeHeight: 0, // 用于记录node高度变化前的高度，进行坐标位移
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

      if (this.activeNo) {
        const relateNodes = getRelateNodes(this.activeNo, [data])
        const activeNode = relateNodes.splice(-1, 1)[0]
        const hostNode = relateNodes.splice(0, 1)[0]
        // 至此relateNodes为activeNode的激活链
        const relateNodesIds = relateNodes.map(item => item.id)
        if (relateNodes.length) {
          Util.traverseTree(data, (node) => {
            if (node.id === hostNode.id) {
              node.collapsed = false
              node.__isShowDetails = true
            } else if (relateNodesIds.includes(node.id)) {
              node.collapsed = false
            } else if (node.id === activeNode.id) {
              node.collapsed = false
              node.__isShowDetails = true
              node.__isActiveNode = true
            }
          })
        } else {
          Util.traverseTree(data, (node) => {
            node.collapsed = false
          })
          data.__isShowDetails = true
        }
      } else {
        Util.traverseTree(data, (node) => {
          node.collapsed = false
        })
        data.__isShowDetails = true
      }

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
            return 260
          },
          getHeight: () => {
            return 46
          },
          getVGap: (d) => {
            return Math.max(d.__nodeHeight / 2, 23)
          },
          getHGap: () => {
            return 70
          }
        },
        maxZoom: 1,
        minZoom: 0.9
      })

      treeGraphInstance.instance = graph

      graph.on('mousedown', () => {
        this._hideGraphContextMenu()
      })

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

      graph.on('node:contextmenu', (e) => {
        const canCopyItemNamesList = ['node-title', 'node-sub-title', 'node-expand-row-text']
        if (canCopyItemNamesList.includes(e.target.cfg.name)) {
          e.preventDefault()
          e.stopPropagation()
          currentGraphEvent = e
          const graphContextMenu = document.getElementById('graph-contextmenu')
          document.body.appendChild(graphContextMenu)
          this.$nextTick(() => {
            graphContextMenu.style.left = e.clientX + 'px'
            graphContextMenu.style.top = e.clientY + 'px'
            graphContextMenu.style.display = 'block'
          })
        }
      })

      graph.data(this.relationData)
      graph.render()
      graph.layout()
      graph.fitView()

      this._focusActiveNode()
    },
    _focusActiveNode() {
      const graph = treeGraphInstance.instance
      const relateNodes = getRelateNodes(this.activeNo, [this.relationData])
      const activeNode = relateNodes.splice(-1, 1)[0]

      graph.focusItem(activeNode.id)
    },
    handleCopyText() {
      let value = currentGraphEvent.target.attrs.text || ''
      value = value.replace(/\n/g, '')
      this._copyText(value)
      this._hideGraphContextMenu()
    },
    _hideGraphContextMenu() {
      currentGraphEvent = null
      const graphContextMenu = document.getElementById('graph-contextmenu')
      if (graphContextMenu) {
        graphContextMenu.style.display = 'none'
      }
    },
    _copyText(value) {
      const input = document.createElement('input')
      input.value = value
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  width: 900px;
  height: 600px;
  margin: 20px auto;
  font-size: 0
}

#graph-contextmenu {
  display: none;
  position: fixed;
  z-index: 10;
  background: #FFF;
  padding: 6px;
  border-radius: 3px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  padding: 4px 0;

  .graph-contextmenu-item {
    padding: 4px 20px;
    cursor: pointer;
    font-size: 13px;
    color: #333;

    &:hover {
      background-color: rgba(231, 38, 56, 0.1);
      color: #E72638;
    }
  }
}

</style>
