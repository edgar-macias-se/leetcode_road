function canPartition(nums: number[]): boolean {
    const totalSum = nums.reduce((a, b) => a + b, 0);

    // Si suma impar, imposible dividir
    if (totalSum % 2 !== 0) return false;

    const target = totalSum / 2;
    const n = nums.length;

    // dp[i][s] = ¿puedo hacer suma s con primeros i números?
    const dp: boolean[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(target + 1).fill(false));

    // Base case: suma 0 siempre posible (subset vacío)
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }

    // Llenar tabla
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];

        for (let s = 0; s <= target; s++) {
            // Opción 1: NO usar este número
            dp[i][s] = dp[i - 1][s];

            // Opción 2: SÍ usar este número (si cabe)
            if (num <= s) {
                const resto = s - num;
                if (dp[i - 1][resto]) {
                    dp[i][s] = true;
                }
            }
        }
    }

    return dp[n][target];
}