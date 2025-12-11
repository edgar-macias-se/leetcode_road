# Maximum Sum Circular Subarray (LeetCode #918)

## 🏷️ Tags
`#KadanesAlgorithm` `#Array` `#Math` `#TypeScript` `#Hard`

## 🧠 Core Concept
In a circular array, the maximum sum subarray can exist in two states:
1.  **In the middle (Normal Case):** A standard contiguous subarray. Solved via traditional Kadane.
2.  **Wrapping around edges (Circular Case):** The subarray connects the end and the start.

## 🗺️ The Strategy (Inverse Logic)
Instead of trying to physically connect the edges, we use the **"Subtract the Minimum"** logic:
* Calculate the **Total Sum** of the array.
* Find the **Minimum Subarray** (the most "toxic" part in the middle) using an inverted Kadane.
* The max circular sum is mathematically: `Total - MinimumSubarray`.

The final answer is the maximum between the **Normal Case** and the **Circular Case**.

### Edge Case
If all numbers are negative, `Total` equals `MinimumSubarray`, resulting in 0. Since we must pick at least one number, we simply return the normal `maxSum` (the least negative number).

## 💻 Implementation (TypeScript - Optimal Solution)

```typescript
function maxSubarraySumCircular(nums: number[]): number {
   let totalSum = 0;
   let maxSum = nums[0];
   let curMax = 0;
   let minSum = nums[0];
   let curMin = 0;

    for(let num of nums){
        // Kadane for Max (Normal Case)
        curMax = Math.max(curMax + num, num);
        maxSum = Math.max(curMax, maxSum);
        
        // Kadane for Min (To remove center for Circular Case)
        curMin = Math.min(curMin + num, num);
        minSum = Math.min(curMin, minSum);
        
        totalSum += num;
    }

    // If maxSum <= 0, all numbers are negative.
    // Return maxSum to avoid returning 0.
    return maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum;
};
````

## 🧪 Big O Analysis

  * **Time:** $O(N)$ — Single pass calculates both scenarios.
  * **Space:** $O(1)$ — Only scalar variables.
