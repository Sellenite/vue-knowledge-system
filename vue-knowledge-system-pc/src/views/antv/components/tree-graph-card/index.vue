<template>
  <div ref="container" class="container"></div>
</template>
<script>
import { TreeGraph } from '@antv/g6'
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
      const getChildObj = (type) => {
        return {
          cardType: type,
          no: 'rw202210230001',
          title: 'xq202210231001_测试超长需求测试超长需求测试超长需求',
          productManager: '王语嫣',
          demandAnalyst: '梁珍',
          projectManager: '林庆栋',
          developer: 'yuuhei',
          status: '已发正式库',
          application: 'GIS地理平台GIS地理平台GIS地理平台GIS地理平台GIS地理平台'
        }
      }

      const getMainObj = () => {
        return {
          cardType: 'host',
          no: 'xq202210231001',
          title: '研发平台GIS需求改造',
          application: '研发平台',
          productManager: '周堂发',
          demandAnalyst: '宋晶晶',
          status: '已发布',
          author: '敖翔/研发平台'
        }
      }

      const originData = {
        ...getMainObj(),
        children: [
          {
            ...getChildObj('main'),
            children: [
              {
                ...getChildObj('sub')
              },
              {
                ...getChildObj('sub')
              }
            ]
          },
          {
            ...getChildObj('main')
          }
        ]
      }

      const traverse = (data) => {
        const fn = (node, level) => {
          const targetNode = {
            ...node,
            level: level,
            isShowDetails: node.cardType === 'host'
          }
          if (node.children && node.children.length > 0) {
            targetNode.children = []
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
            return 122
          },
          getVGap: () => {
            return 40
          },
          getHGap: () => {
            return 30
          }
        }
      })

      graph.on('node:click', (e) => {
        // 点击展开/隐藏详情
        if (e.target.cfg.name === 'node-expand-btn-box' || e.target.cfg.name === 'node-expand-btn-text') {
          // 变更isShowDetails数据
          const model = e.item.getModel()
          model.isShowDetails = !model.isShowDetails
          graph.updateItem(e.item, model)
          // 位于该节点的下方的所有节点的y坐标进行移动
          const currentGroup = graph.findById(model.id)
          const sameLevelGroup = graph.findAll('node', (node) => {
            const _model = node.getModel()
            return _model.level === model.level
          })
          const belowCurrentGroups = sameLevelGroup.slice(sameLevelGroup.indexOf(currentGroup) + 1)
          if (model.isShowDetails) {
            // 下移
            belowCurrentGroups.forEach((group) => {
              const _model = group.getModel()
              graph.updateItem(group, {
                y: group.getBBox().y + _model.__expandDetailGroupHeight
              })
            })
          } else {
            // 上移
            belowCurrentGroups.forEach((group) => {
              const _model = group.getModel()
              graph.updateItem(group, {
                y: group.getBBox().y - _model.__expandDetailGroupHeight
              })
            })
          }
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
