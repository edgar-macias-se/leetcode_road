# Topological Sort - Kahn's Algorithm (Full Mastery)

## 🏷️ Tags

`#TopologicalSort` `#Kahn` `#DAG` `#Graph` `#BFS` `#Queue` `#Medium` `#TypeScript`

---

# Course Schedule (LeetCode #207)

## 🧠 Key Concept

**Topological Sort** is a linear ordering of the nodes in a directed acyclic graph (DAG) where for every directed edge `u → v`, node `u` appears **BEFORE** `v` in the ordering.

**Kahn's Algorithm** uses BFS with a queue to process nodes in topological order, detecting cycles in the process.

---

## 🗺️ The Strategy

### English Translation

**The Problem:**
```
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: true

Interpretation:
- prerequisites[i] = [a, b] means:
  "To take course a, you must complete course b FIRST"

- [1,0]: To take course 1, you need course 0
- [2,0]: To take course 2, you need course 0
- [3,1]: To take course 3, you need course 1
- [3,2]: To take course 3, you need course 2

Dependency Graph:
       0
      / \
     1   2
      \ /
       3

Valid order: [0, 1, 2, 3] or [0, 2, 1, 3]
Both respect the rule: course before its dependents.
```

---

**What is Topological Sort?**

```
Definition:
  Ordering of nodes where each node appears
  BEFORE all the nodes it points to.

Application:
  - Task scheduling with dependencies
  - Build systems (compilation)
  - Package installation
  - Dependency resolution

Requirement:
  The graph MUST be a DAG (Directed Acyclic Graph).
  If there is a cycle → NO topological ordering exists.
```

**Visual Example:**

```
Dressing tasks:

    Underwear
         ↓
       Pants
         ↓
       Shoes

Topological order: [Underwear, Pants, Shoes]

You CANNOT do: [Shoes, Pants, Underwear] ❌
```

**With a Cycle (Impossible):**

```
    A → B
    ↑   ↓
    └─ C

Cycle: A → B → C → A

A before B? Yes (A → B)
B before C? Yes (B → C)
C before A? Yes (C → A)
A before A? ❌ IMPOSSIBLE

No valid topological order exists.
```

---

**Key Concept: In-Degree**

```
In-degree = number of edges POINTING towards a node.

Example:
    A → B → C
        ↑
        D

indegree[A] = 0  (nothing points to A)
indegree[B] = 2  (A and D point to B)
indegree[C] = 1  (B points to C)
indegree[D] = 0  (nothing points to D)
```

**Fundamental Property:**

```
Nodes with indegree = 0 have NO prerequisites.
→ They can be processed FIRST.

When processing a node, we "remove" its outgoing edges.
→ We decrement the indegree of its neighbors.
→ If a neighbor's indegree reaches 0, it can now be processed.
```

---

**Kahn's Algorithm (Step-by-Step):**

```
1. Calculate the indegree of all nodes.
   indegree[node] = # of edges pointing to node.

2. Add nodes with indegree = 0 to the queue.
   (These have no prerequisites).

3. While the queue is not empty:
   a. Extract a node from the queue.
   b. Process the node (add to the result).
   c. For each neighbor of the node:
      - Decrement its indegree (remove dependency).
      - If it reaches 0, add it to the queue.

4. Check if all nodes were processed:
   - If all processed → No cycle ✓
   - If some not processed → Cycle exists ❌
```

**Why Does It Work?**

```
If there is a cycle:
    A → B → C → A

Everyone will always have an indegree ≥ 1.
There will never be a "free" node (indegree = 0).
Some nodes will remain unprocessed.
→ We detect the cycle.

If there is NO cycle:
There is always at least one node with indegree = 0.
We process all nodes eventually.
→ Valid ordering found.
```

---

**Step-by-Step Visualization:**

```
Graph: 0 → 1 → 3
       0 → 2 → 3

Step 1: Calculate indegree
  indegree = [0, 1, 1, 2]
               0  1  2  3

Step 2: Initial Queue = [0] (only 0 has indegree=0)

Step 3: Process 0
  Result = [0]
  Remove edges 0→1, 0→2
  indegree = [0, 0, 0, 2]
  Queue = [1, 2]

Step 4: Process 1
  Result = [0, 1]
  Remove edge 1→3
  indegree = [0, 0, 0, 1]
  Queue = [2]

Step 5: Process 2
  Result = [0, 1, 2]
  Remove edge 2→3
  indegree = [0, 0, 0, 0]
  Queue = [3]

Step 6: Process 3
  Result = [0, 1, 2, 3]
  Queue = []

Result: [0, 1, 2, 3] ✓ Valid topological order.
```

## 💻 Implementation

### TypeScript Version (Full)

```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // 1. Initialize structures
    const indegree: number[] = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    
    // 2. Build graph
    // prerequisites[i] = [course, prerequisite]
    // "To take 'course', you need 'prerequisite' first"
    // Edge: prerequisite → course
    for (const [course, prerequisite] of prerequisites) {
        indegree[course]++;              // course depends on prerequisite
        adj[prerequisite].push(course);   // prerequisite → course
    }
    
    // 3. Queue with courses having no prerequisites
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    // 4. Process courses in topological order
    let processed = 0;
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        processed++;
        
        // Remove this course as a prerequisite for others
        for (const neighbor of adj[course]) {
            indegree[neighbor]--;
            
            // If it no longer has prerequisites, it can be taken
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // 5. Check if all courses were processed
    return processed === numCourses;
}
```

---

### JavaScript Version (LeetCode)

```javascript
class Solution {
    /**
     * @param {number} numCourses
     * @param {number[][]} prerequisites
     * @return {boolean}
     */
    canFinish(numCourses, prerequisites) {
        const indegree = Array(numCourses).fill(0);
        const adj = Array.from({ length: numCourses }, () => []);
        
        // Build graph: prerequisite → course
        for (const [course, prerequisite] of prerequisites) {
            indegree[course]++;
            adj[prerequisite].push(course);
        }
        
        // Queue with courses having no prerequisites
        const queue = [];
        for (let i = 0; i < numCourses; i++) {
            if (indegree[i] === 0) {
                queue.push(i);
            }
        }
        
        let processed = 0;
        
        while (queue.length > 0) {
            const course = queue.shift();
            processed++;
            
            for (const neighbor of adj[course]) {
                indegree[neighbor]--;
                if (indegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }
        
        return processed === numCourses;
    }
}
```

---

### Variant: Return the Topological Order

```typescript
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const indegree: number[] = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    
    for (const [course, prerequisite] of prerequisites) {
        indegree[course]++;
        adj[prerequisite].push(course);
    }
    
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result: number[] = [];
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        result.push(course);  // Add to result
        
        for (const neighbor of adj[course]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // If there is a cycle, return an empty array
    return result.length === numCourses ? result : [];
}
```

---

## 📊 Full Trace

### Example 1: No Cycle (Possible)

```typescript
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]

Graph:
       0
      / \
     1   2
      \ /
       3

─────────────────────────────────────

Step 1: Build graph

for ([course=1, prerequisite=0]):
    indegree[1]++  → indegree = [0, 1, 0, 0]
    adj[0].push(1) → adj = [[1], [], [], []]

for ([course=2, prerequisite=0]):
    indegree[2]++  → indegree = [0, 1, 1, 0]
    adj[0].push(2) → adj = [[1,2], [], [], []]

for ([course=3, prerequisite=1]):
    indegree[3]++  → indegree = [0, 1, 1, 1]
    adj[1].push(3) → adj = [[1,2], [3], [], []]

for ([course=3, prerequisite=2]):
    indegree[3]++  → indegree = [0, 1, 1, 2]
    adj[2].push(3) → adj = [[1,2], [3], [3], []]

Final state:
    indegree = [0, 1, 1, 2]
    adj = [[1,2], [3], [3], []]

─────────────────────────────────────

Step 2: Initialize queue

for i=0: indegree[0]=0 → queue.push(0)
for i=1: indegree[1]=1 → skip
for i=2: indegree[2]=1 → skip
for i=3: indegree[3]=2 → skip

queue = [0]
processed = 0

─────────────────────────────────────

Step 3: Process course 0

course = queue.shift() → course = 0
processed = 1

for neighbor=1 in adj[0]=[1,2]:
    indegree[1]-- → indegree[1] = 0
    indegree[1]==0? YES → queue.push(1)

for neighbor=2 in adj[0]=[1,2]:
    indegree[2]-- → indegree[2] = 0
    indegree[2]==0? YES → queue.push(2)

queue = [1, 2]
indegree = [0, 0, 0, 2]

─────────────────────────────────────

Step 4: Process course 1

course = queue.shift() → course = 1
processed = 2

for neighbor=3 in adj[1]=[3]:
    indegree[3]-- → indegree[3] = 1
    indegree[3]==0? NO

queue = [2]
indegree = [0, 0, 0, 1]

─────────────────────────────────────

Step 5: Process course 2

course = queue.shift() → course = 2
processed = 3

for neighbor=3 in adj[2]=[3]:
    indegree[3]-- → indegree[3] = 0
    indegree[3]==0? YES → queue.push(3)

queue = [3]
indegree = [0, 0, 0, 0]

─────────────────────────────────────

Step 6: Process course 3

course = queue.shift() → course = 3
processed = 4

for neighbor in adj[3]=[]:
    (empty)

queue = []

─────────────────────────────────────

Result:
processed = 4 === numCourses = 4 ✓

return true

Topological order: [0, 1, 2, 3]
```

---

### Example 2: With a Cycle (Impossible)

```typescript
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]

Graph (CYCLE):
    0 ⇄ 1

─────────────────────────────────────

Step 1: Build graph

for ([course=1, prerequisite=0]):
    indegree[1]++  → indegree = [0, 1]
    adj[0].push(1) → adj = [[1], []]

for ([course=0, prerequisite=1]):
    indegree[0]++  → indegree = [1, 1]
    adj[1].push(0) → adj = [[1], [0]]

Final state:
    indegree = [1, 1]  ← Both have prerequisites
    adj = [[1], [0]]

─────────────────────────────────────

Step 2: Initialize queue

for i=0: indegree[0]=1 → skip
for i=1: indegree[1]=1 → skip

queue = []  ← EMPTY! No courses without prerequisites.
processed = 0

─────────────────────────────────────

Step 3: While loop

queue.length = 0
Loop does not run.

─────────────────────────────────────

Result:
processed = 0 !== numCourses = 2 ❌

return false

Cycle exists → Impossible to complete all courses.
```

---

### Example 3: Multiple Paths

```typescript
Input: numCourses = 6, prerequisites = [[3,0],[4,1],[5,2],[3,1],[4,2],[5,3],[5,4]]

Graph:
    0   1   2
     \ / \ / 
      3   4
       \ /
        5

Construction:
    indegree = [0, 0, 0, 2, 2, 3]
    adj = [[3], [3,4], [4,5], [5], [5], []]

Process:
    Initial Queue: [0, 1, 2]
    
    Process 0:
      indegree[3]-- → indegree[3] = 1
      Queue: [1, 2]
    
    Process 1:
      indegree[3]-- → indegree[3] = 0 → queue.push(3)
      indegree[4]-- → indegree[4] = 1
      Queue: [2, 3]
    
    Process 2:
      indegree[4]-- → indegree[4] = 0 → queue.push(4)
      indegree[5]-- → indegree[5] = 2
      Queue: [3, 4]
    
    Process 3:
      indegree[5]-- → indegree[5] = 1
      Queue: [4]
    
    Process 4:
      indegree[5]-- → indegree[5] = 0 → queue.push(5)
      Queue: [5]
    
    Process 5:
      Queue: []

Result:
    processed = 6 === numCourses ✓
    Order: [0, 1, 2, 3, 4, 5] or [1, 0, 2, 3, 4, 5], etc.
```

---

## ⚠️ Common Pitfalls

### 1. **Inverting Edge Direction**

```typescript
// ❌ INCORRECT - inverted edges
for (const [a, b] of prerequisites) {
    indegree[b]++;      // b does not depend on a
    adj[a].push(b);     // a → b (inverted)
}

// ✅ CORRECT - prerequisite → course
for (const [course, prerequisite] of prerequisites) {
    indegree[course]++;              // course depends on prerequisite
    adj[prerequisite].push(course);   // prerequisite → course
}
```

**Reminder:** `[course, prerequisite]` means "To take course, you need prerequisite".

---

### 2. **Not Verifying All Processed Nodes**

```typescript
// ❌ INCORRECT - only checks if queue is empty
while (queue.length > 0) {
    // ...
}
return true;  // Always returns true

// ✅ CORRECT - count processed nodes
let processed = 0;
while (queue.length > 0) {
    processed++;
    // ...
}
return processed === numCourses;
```

---

### 3. **Using array.shift() Instead of an Efficient Queue**

```typescript
// ⚠️ WORKS but inefficient O(n) per shift
const course = queue.shift();

// ✅ BETTER for production - use an index
let front = 0;
while (front < queue.length) {
    const course = queue[front++];
    // ...
}

// Or use a real Queue structure.
```

---

### 4. **Forgetting to Handle Multiple Courses Without Prerequisites**

```typescript
// ❌ INCORRECT - only adds the first one
for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) {
        queue.push(i);
        break;  // ← ERROR: adds only one
    }
}

// ✅ CORRECT - add ALL
for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) {
        queue.push(i);  // Add all courses without prerequisites
    }
}
```

---

### 5. **Not Decrementing in-degree Before Verifying**

```typescript
// ❌ INCORRECT - verifies before decrementing
for (const neighbor of adj[course]) {
    if (indegree[neighbor] === 0) {
        queue.push(neighbor);
    }
    indegree[neighbor]--;
}

// ✅ CORRECT - decrement first
for (const neighbor of adj[course]) {
    indegree[neighbor]--;
    if (indegree[neighbor] === 0) {
        queue.push(neighbor);
    }
}
```

---

## 🧪 Big O Analysis

**Variables:**
- V = number of nodes (courses)
- E = number of edges (prerequisites)

**Time Complexity: O(V + E)**

```
Breakdown:
1. Build graph: O(E)
   - Process each prerequisite once.

2. Initialize queue: O(V)
   - Check the in-degree of each node.

3. Process nodes: O(V + E)
   - Each node is processed once: O(V).
   - Each edge is visited once: O(E).

Total: O(E) + O(V) + O(V + E) = O(V + E)
```

**Space Complexity: O(V + E)**

```
- indegree array: O(V)
- adjacency list: O(V + E)
  - V lists
  - E total edges
- queue: O(V) in worst case
- result array: O(V) if storing order

Total: O(V + E)
```

**Practical Comparison:**

| V | E | Operations (V+E) | Approx Time |
|---|---|-------------------|--------------|
| 10 | 20 | 30 | < 1ms |
| 100 | 500 | 600 | ~1ms |
| 1,000 | 5,000 | 6,000 | ~10ms |
| 10,000 | 50,000 | 60,000 | ~100ms |

**Very efficient:** Linear in the size of the graph.

---

## 🎯 Comparison: DFS vs BFS (Kahn)

| Aspect | DFS (Recursive) | BFS (Kahn) |
|---------|-----------------|------------|
| **Structure** | Stack (recursion) | Queue (explicit) |
| **Complexity** | O(V + E) | O(V + E) |
| **Detects cycles** | Using colors/states | Using a counter |
| **Order** | Reverse post-order | Direct |
| **Implementation** | More complex | Simpler ✅ |
| **Iterative** | Needs an explicit stack | Natural with a queue |

**Kahn is preferred because:**
- ✅ More intuitive.
- ✅ Easier to implement.
- ✅ Natural cycle detection.
- ✅ Iterative (no stack overflow).

---

## 🎓 Kahn's Algorithm Template

```typescript
function topologicalSort(n: number, edges: number[][]): number[] {
    // 1. Build graph
    const indegree = new Array(n).fill(0);
    const adj = Array.from({ length: n }, () => []);
    
    for (const [to, from] of edges) {
        indegree[to]++;
        adj[from].push(to);
    }
    
    // 2. Queue with nodes having no dependencies
    const queue: number[] = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    // 3. Process in topological order
    const result: number[] = [];
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node);
        
        for (const neighbor of adj[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // 4. Check if a cycle exists
    return result.length === n ? result : [];
}
```

---

## 💡 Real-World Use Cases

**Topological Sort is used in:**

- ✅ **Build systems:** Make, Maven, Gradle (compilation order)
- ✅ **Package managers:** npm, pip (dependency resolution)
- ✅ **Task scheduling:** Planning with prerequisites
- ✅ **Course planning:** University curriculum planning
- ✅ **Excel formulas:** Cell calculation order
- ✅ **Symbol resolution:** Compilers (resolution order)
- ✅ **Lazy evaluation:** Expression evaluation order

---

## 📊 Global Progress

**Status:** 🏆 **TOPOLOGICAL SORT (KAHN'S) MASTERED**

**Section 4: Graphs** (COMPLETE ✅)
- [x] Dijkstra's Algorithm (1/3) ✅
- [x] Prim's & Kruskal's (MST) (2/3) ✅
- [x] **Topological Sort (Kahn's)** (3/3) ✅

**Solved Problems:** 28/45  
**Progress:** 62% of Syllabus  
**Mastered Patterns:** 13/15

**Section 4: Graphs COMPLETE!** 🎉

---

## 🔥 Implementation Tips

1. **Clear Naming:** `[course, prerequisite]` is better than `[a, b]`.
2. **Correct Edges:** `prerequisite → course`.
3. **Decrement First:** Before checking `indegree === 0`.
4. **Count Processed:** Do not just check for an empty queue.
5. **All Initial Nodes:** Add ALL nodes with `indegree=0`.
6. **Efficient Queue:** Consider using an index instead of `shift()`.
7. **DAG Requirement:** Only works without cycles.

---

## 🎯 When to Use Topological Sort

### ✅ Use When:

1. **Directed Acyclic Graph (DAG)**.
2. **Dependencies between tasks**.
3. **You need a processing order**.
4. **Detecting cycles in dependencies**.

### ❌ DO NOT Use When:

1. **Undirected graph** → Use other algorithms.
2. **Cycles are allowed** → There is no topological order.
3. **You only need connectivity** → Use DFS/BFS.
4. **Shortest path** → Use Dijkstra.

---

## 🚀 Next Section

**You have completed Section 4: Graphs!** 🎉

**Next:** Section 5: Dynamic Programming
- 0/1 Knapsack
- Unbounded Knapsack
- LCS (Longest Common Subsequence)
- Palindromes

**Target:** February 2025 🎯
