/**
 * 格雷编码是一个二进制数字系统，在该系统中，两个连续的数值仅有一个位数的差异。
 * 给定一个代表编码总位数的非负整数 n，打印其格雷编码序列。格雷编码序列必须以 0 开头。
 * 输入: 2
 * 输出: [0,1,3,2]
 * 解释:
 * 00 - 0
 * 01 - 1
 * 11 - 3
 * 10 - 2
 */
const grayCode = (number) => {
  if (number === 1) {
    return ['0', '1'];
  } else {
    // 与前一个有关系，一直递归到第一个拿最初的数组
    const prev = grayCode(number - 1);
    const arr = [];
    // 排列的总数，-1是为了对应数组的index
    const max = Math.pow(2, number) - 1;
    // 对称赋值
    for (let i = 0; i < prev.length; i++) {
      arr[i] = `0${prev[i]}`;
      arr[max - i] = `1${prev[i]}`;
    }
    return arr;
  }
}

export default grayCode;