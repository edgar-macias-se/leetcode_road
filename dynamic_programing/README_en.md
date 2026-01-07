# Dynamic Programming - Overview

## 🏷️ Tags

`#DynamicProgramming` `#DP` `#Knapsack` `#LCS` `#Memoization` `#Tabulation` `#TypeScript`

---

## 🧠 What is Dynamic Programming?

**Dynamic Programming (DP)** is an optimization technique that solves complex problems by breaking them down into **overlapping subproblems** and storing their results to avoid repeated calculations.

### Key Characteristics

1. **Optimal Substructure:** The optimal solution to the problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems:** The same subproblems are solved multiple times.
3. **Memoization:** Storing results to avoid recalculating.

---

## 🗺️ Fundamental Patterns

### 1. 0/1 Knapsack

**Characteristic:** Each element can be used **0 or 1 time**.

**When to Use:**
- An array/list of items.
- Each item is used only once.
- Reaching a certain sum/capacity.
- Questions: "Is it possible?" or "How many ways?"

**State:** `dp[i][sum]`

**Problems in this Repo:**
- Partition Equal Subset Sum (LC #416)
- Target Sum (LC #494)

---

### 2. Unbounded Knapsack

**Characteristic:** Each element can be used **infinitely many times**.

**When to Use:**
- An array/list of items.
- Each item can be reused.
- Minimizing/maximizing or counting combinations.
- Order DOES NOT matter.

**State:** `dp[amount]`

**Problems in this Repo:**
- Coin Change (LC #322) - Minimization
- Coin Change II (LC #518) - Combination Count

---

### 3. LCS (Longest Common Subsequence)

**Characteristic:** Comparing **two strings/arrays**.

**When to Use:**
- Two strings/arrays for comparison.
- Find a common subsequence/substring.
- Character order matters.
- Characters can be skipped.

**State:** `dp[i][j]`

**Problems in this Repo:**
- Longest Common Subsequence (LC #1143)

---

## 📊 Pattern Comparison

| Pattern | Dimension | Items | Operation | Complexity |
|--------|-----------|-------|-----------|-------------|
| **0/1 Knapsack** | 2D `dp[i][s]` | Once | `OR` / `+` | O(n × sum) |
| **Unbounded** | 1D `dp[amount]` | Inifinite | `min` / `+` | O(amount × items) |
| **LCS** | 2D `dp[i][j]` | Two arrays | `max` | O(M × N) |

---

## 🎯 Quick Decision Guide

```
How many arrays/strings do I have?
├─ 1 array + sum/capacity
│  ├─ Each item once? → 0/1 Knapsack
│  └─ Each item infinitely? → Unbounded Knapsack
└─ 2 strings/arrays → LCS
```

---

## 💡 Key Concepts

### Memoization vs Tabulation

**Memoization (Top-Down):**
```typescript
function fib(n: number, memo: Map<number, number>): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    
    const result = fib(n-1, memo) + fib(n-2, memo);
    memo.set(n, result);
    return result;
}
```

**Tabulation (Bottom-Up):**
```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

---

## ⚠️ Common Pitfalls

### 1. Array.fill() with References

```typescript
// ❌ INCORRECT
const dp = Array(n).fill(Array(m).fill(0));

// ✅ CORRECT
const dp = Array(n).fill(0).map(() => Array(m).fill(0));
```

### 2. Incorrect Indices

```typescript
// dp[i] represents the i-th element
// But we access the original array with [i-1]

// ❌ INCORRECT
dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i]];

// ✅ CORRECT
dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i-1]];
```

### 3. Loop Order Matters

In **Coin Change II** (counting combinations):

```typescript
// ❌ INCORRECT - Counts permutations
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) { }
}

// ✅ CORRECT - Counts combinations
for (const coin of coins) {
    for (let amount = coin; amount <= target; amount++) { }
}
```

---

## 🧪 Complexity Analysis

### Time Complexity

| Pattern | Complexity | Variables |
|--------|-------------|-----------|
| 0/1 Knapsack | O(n × sum) | n items, target sum |
| Unbounded Knapsack | O(amount × C) | C coins/items |
| LCS | O(M × N) | M, N string lengths |

### Space Complexity

All patterns have optimizations:
- 2D → 1D using a rolling array.
- O(n × sum) → O(sum).
- O(M × N) → O(min(M, N)).

---

## 🎓 Optimization Techniques

### Space Optimization (0/1 Knapsack)

```typescript
// Original: O(n × sum)
const dp: boolean[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(sum + 1).fill(false));

// Optimized: O(sum)
const dp: boolean[] = Array(sum + 1).fill(false);
dp[0] = true;

for (const num of nums) {
    // CRITICAL: Iterate from right to left
    for (let s = sum; s >= num; s--) {
        dp[s] = dp[s] || dp[s - num];
    }
}
```

**Why from right to left?**
- Left → Right: uses already updated values (incorrect).
- Right → Left: uses values from the previous iteration (correct).

---

## 📚 Repository Structure

```
dynamic_programming/
├── 0-1_knapsack/
│   ├── partition_equal_subset_sum/
│   └── target_sum/
├── unbounded_knapsack/
│   ├── coin_change/
│   └── coin_change_II/
└── lcs/
    └── longest_common_subsequence/
```

Each problem includes:
- `README.md` (Spanish) - Full explanation.
- `README_en.md` (English) - Complete explanation.
- `solution.ts` - Optimized implementation.

---

## 🚀 Next Steps

1. **Master the 3 fundamental patterns** ✅
2. Practice additional problems.
3. Learn advanced patterns (Palindromes, Matrix Chain).
4. Optimize space in 2D solutions.

---

## 💡 Interview Tips

### Step 1: Identify the Pattern
```
Key questions:
- How many arrays/strings? (1 → Knapsack, 2 → LCS)
- How many times do I use each item? (Once → 0/1, ∞ → Unbounded)
- What am I optimizing? (Possible/Ways → boolean/count, Minimize → min)
```

### Step 2: Define the State
```
What information do I need?
- Items + capacity → dp[i][capacity]
- Two strings → dp[i][j]
- Amount only → dp[amount]
```

### Step 3: Find the Recurrence
```
How do subproblems relate?
- 0/1: Use or not? → dp[i-1][s] OR dp[i-1][s-num]
- Unbounded: How many times? → dp[amount-coin]
- LCS: Do they match? → dp[i-1][j-1]+1 : max(...)
```

### Step 4: Implement and Optimize
```
1. Write a clear 2D version.
2. Verify with a small example.
3. Optimize to 1D if possible.
4. Analyze complexity.
```

---

## 🎯 Progress

**Mastered Patterns:** 3/3 ✅
- ✅ 0/1 Knapsack
- ✅ Unbounded Knapsack
- ✅ LCS

**Solved Problems:** 5 ✅

**Target:** February 2025 🎯
