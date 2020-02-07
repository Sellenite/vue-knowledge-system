/**
 * 给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
 * 输入: "Let's take LeetCode contest"
 * 输出: "s'teL ekat edoCteeL tsetnoc"
 */
const reverseWords = (string) => {
  const arr = string.split(' ');
  return arr.map(item => {
    return item.split('').reverse().join('');
  }).join(' ');
};

export default reverseWords;