# Redundant Connection II (LeetCode #685)

## 🏷️ Tags

`#UnionFind` `#DisjointSet` `#Graph` `#DirectedGraph` `#Hard` `#TypeScript`

## 🧠 Key Concept

This problem combines **Union-Find with directed graph analysis**. Unlike Redundant Connection I (undirected graph), here we must consider that each node can have **exactly one parent** (except for the root). Complexity arises because there are **3 distinct cases** when adding a redundant edge:

1. **Node with 2 parents, NO cycle:** The last edge added towards that node is the problem.
2. **Cycle, NO node with 2 parents:** Standard Union-Find detects the redundant edge.
3. **Node with 2 parents AND a cycle:** The first edge towards the node with 2 parents causes the cycle.

The key is to **first detect if a node with 2 parents exists**, and then use Union-Find strategically to identify which of the two candidate edges to remove.

## 🗺️ The Strategy

### Step 1: Detection of Node with 2 Parents
```
We traverse all edges once:
- Maintain a parent[] array that records the parent of each node.
- If we find a node V with parent[V] already assigned:
  → candidate1 = [parent[V], V]  (first edge towards V)
  → candidate2 = [U, V]           (second edge towards V, the current one)
```

### Step 2: Graph Construction with Union-Find
```
Cases:
A) If there is NO node with 2 parents:
   - Use standard Union-Find.
   - The first edge that closes a cycle is the answer.

B) If there IS a node with 2 parents:
   - Build the graph IGNORING candidate2.
   - If a cycle is detected → candidate1 causes the problem.
   - If NO cycle is detected → candidate2 is redundant.
```

### Step 3: Return Based on the Case
```
- Case 1: No cycle → return candidate2
- Case 2: Cycle without 2 parents → return the last edge of the cycle
- Case 3: Cycle with 2 parents → return candidate1
```

### ASCII Diagram of the 3 Cases

**Case 1: Node with 2 parents, NO cycle**
```
    2 → 1 ← 3
        ↓
        4

Edges: [[2,1], [3,1], [1,4]]
Node 1 has 2 parents (2 and 3)
Solution: [3,1] (last edge towards 1)
```

**Case 2: Cycle, NO node with 2 parents**
```
    1 → 2 → 3
    ↑_______↓

Edges: [[1,2], [2,3], [3,1]]
There is a cycle but each node has 1 parent
Solution: [3,1] (closes the cycle)
```

**Case 3: Node with 2 parents AND a cycle**
```
    2 → 1 ← 3
    ↑   ↓
    4 ← 1

Edges: [[2,1], [3,1], [4,2], [1,4]]
Node 1 has 2 parents AND there is a cycle (2→1→4→2)
Solution: [2,1] (first edge, part of the cycle)
```

## 💻 TypeScript Implementation

```typescript
function findRedundantDirectedConnection(edges: number[][]): number[] {
    const n = edges.length;
    const parent = new Array(n + 1).fill(-1);
    
    let candidate1: number[] | null = null;
    let candidate2: number[] | null = null;
    
    // Step 1: Detect node with 2 parents
    for (const [u, v] of edges) {
        if (parent[v] !== -1) {
            // Node v already has a parent
            candidate1 = [parent[v], v]; // First edge towards v
            candidate2 = [u, v];          // Second edge towards v (current)
            break;
        }
        parent[v] = u;
    }
    
    // Step 2: Union-Find to detect cycles
    const par = new Array(n + 1).fill(0).map((_, i) => i);
    
    function find(x: number): number {
        if (par[x] !== x) {
            par[x] = find(par[x]); // Path compression
        }
        return par[x];
    }
    
    function union(x: number, y: number): boolean {
        const px = find(x);
        const py = find(y);
        
        if (px === py) {
            return false; // Already connected → cycle
        }
        
        par[px] = py;
        return true;
    }
    
    // Step 3: Try to build the graph
    for (const [u, v] of edges) {
        // If candidate2 exists, ignore that edge in this attempt
        if (candidate2 && u === candidate2[0] && v === candidate2[1]) {
            continue;
        }
        
        if (!union(u, v)) {
            // Cycle detected
            if (candidate1) {
                // Case 3: Node with 2 parents AND a cycle
                // The cycle is caused by candidate1, not candidate2
                return candidate1;
            } else {
                // Case 2: Cycle only (no node with 2 parents)
                return [u, v];
            }
        }
    }
    
    // Case 1: Node with 2 parents, NO cycle
    // The last edge (candidate2) is the problem
    return candidate2!;
}
```

### Implementation Highlights

1. **Two passes over the edges:**
   - First pass: Detect the node with 2 parents.
   - Second pass: Union-Find to detect cycles.

2. **Path Compression in find():**
   - `par[x] = find(par[x])` compresses the path.
   - Optimizes future calls to O(α(n)) ≈ O(1).

3. **Ignore candidate2 Strategy:**
   - When building the graph, we ignore the second edge towards the node with 2 parents.
   - This allows us to identify if the cycle involves candidate1.

4. **Conditional Return:**
   - If there is a cycle with candidate1 → return candidate1.
   - If there is NO cycle → return candidate2.
   - If there is a cycle without candidates → return current edge.

## ⚠️ Common Pitfalls

### 1. Treating as an Undirected Graph
```typescript
// ❌ INCORRECT: Use standard Union-Find
for (const [u, v] of edges) {
    if (!union(u, v)) {
        return [u, v]; // This works for RC I, not for RC II
    }
}
```
**Why it fails:** In directed graphs, direction matters. A node can have multiple children but only one parent.

### 2. Not Detecting the Node with 2 Parents
```typescript
// ❌ INCORRECT: Assume there are only cycles
// Forget to check parent[v] !== -1
```
**Why it fails:** Case 1 (2 parents without a cycle) will never be detected correctly.

### 3. Ignoring the Wrong Edge
```typescript
// ❌ INCORRECT: Ignore candidate1 instead of candidate2
if (candidate1 && u === candidate1[0] && v === candidate1[1]) {
    continue; // WRONG!
}
```
**Why it fails:** We must test the graph WITHOUT the last edge (candidate2) to see if the cycle persists.

### 4. Not Using Path Compression
```typescript
// ⚠️ SUBOPTIMAL: Naive find() implementation
function find(x: number): number {
    while (par[x] !== x) {
        x = par[x];
    }
    return x;
}
```
**Why it's suboptimal:** Without path compression, find() can degrade to O(n) in the worst case.

### 5. Confusing the Return Order
```typescript
// ❌ INCORRECT: Return the first edge found
if (candidate2) return candidate2; // Without verifying cycles
if (candidate1) return candidate1;
```
**Why it fails:** It doesn't distinguish between the 3 cases. The verification order is critical.

## 🧪 Big O Analysis

### Time Complexity: **O(n · α(n))**
Where α(n) is the inverse Ackermann function (practically constant).

**Breakdown:**
- **First pass** (detect 2 parents): O(n).
- **Second pass** (Union-Find):
  - n union/find operations.
  - Each find() is O(α(n)) with path compression.
  - Total: O(n · α(n)).
- **Total:** O(n) + O(n · α(n)) = **O(n · α(n))** ≈ O(n).

### Space Complexity: **O(n)**

**Breakdown:**
- `parent[]`: O(n) - records the parent of each node.
- `par[]`: O(n) - Union-Find structure.
- `candidate1, candidate2`: O(1) - just 2 edges.
- **Total:** O(n) + O(n) = **O(n)**.

### Applied Optimizations

1. **Path Compression in find():**
   ```typescript
   par[x] = find(par[x]); // Compresses the path
   ```
   Reduces future calls from O(n) to O(α(n)).

2. **Early Termination:**
   - If we detect 2 parents, we stop searching for more.
   - If we detect a cycle, we return immediately.

3. **Single Pass When Possible:**
   - In Case 2 (cycle only), a single Union-Find pass is sufficient.

### Comparison with Redundant Connection I

| Aspect | RC I (Undirected) | RC II (Directed) |
|---------|-------------------|------------------|
| Time Complexity | O(n · α(n)) | O(n · α(n)) |
| Space Complexity | O(n) | O(n) |
| Number of Cases | 1 (cycle only) | 3 (2 parents, cycle, both) |
| Required Passes | 1 | 2 |
| Difficulty | Medium | Hard |

---

## 📚 Additional Resources

- **Union-Find Visualization:** [VisuAlgo - Union-Find](https://visualgo.net/en/ufds)
- **LeetCode Discuss:** [Redundant Connection II Solutions](https://leetcode.com/problems/redundant-connection-ii/discuss/)
- **Related Concept:** Redundant Connection I (LC #684) - undirected version
