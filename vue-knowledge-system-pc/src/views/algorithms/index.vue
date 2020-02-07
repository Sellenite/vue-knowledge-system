<template>
  <div class="algorithms-page">
    <p>557_reverseWords: {{ reverseWords("Let's take LeetCode contest") }}</p>
    <p>696_countBinarySubstrings: {{ countBinarySubstrings("10101") }}</p>
    <p>17_letterCombinations: {{ letterCombinations("234") }}</p>
    <p>914_hasGroupsSizeX: {{ hasGroupsSizeX([1, 2, 3, 4, 4, 3, 2, 1]) }}</p>
    <p>605_canPlaceFlowers: {{ canPlaceFlowers([1,0,0,0,1]) }}</p>
  </div>
</template>

<script>
import reverseWords from './js/557_reverseWords.js';
import countBinarySubstrings from './js/696_countBinarySubstrings.js';
import letterCombinations from './js/17_letterCombinations.js';
import hasGroupsSizeX from './js/914_hasGroupsSizeX.js';
import canPlaceFlowers from './js/605_canPlaceFlowers.js';

export default {
  name: 'Algorithms',
  data() {
    return {
    }
  },
  methods: {
    /**
     * 反转字符串中的单词 III
     * 考察数组的基本用法
     */
    reverseWords(string) {
      return reverseWords(string);
    },
    /**
     * 计数二进制子串
     * 考察找规律和正则的运用
     */
    countBinarySubstrings(string) {
      return countBinarySubstrings(string);
    },
    /**
     * 电话号码的字母组合
     * 考察多项进行组合运算
     */
    letterCombinations(string) {
      return letterCombinations(string);
    },
    /**
     * 卡牌分组
     * 考察最大公约数，多个值如何取公约数
     */
    hasGroupsSizeX(array) {
      return hasGroupsSizeX(array);
    },
    canPlaceFlowers(array, num) {
      return canPlaceFlowers(array, num);
    }
  }
}
</script>
<style>
</style>