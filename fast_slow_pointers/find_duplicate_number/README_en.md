# Problem 3: Find the Duplicate Number (LeetCode #287) 🔥

## 🧠 Key Concept

**Fast & Slow in Array:** This problem uses a brilliant transformation: it treats the array as an **implicit linked list** where each value is a pointer to the next index. The duplicate number creates a cycle. We apply Floyd's Cycle Detection on the array to find the cycle start, which is the duplicate number.

## 🗺️ The Strategy

### English

**The Problem:**
- Array of `n + 1` elements
- Values in range `[1, n]`
- **Pigeonhole Principle:** 5 elements in 4 "holes" → at least one repeats

**Constraints eliminating simple solutions:**
- ❌ Do not modify the array (eliminates sorting, marking negatives)
- ❌ O(1) space (eliminates HashSet)

**The Key Transformation: Array → Linked List**

Each value is a valid index (because `1 <= nums[i] <= n`):
```
nums[i] → nums[nums[i]]
```

**Example:**
```
nums = [1, 3, 4, 2, 2]
index: 0  1  2  3  4

As "linked list":
index 0 → value 1 → index 1 → value 3 → index 3 → value 2 → index 2 → value 4 → index 4 → value 2 → index 2...

Path: 0 → 1 → 3 → 2 → 4 → 2 → 4 → 2...
                      ↑________|
                      Cycle!
```

**Why does the duplicate create a cycle?**

If the number `2` appears twice (at indices 3 and 4):
- Both occurrences point to the same next index (index 2)
- This creates convergence → cycle
- The start of the cycle is the index that multiple values point to
- That index is the duplicate number

**Difference with Linked List Cycle II:**

1. **Initialization:** We start at index 0 (not at head)
   - Index 0 is never part of the cycle (values are in [1, n])

2. **Movement:** We use values as indices
   ```typescript
   slow = nums[slow]
   fast = nums[nums[fast]]
   ```

3. **Phase 1:** We use `do-while` (not `while`)
   ```typescript
   // ❌ With while: slow = 0, fast = 0 → does not enter loop
   while (slow !== fast) { ... }
   
   // ✅ With do-while: executes first, then compares
   do { ... } while (slow !== fast)
   ```

**Full Algorithm:**
```
Phase 1: Detect cycle
─────────────────────
slow = 0
fast = 0

do {
    slow = nums[slow]
    fast = nums[nums[fast]]
} while (slow !== fast)

Phase 2: Find start (the duplicate)
────────────────────────────────────
ptr1 = 0
ptr2 = slow (meeting point)

while (ptr1 !== ptr2) {
    ptr1 = nums[ptr1]
    ptr2 = nums[ptr2]
}

return ptr1  (the duplicate number)
```

**Full Visualization:**
```
nums = [1, 3, 4, 2, 2]
        0  1  2  3  4

PHASE 1:
──────
slow = 0, fast = 0

Iteration 1:
slow = nums[0] = 1
fast = nums[nums[0]] = nums[1] = 3

Iteration 2:
slow = nums[1] = 3
fast = nums[nums[3]] = nums[2] = 4

Iteration 3:
slow = nums[3] = 2
fast = nums[nums[4]] = nums[2] = 4

Iteration 4:
slow = nums[2] = 4
fast = nums[nums[4]] = nums[2] = 4

slow === fast (both at 4) ✅

PHASE 2:
──────
ptr1 = 0
ptr2 = 4

Iteration 1:
ptr1 = nums[0] = 1
ptr2 = nums[4] = 2

Iteration 2:
ptr1 = nums[1] = 3
ptr2 = nums[2] = 4

Iteration 3:
ptr1 = nums[3] = 2
ptr2 = nums[4] = 2

ptr1 === ptr2 (both at 2) ✅

Result: 2
```

## 💻 Implementation

```typescript
function findDuplicate(nums: number[]): number {
    let slow = 0;
    let fast = 0;
    
    // Phase 1: Detect cycle (use do-while)
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Phase 2: Find cycle start (the duplicate)
    let ptr1 = 0;
    let ptr2 = slow;
    
    while (ptr1 !== ptr2) {
        ptr1 = nums[ptr1];
        ptr2 = nums[ptr2];
    }
    
    return ptr1;
}
```

## ⚠️ Common Pitfalls

### 1. **Using `while` instead of `do-while` in Phase 1**
```typescript
// ❌ INCORRECT
slow = 0;
fast = 0;
while (slow !== fast) {  // Doesn't enter because slow === fast (both 0)
    slow = nums[slow];
    fast = nums[nums[fast]];
}

// ✅ CORRECT
do {
    slow = nums[slow];
    fast = nums[nums[fast]];
} while (slow !== fast);  // Executes first, then compares
```

### 2. **Confusing indices with values**
```typescript
// ❌ INCORRECT - Advances like in linked list
slow = slow.next;
fast = fast.next.next;

// ✅ CORRECT - Uses values as indices
slow = nums[slow];
fast = nums[nums[fast]];
```

### 3. **Initializing at index other than 0**
```typescript
// ❌ INCORRECT
slow = nums[0];  // Start at value
fast = nums[0];

// ✅ CORRECT
slow = 0;  // Start at index 0
fast = 0;
```

### 4. **Thinking the cycle start is directly the duplicate**
```
Common confusion: "The index where the cycle starts is the duplicate"

❌ INCORRECT: The INDEX where the cycle starts
✅ CORRECT: The VALUE that points to that index is the duplicate

Example:
Cycle starts at index 2
The value pointing to index 2 is 2
The duplicate is 2 ✅
```

### 5. **Trying to solve with HashSet (violating constraints)**
```typescript
// ❌ INCORRECT - O(n) space
const seen = new Set();
for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
}

// ✅ CORRECT - O(1) space
// Use Fast & Slow Pointers
```

## 🧪 Big O Analysis

- **Time:** O(n)
  - Phase 1: O(n) to detect cycle
  - Phase 2: O(n) to find start
  - Total: O(n)
- **Space:** O(1) - Only scalar variables

**Comparison with other approaches:**

| Approach | Time | Space | Modifies Array | Notes |
|----------|------|-------|----------------|-------|
| Sorting | O(n log n) | O(1) | ✅ Yes ❌ | Violates constraints |
| HashSet | O(n) | O(n) ❌ | No | Violates space constraint |
| Mark negatives | O(n) | O(1) | ✅ Yes ❌ | Violates constraints |
| **Fast & Slow** | **O(n)** | **O(1)** | **No** ✅ | **Meets all** ✅ |
