# Problem 1: Number of Provinces (LeetCode #547)

## 🧠 Key Concept

**Union-Find** (also called **Disjoint Set Union - DSU**) is a data structure that maintains a collection of **disjoint sets** (non-overlapping) and supports two main operations: **Find** (which set does this element belong to?) and **Union** (merge two sets). It is ideal for **connectivity** and **connected components** problems in graphs.

## 🗺️ The Strategy

### English

**Structure Visualization:**
```
Elements: [0, 1, 2, 3, 4, 5]

Initial: Each element is its own set
{0} {1} {2} {3} {4} {5}

parent = [0, 1, 2, 3, 4, 5]  // Each is its own parent

After union(0, 1):
{0, 1} {2} {3} {4} {5}

    0       2   3   4   5
    |
    1

parent = [0, 0, 2, 3, 4, 5]

After union(2, 3):
{0, 1} {2, 3} {4} {5}

    0       2       4   5
    |       |
    1       3

parent = [0, 0, 2, 2, 4, 5]

After union(0, 2):
{0, 1, 2, 3} {4} {5}

        0           4   5
       / \
      1   2
          |
          3

parent = [0, 0, 0, 2, 4, 5]
```

**Fundamental Operations:**

**1. FIND - Find the root (set representative)**
```typescript
// Basic version (no optimization)
find(x: number): number {
    while (x !== parent[x]) {
        x = parent[x];  // Go up to parent
    }
    return x;
}
// Complexity: O(n) worst case (degenerate tree)

// Optimized version: Path Compression ⚡
find(x: number): number {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);  // Compress path
    }
    return this.parent[x];
}
// Complexity: O(α(n)) ≈ O(1) amortized
```

**Path Compression - What does it do?**
```
Before find(5):
5 → 4 → 3 → 2 → 1 → 0

During find(5) with path compression:
1. Find root: 5 → 4 → 3 → 2 → 1 → 0 (root = 0)
2. Compress: make all point directly to 0

After:
5 → 0
4 → 0
3 → 0
2 → 0
1 → 0

Next time find(5): 5 → 0  (O(1)) ✅
```

**2. UNION - Merge two sets**
```typescript
// Basic version (no optimization)
union(x: number, y: number): void {
    let rootX = this.find(x);
    let rootY = this.find(y);
    
    if (rootX !== rootY) {
        this.parent[rootX] = rootY;  // Any direction
    }
}

// Optimized version: Union by Rank ⚡
union(x: number, y: number): void {
    let rootX = this.find(x);
    let rootY = this.find(y);
    
    if (rootX === rootY) return;  // Already in same set
    
    // Join shorter tree under taller tree
    if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
    } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;  // Only increment when heights are equal
    }
}
```

**Union by Rank - Why?**
```
Without optimization:
0 → 1 → 2 → 3 → 4 → 5  (degenerate tree, height = n)

With union by rank:
        0
       /|\
      1 2 3  (balanced tree, height = log n)
```

**Rank Concept:**
- `rank` is an **approximation of the tree height**
- Only increments when you join two trees of **equal height**
- Guarantees tree height is O(log n)

**Application to the Problem:**

```
isConnected = [[1,1,0],
               [1,1,0],
               [0,0,1]]

Implicit graph:
0 — 1    2

Algorithm:
1. Create Union-Find with n=3 cities
2. For each connection isConnected[i][j] = 1:
   union(i, j)
3. Count how many distinct sets (provinces)

Initial state:
parent = [0, 1, 2]
rank   = [0, 0, 0]

Process isConnected[0][1] = 1:
union(0, 1)
parent = [0, 0, 2]
rank   = [1, 0, 0]

Count provinces:
- parent[0] = 0 ✓ (is root)
- parent[1] = 0 ✗ (not root)
- parent[2] = 2 ✓ (is root)

Result: 2 provinces
```

**Traversal Optimization:**

The matrix is **symmetric**: `isConnected[i][j] = isConnected[j][i]`

```typescript
// ❌ Traverse entire matrix (redundant)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (isConnected[i][j] === 1) {
            union(i, j);  // union(0,1) and union(1,0) are the same
        }
    }
}

// ✅ Only traverse upper half
for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {  // j starts at i+1
        if (isConnected[i][j] === 1) {
            union(i, j);
        }
    }
}
```

## 💻 Implementation

```typescript
class UnionFind {
    parent: number[];
    rank: number[];
    
    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = Array(n).fill(0);
    }
    
    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    union(x: number, y: number): void {
        let rootX = this.find(x);
        let rootY = this.find(y);
        
        if (rootX === rootY) return;
        
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }
}

function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const uf = new UnionFind(n);
    
    // Process connections (only upper half)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    // Count provinces (distinct sets)
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (i === uf.parent[i]) {  // Is root
            count++;
        }
    }
    
    return count;
}
```

**Alternative version with DFS (simpler for this problem):**
```typescript
function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let count = 0;
    
    function dfs(city: number): void {
        visited[city] = true;
        for (let j = 0; j < n; j++) {
            if (isConnected[city][j] === 1 && !visited[j]) {
                dfs(j);
            }
        }
    }
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            count++;
        }
    }
    
    return count;
}
```

## ⚠️ Common Pitfalls

### 1. **Assigning parent[root] instead of root directly**
```typescript
// ❌ INCORRECT
union(x: number, y: number): void {
    if (rank[rootX] < rank[rootY]) {
        this.parent[rootX] = this.parent[rootY];  // ❌ Might not be rootY
    }
}

// ✅ CORRECT
union(x: number, y: number): void {
    if (rank[rootX] < rank[rootY]) {
        this.parent[rootX] = rootY;  // ✅ Use root directly
    }
}
```

### 2. **Summing ranks instead of only incrementing when equal**
```typescript
// ❌ INCORRECT
union(x: number, y: number): void {
    this.parent[rootY] = rootX;
    this.rank[rootX] += this.rank[rootY];  // ❌ DO NOT sum
}

// ✅ CORRECT
union(x: number, y: number): void {
    if (this.rank[rootX] === this.rank[rootY]) {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;  // ✅ Only increment when equal
    }
}
```

**Explanation:**
- `rank` is **approximate height**, not size
- Only increments when joining trees of equal height
- If you join height 2 tree with height 1 tree, final height is still 2

### 3. **Not optimizing find() with path compression**
```typescript
// ⚠️ WORKS but SLOW
find(x: number): number {
    while (x !== this.parent[x]) {
        x = this.parent[x];
    }
    return x;
}
// Complexity: O(n) worst case

// ✅ OPTIMAL
find(x: number): number {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
}
// Complexity: O(α(n)) ≈ O(1) amortized
```

### 4. **Traversing entire matrix instead of upper half**
```typescript
// ⚠️ WORKS but INEFFICIENT (redundant unions)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (isConnected[i][j] === 1) {
            union(i, j);  // union(0,1) and union(1,0) duplicated
        }
    }
}

// ✅ OPTIMAL
for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {  // Avoids duplicates
        if (isConnected[i][j] === 1) {
            union(i, j);
        }
    }
}
```

### 5. **Using Set to count instead of iterating parent**
```typescript
// ⚠️ WORKS but uses O(n) extra space
const roots = new Set<number>();
for (let i = 0; i < n; i++) {
    roots.add(find(i));
}
return roots.size;

// ✅ BETTER - O(1) space
let count = 0;
for (let i = 0; i < n; i++) {
    if (i === parent[i]) count++;
}
return count;
```

## 🧪 Big O Analysis

**Variables:**
- `n` = number of cities
- `α(n)` = inverse Ackermann function (grows extremely slowly, practically constant)

**Union-Find Construction:**
- **Time:** O(n) - Initialize arrays
- **Space:** O(n) - Parent and rank arrays

**find() operation with path compression:**
- **Time:** O(α(n)) ≈ O(1) amortized
- **Space:** O(α(n)) - Recursion stack

**union() operation with union by rank:**
- **Time:** O(α(n)) ≈ O(1) amortized (2 calls to find)
- **Space:** O(1)

**Process isConnected matrix:**
- **Time:** O(n²) - Traverse matrix
- **Space:** O(1) - Only variables

**Count provinces:**
- **Time:** O(n) - Iterate parent
- **Space:** O(1)

**Total:**
- **Time:** O(n²) - Dominated by matrix traversal
- **Space:** O(n) - Union-Find structure

**Comparison:**

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Union-Find** | **O(n²)** | **O(n)** | Best for dynamic queries ✅ |
| DFS/BFS | O(n²) | O(n) | Simpler for this problem ✅ |

**When to use Union-Find vs DFS?**

| Scenario | Union-Find | DFS/BFS |
|----------|------------|---------|
| Static graph | O(n²) | O(n²) - **Simpler** ✅ |
| Dynamic updates | O(α(n)) per operation ✅ | O(n) - Redo everything ❌ |
| Connectivity queries | O(α(n)) ✅ | O(n) ❌ |
| Directed graph | ❌ Doesn't apply well | ✅ Works |
