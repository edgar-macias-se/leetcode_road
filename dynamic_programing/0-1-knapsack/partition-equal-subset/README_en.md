# Partition Equal Subset Sum (LeetCode #416)

## 🏷️ Tags

`#0/1Knapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#SubsetSum`

---

## 🧠 Main Concept

Given an array of positive integers, determine if it can be partitioned into two subsets with **equal sum**.

This is a classic **0/1 Knapsack** problem because each number can be used **0 or 1 time** (only once).

---

## 🗺️ The Strategy

### Problem Transformation

```
Original problem:
  Can I divide the array into two subsets with equal sum?

Observation:
  If total sum = S
  If divided into two equal parts:
    Part 1 + Part 2 = S
    Part 1 = Part 2 = S/2

Transformed problem:
  Does a subset exist that sums exactly to S/2?
```

### Initial Validations

```
1. If total sum is ODD → Impossible
   Example: [1, 2, 4] → sum = 7
   7 cannot be divided into two equal integers.

2. If total sum is EVEN → Search for a subset that sums to S/2
   Example: [1, 5, 11, 5] → sum = 22
   Does a subset exist that sums to 11?
```

### DP State

```
dp[i][s] = Is it possible to make sum 's' using the first 'i' numbers?

Dimensions:
  i: from 0 to n (number of elements considered)
  s: from 0 to target (possible sums)

Example:
  nums = [1, 5, 11, 5], target = 11
  dp[2][6] = Can I make sum 6 with {1, 5}?
```

### Recurrence

```
For each number nums[i-1]:

Option 1: DO NOT use this number
  dp[i][s] = dp[i-1][s]
  (We copy the result without this number)

Option 2: DO use this number (if it fits)
  If nums[i-1] <= s:
    dp[i][s] = dp[i-1][s - nums[i-1]]
    (Could I make the remainder without this number?)

Combined:
  dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i-1]]
```

### Base Case

```
dp[i][0] = true  (for all i)

Why?
  I can always make sum 0 with the empty subset {}
```

---

## 💻 Implementation

```typescript
function canPartition(nums: number[]): boolean {
    // 1. Calculate total sum
    const totalSum = nums.reduce((a, b) => a + b, 0);
    
    // 2. If odd sum, impossible
    if (totalSum % 2 !== 0) return false;
    
    const target = totalSum / 2;
    const n = nums.length;
    
    // 3. Create DP table
    const dp: boolean[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(target + 1).fill(false));
    
    // 4. Base case: sum 0 always possible
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    // 5. Fill table
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        
        for (let s = 0; s <= target; s++) {
            // Option 1: DO NOT use this number
            dp[i][s] = dp[i - 1][s];
            
            // Option 2: DO use this number (if it fits)
            if (num <= s) {
                const remainder = s - num;
                if (dp[i - 1][remainder]) {
                    dp[i][s] = true;
                }
            }
        }
    }
    
    // 6. Final answer
    return dp[n][target];
}
```

---

## 📊 Trace Example

```typescript
Input: nums = [1, 5, 11, 5]

Step 1: totalSum = 22, target = 11

Step 2: Initialize dp[5][12] table

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=0     T   F   F   F   F   F   F   F   F   F   F   F
i=1     T   ?   ?   ?   ?   ?   ?   ?   ?   ?   ?   ?

Step 3: Process nums[0] = 1

dp[1][1]: nums[0]=1 <= 1? YES
  dp[1][1] = dp[0][0] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=1     T   T   F   F   F   F   F   F   F   F   F   F

Step 4: Process nums[1] = 5

dp[2][5]: nums[1]=5 <= 5? YES → T
dp[2][6]: nums[1]=5 <= 6? YES → dp[1][1] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=2     T   T   F   F   F   T   T   F   F   F   F   F

Step 5: Process nums[2] = 11
dp[3][11] = dp[2][0] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=3     T   T   F   F   F   T   T   F   F   F   F   T

Result: dp[4][11] = true ✓
```

---

## ⚠️ Common Pitfalls

### 1. Incorrect Value of n
`dp` needs `n + 1` rows to account for 0 elements considerated.

### 2. Array.fill() Creates References
Always use `.fill(0).map(() => ...)` for multi-dimensional arrays.

### 3. Incorrect nums Index
`dp[i]` corresponds to `nums[i-1]`.

---

## 🧪 Big O Analysis

### Time Complexity: O(n × sum)
We fill a table of `n` rows and `sum` columns.

### Space Complexity: O(n × sum)
Can be optimized to **O(sum)** using a 1D array.

---

## 🎯 Optimization: Space O(sum)

```typescript
function canPartitionOptimized(nums: number[]): boolean {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    
    const target = sum / 2;
    const dp: boolean[] = Array(target + 1).fill(false);
    dp[0] = true;
    
    // CRITICAL: Iterate from right to left
    for (const num of nums) {
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
    }
    
    return dp[target];
}
```

**Why right to left?**
To ensure we use values from the previous iteration, meaning each number is used at most once.

---

## 🔗 Related Problems

- Target Sum (LC #494) - Same pattern with transformation.
- Subset Sum - Direct variant.
- Last Stone Weight II (LC #1049) - Minimization with same concept.

---

## 📝 Implementation Notes

1. **Always validate even sum** first.
2. **Use .map()** for independent arrays.
3. **Correct indices:** `dp[i]` uses `nums[i-1]`.
4. **Important base case:** `dp[i][0] = true`.
5. **Space optimization** is highly recommended.
