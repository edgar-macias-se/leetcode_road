# Problem 1: Best Time to Buy and Sell Stock (LeetCode #121)

## 🧠 Core Concept

This problem introduces the basic concept of **Single-Variable Sliding Window**: tracking an optimal value from the past (minimum buy price) while traversing the array. Though technically simpler than traditional sliding window, it establishes the pattern foundation: maintaining relevant information while advancing linearly.

## 🗺️ The Strategy

1. **Initialize:** `buy` (minimum price seen) and `profit` (maximum profit)
2. **Traverse:** For each price:
   - Update `buy` to minimum between current price and `buy`
   - Calculate potential profit: `current price - buy`
   - Update `profit` if better found
3. **Return:** Maximum profit

**Key Insight:** You only need to remember the minimum price from the past, not the entire window.

## 💻 Code Implementation

```typescript
function maxProfit(prices: number[]): number {
    let buy = prices[0];
    let profit = 0;
    
    for (const price of prices) {
        buy = Math.min(price, buy);
        profit = Math.max(profit, price - buy);
    }
    
    return profit;
}
```

## ⚠️ Common Pitfalls

1. **Comparing each price with all future prices:** O(n²) - unnecessary
2. **Using `Infinity` when `prices[0]` suffices** (constraints guarantee length >= 1)
3. **Checking `price - buy > 0`:** Redundant, `Math.max` already handles negatives

## 🧪 Big O Analysis

- **Time:** O(n) - Single pass through the array
- **Space:** O(1) - Only two scalar variables