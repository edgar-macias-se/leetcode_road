/**
 * Coin Change (LeetCode #322)
 * Pattern: Unbounded Knapsack
 * Difficulty: Medium
 */

function coinChange(coins: number[], amount: number): number {
    const dp: number[] = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin > i) continue;

            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

export { coinChange };