# Path with Maximum Probability

### Problem Statement

Given an undirected graph with `n` nodes and edges with success probabilities, find the path from `start` to `end` with the **maximum probability** of success.

**Example:**
```
Input: n = 3, edges = [[0,1],[1,2],[0,2]], 
       succProb = [0.5, 0.5, 0.2], start = 0, end = 2
Output: 0.25

Graph:
    0 --0.5-- 1
     \        |
     0.2     0.5
       \      |
        ---- 2

Path 1: 0 → 2 (prob = 0.2)
Path 2: 0 → 1 → 2 (prob = 0.5 × 0.5 = 0.25) ✓

Maximum: 0.25
```

---

### Key Concepts

**1. Probabilities are Multiplied**

```
Path probability = product of edge probabilities

Path: A → B → C
Prob(A→B) = 0.8
Prob(B→C) = 0.5

Total Prob: 0.8 × 0.5 = 0.4
```

**2. Multiplying Decreases Values**

```
0.8 × 0.5 = 0.4 < 0.8

This is why we need to MAXIMIZE (Max Heap)
Not MINIMIZE as in classic Dijkstra.
```

**3. Initial Values**

```
prob[start] = 1.0  (100% we are at start)
prob[others] = 0.0  (0% we are elsewhere)

We seek to maximize prob[end]
```

---

### Implementation

```typescript
function maxProbability(
    n: number, 
    edges: number[][], 
    succProb: number[], 
    start_node: number, 
    end_node: number
): number {
    // 1. Build bidirectional graph with probabilities
    const graph = new Map<number, [number, number][]>();
    
    for(let i = 0; i < edges.length; i++){
        const [u, v] = edges[i];
        const p = succProb[i];
        
        if(!graph.has(u)) graph.set(u, []);
        if(!graph.has(v)) graph.set(v, []);
        
        graph.get(u)!.push([v, p]);  // [neighbor, probability]
        graph.get(v)!.push([u, p]);  // Bidirectional
    }
    
    // 2. Initialize probabilities
    const prob = new Array<number>(n).fill(0.0);
    prob[start_node] = 1.0;
    
    // 3. Max Heap ordered by probability (LARGEST first)
    const maxHeap = new MaxPriorityQueue<{currProb: number, node: number}>(
        (item) => item.currProb
    );
    maxHeap.enqueue({currProb: 1.0, node: start_node});
    
    const visited = new Set<number>();
    
    // 4. Modified Dijkstra (MAXIMIZE)
    while(!maxHeap.isEmpty()){
        const {currProb, node} = maxHeap.dequeue().element;
        
        // Early exit if we find destination
        if(node === end_node){
            return currProb;
        }
        
        // Skip if already visited
        if(visited.has(node)){
            continue;
        }
        visited.add(node);
        
        // Explore neighbors
        if(!graph.has(node)) continue;
        
        for(const [neighbor, edgeProb] of graph.get(node)!){
            const newProb = currProb * edgeProb;  // Multiply probabilities
            
            // If we find a HIGHER probability
            if(newProb > prob[neighbor]){
                prob[neighbor] = newProb;
                maxHeap.enqueue({currProb: newProb, node: neighbor});
            }
        }
    }
    
    // 5. No path exists
    return 0.0;
}
```

---

### Full Trace

```typescript
n = 3, edges = [[0,1],[1,2],[0,2]], 
succProb = [0.5, 0.5, 0.2], start = 0, end = 2

Graph:
graph = {
  0: [[1, 0.5], [2, 0.2]],
  1: [[0, 0.5], [2, 0.5]],
  2: [[1, 0.5], [0, 0.2]]
}

─────────────────────────────────────

Initial:
  prob = [1.0, 0, 0]
  maxHeap = [{1.0, 0}]
  visited = {}

─────────────────────────────────────

Step 1: Process node=0, currProb=1.0

node === end? 0 === 2? NO
visited.has(0)? NO
visited.add(0) → visited = {0}

Neighbors: [[1, 0.5], [2, 0.2]]

Neighbor [1, 0.5]:
  newProb = 1.0 × 0.5 = 0.5
  0.5 > prob[1]=0? YES ✓
  prob[1] = 0.5
  maxHeap.enqueue({0.5, 1})

Neighbor [2, 0.2]:
  newProb = 1.0 × 0.2 = 0.2
  0.2 > prob[2]=0? YES ✓
  prob[2] = 0.2
  maxHeap.enqueue({0.2, 2})

State:
  prob = [1.0, 0.5, 0.2]
  maxHeap = [{0.5, 1}, {0.2, 2}]  ← Max heap: 0.5 first


─────────────────────────────────────

Step 2: Process node=1, currProb=0.5

node === end? 1 === 2? NO
visited.has(1)? NO
visited.add(1) → visited = {0, 1}

Neighbors: [[0, 0.5], [2, 0.5]]

Neighbor [0, 0.5]:
  newProb = 0.5 × 0.5 = 0.25
  0.25 > prob[0]=1.0? NO → skip

Neighbor [2, 0.5]:
  newProb = 0.5 × 0.5 = 0.25
  0.25 > prob[2]=0.2? YES ✓ (better path!)
  prob[2] = 0.25
  maxHeap.enqueue({0.25, 2})

State:
  prob = [1.0, 0.5, 0.25]
  maxHeap = [{0.25, 2}, {0.2, 2}]

─────────────────────────────────────

Step 3: Process node=2, currProb=0.25

node === end? 2 === 2? YES ✓
return 0.25

─────────────────────────────────────

Result: 0.25 ✓
```
