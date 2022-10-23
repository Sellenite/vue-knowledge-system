import { registerNode, Util } from '@antv/g6'

const TREE_GRAPH_CARD_CARD_NAME = 'tree-graph-card-node'

const NODE_WIDTH = 244
const NODE_HEIGHT = 122 // 高度给一个默认的初始高度，之后节点高度会有变化
const NODE_TITLE_BOX_HEIGHT = 46
const NODE_PADDING = [18, 18, 18, 18]

// 返回当前节点需要配置的颜色等配置
const getNodeConfig = (cfg) => {
  let titleIconBackgroundColor, titleIconFontColor, taskTypeFontColor
  if (cfg.cardType === 'host') {
    titleIconBackgroundColor = 'rgba(235, 247, 255)'
    titleIconFontColor = 'rgba(41, 167, 255)'
  } else {
    titleIconBackgroundColor = 'rgba(250, 244, 238)'
    titleIconFontColor = 'rgba(255, 142, 0)'
    if (cfg.cardType === 'main') {
      taskTypeFontColor = 'red'
    } else if (cfg.cardType === 'sub') {
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
  str = str.replace(/\n/gi, '')
  // 单个字体考虑加上字号+边距
  const actualLength = Math.floor(maxWidth / (fontSize + 2))
  let width = Util.getTextSize(str, fontSize)[0]
  const strArr = []
  while (width > 0) {
    const substr = str.substring(0, actualLength)
    strArr.push(substr)
    str = str.substring(actualLength)
    width = Util.getTextSize(str, fontSize)[0]
  }

  return strArr
}

// 渲染节点方法集合
const nodeBasicMethod = {
  // 创建外层最大容器作为keyShape
  createNodeBox: (group) => {
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
  createNodeTitle: (cfg, group) => {
    const config = getNodeConfig(cfg)
    const titleGroup = group.addGroup({ name: 'node-title-group' })
    const titleFontSize = 12
    const titleIconWidth = 22
    const titleIconHeight = titleIconWidth
    const titleIconMarginRight = 8
    // icon框
    titleGroup.addShape('rect', {
      attrs: {
        x: NODE_PADDING[3],
        y: (NODE_TITLE_BOX_HEIGHT / 2) - (titleIconHeight / 2),
        width: titleIconWidth,
        height: titleIconHeight,
        fill: config.titleIconBackgroundColor,
        radius: 2
      }
    })
    // icon文字
    titleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + (titleIconWidth / 2) - (titleFontSize / 2),
        y: (NODE_TITLE_BOX_HEIGHT / 2) - (titleIconHeight / 2) + (titleFontSize / 2),
        text: cfg.cardType === 'host' ? '需' : '认',
        fontSize: titleFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: config.titleIconFontColor
      }
    })
    // title
    titleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + titleIconWidth + titleIconMarginRight,
        y: (NODE_TITLE_BOX_HEIGHT / 2) - (titleFontSize / 2),
        text: cfg.no,
        fontSize: titleFontSize,
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
  createNodeSubTitle: (cfg, group) => {
    const config = getNodeConfig(cfg)
    const subTitleGroup = group.addGroup({ name: 'node-sub-title-group' })
    const subTitleFontSize = 14
    const subTitleMarginBottom = 14
    const iconText = '普通'
    const iconTextFontSize = 12
    const iconTextSizeArr = Util.getTextSize(iconText, iconTextFontSize)
    const iconTextBoxWidth = iconTextSizeArr[0] + 10
    const iconTextBoxHeight = iconTextSizeArr[1] + 6
    const iconTextBoxMarginRight = 8
    // 子标题
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3],
        y: NODE_TITLE_BOX_HEIGHT + NODE_PADDING[0],
        text: cfg.title,
        fontSize: subTitleFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: '#333333'
      }
    })
    // icon框
    subTitleGroup.addShape('rect', {
      attrs: {
        x: NODE_PADDING[3],
        y: NODE_TITLE_BOX_HEIGHT + NODE_PADDING[0] + subTitleFontSize + subTitleMarginBottom,
        width: iconTextBoxWidth,
        height: iconTextBoxHeight,
        fill: 'rgba(252, 252, 254)',
        stroke: 'rgba(235, 235, 235)',
        radius: 2
      }
    })
    // icon文字
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + (iconTextBoxWidth / 2) - (iconTextSizeArr[0] / 2),
        y: NODE_TITLE_BOX_HEIGHT + NODE_PADDING[0] + subTitleFontSize + subTitleMarginBottom + (iconTextBoxHeight / 2) - (iconTextSizeArr[1] / 2) + 1,
        text: iconText,
        fontSize: iconTextFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: '#333333'
      }
    })
    // 主办/协办
    subTitleGroup.addShape('text', {
      attrs: {
        x: NODE_PADDING[3] + iconTextBoxWidth + iconTextBoxMarginRight,
        y: NODE_TITLE_BOX_HEIGHT + NODE_PADDING[0] + subTitleFontSize + subTitleMarginBottom + (iconTextBoxHeight / 2) - (iconTextSizeArr[1] / 2) + 1,
        text: cfg.cardType === 'main' ? '主办' : cfg.cardType === 'sub' ? '协办' : '',
        fontSize: iconTextFontSize,
        textAlign: 'left',
        textBaseline: 'top',
        fill: config.taskTypeFontColor
      }
    })
    // 展开按钮group
    const expandBtnGroup = group.addGroup({ name: 'node-expand-btn-group' })
    const btnText = cfg.isShowDetails ? '-' : '+'
    const btnTextBoxWidth = 14
    const btnTextBoxHeight = 14
    expandBtnGroup.addShape('rect', {
      attrs: {
        x: NODE_WIDTH - btnTextBoxWidth - 14,
        y: NODE_HEIGHT - btnTextBoxHeight - 14,
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
        y: NODE_HEIGHT - btnTextBoxHeight - 14 + 1,
        text: btnText,
        textAlign: 'center',
        textBaseline: 'top',
        fill: '#333333',
        cursor: 'pointer'
      },
      name: 'node-expand-btn-text'
    })
  },
  // 创建详情动态字段
  createNodeExpandDetail: (cfg, group) => {
    const expandDetailGroup = group.find(e => e.cfg.name === 'node-expand-detail-group')
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
      let sumY = NODE_HEIGHT
      for (const item of arr) {
        const text = `${item.label}：${cfg[item.key]}`
        const textArr = getStringLineArr(text, NODE_WIDTH, rowTextFontSize)
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
    if (cfg.cardType === 'host') {
      handleRenderRow(hostInfoArr)
    } else {
      handleRenderRow(childInfoArr)
    }
  },
  // 创建先去动态字段后导致节点变高，要重新渲染容器的高度样式
  fitContainerHeight: (cfg, group, type) => {
    const nodeContainer = group.find(e => e.cfg.name === 'node-container')
    if (type === 'expand') {
      const nodeHeight = group.getBBox().height
      nodeContainer.attr('height', nodeHeight)
    } else {
      const nodeHeight = group.getBBox().height - cfg.__expandDetailGroupHeight
      nodeContainer.attr('height', nodeHeight)
    }
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
      if (!cfg.isShowDetails) {
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

      expandBtnText.attr('text', cfg.isShowDetails ? '-' : '+')
      if (cfg.isShowDetails) {
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
