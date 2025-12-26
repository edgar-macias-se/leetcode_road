# Dijkstra's Algorithm - Network Delay Time (Full Mastery)

## 🏷️ Tags

`#Dijkstra` `#ShortestPath` `#Graph` `#PriorityQueue` `#Greedy` `#Medium` `#TypeScript`

---

# Network Delay Time (LeetCode #743)

## 🧠 Key Concept

**Dijkstra's Algorithm** is a greedy algorithm used to find the **shortest path** from a source node to all other nodes in a graph with **positive weights**. It uses a Priority Queue (Min Heap) to always process the node with the current smallest distance.

---

## 🗺️ The Strategy

**The Problem:**
```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2

Graph:
    1
   ↗ (1)
  2 → 3 → 4
    (1) (1)

From k=2, find the minimum time for ALL nodes to receive the signal.
```

**Why Dijkstra?**

This problem requires:
1. ✅ Shortest path from one node to all others
2. ✅ Graph with positive weights (0 ≤ wi ≤ 100)
3. ✅ Efficiency: O((V + E) log V)

**Shortest Path Algorithms:**

| Algorithm | Complexity | Negative Weights | Best For |
|-----------|-------------|-----------------|------------|
| **BFS** | O(V + E) | ❌ Only weight=1 | Unweighted graphs |
| **Dijkstra** | O((V+E) log V) | ❌ | Positive weights ✅ |
| **Bellman-Ford** | O(V × E) | ✅ | Negative weights |

---

**Intuitive Idea:**

**Analogy:** GPS navigating through a city.
- You always explore the path that seems the shortest.
- You mark locations already visited.
- You update distances if you find a better path.

**The Algorithm:**

```
1. Initialize all distances to ∞, except for the start node (0).
2. Use a Min Heap to track nodes by distance.
3. While there are nodes to process:
   a. Extract the node with the smallest distance.
   b. If already visited, skip.
   c. Mark as visited.
   d. Relax edges: for each neighbor, if we find
      a shorter path, update its distance.
4. Return the maximum distance (time of the farthest node).
```

---

**Step-by-Step Visualization:**

```
Graph: times = [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2

Adjacency List:
{
  1: [],
  2: [[1,1], [3,1]],
  3: [[4,1]],
  4: []
}

Process:

Initial State:
  distances = [∞, ∞, 0, ∞, ∞]
                   1  2  3  4
  minHeap = [[2, 0]]  (node, distance)
  visited = {}

─────────────────────────────────────

Step 1: Process node 2 (dist=0)
  
  visited = {2}
  
  Neighbors of 2: [[1,1], [3,1]]
  
  Relax edge 2→1 (weight 1):
    newDist = 0 + 1 = 1
    1 < ∞ ? YES ✓
    distances[1] = 1
    minHeap.enqueue([1, 1])
  
  Relax edge 2→3 (weight 1):
    newDist = 0 + 1 = 1
    1 < ∞ ? YES ✓
    distances[3] = 1
    minHeap.enqueue([3, 1])
  
  State:
    distances = [∞, 1, 0, 1, ∞]
    minHeap = [[1,1], [3,1]]

─────────────────────────────────────

Step 2: Process node 1 (dist=1)
  
  visited = {2, 1}
  
  Neighbors of 1: [] (none)
  
  State:
    distances = [∞, 1, 0, 1, ∞]
    minHeap = [[3,1]]

─────────────────────────────────────

Step 3: Process node 3 (dist=1)
  
  visited = {2, 1, 3}
  
  Neighbors of 3: [[4,1]]
  
  Relax edge 3→4 (weight 1):
    newDist = 1 + 1 = 2
    2 < ∞ ? YES ✓
    distances[4] = 2
    minHeap.enqueue([4, 2])
  
  State:
    distances = [∞, 1, 0, 1, 2]
    minHeap = [[4,2]]

─────────────────────────────────────

Step 4: Process node 4 (dist=2)
  
  visited = {2, 1, 3, 4}
  
  Neighbors of 4: []
  
  State:
    distances = [∞, 1, 0, 1, 2]
    minHeap = []

─────────────────────────────────────

Final Result:
  distances = [∞, 1, 0, 1, 2]
  
  Maximum distance = max(1, 0, 1, 2) = 2 ✓
  
  All nodes reachable → return 2
```

---

**Why the Maximum?**

```
The problem asks: "How long does it take for the signal to reach ALL nodes?"

From k=2:
- Node 1 receives signal at time 1
- Node 3 receives signal at time 1
- Node 4 receives signal at time 2

When have ALL received the signal?
→ When the FARTHEST node receives it
→ max(1, 1, 2) = 2
```

---

**Edge Relaxation:**

```
"Relaxation" is updating the distance if we find a better path.

Example:
  distances[4] = 10  (current known path)
  
  We discover a new path: 3 → 4 with weight 1
  Distance from source to 3 = 8
  
  newDist = 8 + 1 = 9
  
  9 < 10 ? YES ✓
  distances[4] = 9  ← WE RELAX (update to better distance)
```


## 💻 Implementation

### Version 1: Standard API (Element + Priority Separated)

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Build adjacency list
    const adjList = new Map<number, number[][]>();
    for(let i = 1; i <= n; i++){
        adjList.set(i, []);
    }

    for(const [src, dest, weight] of times){
        adjList.get(src)!.push([dest, weight]);
    }
    
    // 2. Initialize distances
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    // 3. Min Priority Queue (Standard API)
    const minHeap = new MinPriorityQueue<number>();
    minHeap.enqueue(k, 0);  // (element, priority)

    const visited = new Set<number>();

    // 4. Dijkstra
    while(!minHeap.isEmpty()){
        const {element: node, priority: dist} = minHeap.dequeue();
        
        // Skip if already visited
        if(visited.has(node)){
            continue;
        }
        
        visited.add(node);

        // Relax edges
        for(const [neighbor, weight] of adjList.get(node)!){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue(neighbor, newDist);
            }
        }
    }

    // 5. Find maximum distance
    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Characteristics:**
- ✅ Explicit API: `enqueue(element, priority)`
- ✅ Object destructuring: `{element, priority}`
- ✅ Clear separation of element and priority

---

### Version 2: Custom Comparator (Tuples) ⭐

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Build adjacency list
    const adjList = new Map<number, number[][]>();
    for(let i = 1; i <= n; i++){
        adjList.set(i, []);
    }

    for(const [src, dest, weight] of times){
        adjList.get(src)!.push([dest, weight]);
    }
    
    // 2. Initialize distances
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    // 3. Min Priority Queue with custom comparator
    const minHeap = new MinPriorityQueue<[number,number]>(([,tw]) => tw); 
    minHeap.enqueue([k, 0]);  // [node, distance]

    const visited = new Set<number>();

    // 4. Dijkstra
    while(!minHeap.isEmpty()){
        const [node, dist] = minHeap.dequeue();
        
        if(visited.has(node)) continue;
        visited.add(node);

        for(const [neighbor, weight] of adjList.get(node)!){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue([neighbor, newDist]);
            }
        }
    }

    // 5. Find maximum distance
    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Characteristics:**
- ✅ Comparator: `([,tw]) => tw` extracts priority
- ✅ Tuples: `[node, distance]`
- ✅ Array destructuring: `[node, dist]`
- ✅ More concise

---

### Version 3: No Heap (Simple Array)

For n ≤ 100, a simple array is acceptable:

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Build adjacency list
    const adjList: Record<number, number[][]> = {};
    for(let i = 1; i <= n; i++){
        adjList[i] = [];
    }

    for(const [src, dest, weight] of times){
        adjList[src].push([dest, weight]);
    }
    
    // 2. Initialize distances
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    const visited = new Set<number>();

    // 3. Dijkstra without heap
    for(let i = 0; i < n; i++){
        // Find unvisited node with smallest distance
        let minDist = Infinity;
        let node = -1;
        
        for(let j = 1; j <= n; j++){
            if(!visited.has(j) && distances[j] < minDist){
                minDist = distances[j];
                node = j;
            }
        }
        
        if(node === -1) break;  // No more reachable nodes
        
        visited.add(node);

        // Relax edges
        for(const [neighbor, weight] of adjList[node]){
            const newDist = distances[node] + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
            }
        }
    }

    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Complexity:** O(V²) - acceptable for n ≤ 100

---

## 🎯 Version Comparison

| Version | API | Destructuring | Conciseness | Complexity |
|---------|-----|---------------|-----------|-------------|
| **Version 1** | `enqueue(k, 0)` | `{element, priority}` | Medium | O((V+E) log V) |
| **Version 2** | `enqueue([k, 0])` | `[node, dist]` | High ✅ | O((V+E) log V) |
| **Version 3** | No heap | N/A | Low | O(V²) |

**Recommendation:** Version 2 (custom comparator) is more elegant for interviews.

---

## ⚠️ Common Pitfalls

### 1. **Not marking nodes as visited**

```typescript
// ❌ INCORRECT - processes nodes multiple times
while(!minHeap.isEmpty()){
    const [node, dist] = minHeap.dequeue();
    // MISSING: check if already visited
    
    for(const [neighbor, weight] of adjList.get(node)!){
        // ...
    }
}

// ✅ CORRECT
while(!minHeap.isEmpty()){
    const [node, dist] = minHeap.dequeue();
    
    if(visited.has(node)) continue;  // ← CRITICAL
    visited.add(node);
    
    // ...
}
```

**Why?** Without tracking, a node can be processed multiple times → worse complexity.

---

### 2. **Using outdated distance from heap**

```typescript
// ❌ INCORRECT - use dist from heap
const [node, dist] = minHeap.dequeue();

for(const [neighbor, weight] of adjList.get(node)!){
    const newDist = dist + weight;  // ← Could be outdated
    // ...
}

// ✅ CORRECT - use updated distance
const [node, dist] = minHeap.dequeue();

if(visited.has(node)) continue;  // ← Skip outdated entries
visited.add(node);

for(const [neighbor, weight] of adjList.get(node)!){
    const newDist = dist + weight;  // ← Now correct
    // ...
}
```

**Explanation:** The heap can contain multiple entries for the same node with different distances. Only the first (smallest) one is valid.

---

### 3. **Forgetting to check for unreachable nodes**

```typescript
// ❌ INCORRECT
const maxDist = Math.max(...distances.slice(1));
return maxDist;  // ← Returns Infinity if there are unreachable nodes

// ✅ CORRECT
const maxDist = Math.max(...distances.slice(1));
return maxDist < Infinity ? maxDist : -1;  // ← Return -1
```

---

### 4. **Using Map but accessing like an object**

```typescript
// ❌ INCORRECT
const adjList = new Map<number, number[][]>();
for(const [neighbor, weight] of adjList[node]){  // ← Error!

// ✅ CORRECT
const adjList = new Map<number, number[][]>();
for(const [neighbor, weight] of adjList.get(node)!){  // ← .get()
```

---

### 5. **Not initializing all nodes in the adjacency list**

```typescript
// ❌ INCORRECT - only create nodes with outgoing edges
const adjList = new Map<number, number[][]>();
for(const [src, dest, weight] of times){
    if(!adjList.has(src)) adjList.set(src, []);
    adjList.get(src)!.push([dest, weight]);
}
// Nodes without outgoing edges won't exist in the Map

// ✅ CORRECT - initialize ALL nodes
const adjList = new Map<number, number[][]>();
for(let i = 1; i <= n; i++){
    adjList.set(i, []);  // ← Create all
}
for(const [src, dest, weight] of times){
    adjList.get(src)!.push([dest, weight]);
}
```

---

## 🧪 Big O Analysis

**Variables:**
- V = number of nodes (vertices)
- E = number of edges

### With Min Heap (Priority Queue)

**Time Complexity: O((V + E) log V)**

```
Breakdown:
- Initialization: O(V) to create adjacency list and distances
- Heap Push/Pop: O(log V) per operation
  - Each node processed once: V × O(log V)
  - Each edge relaxed once: E × O(log V)
- Total: O(V log V + E log V) = O((V + E) log V)
```

**Space Complexity: O(V + E)**

```
- Adjacency list: O(E) edges + O(V) nodes
- Distances array: O(V)
- MinHeap: O(V) maximum
- Visited set: O(V)
Total: O(V + E)
```

---

### No Heap (Simple Array)

**Time Complexity: O(V²)**

```
- Finding minimum: O(V) for each iteration
- V iterations: O(V²)
- Relax edges: O(E) total
- Total: O(V² + E) = O(V²) if graph is dense
```

**When to use each version:**

| Case | Version | Reason |
|------|---------|-------|
| n ≤ 100 | Simple array | Simpler, acceptable complexity |
| n > 100 | Min Heap | Much faster |
| Dense graph (E ≈ V²) | Min Heap | O(V² log V) vs O(V²) |
| Sparse graph (E ≈ V) | Min Heap | O(V log V) vs O(V²) |

---

## 🎯 Comparison: Dijkstra vs BFS vs Bellman-Ford

| Algorithm | Complexity | Weights | Best For | Limitation |
|-----------|-------------|-------|------------|------------|
| **BFS** | O(V + E) | All = 1 | Unweighted graphs | Only unit weight |
| **Dijkstra** | O((V+E) log V) | **Positive** ✅ | Shortest path with weights | No negative weights |
| **Bellman-Ford** | O(V × E) | Positive and Negative | Detect negative cycles | Very slow |

**Example of when to use each:**

```typescript
// BFS: All weights = 1
times = [[1,2,1], [2,3,1], [3,4,1]]
→ Use BFS (simpler)

// Dijkstra: Varied positive weights
times = [[1,2,5], [2,3,2], [3,4,10]]
→ Use Dijkstra ✅

// Bellman-Ford: Negative weights
times = [[1,2,5], [2,3,-3], [3,4,10]]
→ Use Bellman-Ford (Dijkstra fails)
```

---

## 🚀 When to Use Dijkstra

### ✅ Use Dijkstra When:

1. **Single-source shortest path** (one source to all)
2. **Positive weights** (0 ≤ weight)
3. **Directed or undirected graph**
4. **Efficiency is needed** O((V+E) log V)

### ❌ DO NOT Use Dijkstra When:

1. **Negative weights** → Use Bellman-Ford
2. **All-pairs shortest path** → Use Floyd-Warshall
3. **All weights = 1** → Use BFS (simpler)
4. **Directed Acyclic Graph (DAG)** → Use Topological Sort

---

## 💡 Real-World Use Cases

**Dijkstra is used in:**

- ✅ **GPS and Navigation:** Google Maps, Waze
- ✅ **Telecommunication Networks:** Packet routing
- ✅ **Games:** Pathfinding in video games
- ✅ **Social Networks:** Friend suggestions
- ✅ **Logistics:** Delivery route optimization
- ✅ **Internet:** Routing protocols (OSPF)

---

## 🎓 Dijkstra Template

```typescript
function dijkstra(graph: Graph, start: number): number[] {
    const distances = new Array(n + 1).fill(Infinity);
    distances[start] = 0;
    
    const minHeap = new MinPriorityQueue<[number, number]>(([,d]) => d);
    minHeap.enqueue([start, 0]);
    
    const visited = new Set<number>();
    
    while(!minHeap.isEmpty()){
        const [node, dist] = minHeap.dequeue();
        
        if(visited.has(node)) continue;
        visited.add(node);
        
        for(const [neighbor, weight] of graph[node]){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue([neighbor, newDist]);
            }
        }
    }
    
    return distances;
}
```

**Template Steps:**
1. Initialize distances to ∞.
2. Use a Min Heap ordered by distance.
3. Track visited nodes.
4. While there are nodes: process the one with the smallest distance.
5. Relax edges of neighbors.

---

## 📊 Global Progress

**Status:** 🏆 **Dijkstra MASTERED**

**Section 4: Graphs**
- [x] **Dijkstra's Algorithm** (1/3) ✅
- [ ] Prim's & Kruskal's (MST)
- [ ] Topological Sort (Kahn's)

**Solved Problems:** 26/45  
**Progress:** 58% of Syllabus  
**Mastered Patterns:** 11/15

---

## 🔥 Implementation Tips

1. **Always initialize all nodes** in the adjacency list.
2. **Use a Set for visited**, not an array.
3. **Check visited immediately** after dequeue.
4. **A custom comparator** makes the code cleaner.
5. **Don't forget `.get()`** with Map.
6. **Return -1** if some nodes are unreachable.
7. **For n ≤ 100**: a simple array works fine.
