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
      ...getChildObj({ type: 'main', no: 'xq20220329001000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329001009' })
        },
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329002000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329002009' })
        },
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329003000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329003009' })
        },
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329004000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329004009' })
        },
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329005000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329005009' })
        },
      ]
    },
    {
      ...getChildObj({ type: 'main', no: 'xq20220329006000' }),
      children: [
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006001' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006002' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006003' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006004' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006005' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006006' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006007' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006008' })
        },
        {
          ...getChildObj({ type: 'sub', no: 'xq20220329006009' })
        },
      ]
    },
  ]
}

export { treeData }
