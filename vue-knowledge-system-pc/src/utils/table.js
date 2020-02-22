/**
 * ElementUI Table 垂直方向的数据合并通用方法
 * @param  {Array} data  table的传入的数组
 * @param  {Array} merge 需要合并的key值
 * @return {Array}       返回新的数据数组
 * 
 * 该函数需要配合以下函数传给table的span-method
 * <el-table :data="table" :span-method="objectSpanMethod">
 * objectSpanMethod({ row, column, rowIndex, columnIndex }) {
 *   const span = column.property + '-span'
 *   if (row[span]) {
 *     return row[span]
 *   }
 * }
 */
const mergeTableVerticalRow = (data, merge) => {
  if (!merge || merge.length === 0) {
    return data
  }
  merge.forEach((key) => {
    const mList = {}
    data = data.map((item, index) => {
      // 用值去做key
      const rowVal = item[key]
      // 与上一行或上几行相同值，需要进行合并操作
      if (mList[rowVal] && mList[rowVal].newIndex === index) {
        mList[rowVal].num++ // 没什么用，只是记录连续多少个值进行合并
        mList[rowVal].newIndex++ // 将标记往下一行移
        data[mList[rowVal].index][key + '-span'].rowspan++ // 上一行或上几行的rowspan进行+1，合并当前行
        item[key + '-span'] = {
          rowspan: 0,
          colspan: 0
        } // 合并当前行后，该行必须返回[0, 0]，意思是将该行隐藏掉
      } else {
        mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
        item[key + '-span'] = {
          rowspan: 1,
          colspan: 1
        } // 返回[1, 1]的意思就是不进行合并操作
      }
      return item
    })
  })
  return data
};

export { mergeTableVerticalRow };