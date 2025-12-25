function combinations(n: number, k: number): number[][] {
    let combs: number[][] = [];

    function helper(i: number, curComb: number[]): void {
        if (curComb.length === k) {
            combs.push([...curComb]);
            return;
        }

        if (i > n) return;

        for (let j = i; j <= n; j++) {
            curComb.push(j);
            helper(j + 1, curComb);
            curComb.pop();
        }
    }

    helper(1, []);
    return combs;
}