### Cheapest Flights Within K Stops

Given a directed graph of `n` cities with flights `[from, to, price]`, find the cheapest flight from `src` to `dst` with **at most `k` stops**.

**Example:**
```
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 
       src = 0, dst = 3, k = 1
Output: 700

Graph:
    0 --100--> 1 --600--> 3
    ^          |
   100        100
    |          v
    2 --200--> 3

Paths:
- 0 → 1 → 3 (cost 700, 1 stop) ✓
- 0 → 1 → 2 → 3 (cost 400, 2 stops) ✗ Exceeds k=1

Result: 700
```

---

### Key Concepts

**1. Three-Dimensional State**

```
Normal Dijkstra state: (cost, node)
State here: (cost, node, stops)

The same node can be visited with different #stops:
- Node 2 with 1 stop
- Node 2 with 3 stops
These are DIFFERENT states.
```

**2. Do Not Mark Visited Globally**

```
❌ INCORRECT:
visited = Set<number>  // Only node

✅ CORRECT:
dist[node][stops] = best_cost
// Track by (node, stops)
```

**3. k Stops vs k+1 Flights**

```
k = 1 (maximum 1 stop)
means up to 2 flights:
  Flight 1: src → intermediate (0 stops so far)
  Flight 2: intermediate → dst (1 stop)

Therefore: stops <= k+1 in the code.
```

---

### Implementation

```typescript
function findCheapestPrice(
    n: number, 
    flights: number[][], 
    src: number, 
    dst: number, 
    k: number
): number {
    // 1. Build directed graph
    const graph = new Map<number, [number, number][]>();
    
    for(const [from, to, price] of flights){
        if(!graph.has(from)) graph.set(from, []);
        graph.get(from)!.push([to, price]);  // [destination, price]
    }
    
    // 2. Min Heap ordered by COST
    const minHeap = new MinPriorityQueue<{cost: number, node: number, stops: number}>(
        (item) => item.cost  // Order by accumulated cost
    );
    minHeap.enqueue({cost: 0, node: src, stops: 0});
    
    // 3. Track best cost by (node, #stops)
    const dist: number[][] = Array(n).fill(0).map(() => Array(k + 2).fill(Infinity));
    dist[src][0] = 0;
    
    // 4. Modified Dijkstra with stops limit
    while(!minHeap.isEmpty()){
        const {cost, node, stops} = minHeap.dequeue().element;
        
        // Early exit if we find destination
        if(node === dst){
            return cost;  // Return cost from heap
        }
        
        // If we exceed stops, skip
        if(stops > k) continue;
        
        // Explore neighbors
        if(!graph.has(node)) continue;
        
        for(const [neighbor, price] of graph.get(node)!){
            const newCost = cost + price;  // Add costs
            const newStops = stops + 1;
            
            // Only process if it doesn't exceed limit AND is better
            if(newStops <= k + 1 && newCost < dist[neighbor][newStops]){
                dist[neighbor][newStops] = newCost;
                minHeap.enqueue({cost: newCost, node: neighbor, stops: newStops});
            }
        }
    }
    
    // 5. Path not found
    return -1;
}
```

---

### Full Trace

```typescript
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], 
src = 0, dst = 2, k = 1

Graph:
graph = {
  0: [[1, 100], [2, 500]],
  1: [[2, 100]]
}

─────────────────────────────────────

Initial:
  minHeap = [{cost: 0, node: 0, stops: 0}]
  dist[node][stops] = Infinity for all
  dist[0][0] = 0

─────────────────────────────────────

Step 1: Process {cost=0, node=0, stops=0}

node === dst? 0 === 2? NO
stops=0 <= k=1? YES ✓

Neighbors: [[1, 100], [2, 500]]

Neighbor [1, 100]:
  newCost = 0 + 100 = 100
  newStops = 0 + 1 = 1
  1 <= k+1=2? YES ✓
  100 < dist[1][1]=Inf? YES ✓
  dist[1][1] = 100
  minHeap.enqueue({100, 1, 1})

Neighbor [2, 500]:
  newCost = 0 + 500 = 500
  newStops = 1
  1 <= k+1=2? YES ✓
  500 < dist[2][1]=Inf? YES ✓
  dist[2][1] = 500
  minHeap.enqueue({500, 2, 1})

State:
  minHeap = [{100, 1, 1}, {500, 2, 1}]
  dist[1][1] = 100
  dist[2][1] = 500

─────────────────────────────────────

Step 2: Process {cost=100, node=1, stops=1}

node === dst? 1 === 2? NO
stops=1 <= k=1? YES ✓

Neighbors: [[2, 100]]

Neighbor [2, 100]:
  newCost = 100 + 100 = 200
  newStops = 1 + 1 = 2
  2 <= k+1=2? YES ✓
  200 < dist[2][2]=Inf? YES ✓
  dist[2][2] = 200
  minHeap.enqueue({200, 2, 2})

State:
  minHeap = [{200, 2, 2}, {500, 2, 1}]
  dist[2][2] = 200

─────────────────────────────────────

Step 3: Process {cost=200, node=2, stops=2}

node === dst? 2 === 2? YES ✓
return 200

─────────────────────────────────────

Result: 200 ✓

Note: Path 0 → 1 → 2 with 1 stop (cost 200)
      is better than direct 0 → 2 (cost 500).
```

---

## ⚠️ Common Pitfalls

### Problem 1: Maximum Probability

**1. Not saving probability with neighbor**

```typescript
// ❌ INCORRECT - You lose the association
graph.set(u, [...graph.get(u) || [], v]);  // Only neighbor

// ✅ CORRECT - Save [neighbor, probability]
graph.get(u)!.push([v, succProb[i]]);
```

---

**2. Using Min Heap instead of Max Heap**

```typescript
// ❌ INCORRECT
const minHeap = new MinPriorityQueue<{prob: number, node: number}>();

// ✅ CORRECT - MAX heap to maximize
const maxHeap = new MaxPriorityQueue<{currProb: number, node: number}>(
    (item) => item.currProb
);
```

---

**3. Incorrect Array Size**

```typescript
// ❌ INCORRECT
const prob = new Array(edges.length).fill(0);  // # of edges

// ✅ CORRECT
const prob = new Array(n).fill(0);  // # of nodes
```

---

**4. Incorrect Comparison**

```typescript
// ❌ INCORRECT
if(newProb > succProb[neighbor])  // succProb is the input

// ✅ CORRECT
if(newProb > prob[neighbor])  // prob is the probability array
```

---

### Problem 2: Cheapest Flights

**1. Heap missing the cost**

```typescript
// ❌ INCORRECT - Missing cost
minHeap.enqueue({node: src, stops: 0});

// ✅ CORRECT - Include cost
minHeap.enqueue({cost: 0, node: src, stops: 0});
```

---

**2. Sorting by stops instead of cost**

```typescript
// ❌ INCORRECT
new MinPriorityQueue<...>({compare: (a,b) => a.stops - b.stops});

// ✅ CORRECT - Sort by COST
new MinPriorityQueue<...>((item) => item.cost);
```

---

**3. Returning incorrect value**

```typescript
// ❌ INCORRECT
if(node === dst) return prices[node];  // Array might be outdated

// ✅ CORRECT - Return cost from the heap
if(node === dst) return cost;  // cost comes from the heap
```

---

**4. Calculating new cost incorrectly**

```typescript
// ❌ INCORRECT
const newCost = prices[node] + price;  // prices might be wrong

// ✅ CORRECT
const newCost = cost + price;  // cost from the heap
```

---

**5. Not tracking (node, stops)**

```typescript
// ❌ INCORRECT - Node only
const prices = new Array(n).fill(Infinity);

// ✅ CORRECT - By (node, stops)
const dist: number[][] = Array(n).fill(0).map(() => Array(k + 2).fill(Infinity));
```

---

## 🧪 Big O Analysis

### Maximum Probability

**Time Complexity: O(E log V)**

```
- Graph construction: O(E)
- Heap operations: O(E log V)
  - Each edge is relaxed at most once
  - Each insertion: O(log V)

Total: O(E log V)
```

**Space Complexity: O(V + E)**

```
- Graph: O(E) edges + O(V) nodes
- prob array: O(V)
- maxHeap: O(V)
- visited: O(V)

Total: O(V + E)
```

---

### Cheapest Flights

**Time Complexity: O(E × k × log(V × k))**

```
- Each (node, stops) is a different state
- Maximum V × k states
- Heap operations: O(log(V × k))
- Each edge can be processed k times

Total: O(E × k × log(V × k))
```

**Space Complexity: O(V × k)**

```
- Graph: O(E)
- dist[V][k+2]: O(V × k)
- minHeap: O(V × k) in worst case

Total: O(V × k + E)
```

---

## 🎯 Comparison: Three Dijkstra Variants

| Aspect | Classic | Max Probability | Cheapest Flights |
|---------|---------|-----------------|------------------|
| **Type** | Minimization | **Maximization** | Minimization with constraint |
| **Heap** | Min | **Max** | Min |
| **State** | `(dist, node)` | `(prob, node)` | **(cost, node, stops)** |
| **Operation** | Addition | **Multiplication** | Addition |
| **Initial** | 0 / ∞ | **1.0 / 0** | 0 |
| **Visited** | Simple Set | Simple Set | **By (node, stops)** |
| **Complexity** | O(E log V) | O(E log V) | **O(E×k × log(V×k))** |

---

## 🎓 General Template

```typescript
// Modifiable template for Dijkstra variants

function dijkstraVariant(graph, start, end, constraint?) {
    // 1. Initialize heap (min or max depending on problem)
    const heap = new PriorityQueue<State>();
    heap.enqueue(initialState);
    
    // 2. Track visited or distances
    const dist = initializeDistances();
    
    // 3. Main loop
    while(!heap.isEmpty()){
        const state = heap.dequeue();
        
        // Early exit
        if(state.node === end) return state.value;
        
        // Check constraints
        if(violated(constraint)) continue;
        
        // Mark visited (if applicable)
        markVisited(state);
        
        // Explore neighbors
        for(const neighbor of graph.get(state.node)){
            const newState = computeNewState(state, neighbor);
            
            if(isBetter(newState, dist[neighbor])){
                updateDist(neighbor, newState);
                heap.enqueue(newState);
            }
        }
    }
    
    return notFound;
}
```

---

## 💡 Real-World Use Cases

**Maximum Probability:**
- ✅ Communication networks (maximize reliability)
- ✅ Transport routes (maximize probability of success)
- ✅ Routing with packet loss

**Cheapest Flights:**
- ✅ Flight booking systems
- ✅ Route optimization with constraints
- ✅ Multimodal transport planning

---

## 📊 Global Progress

**Status:** 🏆 **DIJKSTRA VARIANTS MASTERED**

**Section 4: Graphs** (COMPLETE ✅)
- [x] Dijkstra's Algorithm (Network Delay) ✅
- [x] **Dijkstra Variant 1 (Max Probability)** ✅
- [x] **Dijkstra Variant 2 (Cheapest Flights)** ✅
- [x] Prim's & Kruskal's (MST) ✅
- [x] Topological Sort ✅

**Solved Problems:** 30/45  
**Progress:** 67% of Syllabus  
**Mastered Patterns:** 13/15

---

## 🔥 Implementation Tips

### Maximum Probability:
1. **Max Heap**, not Min Heap.
2. **Multiply** probabilities, do not add.
3. Keep `[neighbor, probability]` together.
4. Initial: `prob[start] = 1.0`, others `0.0`.
5. Compare: `newProb > prob[neighbor]`.

### Cheapest Flights:
1. State: `(cost, node, stops)` - **three-dimensional**.
2. **Sort by cost**, not by stops.
3. **DO NOT mark visited** globally.
4. Track: `dist[node][stops]`.
5. Return `cost` from heap, not from array.
6. k stops = k+1 flights maximum.

### General:
- Identify what is being maximized/minimized.
- Determine necessary state (2D or 3D).
- Correct Heap (Min or Max).
- Check operation (addition, multiplication, etc.).
- Early exit when destination is found.
