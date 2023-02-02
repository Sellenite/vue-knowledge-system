import { registerNode, Util } from '@antv/g6'
import treeGraphInstance from './instance.js'

const TREE_GRAPH_CARD_CARD_NAME = 'tree-graph-card-node'

const NODE_WIDTH = 260
const NODE_HEIGHT = 46 // 高度给一个默认的初始高度，之后节点高度会有变化
const NODE_PADDING = [18, 18, 18, 18]
const NODE_V_GAP = 46

// 返回当前节点需要配置的颜色等配置
const getNodeConfig = (cfg) => {
  let titleIconBackgroundColor, titleIconFontColor, taskTypeFontColor
  if (cfg.__cardType === 'host') {
    titleIconBackgroundColor = 'rgba(235, 247, 255)'
    titleIconFontColor = 'rgba(41, 167, 255)'
  } else {
    titleIconBackgroundColor = 'rgba(250, 244, 238)'
    titleIconFontColor = 'rgba(255, 142, 0)'
    if (cfg.__cardType === 'main') {
      taskTypeFontColor = 'red'
    } else if (cfg.__cardType === 'sub') {
      taskTypeFontColor = 'blue'
    }
  }

  const defaultColor = {
    activeNodeShadowColor: 'rgba(255, 73, 73, 0.2)',
    normalNodeShadowColor: 'rgba(0, 0, 0, 0.2)',
    activeNodeBorderColor: 'rgba(255, 73, 73)',
  }

  const config = {
    ...defaultColor,
    titleIconBackgroundColor,
    titleIconFontColor,
    taskTypeFontColor
  }

  return config
}

// 由于节点的文本不会换行，根据节点的宽度切分详情文本到数组中，然后进行换行
const getStringLineArr = (str, maxWidth, fontSize) => {
  const arr = []
  str = str.replace(/\n/gi, '')
  while (str.length > 0) {
    for (let i = 0; i <= str.length; i++) {
      const _str = str.substring(0, i)
      if (Util.getTextSize(_str, fontSize)[0] >= maxWidth || i === str.length) {
        arr.push(_str)
        str = str.substring(i)
        break
      }
    }
  }

  return arr
}

// 渲染节点方法集合
const nodeBasicMethod = {
  // 创建外层最大容器作为keyShape
  createNodeBox(cfg, group) {
    const config = getNodeConfig(cfg)
    // 最外面的大矩形
    let shadowColor
    let lineWidth
    let stroke
    if (cfg.__isActiveNode) {
      shadowColor = config.activeNodeShadowColor
      stroke = config.activeNodeBorderColor
      lineWidth = 2
    } else {
      shadowColor = config.normalNodeShadowColor
      lineWidth = 0
    }
    const nodeContainer = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fill: '#FFFFFF',
        shadowColor: shadowColor,
        stroke: stroke,
        lineWidth: lineWidth,
        shadowBlur: 8,
        radius: 3
      },
      name: 'node-container'
    })

    cfg.__nodeHeight = group.getBBox().height
    return nodeContainer
  },
  // 创建标题
  createNodeTitle(cfg, group) {
    const config = getNodeConfig(cfg)
    const titleGroup = group.addGroup({ name: 'node-title-group' })
    // 弄一个固定高度的底层
    titleGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fill: 'transparent',
      },
    })
    // icon
    const iconBoxTextMap = {
      'host': '需',
      'main': '任',
      'sub': '任'
    }
    const iconBox = this.createNodeTextBox({
      x: NODE_PADDING[3],
      y: 13,
      text: iconBoxTextMap[cfg.__cardType],
      fontSize: 12,
      fontColor: config.titleIconFontColor,
      fill: config.titleIconBackgroundColor,
      padding: [4, 4, 4, 4],
      group: titleGroup
    })
    // title
    titleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + iconBox.getBBox().width + 8,
        y: 17,
        text: cfg.no,
        fontSize: 12,
        textAlign: 'left',
        textBaseline: 'top',
        fill: 'rgba(133, 129, 139)'
      },
      name: 'node-title',
    })
    // 展开、收起的
    const collapsedBtnGroup = titleGroup.addGroup({ name: 'node-collapsed-btn-group' })
    const btnText = cfg.collapsed ? '+' : '-'
    const btnTextBoxWidth = 14
    const btnTextBoxHeight = 14
    const showTextFontSize = 12
    let showText
    if (cfg.collapsed) {
      if (cfg.children.length) {
        showText = '展开所有'
      } else {
        showText = '展开'
      }
    } else {
      if (cfg.children.length) {
        showText = '收起所有'
      } else {
        showText = '收起'
      }
    }
    const showTextWidth = Util.getTextSize(showText, showTextFontSize)[0]
    collapsedBtnGroup.addShape('rect', {
      attrs: {
        x: NODE_WIDTH - NODE_PADDING[1] / 2 - showTextWidth - btnTextBoxWidth - 6,
        y: 14,
        width: btnTextBoxWidth,
        height: btnTextBoxHeight,
        fill: '#FFFFFF',
        lineWidth: 1,
        stroke: '#AAAAAA',
        radius: 2,
        cursor: 'pointer'
      },
      name: 'node-collapsed-btn-box'
    })
    collapsedBtnGroup.addShape('text', {
      attrs: {
        x: NODE_WIDTH - NODE_PADDING[1] / 2 - showTextWidth - btnTextBoxWidth + 1,
        y: 15,
        text: btnText,
        fontSize: 14,
        textAlign: 'center',
        textBaseline: 'top',
        fill: '#AAAAAA',
        cursor: 'pointer'
      },
      name: 'node-collapsed-btn-text'
    })
    collapsedBtnGroup.addShape('text', {
      attrs: {
        x: NODE_WIDTH - NODE_PADDING[1] / 2 - showTextWidth,
        y: 16,
        text: showText,
        fontSize: showTextFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: '#AAAAAA',
        cursor: 'pointer'
      },
      name: 'node-collapsed-btn-show-text'
    })
    cfg.__nodeHeight = group.getBBox().height
  },
  // 创建标题下方区域
  createNodeSubTitle(cfg, group) {
    let tempX
    let tempY
    const config = getNodeConfig(cfg)
    const subTitleGroup = group.addGroup({ name: 'node-sub-title-group' })
    // 顶部线
    subTitleGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: group.getBBox().height,
        width: NODE_WIDTH,
        height: 1,
        fill: '#D6D9E0'
      }
    })
    // 子标题
    const subTitleFontSize = 14
    const textArr = getStringLineArr(cfg.title, NODE_WIDTH - NODE_PADDING[1] - NODE_PADDING[3], subTitleFontSize)
    const processText = textArr.join('\n')
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3],
        y: group.getBBox().height + NODE_PADDING[0],
        text: processText,
        fontSize: subTitleFontSize,
        lineHeight: 18,
        textAlign: 'left',
        textBaseline: 'top',
        fill: '#333333',
      },
      name: 'node-sub-title'
    })
    tempY = group.getBBox().height + 6
    // 普通
    const iconTextFontSize = 12
    const iconBox = this.createNodeTextBox({
      x: NODE_PADDING[3],
      y: tempY,
      text: '普通',
      fontSize: iconTextFontSize,
      fill: 'rgba(252, 252, 254)',
      padding: [4, 4, 4, 4],
      stroke: 'rgba(235, 235, 235)',
      border: 1,
      group: subTitleGroup
    })
    // 主办/协办
    const taskTypeText = cfg.__cardType === 'main' ? '主办' : cfg.__cardType === 'sub' ? '协办' : ''
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + iconBox.getBBox().width + 8,
        y: tempY + (iconBox.getBBox().height / 2) - (Util.getTextSize(taskTypeText, iconTextFontSize)[1] / 2),
        text: taskTypeText,
        fontSize: iconTextFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: config.taskTypeFontColor
      }
    })
    // 展开按钮group
    const expandBtnGroup = subTitleGroup.addGroup({ name: 'node-expand-btn-group' })
    const btnText = cfg.__isShowDetails ? '-' : '+'
    const btnTextBoxWidth = 14
    const btnTextBoxHeight = 14
    expandBtnGroup.addShape('rect', {
      attrs: {
        x: NODE_WIDTH - btnTextBoxWidth - 14,
        y: tempY + 2,
        width: btnTextBoxWidth,
        height: btnTextBoxHeight,
        fill: '#FFFFFF',
        lineWidth: 1,
        stroke: '#DDDDDD',
        radius: 2,
        cursor: 'pointer'
      },
      name: 'node-expand-btn-box'
    })
    expandBtnGroup.addShape('text', {
      attrs: {
        x: NODE_WIDTH - btnTextBoxWidth - 14 + btnTextBoxWidth / 2,
        y: tempY + 3,
        text: btnText,
        fontSize: 14,
        textAlign: 'center',
        textBaseline: 'top',
        fill: '#333333',
        cursor: 'pointer'
      },
      name: 'node-expand-btn-text'
    })
    // 增加一个底部的padding
    subTitleGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: group.getBBox().height,
        width: NODE_WIDTH,
        height: NODE_PADDING[2]
      }
    })
    cfg.__nodeHeight = group.getBBox().height
  },
  // 创建详情动态字段
  createNodeExpandDetail(cfg, group) {
    const expandDetailGroup = group.addGroup({ name: 'node-expand-detail-group' })
    // 顶部线
    expandDetailGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: group.getBBox().height,
        width: NODE_WIDTH,
        height: 1,
        fill: '#D6D9E0'
      }
    })
    // 顶部padding
    expandDetailGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: group.getBBox().height,
        width: NODE_WIDTH,
        height: NODE_PADDING[2]
      }
    })
    const hostInfoArr = [
      {
        key: 'application',
        label: '主办应用'
      },
      {
        key: 'productManager',
        label: '产品经理'
      },
      {
        key: 'demandAnalyst',
        label: '需求分析师'
      },
      {
        key: 'status',
        label: '需求状态'
      }
    ]
    const childInfoArr = [
      {
        key: 'application',
        label: '实施应用'
      },
      {
        key: 'productManager',
        label: '产品经理'
      },
      {
        key: 'projectManager',
        label: '项目经理'
      },
      {
        key: 'demandAnalyst',
        label: '需求分析师'
      },
      {
        key: 'developer',
        label: '开发责任人'
      },
      {
        key: 'status',
        label: '纳版状态'
      }
    ]
    const handleRenderRow = (arr) => {
      const rowTextLineHeight = 18
      const rowTextFontSize = 12
      // 初始y在标题下方
      let sumY = group.getBBox().height
      for (const item of arr) {
        const text = `${item.label}：${cfg[item.key]}`
        const textArr = getStringLineArr(text, NODE_WIDTH - NODE_PADDING[1] - NODE_PADDING[3], rowTextFontSize)
        const processText = textArr.join('\n')
        const textHeight = textArr.length * rowTextLineHeight
        expandDetailGroup.addShape('text', {
          attrs: {
            text: processText,
            x: NODE_PADDING[3],
            y: sumY,
            fontSize: rowTextFontSize,
            lineHeight: rowTextLineHeight,
            textAlign: 'left',
            textBaseline: 'top',
            fill: '#333333'
          },
          name: 'node-expand-row-text',
        })
        sumY += textHeight
      }
      // 增加一个底部的padding
      const paddingHeight = NODE_PADDING[2] - (rowTextLineHeight - rowTextFontSize)
      expandDetailGroup.addShape('rect', {
        attrs: {
          x: 0,
          y: sumY,
          width: NODE_WIDTH,
          height: paddingHeight
        }
      })
    }
    if (cfg.__cardType === 'host') {
      handleRenderRow(hostInfoArr)
    } else {
      handleRenderRow(childInfoArr)
    }
    cfg.__nodeHeight = group.getBBox().height
  },
  // 适应当前node的渲染高度
  fitSingleContainerHeight(cfg, group) {
    const nodeContainer = group.find(e => e.cfg.name === 'node-container')
    const nodeTitleGroup = group.find(e => e.cfg.name === 'node-title-group')
    const nodeSubTitleGroup = group.find(e => e.cfg.name === 'node-sub-title-group')
    const nodeExpandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
    let height = 0
    if (nodeTitleGroup) {
      height = nodeTitleGroup.getBBox().maxY
    }
    if (nodeSubTitleGroup) {
      height = nodeSubTitleGroup.getBBox().maxY
    }
    if (nodeExpandDetailGroup) {
      height = nodeExpandDetailGroup.getBBox().maxY
    }
    cfg.__nodeHeight = height
    nodeContainer.attr('height', height)
  },
  // 适应所有node的渲染高度，必须在update执行，getNodes行为是异步操作
  fitAllContainerHeight() {
    const graph = treeGraphInstance.instance
    const allGroup = graph.getNodes()
    allGroup.forEach((node) => {
      const group = node.getContainer()
      const model = node.getModel()
      const nodeContainer = group.find(e => e.cfg.name === 'node-container')
      const nodeTitleGroup = group.find(e => e.cfg.name === 'node-title-group')
      const nodeSubTitleGroup = group.find(e => e.cfg.name === 'node-sub-title-group')
      const nodeExpandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
      let height = 0
      if (nodeTitleGroup) {
        height = nodeTitleGroup.getBBox().maxY
      }
      if (nodeSubTitleGroup) {
        height = nodeSubTitleGroup.getBBox().maxY
      }
      if (nodeExpandDetailGroup) {
        height = nodeExpandDetailGroup.getBBox().maxY
      }
      model.__nodeHeight = height
      nodeContainer.attr('height', height)
    })
  },
  _getAllCfgList() {
    const graph = treeGraphInstance.instance
    const data = graph.cfg.data
    let allCfgList = []
    const traverse = (data) => {
      const fn = (node, level) => {
        allCfgList.push(node)
        if (node.children.length > 0) {
          node.children.forEach((item) => {
            fn(item)
          })
        }
      }
      fn(data)
    }
    traverse(data)

    return allCfgList
  },
  _getExistCfgList() {
    // 对遍历顺序有强要求，千万不要用graph.findAll()或graph.getNodes()拿节点集合去遍历，否则一旦进行过collapsed
    // 被collapsed那一方就会被push到最底层，导致顺序错乱，需要用原数据进行递归遍历
    const graph = treeGraphInstance.instance
    const data = graph.cfg.data
    let existCfgList = []
    const traverse = (data) => {
      const fn = (node, level) => {
        existCfgList.push(node)
        if (node.children.length > 0) {
          node.children.forEach((item) => {
            fn(item)
          })
        }
      }
      fn(data)
    }
    traverse(data)

    const nodes = graph.getNodes()
    const existNodeIds = []
    nodes.forEach(node => {
      existNodeIds.push(node.getModel().id)
    })
    existCfgList = existCfgList.filter(item => {
      return existNodeIds.includes(item.id)
    })

    return existCfgList
  },
  // 位于该节点的下方的所有节点的y坐标进行移动
  fitCurrentLevelPosition(cfg) {
    const graph = treeGraphInstance.instance
    setTimeout(() => {
      const existCfgList = this._getExistCfgList()
      // 修复当前level的position
      const sameLevelCfgList = existCfgList.filter(item => item.__level === cfg.__level)
      const currentIndex = sameLevelCfgList.findIndex(item => item.id === cfg.id)
      const belowCurrentCfgList = sameLevelCfgList.slice(currentIndex + 1)
      const diff = cfg.__nodeHeight - cfg.__tempNodeHeight
      for (let i = 0; i < belowCurrentCfgList.length; i++) {
        const node = belowCurrentCfgList[i]
        if (i === 0) {
          // 由于有些node进行过collapsed操作，layout之后的坐标已经是正常的了，就无必要进行坐标位移操作
          if (node.y - (cfg.y + cfg.__nodeHeight) === NODE_V_GAP) {
            break
          }
        }
        graph.updateItem(node.id, {
          y: node.y + diff
        })
      }
      cfg.__tempNodeHeight = cfg.__nodeHeight
    }, 20)
  },
  // 创建带有文字的rect
  createNodeTextBox({
    x = 0,
    y = 0,
    text = '',
    fontSize = 12,
    fontColor = '#333333',
    fill = '#FFFFFF',
    radius = 2,
    padding = [0, 0, 0, 0, ],
    stroke = null,
    border = 0,
    group
  }) {
    if (!group) {
      return
    }
    const fontWidth = Util.getTextSize(text, fontSize)[0]
    const fontHeight = Util.getTextSize(text, fontSize)[1]
    const boxWidth = fontWidth + padding[1] + padding[3]
    const boxHeight = fontHeight + padding[0] + padding[2]
    const boxGroup = group.addGroup({ name: `node-text-box-group-${Math.random()}` })
    boxGroup.addShape('rect', {
      attrs: {
        x,
        y,
        width: boxWidth,
        height: boxHeight,
        fill,
        radius,
        stroke,
        lineWidth: border
      }
    })
    boxGroup.addShape('text', {
      attrs: {
        x: x + (boxWidth / 2) - (fontWidth / 2),
        y: y + (boxHeight / 2) - (fontHeight / 2) + 1,
        text,
        fontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: fontColor
      }
    })
    return boxGroup
  }
}

registerNode(
  TREE_GRAPH_CARD_CARD_NAME, {
    draw(cfg, group) {
      const nodeContainer = nodeBasicMethod.createNodeBox(cfg, group)
      nodeBasicMethod.createNodeTitle(cfg, group)
      if (!cfg.collapsed) {
        nodeBasicMethod.createNodeSubTitle(cfg, group)
        if (cfg.__isShowDetails) {
          nodeBasicMethod.createNodeExpandDetail(cfg, group)
        }
      }
      nodeBasicMethod.fitSingleContainerHeight(cfg, group)

      return nodeContainer
    },
    update(cfg, item) {
      const group = item.getContainer()
      if (cfg.__eventDetailsFlag) {
        // 要限制update的时机，不然layout会导致update执行两次
        cfg.__eventDetailsFlag = false
        cfg.__tempNodeHeight = cfg.__nodeHeight
        const nodeExpandBtnText = group.find(e => e.cfg.name === 'node-expand-btn-text')
        if (cfg.__isShowDetails) {
          nodeExpandBtnText.attr('text', '-')
          nodeBasicMethod.createNodeExpandDetail(cfg, group)
          nodeBasicMethod.fitAllContainerHeight()
          nodeBasicMethod.fitCurrentLevelPosition(cfg)
        } else {
          nodeExpandBtnText.attr('text', '+')
          const nodeExpandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
          group.removeChild(nodeExpandDetailGroup)
          nodeBasicMethod.fitAllContainerHeight()
          nodeBasicMethod.fitCurrentLevelPosition(cfg)
        }
      }
      if (cfg.__eventCollapsedFlag) {
        // 要限制update的时机，不然layout会导致update执行两次
        cfg.__eventCollapsedFlag = false
        cfg.__tempNodeHeight = cfg.__nodeHeight
        const nodeCollapsedBtnText = group.find(e => e.cfg.name === 'node-collapsed-btn-text')
        const nodeCollapsedBtnShowText = group.find(e => e.cfg.name === 'node-collapsed-btn-show-text')
        if (cfg.collapsed) {
          let showText
          if (cfg.children.length) {
            showText = '展开所有'
          } else {
            showText = '展开'
          }
          nodeCollapsedBtnText.attr('text', '+')
          nodeCollapsedBtnShowText.attr('text', showText)
          const nodeSubTitleGroup = group.find(e => e.cfg.name === 'node-sub-title-group')
          const nodeExpandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
          group.removeChild(nodeSubTitleGroup)
          group.removeChild(nodeExpandDetailGroup)
          cfg.__isShowDetails = false
          nodeBasicMethod.fitAllContainerHeight()
          nodeBasicMethod.fitCurrentLevelPosition(cfg)
        } else {
          let showText
          if (cfg.children.length) {
            showText = '收起所有'
          } else {
            showText = '收起'
          }
          nodeCollapsedBtnText.attr('text', '-')
          nodeCollapsedBtnShowText.attr('text', showText)
          nodeBasicMethod.createNodeSubTitle(cfg, group)
          nodeBasicMethod.fitAllContainerHeight()
          nodeBasicMethod.fitCurrentLevelPosition(cfg)
        }
      }
    },
  },
  'single-node'
)

export {
  TREE_GRAPH_CARD_CARD_NAME
}
