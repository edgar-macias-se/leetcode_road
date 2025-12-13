# Problem 1: Range Sum Query - Immutable (LeetCode #303)

## 🧠 Key Concept

**Prefix Sum** (cumulative sum) is a pre-processing technique that allows answering range sum queries in **O(1)** after an initial setup of O(n). Instead of recalculating the sum each time, we pre-calculate all sums from the start up to each index.

## 🗺️ The Strategy

**Building the Prefix Array:**
```
Original:     [3,  2,  1,  4,  5]
Prefix Sum:   [3,  5,  6, 10, 15]
              ↑   ↑   ↑   ↑   ↑
              3  3+2 5+1 6+4 10+5
```

**Construction Formula:**
```
prefix[i] = sum of all elements from index 0 to i (inclusive)

prefix[0] = arr[0]
prefix[1] = prefix[0] + arr[1]
prefix[i] = prefix[i-1] + arr[i]
```

**Calculating Range Sum:**
```
sum[left, right] = prefix[right] - prefix[left-1]

Example:
arr = [3, 2, 1, 4, 5]
prefix = [3, 5, 6, 10, 15]

sum[1, 3] = sum of indices [1, 2, 3] = 2 + 1 + 4 = 7
          = prefix[3] - prefix[0]
          = 10 - 3 = 7 ✅
```

**Problem with left = 0:**
```
sum[0, 2] = prefix[2] - prefix[-1]  ❌ Out of bounds!
```

**Solution: Padding with 0 at the beginning**
```
nums =    [-2,  0,  3, -5,  2, -1]
prefix = [0, -2, -2,  1, -4, -2, -3]  ← Added 0 at start
          ↑
       fictitious index

Now it ALWAYS works:
sum[0, 2] = prefix[3] - prefix[0] = 1 - 0 = 1 ✅
sum[2, 5] = prefix[6] - prefix[2] = -3 - (-2) = -1 ✅
```

**With padding, indices shift:**
- `prefix[i+1]` = sum from 0 to i in original array
- `sumRange(left, right) = prefix[right+1] - prefix[left]`

## 💻 Implementation

```typescript
class NumArray {
    private prefix: number[];
    
    constructor(nums: number[]) {
        // Create prefix array with padding (size n+1)
        this.prefix = new Array<number>(nums.length + 1);
        this.prefix[0] = 0;  // Initial padding
        
        // Build prefix sums
        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        // Simple formula without special cases
        return this.prefix[right + 1] - this.prefix[left];
    }
}
```

**Alternative without padding (less elegant):**
```typescript
class NumArray {
    private prefix: number[];
    
    constructor(nums: number[]) {
        this.prefix = new Array(nums.length);
        this.prefix[0] = nums[0];
        for (let i = 1; i < nums.length; i++) {
            this.prefix[i] = this.prefix[i-1] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        if (left === 0) {
            return this.prefix[right];  // Special case
        }
        return this.prefix[right] - this.prefix[left - 1];
    }
}
```

## ⚠️ Common Pitfalls

### 1. **Not using padding and forgetting special case `left = 0`**
```typescript
// ❌ INCORRECT - Fails when left = 0
sumRange(left, right) {
    return this.prefix[right] - this.prefix[left - 1];
    // If left = 0 → this.prefix[-1] ❌ Out of bounds!
}

// ✅ CORRECT - With padding
this.prefix = new Array(nums.length + 1);
this.prefix[0] = 0;
// Now prefix[left] always exists
```

### 2. **Confusing indices with padding**
```typescript
// With padding, prefix has size n+1
// prefix[i] = sum from 0 to i-1 in nums

// ❌ INCORRECT
this.prefix[i] = this.prefix[i-1] + nums[i];  // Index mismatch

// ✅ CORRECT
this.prefix[i+1] = this.prefix[i] + nums[i];
```

### 3. **Using for-of loop with indices**
```typescript
// ❌ INCORRECT - You lose the index
for (const num of nums) {
    this.prefix[i+1] = this.prefix[i] + num;  // i is undefined
}

// ✅ CORRECT
for (let i = 0; i < nums.length; i++) {
    this.prefix[i+1] = this.prefix[i] + nums[i];
}
```

## 🧪 Big O Analysis

- **Constructor:** O(n) - Single pass through array to build prefix
- **sumRange:** O(1) - One subtraction
- **Space:** O(n) - Prefix array of size n+1

**Comparison:**

| Approach | Constructor | sumRange | 10,000 queries |
|----------|-------------|----------|----------------|
| Brute Force | O(1) | O(n) | O(10^8) ❌ |
| **Prefix Sum** | **O(n)** | **O(1)** | **O(n + 10^4)** ✅ |

---
