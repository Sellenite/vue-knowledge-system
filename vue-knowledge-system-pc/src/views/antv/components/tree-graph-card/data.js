const getChildObj = ({ type, no }) => {
  return {
    cardType: type,
    no: no,
    title: 'xq202210231001_测试超长需求测试超长需求测试超长需求',
    productManager: '王语嫣',
    demandAnalyst: '梁珍',
    projectManager: '林庆栋',
    developer: 'yuuhei',
    status: '已发正式库',
    application: 'GIS地理平台GIS地理平台GIS地理平台GIS地理平台GIS地理平台',
  }
}

const getHostObj = () => {
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
  ...getHostObj(),
  children: [
    {
      ...getChildObj({ type: 'main', no: 'xq20220329001803' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001804' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001805' })
        }
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329001806' })
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329001807' })
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329001808' })
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329001809' })
    }
  ]
}

export { treeData }
