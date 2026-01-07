# Target Sum (LeetCode #494)

## 🏷️ Tags

`#0/1Knapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Counting`

---

## 🧠 Main Concept

Given an array of integers and a target number, assign a **+** or **-** sign to each number to reach exactly the target. Return the **number of different ways** to achieve this.

This is a **0/1 Knapsack problem with mathematical transformation** because each number is used exactly once, but we need to decide its sign.

---

## 🎯 The Mathematical Transformation (The Key)

### Step 1: Separate into Two Groups

```
In any valid solution, we divide the numbers into two groups:

Group P (Positives): numbers with a + sign
Group N (Negatives): numbers with a - sign

Example:
nums = [1, 1, 1, 1, 1], target = 3

One solution: +1 +1 +1 +1 -1 = 3
  P = {1, 1, 1, 1} → sum = 4
  N = {1}          → sum = 1
  
Result: P - N = 4 - 1 = 3 ✓
```

### Step 2: System of Equations

```
We know two things:

1. P - N = target  (this is what we want)

2. P + N = sum(all numbers)
   Because we use ALL numbers,
   some with + and some with -
```

### Step 3: Solve for P

```
We have:
  P - N = target         ... (Equation 1)
  P + N = sum            ... (Equation 2)

Adding (1) + (2):
  (P - N) + (P + N) = target + sum
  2P = target + sum
  
  P = (target + sum) / 2
```

### Step 4: Transformed Problem

```
Original Problem:
  "How many ways to assign +/- to make target?"

Transformed Problem:
  "How many subsets sum exactly to (target + sum) / 2?"

This is EXACTLY Partition Equal Subset Sum!
But instead of boolean (is it possible?), 
we count HOW MANY ways there are.
```

---

## 🔍 Why the Transformation Works

### Visual Proof

```
nums = [1, 2, 3], target = 0

sum = 1 + 2 + 3 = 6
P = (0 + 6) / 2 = 3

Transformed question: How many subsets sum to 3?

Subsets summing to 3:
  1. {3} ✓
  2. {1, 2} ✓

Verification:
Subset {3} with +:
  Positive: {3}
  Negative: {1, 2}
  Expression: -1 -2 +3 = 0 ✓

Subset {1, 2} with +:
  Positive: {1, 2}
  Negative: {3}
  Expression: +1 +2 -3 = 0 ✓

It matches! 2 ways.
```

---

## 🗺️ DP Strategy

### State

```
dp[i][s] = Number of ways to make sum 's' using the first 'i' numbers.

Difference from Partition:
  Partition: boolean (is it possible?)
  Target Sum: number (how many ways?)
```

### Recurrence

```
For each number nums[i-1]:

Option 1: DO NOT use this number in the subset
  dp[i][s] = dp[i-1][s]

Option 2: DO use this number in the subset
  dp[i][s] = dp[i-1][s - nums[i-1]]

Combined (ADD both options):
  dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i-1]]
             ───────────   ───────────────────────
             Ways without  Ways using
             this number   this number
```

### Base Case

```
dp[0][0] = 1

Why?
  There is 1 way to make sum 0 with no numbers: the empty subset {}
```

---

## 💻 Implementation

```typescript
function findTargetSumWays(nums: number[], target: number): number {
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // Validations
    if (Math.abs(target) > sum) return 0;
    if ((target + sum) % 2 !== 0) return 0;
    
    const newTarget = (target + sum) / 2;
    if (newTarget < 0) return 0;
    
    const n = nums.length;
    const dp: number[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(newTarget + 1).fill(0));
    
    dp[0][0] = 1;
    
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        for (let s = 0; s <= newTarget; s++) {
            if (s < num) {
                dp[i][s] = dp[i - 1][s];
            } else {
                dp[i][s] = dp[i - 1][s] + dp[i - 1][s - num];
            }
        }
    }
    
    return dp[n][newTarget];
}
```

---

## 📊 Summary Table

```
Input: nums = [1, 1, 1], target = 1
newTarget = (1 + 3) / 2 = 2

    s:  0   1   2
i=0     1   0   0
i=1     1   1   0
i=2     1   2   1
i=3     1   3   3
                ↑
         ANSWER = 3
```

---

## ⚠️ Common Pitfalls

### 1. Not Validating Negative newTarget
Always check `if (newTarget < 0) return 0`.

### 2. Forgetting Parity Check
If `(target + sum)` is odd, `newTarget` won't be an integer.

### 3. Using OR instead of Addition
Target Sum counts ways, so use `+`.

---

## 🧪 Big O Analysis

### Time Complexity: O(n × sum)
We fill a table of `n` rows and `sum` columns.

### Space Complexity: O(n × sum)
Can be optimized to **O(sum)** using a 1D array.

---

## 🔗 Related Problems

- Partition Equal Subset Sum (LC #416) - Same transformation, boolean.
- Subset Sum - Direct variant.
- Ones and Zeroes (LC #474) - 0/1 Knapsack with two dimensions.

---

## 📝 Implementation Notes

1. **Base case: dp[0][0] = 1**.
2. **Summing (+=), not OR** in the recurrence.
3. **Mathematical transformation** is the key.
4. **Zereos** in the input are handled correctly by this DP.
