function maxSubarraySumCircular(nums: number[]): number {

    let totalSum = 0, maxSum = nums[0], curMax = 0, minSum = nums[0], curMin = 0;

    for (let num of nums) {
        curMax = Math.max(curMax + num, num)
        maxSum = Math.max(curMax, maxSum)
        curMin = Math.min(curMin + num, num)
        minSum = Math.min(curMin, minSum)
        totalSum += num
    }

    return maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum
};