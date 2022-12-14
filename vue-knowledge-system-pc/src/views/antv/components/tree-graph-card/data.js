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

const treeData = {
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

export { treeData }
