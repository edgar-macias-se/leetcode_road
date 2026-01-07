function longestCommonSubsequence(text1: string, text2: string): number {
    const M = text1.length;
    const N = text2.length;

    const dp = Array(M + 1)
        .fill(0)
        .map(() => Array(N + 1).fill(0));

    for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= N; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[M][N];
}

export { longestCommonSubsequence };