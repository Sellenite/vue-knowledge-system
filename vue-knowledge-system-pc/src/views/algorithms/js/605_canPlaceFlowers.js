/**
 * 假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死去。
 * 给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数n。能否在不打破种植规则的情况下种入n朵花？能则返回True，不能则返回False。
 * 输入: flowerbed = [1,0,0,0,1], n = 1
 * 输出: True
 */
const canPlaceFlowers = (array, num) => {
  let max = 0;
  // length-1，结尾边界问题
  for (let i = 0; i < array.length - 1; i++) {
    // 开始边界问题
    if (array[i] === 0) {
      if (i === 0 && array[i + 1] === 0) {
        max++;
        i++;
      } else if (array[i - 1] === 0 && array[i + 1] === 0) {
        max++;
        i++;
      }
    }
  }

  return { array, maxPlaceNum: max };
}

export default canPlaceFlowers;