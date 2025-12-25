# Problem: Permutations (LeetCode #46)

## 🧠 Key Concept

**Permutations** generates all possible orderings of a set of elements. Unlike Subsets and Combinations where **order DOES NOT matter**, in Permutations **order DOES matter**: [1,2,3] is different from [2,1,3].

## 🗺️ The Strategy

### English

**The Problem:**
```
Input: nums = [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]

ORDER MATTERS:
[1,2,3] ≠ [1,3,2] ≠ [2,1,3]

Total: 3! = 6 permutations
```

**How many Permutations?**

Formula: **n!** (factorial)

```
n = 3: 3! = 3 × 2 × 1 = 6
n = 4: 4! = 4 × 3 × 2 × 1 = 24
n = 5: 5! = 5 × 4 × 3 × 2 × 1 = 120
```

**Why n!?**

```
First position: n options
Second position: n-1 options (one already used)
Third position: n-2 options
...
Last position: 1 option

Total: n × (n-1) × (n-2) × ... × 1 = n!
```

---

**Tree Visualization:**

```
nums = [1, 2, 3]

                        []
            /           |           \
          [1]          [2]          [3]
         /   \        /   \        /   \
      [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
        |     |      |     |      |     |
     [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
        ✓     ✓      ✓     ✓      ✓     ✓

Level 1: Choose first element (3 options)
Level 2: Choose second (2 options - no repeats)
Level 3: Choose third (1 option)

Total: 3 × 2 × 1 = 6 permutations
```

**Key Difference with Other Patterns:**

| Pattern | Order Matters | Total | Tracking Needed |
|---------|--------------|-------|-------------------|
| **Subsets** | No | 2^n | No |
| **Combinations** | No | C(n,k) | No |
| **Permutations** | **Yes** ✅ | **n!** | **Yes** ✅ |

```
Example:
Subsets/Combinations: [1,2] === [2,1] (same)
Permutations: [1,2] ≠ [2,1] (different)
```

---

**Two Main Approaches:**

### 1. With `used` Array (Explicit Tracking) - Recommended ✅

```typescript
function permute(nums: number[]): number[][] {
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        // Base case: complete permutation
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        // FULL loop (0 to n) - no startIndex
        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;  // Skip if already used

            // Make choice
            curr.push(nums[i]);
            used[i] = true;
            
            // Explore
            helper();
            
            // Backtrack
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res; 
}
```

**Characteristics:**
- ✅ Very clear and easy to understand
- ✅ `used` array tracks included elements
- ✅ Loop goes from 0 to n (doesn't use startIndex)
- ✅ Preferred in interviews

**Detailed Trace:**
```
nums = [1, 2, 3]
used = [F, F, F]
curr = []

helper():
  curr.length=0 !== 3
  
  Loop i=0 (nums[0]=1):
    used[0]=F ✓
    curr = [1]
    used = [T, F, F]
    
    helper():
      curr.length=1 !== 3
      
      Loop i=0: used[0]=T → skip
      
      Loop i=1 (nums[1]=2):
        used[1]=F ✓
        curr = [1, 2]
        used = [T, T, F]
        
        helper():
          curr.length=2 !== 3
          
          Loop i=0: used[0]=T → skip
          Loop i=1: used[1]=T → skip
          
          Loop i=2 (nums[2]=3):
            used[2]=F ✓
            curr = [1, 2, 3]
            used = [T, T, T]
            
            helper():
              curr.length=3 === 3 ✓
              res.push([1,2,3]) → [[1,2,3]]
              return
            
            curr.pop() → [1, 2]
            used[2] = F → [T, T, F]
          
          return
        
        curr.pop() → [1]
        used[1] = F → [T, F, F]
      
      Loop i=2 (nums[2]=3):
        used[2]=F ✓
        curr = [1, 3]
        used = [T, F, T]
        
        helper():
          curr.length=2 !== 3
          
          Loop i=1 (nums[1]=2):
            curr = [1, 3, 2]
            used = [T, T, T]
            
            helper():
              res.push([1,3,2]) → [[1,2,3], [1,3,2]]
              return
            
            curr.pop() → [1, 3]
            used[1] = F → [T, F, T]
          
          return
        
        curr.pop() → [1]
        used[2] = F → [T, F, F]
      
      return
    
    curr.pop() → []
    used[0] = F → [F, F, F]
  
  Loop i=1 (nums[1]=2):
    curr = [2]
    used = [F, T, F]
    
    helper():
      Loop i=0: curr = [2, 1]
        helper():
          Loop i=2: curr = [2, 1, 3]
            res.push([2,1,3]) → [[1,2,3], [1,3,2], [2,1,3]]
      
      Loop i=2: curr = [2, 3]
        helper():
          Loop i=0: curr = [2, 3, 1]
            res.push([2,3,1]) → [..., [2,3,1]]
    
    curr.pop() → []
    used[1] = F
  
  Loop i=2 (nums[2]=3):
    curr = [3]
    used = [F, F, T]
    
    helper():
      Loop i=0: curr = [3, 1]
        Loop i=1: curr = [3, 1, 2]
          res.push([3,1,2])
      
      Loop i=1: curr = [3, 2]
        Loop i=0: curr = [3, 2, 1]
          res.push([3,2,1])

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]] ✓
```

**State at Each Step:**
```
curr: []              used: [F, F, F]
curr: [1]             used: [T, F, F]
curr: [1, 2]          used: [T, T, F]
curr: [1, 2, 3]       used: [T, T, T] → ✓ Save
curr: [1, 2]          used: [T, T, F] ← Backtrack
curr: [1]             used: [T, F, F] ← Backtrack
curr: [1, 3]          used: [T, F, T]
curr: [1, 3, 2]       used: [T, T, T] → ✓ Save
...
```

---

### 2. With In-Place Swap (More Space Efficient)

```typescript
function permute(nums: number[]): number[][] {
    let res: number[][] = [];

    function helper(start: number){
        // Base case: all elements fixed
        if(start === nums.length){
            res.push([...nums]);
            return;
        }

        // Try map each element at 'start' position
        for(let i = start; i < nums.length; i++){
            // Swap: put nums[i] at position start
            [nums[start], nums[i]] = [nums[i], nums[start]];
            
            // Explore with this element fixed
            helper(start+1);
            
            // Backtrack: undo swap
            [nums[i], nums[start]] = [nums[start], nums[i]];
        }
    }

    helper(0);
    return res;
}
```

**Characteristics:**
- ✅ O(1) extra space efficient
- ✅ Swap using ES6 destructuring
- ✅ Fixes elements from left to right
- ✅ Bonus points in interviews

**Detailed Trace:**
```
nums = [1, 2, 3]

helper(0):
  start=0 !== 3
  
  Loop i=0:
    swap(0,0): [1, 2, 3] → [1, 2, 3] (unchanged)
    
    helper(1):
      start=1 !== 3
      
      Loop i=1:
        swap(1,1): [1, 2, 3] → [1, 2, 3]
        
        helper(2):
          start=2 !== 3
          
          Loop i=2:
            swap(2,2): [1, 2, 3] → [1, 2, 3]
            
            helper(3):
              start=3 === 3 ✓
              res.push([1, 2, 3]) → [[1,2,3]]
              return
            
            swap(2,2): [1, 2, 3] → [1, 2, 3]
          
          return
        
        swap(1,1): [1, 2, 3] → [1, 2, 3]
      
      Loop i=2:
        swap(1,2): [1, 2, 3] → [1, 3, 2]
        
        helper(2):
          start=2 !== 3
          
          Loop i=2:
            swap(2,2): [1, 3, 2] → [1, 3, 2]
            
            helper(3):
              res.push([1, 3, 2]) → [[1,2,3], [1,3,2]]
              return
            
            swap(2,2): [1, 3, 2] → [1, 3, 2]
          
          return
        
        swap(1,2): [1, 3, 2] → [1, 2, 3]
      
      return
    
    swap(0,0): [1, 2, 3] → [1, 2, 3]
  
  Loop i=1:
    swap(0,1): [1, 2, 3] → [2, 1, 3]
    
    helper(1):
      start=1 !== 3
      
      Loop i=1:
        swap(1,1): [2, 1, 3] → [2, 1, 3]
        
        helper(2):
          Loop i=2:
            helper(3):
              res.push([2, 1, 3]) → [..., [2,1,3]]
      
      Loop i=2:
        swap(1,2): [2, 1, 3] → [2, 3, 1]
        
        helper(2):
          Loop i=2:
            helper(3):
              res.push([2, 3, 1]) → [..., [2,3,1]]
        
        swap(1,2): [2, 3, 1] → [2, 1, 3]
      
      return
    
    swap(0,1): [2, 1, 3] → [1, 2, 3]
  
  Loop i=2:
    swap(0,2): [1, 2, 3] → [3, 2, 1]
    
    helper(1):
      Loop i=1:
        swap(1,1): [3, 2, 1]
        helper(2):
          res.push([3, 2, 1]) → [..., [3,2,1]]
      
      Loop i=2:
        swap(1,2): [3, 2, 1] → [3, 1, 2]
        helper(2):
          res.push([3, 1, 2]) → [..., [3,1,2]]
    
    swap(0,2): [3, 2, 1] → [1, 2, 3]

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]]
```

**Swap Visualization:**
```
Position start: Element to fix

start=0: Try 1, 2, 3 at position 0
  ↓
  swap(0,0): [1, 2, 3] - Fixes 1 at pos 0
  swap(0,1): [2, 1, 3] - Fixes 2 at pos 0
  swap(0,2): [3, 2, 1] - Fixes 3 at pos 0

start=1: Try remaining elements at position 1
  ↓
  [1, 2, 3]: Try 2, 3 at pos 1
  [2, 1, 3]: Try 1, 3 at pos 1
  [3, 2, 1]: Try 2, 1 at pos 1

start=2: Only 1 element left → save
```

---

**Approaches Comparison:**

| Aspect | With `used` Array | With In-Place Swap |
|---------|------------------|-------------------|
| **Extra Space** | O(n) - used array | **O(1)** ✅ |
| **Time** | O(n × n!) | O(n × n!) |
| **Clarity** | ✅ Very clear | ⚠️ Requires understanding swap |
| **Modification** | Doesn't modify nums | Modifies temporarily |
| **Debugging** | ✅ Easier | ⚠️ More complex |
| **For interviews** | ✅ **Preferred** | ✅ Bonus points |
| **Output Order** | Lexicographical | Different order |

**Recommendation:** Use `used` version in interviews (clearer), mention swap version as optimization.

## 💻 Implementation

### Version 1: With `used` Array (Recommended)

```typescript
function permute(nums: number[]): number[][] {
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;

            curr.push(nums[i]);
            used[i] = true;
            helper();
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res; 
}
```

### Version 2: With In-Place Swap (Efficient)

```typescript
function permute(nums: number[]): number[][] {
    let res: number[][] = [];

    function helper(start: number){
        if(start === nums.length){
            res.push([...nums]);
            return;
        }

        for(let i = start; i < nums.length; i++){
            [nums[start], nums[i]] = [nums[i], nums[start]];
            helper(start+1);
            [nums[i], nums[start]] = [nums[start], nums[i]];
        }
    }

    helper(0);
    return res;
}
```

## ⚠️ Common Pitfalls

### 1. **Using startIndex instead of full loop**

```typescript
// ❌ INCORRECT - this is for Combinations
for(let i = startIndex; i < nums.length; i++) {
    // Generates combinations, NOT permutations
}

// ✅ CORRECT - full loop for Permutations
for(let i = 0; i < nums.length; i++) {
    if(used[i]) continue;  // Skip used
    // ...
}
```

**Why?**
- Combinations: [1,2] === [2,1] → using startIndex avoids duplicates
- Permutations: [1,2] ≠ [2,1] → we need full loop

---

### 2. **Forgetting to set used[i] = false in backtrack**

```typescript
// ❌ INCORRECT
curr.push(nums[i]);
used[i] = true;
helper();
curr.pop();
// MISSING: used[i] = false;

// ✅ CORRECT
curr.push(nums[i]);
used[i] = true;
helper();
curr.pop();
used[i] = false;  // ← CRITICAL
```

---

### 3. **Not doing swap back**

```typescript
// ❌ INCORRECT
[nums[start], nums[i]] = [nums[i], nums[start]];
helper(start + 1);
// MISSING: swap back

// ✅ CORRECT
[nums[start], nums[i]] = [nums[i], nums[start]];
helper(start + 1);
[nums[i], nums[start]] = [nums[start], nums[i]];  // ← Undo
```

---

### 4. **Not copying the array when pushing**

```typescript
// ❌ INCORRECT (swap version)
res.push(nums);  // Reference - all point to same array

// ✅ CORRECT
res.push([...nums]);  // Copy
```

---

### 5. **Confusing with Combinations**

```typescript
// Combinations (order DOES NOT matter):
if(curr.length === k) {  // Specific size k
    for(let i = start; i < n; i++) {  // startIndex
        // ...
    }
}

// Permutations (order DOES matter):
if(curr.length === n) {  // Full size n
    for(let i = 0; i < n; i++) {  // Full loop
        if(used[i]) continue;  // Tracking needed
        // ...
    }
}
```

## 🧪 Big O Analysis

**Variables:**
- `n` = array size

### Both Versions

**Time Complexity: O(n × n!)**

```
Generate n! permutations
Copy each one: O(n)
Total: O(n × n!)

Explanation:
- Level 1: n options
- Level 2: n-1 options per branch
- Level 3: n-2 options per branch
- ...
- Total branches: n! permutations
- Copy each permutation: O(n)
```

**Space Complexity:**

```
Version 1 (with used):
- Recursion stack: O(n) depth
- `used` array: O(n)
- `curr` array: O(n)
Total: O(n)

Version 2 (with swap):
- Recursion stack: O(n) depth
- No extra arrays
Total: O(n) - stack only
```

**Practical Comparison:**

| n | n! | Operations (n × n!) | Estimated Time* |
|---|----|--------------------|-----------------|
| 3 | 6 | 18 | < 1ms |
| 4 | 24 | 96 | < 1ms |
| 5 | 120 | 600 | ~1ms |
| 6 | 720 | 4,320 | ~10ms |
| 7 | 5,040 | 35,280 | ~100ms |
| 8 | 40,320 | 322,560 | ~1s |
| 10 | 3,628,800 | 36,288,000 | ~2min |

*Approximate time on modern hardware

**Factorial growth is EXTREMADAMENTE fast!**

---

## 🎯 Comparison: Subsets vs Combinations vs Permutations

| Aspect | Subsets | Combinations | Permutations |
|---------|---------|--------------|--------------|
| **Order matters** | No | No | **Yes** ✅ |
| **Size** | Variable (0 to n) | Fixed (k) | Fixed (n) |
| **Total** | 2^n | C(n,k) | **n!** |
| **Loop range** | `i=start to n` | `i=start to n` | **`i=0 to n`** |
| **Tracking** | Not needed | Not needed | **Needed** |
| **Base case** | `index >= n` | `length === k` | **`length === n`** |
| **Complexity** | O(n × 2^n) | O(k × C(n,k)) | **O(n × n!)** |

**Visual Example:**

```
nums = [1, 2, 3]

Subsets (order DOES NOT matter):
[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
Total: 2^3 = 8

Combinations k=2 (order DOES NOT matter):
[[1,2], [1,3], [2,3]]
Total: C(3,2) = 3

Permutations (order DOES matter):
[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
Total: 3! = 6
```

**Key Difference:**
```
Subsets/Combinations:
[1,2] === [2,1]  (same subset/combination)

Permutations:
[1,2] ≠ [2,1]  (different permutations)
```

---

## 🔥 Variant: Permutations II (With Duplicates)

**Problem:** If the array contains duplicates, avoid duplicate permutations.

```
Input: nums = [1, 1, 2]
Output: [[1,1,2], [1,2,1], [2,1,1]]

Without handling duplicates:
[[1,1,2], [1,2,1], [1,1,2], [1,2,1], [2,1,1], [2,1,1]]
                    ↑ duplicates
```

**Solution:**

```typescript
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);  // CRITICAL: sort
    
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;
            
            // Skip duplicates: if previous element is equal
            // and has not been used, skip this one
            if(i > 0 && nums[i] === nums[i-1] && !used[i-1]) {
                continue;
            }

            curr.push(nums[i]);
            used[i] = true;
            helper();
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res;
}
```

**Skip Explanation:**

```
nums = [1, 1, 2] (sorted)

At each level, if we have duplicates:
- Use the first one: OK
- Use the second one WITHOUT having used the first one: ❌ Skip

Why?
If we use the second 1 without using the first:
  [1₂, ...] will generate the same permutations as [1₁, ...]
  
That's why skip when:
  nums[i] === nums[i-1] && !used[i-1]
```

---

## 🎓 Permutations General Template

```typescript
// Permutations Template
function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);
    
    function backtrack(): void {
        // 1. Base case: complete permutation
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        // 2. FULL loop (0 to n)
        for (let i = 0; i < nums.length; i++) {
            // 3. Skip if already used
            if (used[i]) continue;
            
            // 4. Make choice
            current.push(nums[i]);
            used[i] = true;
            
            // 5. Explore
            backtrack();
            
            // 6. Undo (backtrack)
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}
```

**Key Points:**
1. Loop goes from `0` to `n` (no startIndex)
2. Needs tracking with `used` array
3. Generates n! permutations
4. Order matters: [1,2] ≠ [2,1]

---

## 🚀 Full Backtracking Pattern Progression

- [x] **Medium:** Subsets (#78)
- [x] **Medium:** Subsets II (#90)
- [x] **Medium:** Combinations (#77)
- [x] **Medium:** Permutations (#46)

**Status:** 🏆 **PATTERN MASTERED** - 4/4 core problems complete

**Backtracking Pattern completed 100%!** 🎉

---

## 💡 Implementation Tips

1. **Choose version:** `used` array is clearer for interviews.
2. **Full loop:** `i=0 to n` (no startIndex as in Combinations).
3. **Mandatory tracking:** Without `used`, you will generate invalid permutations.
4. **Always copy:** `[...current]` or `[...nums]`.
5. **Full backtrack:** `pop()` + `used[i] = false`.
6. **For duplicates:** Sort + skip duplicates.
7. **Elegant swap:** Use ES6 destructuring `[a, b] = [b, a]`.

---

## 🔍 Real Use Cases

**Permutations is used in:**
- ✅ Scheduling and task ordering
- ✅ Traveling Salesman Problem (TSP)
- ✅ Generation of test cases
- ✅ Puzzle solving (Rubik's cube)
- ✅ Cryptography (key permutations)
- ✅ Anagram detection and generation
- ✅ Tournament bracket generation
- ✅ Resource allocation with priorities
