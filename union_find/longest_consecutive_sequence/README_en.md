# Problem 2: Longest Consecutive Sequence (LeetCode #128) 🔥

## 🧠 Key Concept

**Union-Find + HashMap:** Uses Union-Find with a variant called **Union by Size** to automatically track the size of the largest component. Each number is a node, and consecutive numbers are united. The maximum size of any component is the length of the longest consecutive sequence.

## 🗺️ The Strategy

### English

**The Problem:**
```
nums = [100, 4, 200, 1, 3, 2]

Consecutive sequences:
[1, 2, 3, 4]  → length 4 ✅
[100]         → length 1
[200]         → length 1

Result: 4
```

**Why Union-Find?**

We can model the problem as a graph:
- Each number is a **node**
- If two numbers are **consecutive**, we connect them

```
Graph for [100, 4, 200, 1, 3, 2]:

1 — 2 — 3 — 4    100    200

Components:
{1, 2, 3, 4}  → size 4 ✅
{100}         → size 1
{200}         → size 1
```

**Union by Size vs Union by Rank:**

```typescript
// Union by Rank (previous problem)
class UnionFind {
    rank: number[];  // Approximate tree height
    
    union(x, y) {
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;  // Only increment when equal
        }
    }
}

// Union by Size (this problem) ✅
class UnionFind {
    size: number[];   // Exact component size
    maxSize: number;  // Size of largest component
    
    union(x, y) {
        size[rootX] += size[rootY];  // Sum sizes
        maxSize = Math.max(maxSize, size[rootX]);  // Update max
    }
}
```

**Why Union by Size here?**

Because we need the **exact size** of the largest component, not just a height approximation.

**Step-by-Step Algorithm:**

```
nums = [100, 4, 200, 1, 3, 2]

1. Remove duplicates with HashMap:
   map = {100: 0, 4: 1, 200: 2, 1: 3, 3: 4, 2: 5}
   //     num  idx

2. Create Union-Find with 6 elements:
   parent  = [0, 1, 2, 3, 4, 5]
   size    = [1, 1, 1, 1, 1, 1]
   maxSize = 1

3. For each number, check if num+1 exists:
   
   100: Does 101 exist? NO → skip
   
   4: Does 5 exist? NO → skip
   
   200: Does 201 exist? NO → skip
   
   1: Does 2 exist? YES (index 5)
      union(3, 5)
      parent  = [0, 1, 2, 3, 4, 3]
      size    = [1, 1, 1, 2, 1, 1]
                         ↑ size of component {1,2}
      maxSize = 2
   
   3: Does 4 exist? YES (index 1)
      union(4, 1)
      parent  = [0, 1, 2, 3, 4, 4]
      size    = [1, 1, 1, 2, 2, 1]
                            ↑ size of component {3,4}
      maxSize = 2
   
   2: Does 3 exist? YES (index 4)
      union(5, 4)
      find(5) = 3, find(4) = 4
      union(3, 4)
      parent  = [0, 1, 2, 4, 4, 3]
      size    = [1, 1, 1, 2, 4, 1]
                            ↑ size of component {1,2,3,4}
      maxSize = 4 ✅

4. Return maxSize = 4
```

**Component Visualization:**

```
After union(1, 2):
    3       1       0   4   2
            |
            5
{1,2} size=2

After union(3, 4):
    3       4       0   2
            |
            1
{3,4} size=2, {1,2} size=2

After union(2, 3):
        4           0
       / \
      1   3
      |
      5

{1,2,3,4} size=4, maxSize=4 ✅
```

**Why use HashMap?**

```
nums = [100, 4, 200, 1, 3, 2]

Without HashMap:
Would need Union-Find of size 201 (0 to 200)
Space: O(max(nums)) ❌

With HashMap:
Map numbers to contiguous indices [0, 1, 2, 3, 4, 5]
Space: O(n) ✅
```

**Union by Size Optimization:**

```typescript
union(i: number, j: number): void {
    let rootI = this.find(i);
    let rootJ = this.find(j);
    
    if (rootI !== rootJ) {
        // Optimization: always put smaller under larger
        if (this.size[rootI] < this.size[rootJ]) {
            [rootI, rootJ] = [rootJ, rootI];  // Swap
        }
        this.parent[rootJ] = rootI;
        this.size[rootI] += this.size[rootJ];  // Sum sizes
        this.maxSize = Math.max(this.maxSize, this.size[rootI]);
    }
}
```

## 💻 Implementation

```typescript
class UnionFind {
    parent: number[];
    size: number[];
    maxSize: number;

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.size = new Array(n).fill(1);
        this.maxSize = n > 0 ? 1 : 0;
    }

    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);  // Path compression
    }

    union(i: number, j: number): void {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by Size: put smaller under larger
            if (this.size[rootI] < this.size[rootJ]) {
                [rootI, rootJ] = [rootJ, rootI];
            }
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
            this.maxSize = Math.max(this.maxSize, this.size[rootI]);
        }
    }
}

function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;

    const uf = new UnionFind(nums.length);
    const map = new Map<number, number>();

    // 1. Remove duplicates and assign indices
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) continue;
        map.set(nums[i], i);
    }

    // 2. Unite consecutive numbers
    for (const [num, index] of map) {
        if (map.has(num + 1)) {
            uf.union(index, map.get(num + 1)!);
        }
    }

    return uf.maxSize;
}
```

**Alternative version with HashSet (simpler):**
```typescript
function longestConsecutive(nums: number[]): number {
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (const num of numSet) {
        // Only start sequence if it's the beginning (num-1 doesn't exist)
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;
            
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = Math.max(maxLength, currentLength);
        }
    }
    
    return maxLength;
}
```

## ⚠️ Common Pitfalls

### 1. **Using Union by Rank instead of Union by Size**
```typescript
// ⚠️ WORKS but does NOT keep exact size
class UnionFind {
    rank: number[];  // Approximate height
    
    union(x, y) {
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;  // Increment, NOT sum
        }
    }
}
// How do you know the component size? ❌

// ✅ CORRECT - Union by Size
class UnionFind {
    size: number[];  // Exact size
    
    union(x, y) {
        size[rootX] += size[rootY];  // Sum of sizes
        maxSize = Math.max(maxSize, size[rootX]);
    }
}
```

### 2. **Not removing duplicates before creating Union-Find**
```typescript
// ❌ INCORRECT
nums = [1, 2, 1, 3, 2]
uf = new UnionFind(nums.length)  // Size 5

map.set(1, 0)
map.set(2, 1)
map.set(1, 2)  // Overwrites index 0 with 2
// Now index 0 is orphaned

// ✅ CORRECT - Check for duplicates
for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) continue;  // Skip duplicates
    map.set(nums[i], i);
}
```

### 3. **Checking num-1 instead of num+1**
```typescript
// ❌ INCORRECT - Unites in the wrong direction
for (const [num, index] of map) {
    if (map.has(num - 1)) {  // Searches backwards
        uf.union(index, map.get(num - 1)!);
    }
}

// ✅ CORRECT - Unite forward
for (const [num, index] of map) {
    if (map.has(num + 1)) {  // Searches forward
        uf.union(index, map.get(num + 1)!);
    }
}
```

**Explanation:** Both work, but `num+1` is more natural (building sequence forward).

### 4. **Not initializing maxSize correctly**
```typescript
// ❌ INCORRECT
constructor(n: number) {
    this.maxSize = 0;  // If n=1, never updates
}

// ✅ CORRECT
constructor(n: number) {
    this.maxSize = n > 0 ? 1 : 0;  // Minimum is 1 if there are elements
}
```

### 5. **Forgetting to update maxSize in union**
```typescript
// ❌ INCORRECT
union(i, j) {
    this.size[rootI] += this.size[rootJ];
    // FORGOT: update maxSize
}

// ✅ CORRECT
union(i, j) {
    this.size[rootI] += this.size[rootJ];
    this.maxSize = Math.max(this.maxSize, this.size[rootI]);
}
```

## 🧪 Big O Analysis

**Variables:**
- `n` = length of nums
- `α(n)` = inverse Ackermann ≈ O(1)

**Remove duplicates with HashMap:**
- **Time:** O(n)
- **Space:** O(n)

**Union-Find Construction:**
- **Time:** O(n)
- **Space:** O(n)

**Unite consecutive numbers:**
- **Time:** O(n × α(n)) ≈ O(n) - Iterate map + union operations
- **Space:** O(1)

**Total:**
- **Time:** O(n) - Linear with optimizations
- **Space:** O(n) - HashMap + Union-Find

**Comparison:**

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Sorting | O(n log n) | O(1) | Simple but slower |
| HashSet | O(n) | O(n) | Simplest ✅ |
| **Union-Find** | **O(n)** | **O(n)** | Elegant, maintains components ✅ |
