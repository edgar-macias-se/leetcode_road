# Problem 2: 3Sum (LeetCode #15)

## 🧠 Key Concept

**Sorting + Two Pointers:** Combines initial sorting with pair finding using two pointers. The key is **avoiding duplicates** during iteration without using auxiliary structures like Set. This pattern reduces complexity from O(n³) brute force to O(n²).

## 🗺️ The Strategy

1. **Pre-processing:** Sort the array O(n log n)
2. **Outer loop (fix `i`):** For each element nums[i]:
   - **Optimization:** If `nums[i] > 0`, break (impossible to sum to 0 with positives)
   - **Skip duplicates:** If `nums[i] === nums[i-1]`, continue
3. **Two Pointers (find pairs):**
   - `left = i + 1`, `right = n - 1`
   - `target = 0 - nums[i]`
   - While `left < right`:
     - `sum = nums[left] + nums[right]`
     - If `sum === target`: Found! Add triplet
       - **Skip duplicates left:** `while (nums[left] === nums[left-1]) left++`
       - **Skip duplicates right:** `while (nums[right] === nums[right+1]) right--`
     - If `sum < target`: `left++` (need larger sum)
     - If `sum > target`: `right--` (need smaller sum)

**Why skip duplicates this way?**

For `i`: We compare with `nums[i-1]` because we already explored ALL possible combinations with that value in the previous iteration.

```
nums = [-1, -1, 0, 1]
        ↑   ↑
        0   1

i=0: nums[i]=-1 → Explores ALL pairs (left, right)
i=1: nums[i]=-1 → If we explore, we would find the SAME pairs
     → SKIP because nums[1] === nums[0]
```

For `left` and `right`: After finding a triplet, we skip duplicate values to avoid adding the same triplet multiple times.

**Diagram:**
```
Sorted: [-4, -1, -1, 0, 1, 2]

i=0: nums[i]=-4
     [-4, -1, -1, 0, 1, 2]
       i   L           R
     target = 4
     sum = -1 + 2 = 1 (< 4) → L++
     ...
     Nothing found

i=1: nums[i]=-1
     [-4, -1, -1, 0, 1, 2]
           i   L       R
     target = 1
     sum = -1 + 2 = 1 ✅ FOUND! → [[-1, -1, 2]]
     Skip duplicates, continue...
     sum = 0 + 1 = 1 ✅ FOUND! → [[-1, 0, 1]]

i=2: nums[i]=-1
     Skip because nums[2] === nums[1] (duplicate)
```

## 💻 Implementation

```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b); // CRITICAL: Numeric sorting
    const result: number[][] = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Optimization: if smallest is positive, impossible to sum to 0
        if (nums[i] > 0) break;
        
        // Skip duplicates for i
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        const target = 0 - nums[i];
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                
                // Skip duplicates for left
                while (left < right && nums[left] === nums[left - 1]) left++;
                
                // Skip duplicates for right
                while (left < right && nums[right] === nums[right + 1]) right--;
                
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

## ⚠️ Common Errors

### 1. **Lexicographical Sorting (JavaScript pitfall)**
```typescript
// ❌ DANGER - Lexicographical sorting
nums.sort(); 
// [10, 2, -5] → [-5, 1, 10, 2] ❌ (compares as strings)

// ✅ CORRECT - Numeric sorting
nums.sort((a, b) => a - b);
// [10, 2, -5] → [-5, 2, 10] ✅
```

### 2. **Skip duplicates for `left` and `right` AFTER finding triplet**
```typescript
// ❌ INCORRECT - Skip before finding
while (left < right && nums[left] === nums[left-1]) left++;
if (sum === target) { ... }

// ✅ CORRECT - Skip after finding
if (sum === target) {
    result.push([...]);
    left++;
    right--;
    while (left < right && nums[left] === nums[left-1]) left++;
    while (left < right && nums[right] === nums[right+1]) right--;
}
```

## 🧪 Big O Analysis

- **Time:** O(n²)
  - Sorting: O(n log n)
  - Outer loop: O(n)
    - Inner two pointers: O(n)
  - Total: O(n log n) + O(n²) = O(n²) dominant
  
- **Space:** O(1) or O(n) depending on sort implementation
  - No auxiliary structures used (no Set, no temp arrays)
  - Result does not count towards space complexity
