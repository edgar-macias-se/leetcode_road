# Problem 2: Subarray Sum Equals K (LeetCode #560)

## 🧠 Key Concept

**Prefix Sum + HashMap:** Combines prefix sums with a HashMap to find subarrays with specific sum in O(n). The key is reformulation: instead of looking for `sum[left, right] = k`, we look for how many times `prefixSum - k` appeared before.

## 🗺️ The Strategy

**Problem Reformulation:**

We want: `sum[left, right] = k`

With prefix sums:
```
prefix[right] - prefix[left-1] = k
```

Rearranging:
```
prefix[left-1] = prefix[right] - k
```

**At index i (our "right"):**
```
We look for: How many times did (prefix[i] - k) appear BEFORE?
Each appearance = a subarray ending at i with sum k
```

**HashMap stores:**
- **Key:** Prefix sum
- **Value:** How many times that sum appeared

**Why frequencies?**
```
nums = [1, -1, 1, -1, 1], k = 0

prefix = [1, 0, 1, 0, 1]

At i=3: prefix=0, we look for 0-0=0
        0 appeared 2 times before (at start and at i=1)
        → There are 2 subarrays ending at i=3 with sum 0
```

**Initialization `{0: 1}`:**

Represents "sum 0 appeared 1 time before starting" (fictitious empty subarray).

Allows detecting subarrays from the start:
```
nums = [3], k = 3

i=0: prefix=3, we look for 3-3=0
     Does 0 exist? YES (initialization) → count = 1
     Subarray: [3] from start ✅
```

**Algorithm:**
```
1. map = {0: 1}
2. prefixSum = 0, count = 0

3. For each num:
   prefixSum += num
   
   If map.has(prefixSum - k):
      count += map.get(prefixSum - k)  ← Add FREQUENCY
   
   map.set(prefixSum, (map.get(prefixSum) || 0) + 1)
   
4. Return count
```

**Why add frequency and NOT just increment count:**
```
If (prefixSum - k) appeared 3 times, there are 3 different
subarrays ending at the current position with sum k.
```

**Cancellation Visualization:**
```
prefix[5] - prefix[2] = ?

prefix[5] = [1 + 2 + 3 + 4 + 5 + 6]
prefix[2] = [1 + 2 + 3]

Subtraction: [1+2+3+4+5+6] - [1+2+3] = [4+5+6]
             ↑  Cancel out  ↑

= sum of subarray [3, 5] (indices)
```

## 💻 Implementation

```typescript
function subarraySum(nums: number[], k: number): number {
    const map = new Map<number, number>();
    map.set(0, 1);  // Initialize for subarrays from start
    
    let prefixSum = 0;
    let count = 0;
    
    for (const num of nums) {
        prefixSum += num;
        
        // Find how many times (prefixSum - k) appeared
        if (map.has(prefixSum - k)) {
            count += map.get(prefixSum - k)!;  // Add FREQUENCY
        }
        
        // Increment frequency of current prefixSum
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

## ⚠️ Common Pitfalls

### 1. **Only incrementing count instead of adding frequency**
```typescript
// ❌ INCORRECT
if (map.has(prefixSum - k)) {
    count++;  // Only counts 1, ignores multiple appearances
}

// ✅ CORRECT
if (map.has(prefixSum - k)) {
    count += map.get(prefixSum - k)!;  // Adds all appearances
}
```

**Error Example:**
```
nums = [1, -1, 0], k = 0

With count++:
  Result: 2 ❌
  
With count += frequency:
  Result: 3 ✅
  
Correct subarrays: [1,-1], [0], [1,-1,0]
```

### 2. **Storing indices instead of frequencies**
```typescript
// ❌ INCORRECT - Loses information about multiple appearances
map.set(prefixSum, i);  // Only keeps the last index

// ✅ CORRECT - Keeps frequencies
map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
```

### 3. **Forgetting to initialize `{0: 1}`**
```typescript
// ❌ INCORRECT
const map = new Map<number, number>();  // Empty

nums = [3], k = 3
i=0: prefix=3, look for 0
     Does not exist → count = 0 ❌ (we lose [3])

// ✅ CORRECT
const map = new Map<number, number>();
map.set(0, 1);  // For subarrays from start
```

### 4. **Confusing what to search for**
```typescript
// ❌ INCORRECT
if (map.has(k - prefixSum)) { ... }

// ✅ CORRECT
if (map.has(prefixSum - k)) { ... }
```

**Demonstration:**
```
We want: sum[left, right] = k
With prefix: prefix[right] - prefix[left-1] = k
Isolate: prefix[left-1] = prefix[right] - k
                           ↑ this is prefixSum

We look for: prefixSum - k (NOT k - prefixSum)
```

## 🧪 Big O Analysis

- **Time:** O(n) - Single pass through array
- **Space:** O(n) - HashMap can have up to n unique entries
