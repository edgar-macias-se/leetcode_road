# Coin Change (LeetCode #322)

## 🏷️ Tags

`#UnboundedKnapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Minimization`

---

## 🧠 Main Concept

Given an array of coins of different denominations and an amount (target quantity), return the **minimum number of coins** needed to form that amount.

You can use **each coin infinitely many times**. If it's impossible to form the amount, return `-1`.

This is a classic **Unbounded Knapsack** problem because each coin can be used **unlimited times**.

---

## 🔄 Key Difference: 0/1 vs Unbounded

### 0/1 Knapsack

```typescript
Example: nums = [1, 2, 5], target sum 11

Each number used ONCE:
  You cannot do: 5 + 5 + 1 (uses 5 twice) ❌
  
State: dp[i][sum]
  i = How many items considered so far?
  sum = What sum are we trying to reach?

Recurrence:
  dp[i][s] = dp[i-1][s - num]
             ───────
             PREVIOUS row (item no longer available)
```

### Unbounded Knapsack

```typescript
Example: coins = [1, 2, 5], amount = 11

Each coin used INFINITELY many times:
  You can do: 5 + 5 + 1 (uses 5 twice) ✓
  
State: dp[amount]
  amount = What quantity are we trying to reach?
  (Index i is not strictly necessary for 1D approach)

Recurrence:
  dp[amount] = dp[amount - coin]
               ──────────────────
               SAME array (coin remains available)
```

---

## 🗺️ The Strategy

### DP State

```
dp[i] = Minimum number of coins to form amount i

Example: coins = [1, 2, 5]

dp[0] = 0   (0 coins to make 0)
dp[1] = ?   (Minimum to make 1?)
dp[2] = ?   (Minimum to make 2?)
dp[5] = ?   (Minimum to make 5?)
dp[11] = ?  (Minimum to make 11?)
```

### Recurrence

```
For each 'amount':
  For each 'coin':
    If coin <= amount:
      
      Option: Use this coin
        dp[amount] = dp[amount - coin] + 1
                     ─────────────────   ─
                     Form the rest       This coin
      
      Take the MINIMUM of all options.

Formula:
  dp[amount] = min(dp[amount], dp[amount - coin] + 1)
               ────────────    ───────────────────────
               Best current    Use this coin
```

### Base Case

```
dp[0] = 0

Why?
  0 coins are needed to make amount 0.
  
dp[1..amount] = Infinity (initially impossible)
```

---

## 💻 Implementation

```typescript
function coinChange(coins: number[], amount: number): number {
    // 1. Create DP array
    const dp: number[] = Array(amount + 1).fill(Infinity);
    
    // 2. Base case
    dp[0] = 0;
    
    // 3. For each amount
    for (let i = 1; i <= amount; i++) {
        // 4. Try each coin
        for (const coin of coins) {
            // 5. Skip if coin is too large
            if (coin > i) continue;
            
            // 6. Update minimum
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    // 7. Check if it's possible
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

## 📊 Full Step-by-Step Trace

```typescript
Input: coins = [1, 2, 5], amount = 11

 ═══════════════════════════════════════
INITIALIZATION
 ═══════════════════════════════════════

dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]
      0  1  2  3  4  5  6  7  8  9  10 11

dp[0] = 0 ✓ (base case)

 ═══════════════════════════════════════
AMOUNT i=1
 ═══════════════════════════════════════

Coin 1: 1 <= 1? YES
  dp[1] = min(∞, dp[0] + 1) = 1
  Solution: {1} (1 coin)

Coin 2, 5: skip

 ═══════════════════════════════════════
AMOUNT i=2
 ═══════════════════════════════════════

Coin 1: dp[2] = min(∞, dp[1] + 1) = 2
Coin 2: dp[2] = min(2, dp[0] + 1) = 1
  Best: {2} (1 coin) ✓

 ═══════════════════════════════════════
AMOUNT i=5
 ═══════════════════════════════════════

Coin 1: dp[5] = min(∞, dp[4] + 1) = 3
Coin 2: dp[5] = min(3, dp[3] + 1) = 3
Coin 5: dp[5] = min(3, dp[0] + 1) = 1
  Best: {5} ✓

 ═══════════════════════════════════════
AMOUNT i=11 (TARGET)
 ═══════════════════════════════════════

Coin 1: dp[11] = min(∞, dp[10] + 1) = 2 + 1 = 3  ({5, 5, 1})
Coin 2: dp[11] = min(3, dp[9] + 1) = 3 + 1 = 4
Coin 5: dp[11] = min(3, dp[6] + 1) = 2 + 1 = 3

FINAL ANSWER = 3 ({5, 5, 1})
```

---

## 📊 Final Complete Table

```
amount:  0   1   2   3   4   5   6   7   8   9  10  11
coins:  [1,  2,  5]

dp:     [0,  1,  1,  2,  2,  1,  2,  2,  3,  3,  2,  3]

Solutions:
  0: {} (0 coins)
  1: {1} (1 coin)
  2: {2} (1 coin)
  3: {2,1} (2 coins)
  4: {2,2} (2 coins)
  5: {5} (1 coin)
 10: {5,5} (2 coins)
 11: {5,5,1} (3 coins) ✓
```

---

## 📊 Example 2: Impossible Case

```typescript
Input: coins = [2], amount = 3

dp = [0, ∞, ∞, ∞]
i=1: skip
i=2: dp[2] = min(∞, dp[0]+1) = 1
i=3: dp[3] = min(∞, dp[1]+1) = ∞

Result: -1 ✓
```

---

## ⚠️ Common Pitfalls

### 1. Using Previous Row (0/1 Knapsack)

```typescript
// ✅ CORRECT - Unbounded Knapsack uses current row updates
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) {
        dp[amount] = Math.min(dp[amount], dp[amount - coin] + 1);
    }
}
```

### 2. Not Skipping Large Coins

```typescript
// ❌ INCORRECT - Causes negative index errors
dp[i] = Math.min(dp[i], dp[i - coin] + 1);

// ✅ CORRECT
if (coin > i) continue;
```

### 3. Forgetting to Check Infinity at the End

```typescript
// ✅ CORRECT
return dp[amount] === Infinity ? -1 : dp[amount];
```

---

## 🧪 Big O Analysis

### Time Complexity: O(amount × coins.length)
We iterate through each amount, and for each amount, we check every coin.

### Space Complexity: O(amount)
We use a 1D array of size `amount + 1`.

---

## 🔑 Why It Works: The Intuition

### Incremental Construction

To calculate `dp[7]` with `coins = [1, 2, 5]`:
- Option 1: Use 1 → `dp[6] + 1`
- Option 2: Use 2 → `dp[5] + 1`
- Option 3: Use 5 → `dp[2] + 1`

Take the minimum. Since we solve from `i = 1` up to `amount`, all previous values are already optimal.

---

## 🔗 Related Problems

- Coin Change II (LC #518) - Counting combinations.
- Perfect Squares (LC #279) - Minimization with perfect squares.
- Minimum Cost For Tickets (LC #983) - Unbounded with constraints.

---

## 📝 Implementation Notes

1. **Infinity as initial value** (except `dp[0]`).
2. **dp[0] = 0** is the base case.
3. **Skip large coins** to avoid negative indices.
4. **Check Infinity** at the end and return -1.
5. **No need for 2D array** - 1D is sufficient.
6. **Loop order doesn't matter** for minimization (unlike Coin Change II).
