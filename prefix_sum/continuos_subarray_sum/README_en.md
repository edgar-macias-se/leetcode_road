# Problem 3: Continuous Subarray Sum (LeetCode #523) 🔥

## 🧠 Key Concept

**Prefix Sum + HashMap + Modulo:** Uses mathematical property: if `(a - b) % k == 0`, then `a % k == b % k`. Store indices (not frequencies) to validate that subarray has length >= 2. Only store the **first** occurrence of each remainder to maximize distance.

## 🗺️ The Strategy

### English

**Modulo Math Property:**
```
If (a - b) % k == 0
Then: a % k == b % k
```

**Applying to Prefix Sums:**
```
We want: sum[left, right] % k == 0
With prefix: (prefix[right] - prefix[left-1]) % k == 0

By property:
prefix[right] % k == prefix[left-1] % k
```

**Strategy with HashMap:**
```
At index i:
- remainder = prefixSum % k
- Did this remainder appear before?
- If YES and distance >= 2: return true
```

**Why Indices and NOT Frequencies?**
```
We need to validate: length >= 2

With indices:
  map = {5: 0}  // remainder=5 at index 0
  At i=2: distance = 2 - 0 = 2 >= 2 ✅

With frequencies:
  map = {5: 3}  // appeared 3 times
  How do you know the distance? ❌
```

**Why Only the FIRST Occurrence?**
```
Store first occurrence → maximize distance

nums = [1, 2, 3], k = 6

If we store first: map[1] = 0
  At i=2: 2 - 0 = 2 >= 2 ✅

If we store last: map[1] = 2
  At i=3: 3 - 2 = 1 < 2 ❌
```

**Initialization `{0: -1}`:**

The `-1` represents "before expected array start" (fictitious).

Allows detecting subarrays from index 0:
```
nums = [2, 4], k = 6

i=0: remainder=2, map={0:-1, 2:0}
i=1: remainder=(2+4)%6=0
     0 exists at index -1
     Distance: 1 - (-1) = 2 >= 2 ✅
     Subarray: [2, 4] ✅
```

**Edge Case: k = 0**

Cannot do `% 0` (division by zero).

Special solution: The only multiple of 0 is 0.
```
Search for two consecutive zeros:
nums = [0, 0] → true
nums = [1, 0] → false
```

**Algorithm:**
```
1. If k == 0:
      Search for two consecutive zeros
      
2. map = {0: -1}

3. prefixSum = 0

4. For each i:
      prefixSum += nums[i]
      remainder = prefixSum % k
      
      If map.has(remainder):
         If (i - map[remainder]) >= 2:
            return true
      Else:  ← Only store if NOT exists
         map.set(remainder, i)
         
5. return false
```

**Complete Example:**
```
nums = [23, 2, 4, 6, 7], k = 6

prefix = [23, 25, 29, 35, 42]
remainders = [5, 1, 5, 5, 0]

i=0: remainder=5, map={0:-1, 5:0}
i=1: remainder=1, map={0:-1, 5:0, 1:1}
i=2: remainder=5, exists at i=0
     Distance: 2 - 0 = 2 >= 2 ✅
     Subarray: [2, 4] sum 6 ✅
     return true
```

## 💻 Implementation

```typescript
function checkSubarraySum(nums: number[], k: number): boolean {
    // Edge case: k = 0 (cannot modulo 0)
    if (k === 0) {
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] === 0 && nums[i + 1] === 0) {
                return true;
            }
        }
        return false;
    }
    
    // Initialize map with {0: -1} for subarrays from start
    const map = new Map<number, number>();
    map.set(0, -1);
    
    let prefixSum = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        const remainder = prefixSum % k;
        
        if (map.has(remainder)) {
            // Validate length >= 2
            if (i - map.get(remainder)! >= 2) {
                return true;
            }
        } else {
            // Only store FIRST occurrence
            map.set(remainder, i);
        }
    }
    
    return false;
}
```

## ⚠️ Common Pitfalls

### 1. **Premature Return in Edge Case k = 0**
```typescript
// ❌ INCORRECT - Returns on first iteration
if (k === 0) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0 && nums[i + 1] === 0) {
            return true;
        }
        return false;  // ← BUG: Returns without checking all
    }
}

// ✅ CORRECT - Return outside loop
if (k === 0) {
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === 0 && nums[i + 1] === 0) {
            return true;
        }
    }
    return false;  // ← Outside loop
}
```

### 2. **Out of bounds in edge case**
```typescript
// ❌ INCORRECT
for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0 && nums[i + 1] === 0) {
        // nums[i+1] might be out of bounds
    }
}

// ✅ CORRECT
for (let i = 0; i < nums.length - 1; i++) {
//                                ^^^^
    if (nums[i] === 0 && nums[i + 1] === 0) {
        // Safe: i+1 always exists
    }
}
```

### 3. **Updating indices instead of only storing first**
```typescript
// ❌ INCORRECT - Always updates
if (map.has(remainder)) {
    if (i - map.get(remainder)! >= 2) {
        return true;
    }
}
map.set(remainder, i);  // Always updates

// ✅ CORRECT - Only store if not exists
if (map.has(remainder)) {
    if (i - map.get(remainder)! >= 2) {
        return true;
    }
} else {  // ← Only in else
    map.set(remainder, i);
}
```

### 4. **Storing frequencies instead of indices**
```typescript
// ❌ INCORRECT - Can't validate distance
const map = new Map<number, number>();
map.set(remainder, (map.get(remainder) || 0) + 1);

// ✅ CORRECT - Store indices
map.set(remainder, i);
```

### 5. **Initialize with {0: 0} instead of {0: -1}**
```typescript
// ❌ INCORRECT
map.set(0, 0);

nums = [6, 3], k = 6
i=0: remainder=0, exists at 0
     0 - 0 = 0 < 2 ❌ (should be >= 2)

// ✅ CORRECT
map.set(0, -1);

nums = [6, 3], k = 6
i=0: remainder=0, exists at -1
     0 - (-1) = 1 < 2 ✅ (correct, doesn't count)
```

## 🧪 Big O Analysis

- **Time:** O(n) - Single pass through array
- **Space:** O(min(n, k)) - HashMap can have up to k unique remainders

**Comparison with brute force:**

| Approach | Time | Space |
|----------|------|-------|
| Brute Force | O(n²) | O(1) |
| **Prefix Sum + HashMap** | **O(n)** | **O(k)** ✅ |

---

## 🎓 Prefix Sums Pattern - Summary

### Pattern Variants

**1. Basic Prefix Sum (Range Query):**
- Pre-calculate accumulated sums
- Answer O(1) queries
- Use padding to avoid special cases

**2. Prefix Sum + HashMap (Subarray with specific sum):**
- Search `prefixSum - target` in map
- Store frequencies (not indices)
- Initialize `{0: 1}` for subarrays from start

**3. Prefix Sum + HashMap + Modulo (Multiples):**
- Use property: `(a-b) % k == 0` ⟺ `a % k == b % k`
- Store indices (not frequencies)
- Only store first occurrence
- Validate minimum length

---

### Reusable Templates

**Template 1: Range Query**
```typescript
class PrefixSum {
    private prefix: number[];
    
    constructor(arr: number[]) {
        this.prefix = new Array(arr.length + 1);
        this.prefix[0] = 0;
        for (let i = 0; i < arr.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + arr[i];
        }
    }
    
    rangeSum(left: number, right: number): number {
        return this.prefix[right + 1] - this.prefix[left];
    }
}
```

**Template 2: Subarray Sum with Target**
```typescript
function subarrayWithTarget(arr: number[], target: number): number {
    const map = new Map<number, number>();
    map.set(0, 1);
    
    let prefixSum = 0, count = 0;
    
    for (const num of arr) {
        prefixSum += num;
        if (map.has(prefixSum - target)) {
            count += map.get(prefixSum - target)!;
        }
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

**Template 3: Subarray Multiple of k**
```typescript
function subarrayDivisibleByK(arr: number[], k: number): boolean {
    const map = new Map<number, number>();
    map.set(0, -1);
    
    let prefixSum = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        const remainder = prefixSum % k;
        
        if (map.has(remainder)) {
            if (i - map.get(remainder)! >= minLength) {
                return true;
            }
        } else {
            map.set(remainder, i);
        }
    }
    
    return false;
}
```

---

### When to Use Prefix Sums

✅ **Use this pattern when:**
- Need to answer **multiple range sum queries**
- Looking for subarrays with **specific sum**
- Need to find subarrays whose sum is **multiple of k**
- Problem involves **accumulated sums** or **range differences**
- Want to optimize from O(n × q) to O(n + q) for q queries

❌ **DO NOT use this pattern when:**
- Only **one query** (doesn't justify pre-processing)
- Array changes frequently (prefix invalidates)
- Need **maximum/minimum** in ranges (use Segment Tree)
- Looking for **non-contiguous** subarrays

---

### Key Differences Between Variants

| Aspect | Range Query | Sum = K | Multiple of K |
|--------|-------------|---------|---------------|
| HashMap | No | Yes (frequencies) | Yes (indices) |
| Initialization | `prefix[0] = 0` | `map.set(0, 1)` | `map.set(0, -1)` |
| Search | N/A | `prefixSum - k` | `prefixSum % k` |
| Returns | Sum | Count | Boolean |
| Extra Validation | No | No | Length >= 2 |

---

### Complete Progression

- [x] **Easy:** Range Sum Query - Immutable (#303) - Basic prefix sum with padding
- [x] **Medium:** Subarray Sum Equals K (#560) - Prefix sum + HashMap with frequencies
- [x] **Hard:** Continuous Subarray Sum (#523) - Prefix sum + HashMap + Modulo with indices

**Status:** 🏆 **PATTERN MASTERED** - 3/3 complete

---

### Implementation Tips

1. **Always padding:** Use `prefix[0] = 0` avoids special cases
2. **HashMap per goal:**
   - Count subarrays → Frequencies
   - Validate length → Indices
3. **Correct Initialization:**
   - `{0: 1}` for count from start
   - `{0: -1}` for length validation
4. **Negative Modulo:** In some languages, `(-5) % 3 = -2`, use `((n % k) + k) % k` to force positive
5. **Edge cases of k = 0:** Handle before modulo operations
