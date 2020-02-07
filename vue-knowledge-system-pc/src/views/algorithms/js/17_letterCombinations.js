/**
 * 多个组合依次进行组合运算
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 * 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 * 输入："23"
 * 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
 */

const combine = (arr) => {
  const ret = [];
  // 组合运算
  for (let i = 0; i < arr[0].length; i++) {
    for (let j = 0; j < arr[1].length; j++) {
      ret.push(`${arr[0][i]}${arr[1][j]}`);
    }
  }
  // 重组原始数组，重要
  arr.splice(0, 2, ret);
  if (arr.length > 1) {
    combine(arr);
  } else {
    return ret;
  }
  return arr[0];
}

const letterCombinations = (string) => {
  const map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const arr = [];
  for (let i = 0; i < string.length; i++) {
    if (map[string[i]]) {
      arr.push(map[string[i]]);
    }
  }

  return combine(arr);
}

export default letterCombinations;