# Maximum Product Subarray (LeetCode #152)

## 🏷️ Tags
`#DynamicProgramming` `#KadanesAlgorithm` `#Array` `#TypeScript` `#Medium`

## 🧠 Core Concept
Unlike maximum sum, when dealing with products, negative numbers flip the order: a very small (negative) number can become the global maximum if multiplied by another negative number later.

Therefore, tracking just the maximum is insufficient. We must maintain **two states** at each iteration:
1.  **Current Max Product:** The highest value achievable ending at the current position.
2.  **Current Min Product:** The lowest (most negative) value achievable, kept in reserve in case a future negative number flips it into a massive maximum.

## 🗺️ The Strategy
1.  **Initialization:** `maxProduct` starts at the first element (or -Infinity). `currMax` and `currMin` start at 1.
2.  **Iteration:** Loop through each number `n`.
3.  **Candidate Calculation:** At each step, the new max and min can come from three sources:
    * The number `n` itself (starting fresh).
    * `n * currMax` (extending a positive streak).
    * `n * currMin` (flipping a negative streak).
4.  **Update:**
    * `currMax = max(n, n * currMax, n * currMin)`
    * `currMin = min(n, n * currMax, n * currMin)`
    * *Note:* Using a temporary variable for the old `currMax` is crucial before calculating `currMin`.
5.  **Global:** Update `maxProduct`.

## 💻 Implementation (TypeScript - Optimal Solution)

```typescript
function maxProduct(nums: number[]): number {
    // Initialize global max safely
    let maxProduct: number = nums[0]; 
    
    let currMax: number = 1;
    let currMin: number = 1;

    for(const n of nums){
        // Store previous currMax as it will be overwritten
        let maxTemp = currMax;
        
        // Calculate new extremes. 
        // Including 'n' allows "resetting" the subarray starting at current index.
        currMax = Math.max(n, n * maxTemp, n * currMin);
        currMin = Math.min(n, n * maxTemp, n * currMin);

        // Update global result
        maxProduct = Math.max(maxProduct, currMax);
    }

    return maxProduct;
};
````

## ⚠️ Common Pitfalls

  * **Forgetting the Minimum:** Only tracking the maximum will fail on inputs like `[-2, 3, -4]`.
  * **Sequential Update without Temp:** Calculating `currMin` using the `currMax` you *just* modified in the previous line.
  * **Ignoring Zero:** Zero breaks the chain. The logic `Math.max(n, ...)` implicitly handles this by resetting the chain at 0 (or the next number), but conceptually it's a reset.

## 🧪 Big O Analysis

  * **Time:** $O(n)$ — Single pass.
  * **Space:** $O(1)$ — Constant variables.

