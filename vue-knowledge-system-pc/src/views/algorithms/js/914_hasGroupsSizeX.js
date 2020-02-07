import _ from 'lodash';

/**
 * 求最大公约数（辗转相除法，欧几里得算法）
 * @param  {number}   a
 * @param  {number}   b
 * @return {number}   返回最大公约数
 */
const gcd = (a, b) => {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

/**
 * 此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：
 * 每组都有 X 张牌。
 * 组内所有的牌上都写着相同的整数。
 * 仅当你可选的 X >= 2 时返回 true。
 * 输入：[1,2,3,4,4,3,2,1]
 * 输出：true
 * 解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]
 */
const hasGroupsSizeX = (array) => {
  const str = array.sort().join('');
  // 涉及正则\1+，\1表示第一个group,即(...)\1+表示前面的group重复1到多次
  const group = str.match(/(\d)\1+|\d/g);
  const group_copy = _.cloneDeep(group);
  while (group.length > 1) {
    const a = group.shift().length;
    const b = group.shift().length;
    const gcdNumber = gcd(a, b);
    // 最大公约数是1，即没有最大公约数，返回false
    if (gcdNumber === 1) {
      return { group: group_copy, result: false };
    } else {
      group.unshift('0'.repeat(gcdNumber));
    }
  }
  // 全部已经比较完毕
  const result = group.length ? group[0].length > 1 : false;
  return { group: group_copy, result };
}

export default hasGroupsSizeX;