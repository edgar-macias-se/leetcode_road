function maxProfit(prices: number[]): number {
    let buy = prices[0];
    let profit = 0;

    for (const price of prices) {
        buy = Math.min(price, buy);
        profit = Math.max(profit, price - buy);
    }

    return profit;
}