/**
 * 给定一个字符串 s，计算具有相同数量0和1的非空(连续)子字符串的数量，并且这些子字符串中的所有0和所有1都是组合在一起的。
 * 重复出现的子串要计算它们出现的次数。
 * 输入: "00110011"
 * 输出: 6
 * 解释: 有6个子串具有相同数量的连续1和0：“0011”，“01”，“1100”，“10”，“0011” 和 “01”。
 * 另外，“00110011”不是有效的子串，因为所有的0（和1）没有组合在一起。
 */

const match = (string) => {
  const start = string.match(/^(0+|1+)/)[0];
  // 异或
  const end = (start[0] ^ 1).toString().repeat(start.length);
  const regex = new RegExp(`^(${start}${end})`);
  return string.match(regex) && string.match(regex)[0];
}

const countBinarySubstrings = (string) => {
  const arr = [];
  for (let i = 0; i < string.length; i++) {
    const result = match(string.slice(i));
    if (result) {
      arr.push(result);
    }
  }

  return arr;
}

export default countBinarySubstrings;