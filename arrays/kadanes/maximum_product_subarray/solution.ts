function maxProduct(nums: number[]): number {
    let maxProduct: number = -Infinity;
    let currMax: number = 1;
    let currMin: number = 1;

    for (const n of nums) {
        let maxTemp = currMax;
        currMax = Math.max(n, n * maxTemp, n * currMin);
        currMin = Math.min(n, n * maxTemp, n * currMin);

        maxProduct = Math.max(maxProduct, currMax)
    }

    return maxProduct;
};