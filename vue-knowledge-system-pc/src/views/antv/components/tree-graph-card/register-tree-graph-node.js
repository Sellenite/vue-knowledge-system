import { registerNode, Util } from '@antv/g6'

const TREE_GRAPH_CARD_CARD_NAME = 'tree-graph-card-node'

const NODE_WIDTH = 244
const NODE_HEIGHT = 46 // 高度给一个默认的初始高度，之后节点高度会有变化
const NODE_TITLE_BOX_HEIGHT = 46
const NODE_PADDING = [18, 18, 18, 18]

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

  const config = {
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
  createNodeBox(group) {
    // 最外面的大矩形
    const nodeContainer = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fill: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 8,
        radius: 3
      },
      name: 'node-container'
    })

    return nodeContainer
  },
  // 创建标题
  createNodeTitle(cfg, group) {
    const config = getNodeConfig(cfg)
    const titleGroup = group.addGroup({ name: 'node-title-group' })
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
      }
    })
    // 底部线
    titleGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: NODE_TITLE_BOX_HEIGHT - 1,
        width: NODE_WIDTH,
        height: 1,
        fill: '#D6D9E0'
      }
    })
  },
  // 创建标题下方区域
  createNodeSubTitle(cfg, group) {
    let tempX
    let tempY
    const config = getNodeConfig(cfg)
    const subTitleGroup = group.addGroup({ name: 'node-sub-title-group' })
    const subTitleFontSize = 14
    // 子标题
    const textArr = getStringLineArr(cfg.title, NODE_WIDTH - NODE_PADDING[1] - NODE_PADDING[3], subTitleFontSize)
    const processText = textArr.join('\n')
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3],
        y: NODE_TITLE_BOX_HEIGHT + NODE_PADDING[0],
        text: processText,
        fontSize: subTitleFontSize,
        lineHeight: 18,
        textAlign: 'left',
        textBaseline: 'top',
        fill: '#333333',
      }
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
    const expandBtnGroup = group.addGroup({ name: 'node-expand-btn-group' })
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

  },
  // 创建详情动态字段
  createNodeExpandDetail(cfg, group) {
    const expandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
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
          }
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
      // 记录扩展的高度，便于在graph里进行y坐标位移
      cfg.__expandDetailGroupHeight = expandDetailGroup.getBBox().height
    }
    if (cfg.__cardType === 'host') {
      handleRenderRow(hostInfoArr)
    } else {
      handleRenderRow(childInfoArr)
    }
  },
  // 创建先去动态字段后导致节点变高，要重新渲染容器的高度样式
  fitContainerHeight(cfg, group, type) {
    const nodeContainer = group.find(e => e.cfg.name === 'node-container')
    if (type === 'expand') {
      const nodeHeight = group.getBBox().height
      nodeContainer.attr('height', nodeHeight)
    } else {
      const nodeHeight = group.getBBox().height - cfg.__expandDetailGroupHeight
      nodeContainer.attr('height', nodeHeight)
    }
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
      const nodeContainer = nodeBasicMethod.createNodeBox(group)
      nodeBasicMethod.createNodeTitle(cfg, group)
      nodeBasicMethod.createNodeSubTitle(cfg, group)
      const expandDetailGroup = group.addGroup({ name: 'node-expand-detail-group' })
      // 创建记录扩展高度后再删除
      nodeBasicMethod.createNodeExpandDetail(cfg, group)
      if (!cfg.__isShowDetails) {
        expandDetailGroup.clear()
      }
      nodeBasicMethod.fitContainerHeight(cfg, group, 'expand')

      return nodeContainer
    },
    update(cfg, item) {
      const group = item.getContainer()
      const model = item.getModel()
      const expandBtnText = group.find(e => e.cfg.name === 'node-expand-btn-text')
      const expandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')

      expandBtnText.attr('text', cfg.__isShowDetails ? '-' : '+')
      if (cfg.__isShowDetails) {
        nodeBasicMethod.createNodeExpandDetail(cfg, group)
        nodeBasicMethod.fitContainerHeight(model, group, 'expand')
      } else {
        expandDetailGroup.clear()
        nodeBasicMethod.fitContainerHeight(model, group, 'collapsed')
      }
    }
  },
  'single-node'
)

export {
  TREE_GRAPH_CARD_CARD_NAME
}
