function change(amount: number, coins: number[]): number {
    const dp: number[] = Array(amount + 1).fill(0);
    dp[0] = 1;

    // CRITICAL: Loop by COINS first
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }

    return dp[amount];
}

export { change };