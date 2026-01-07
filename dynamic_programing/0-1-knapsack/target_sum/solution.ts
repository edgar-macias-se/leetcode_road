/**
 * Target Sum (LeetCode #494)
 * Pattern: 0/1 Knapsack
 * Difficulty: Medium
 */

function findTargetSumWays(nums: number[], target: number): number {
    const sum = nums.reduce((a, b) => a + b, 0);

    if (Math.abs(target) > sum) return 0;
    if ((target + sum) % 2 !== 0) return 0;

    const newTarget = (target + sum) / 2;
    if (newTarget < 0) return 0;

    const n = nums.length;
    const dp: number[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(newTarget + 1).fill(0));

    dp[0][0] = 1;

    for (let i = 1; i <= n; i++) {
        for (let s = 0; s <= newTarget; s++) {
            if (s < nums[i - 1]) {
                dp[i][s] = dp[i - 1][s];
            } else {
                dp[i][s] = dp[i - 1][s] + dp[i - 1][s - nums[i - 1]];
            }
        }
    }

    return dp[n][newTarget];
}

export { findTargetSumWays };