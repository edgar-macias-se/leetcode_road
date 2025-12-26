# Minimum Spanning Tree (MST) - Prim's & Kruskal's (Full Mastery)

## 🏷️ Tags

`#MST` `#MinimumSpanningTree` `#Prim` `#Kruskal` `#UnionFind` `#Graph` `#Greedy` `#Medium` `#TypeScript`

---

# Min Cost to Connect All Points (LeetCode #1584)

## 🧠 Key Concept

**Minimum Spanning Tree (MST)** is a subgraph that:
1. Connects **ALL** nodes in the graph
2. Is a **tree** (no cycles)
3. Has the **minimum sum** of edge weights

Two classic algorithms to find the MST:
- **Prim's Algorithm:** A greedy approach that grows the tree node by node.
- **Kruskal's Algorithm:** A greedy approach that adds edges sorted by weight.

---

## 🗺️ The Strategy

### English

**The Problem:**
```
Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20

Visualization:
    (3,10)
       |
      9|
       |
    (0,0)--4--(2,2)--3--(5,2)--4--(7,0)

Optimal MST connections:
- (0,0) to (2,2): |0-2| + |0-2| = 4
- (2,2) to (5,2): |2-5| + |2-2| = 3  
- (5,2) to (7,0): |5-7| + |2-0| = 4
- (2,2) to (3,10): |2-3| + |2-10| = 9

Total MST: 4 + 3 + 4 + 9 = 20
```

---

**What is a Spanning Tree?**

```
Definitions:

Tree:
  - Connected graph (everyone is reachable)
  - No cycles
  - n nodes → n-1 edges

Spanning Tree:
  - A tree that includes ALL nodes
  - Uses exactly n-1 edges

Minimum Spanning Tree (MST):
  - A spanning tree with the SMALLEST sum of weights
```

**Visual Example:**

```
Graph:
    1 ----5---- 2
    |  \    /  |
   2|   \ /   1|
    |    X     |
    3 ----3---- 4

Optimal MST:
    1 ----5---- 2
    |           |
   2|          1|
    |           |
    3 ----3---- 4

Total: 2 + 5 + 1 + 3 = 11
```

---

**Difference: MST vs Dijkstra**

| Aspect | Dijkstra | MST |
|---------|----------|-----|
| **Goal** | Shortest path from ONE node | Connect EVERYONE |
| **Output** | Distances | Tree (edges) |
| **Criterion** | Minimum individual path | Minimum total sum |

---

## 💻 Algorithm 1: Prim's

### Idea

Grow the tree by always adding the CHEAPEST edge that connects to a new node.

### Implementation

```typescript
function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    if (n === 1) return 0;
    
    const visited = new Set<number>();
    const heap = new MinPriorityQueue<[number, number]>(([w,_]) => w);
    
    // Start with node 0
    visited.add(0);
    
    // Initial edges from node 0
    for(let i = 1; i < n; i++){
        const cost = manhattanDistance(points[0], points[i]);
        heap.enqueue([cost, i]);
    }
    
    let totalCost = 0;

    while(visited.size < n){
        const [cost, idx] = heap.dequeue();
        
        // Skip if node already in MST
        if(visited.has(idx)) continue;
        
        visited.add(idx);
        totalCost += cost;

        // Add potential edges from the newly added node
        for(let i = 0; i < n; i++){
            if(!visited.has(i)){
                const newCost = manhattanDistance(points[idx], points[i]);
                heap.enqueue([newCost, i]);
            }
        }
    }

    return totalCost;
}

function manhattanDistance(p1: number[], p2: number[]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}
```

### Complexity
- **Time:** O(E log V) = O(n² log n)
- **Space:** O(n²)

---

## 💻 Algorithm 2: Kruskal's

### Idea

Sort ALL edges and add the cheapest ones, avoiding cycles using Union-Find.

### Union-Find

```typescript
class UnionFind {
    private parent: number[];
    private rank: number[];
    
    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    find(x: number): number {
        // Path compression
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
}
```

### Implementation

```typescript
function minCostConnectPointsKruskal(points: number[][]): number {
    const n = points.length;
    if (n === 1) return 0;
    
    const edges: [number, number, number][] = [];
    
    // 1. Generate all possible edges (n*(n-1)/2)
    for(let i = 0; i < n; i++){
        for(let j = i + 1; j < n; j++){
            const cost = manhattanDistance(points[i], points[j]);
            edges.push([cost, i, j]);
        }
    }
    
    // 2. Sort edges by weight
    edges.sort((a, b) => a[0] - b[0]);
    
    const uf = new UnionFind(n);
    let totalCost = 0;
    let edgesUsed = 0;
    
    // 3. Add edges if they don't form a cycle
    for(const [cost, u, v] of edges){
        if(uf.union(u, v)){
            totalCost += cost;
            if(++edgesUsed === n - 1) break; // Optimization: stop at n-1
        }
    }
    
    return totalCost;
}
```

### Complexity
- **Time:** O(E log E) = O(n² log n) because E = n²
- **Space:** O(n²) to store edges

---

## 🎯 Comparison

| Aspect | Prim's | Kruskal's |
|---------|--------|-----------|
| **Approach** | Grows a tree | Adds edges |
| **Structure** | Min Heap | Sort + Union-Find |
| **Implementation** | Similar to Dijkstra | Simpler |
| **Best for** | Dense graphs | Sparse graphs |

---

## ⚠️ Common Pitfalls

### 1. Using Arrays in a Set

```typescript
// ❌ INCORRECT
const visited = new Set([points[0]]);
visited.has(point);  // Compares references ❌

// ✅ CORRECT
const visited = new Set<number>([0]);
visited.has(idx);  // Compares values ✓
```

### 2. Confusing with Dijkstra

```typescript
// ❌ Dijkstra (accumulated distance)
const newDist = dist + weight;

// ✅ Prim's (edge cost only)
const cost = manhattanDistance(p1, p2);
```

### 3. Missing Path Compression in Union-Find

```typescript
// ❌ INCORRECT (slow)
find(x) {
    return this.parent[x] === x ? x : this.find(this.parent[x]);
}

// ✅ CORRECT (fast)
find(x) {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);  // ← Path compression
    }
    return this.parent[x];
}
```

---

## 🧪 Big O

**Both algorithms:**
- Time: O(n² log n) for a complete graph.
- Space: O(n²).

**Prim's is slightly more efficient in practice for dense graphs.**

---

## 💡 Use Cases

- ✅ Telecommunication networks
- ✅ Electrical grids
- ✅ Transportation design
- ✅ Clustering in ML
- ✅ Circuit board design

---

## 📊 Progress

**Section 4: Graphs**
- [x] Dijkstra's ✅
- [x] **Prim's & Kruskal's** ✅
- [ ] Topological Sort

**Problems:** 27/45 (60%)  
**Patterns:** 12/15

---

## 🔥 Tips

**Prim's:**
1. Use indices, not the coordinate arrays themselves.
2. Heap with tuples `[cost, index]`.
3. Conceptually very similar to Dijkstra.

**Kruskal's:**
1. Generate all possible edges.
2. Sort them by cost.
3. Use Union-Find with path compression.
4. Stop when you've reached exactly n-1 edges.

**General:**
- MST always uses exactly n-1 edges for n nodes.
- Manhattan distance formula: `|x1-x2| + |y1-y2|`.
