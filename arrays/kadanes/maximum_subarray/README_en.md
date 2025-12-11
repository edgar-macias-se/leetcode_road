# Maximum Subarray (LeetCode #53)

## 🏷️ Tags
`#KadanesAlgorithm` `#Array` `#DynamicProgramming` `#TypeScript` `#Easy`

## 🧠 Core Concept
The core of Kadane's Algorithm is a **greedy decision** at each step. The fundamental question is:
*"Should I extend the current subarray with the accumulated sum I have, or should I cut the streak and start a fresh one with the current number?"*

If the "history" (previous accumulated sum) is negative, it acts as a burden for any future number; therefore, we discard it (reset to 0). If it is positive, we keep it.

## 🗺️ The Strategy
1.  **Initialization:** Set `maxSum` to `-Infinity` (to handle arrays containing only negative numbers) and `currSum` to `0`.
2.  **Iteration:** Loop through each number `n` in the array.
3.  **Reset Decision:** Before adding `n`, check `currSum`.
    * If `currSum < 0`, it is decreasing our potential total. Reset it to `0`.
    * (Mathematically: `currSum = max(0, currSum)`).
4.  **Accumulation:** Add `n` to `currSum`.
5.  **Record:** Compare `currSum` with `maxSum` and store the higher value.

## 💻 Implementation (TypeScript - Optimal Solution)

```typescript
function maxSubArray(nums: number[]): number {
    let maxSum: number = -Infinity;
    let currSum: number = 0;

    for (const n of nums) {
        // If current sum is negative, discard it (reset to 0)
        currSum = Math.max(currSum, 0);
        
        // Add current element
        currSum += n;
        
        // Update global maximum
        maxSum = Math.max(maxSum, currSum);
    }

    return maxSum;
};
````

## ⚠️ Common Pitfalls

  * **Initializing `maxSum` to 0:** This will fail if the input is `[-5, -1, -3]`, returning `0` instead of `-1`.
  * **Unnecessary Complexity:** Attempting to use Divide and Conquer leads to an $O(n \log n)$ solution, which is acceptable but inferior to Kadane's $O(n)$.

## 🧪 Big O Analysis

  * **Time:** $O(n)$ — We traverse the array exactly once.
  * **Space:** $O(1)$ — We only use two auxiliary variables (`maxSum`, `currSum`).

