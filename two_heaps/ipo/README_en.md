# IPO (LeetCode #502)

## 🏷️ Tags

`#TwoHeaps` `#Greedy` `#PriorityQueue` `#Heap` `#Hard` `#TypeScript`

## 🧠 Key Concept

This problem combines **Two Heaps with a Greedy strategy**. Unlike other Two Heaps problems where both heaps maintain balanced sizes (like in Find Median), here each heap has a **different purpose**:

1. **Min Heap (sorted by capital):** Maintains ALL projects sorted by the minimum capital required.
2. **Max Heap (sorted by profit):** Maintains only the AVAILABLE projects (those we can do with our current capital) sorted by maximum profit.

The greedy strategy is: **In each iteration, always choose the project with the highest profit among those we can afford.**

The key trick is that capital increases with each completed project, which unlocks new projects in future iterations.

## 🗺️ The Strategy

### Initial Setup
```
1. Create minCapitalHeap with ALL projects
   - Sorted by minimum capital required
   - Structure: {capital, profit}

2. Create an empty maxProfitHeap
   - Sorted by profit (highest first)
   - Structure: only the profit

3. currentCapital = W (initial capital)
```

### Main Algorithm (k iterations)

For each of the k allowed projects:

**Step 1: Unlock available projects**
```
While minCapitalHeap is not empty 
  AND the project with the lowest capital <= currentCapital:
    - Extract that project from minCapitalHeap
    - Add it to maxProfitHeap (only its profit)
```

**Step 2: Execute the best available project**
```
If maxProfitHeap is not empty:
    - Extract the project with the highest profit
    - currentCapital += profit
Else:
    - No available projects, terminate early
```

### Flow Diagram

```
Initial Projects:
  P0: capital=0, profit=1
  P1: capital=1, profit=2
  P2: capital=1, profit=3

┌─────────────────────────────────────────────────────┐
│ INITIAL STATE (W=0, k=2)                           │
├─────────────────────────────────────────────────────┤
│ minCapitalHeap (by capital):                       │
│   [(0,1), (1,2), (1,3)]                           │
│        ↑                                           │
│   lowest capital                                   │
│                                                     │
│ maxProfitHeap (by profit):                         │
│   []                                               │
│                                                     │
│ currentCapital = 0                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ITERATION 1                                         │
├─────────────────────────────────────────────────────┤
│ Step 1: Unlock projects                             │
│   Is (0,1) available? (0 <= 0) → YES                │
│   → Move to maxProfitHeap                          │
│   Is (1,2) available? (1 <= 0) → NO                 │
│   → STOP                                           │
│                                                     │
│ Step 2: Execute best project                        │
│   maxProfitHeap.pop() = 1                          │
│   currentCapital = 0 + 1 = 1                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ITERATION 2                                         │
├─────────────────────────────────────────────────────┤
│ Step 1: Unlock projects                             │
│   Is (1,2) available? (1 <= 1) → YES                │
│   → Move to maxProfitHeap                          │
│   Is (1,3) available? (1 <= 1) → YES                │
│   → Move to maxProfitHeap                          │
│                                                     │
│ maxProfitHeap = [3, 2] (max heap)                  │
│                  ↑                                  │
│             highest profit                          │
│                                                     │
│ Step 2: Execute best project                        │
│   maxProfitHeap.pop() = 3                          │
│   currentCapital = 1 + 3 = 4 ✅                    │
└─────────────────────────────────────────────────────┘
```

## 💻 TypeScript Implementation

```typescript
import { MaxPriorityQueue, MinPriorityQueue } from '@datastructures-js/priority-queue';

function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
    const maxProfit = new MaxPriorityQueue<number>();
    const minCapitalProfit = new MinPriorityQueue<{capital: number, profit: number}>({
        priority: (val) => val.capital  // Sort by capital (lowest first)
    });

    // Populate minCapitalProfit with all projects
    for (let i = 0; i < profits.length; i++) {
        minCapitalProfit.enqueue({
            capital: capital[i], 
            profit: profits[i]
        });
    }

    let currentCapital = w;

    // Execute up to k projects
    for (let i = 0; i < k; i++) {
        // Step 1: Move all available projects to maxProfitHeap
        while (!minCapitalProfit.isEmpty() &&
               minCapitalProfit.front().capital <= currentCapital) {
            maxProfit.enqueue(minCapitalProfit.dequeue().profit);
        }

        // Step 2: If no projects are available, terminate early
        if (maxProfit.isEmpty()) break;

        // Step 3: Execute the project with the highest profit
        currentCapital += maxProfit.dequeue();
    }

    return currentCapital;
}
```

### Implementation Highlights

1. **MinPriorityQueue Constructor:**
   ```typescript
   new MinPriorityQueue<{capital: number, profit: number}>({
       priority: (val) => val.capital  // ← Unary function that extracts priority
   });
   ```
   **Valid Alternative:**
   ```typescript
   {
       compare: (a, b) => a.capital - b.capital  // ← Binary comparison function
   }
   ```

2. **No Need to Balance Heaps:**
   - Unlike Find Median, there is no size restriction here.
   - `minCapitalProfit` is gradually emptied.
   - `maxProfitHeap` grows/shrinks according to availability.

3. **Early Termination is Critical:**
   ```typescript
   if (maxProfit.isEmpty()) break;
   ```
   - If no projects are available, we cannot continue.
   - Prevents unnecessary loops when k > possible projects.

4. **Projects are Processed Only Once:**
   - Each project moves from `minCapitalProfit` → `maxProfitHeap` → executed.
   - It never returns to `minCapitalProfit`.

## ⚠️ Common Pitfalls

### 1. Using `compare` incorrectly in the constructor
```typescript
// ❌ INCORRECT
new MinPriorityQueue<{capital: number, profit: number}>({
    compare: (val) => val.capital  // ← "compare" expects 2 arguments
});

// ✅ CORRECT (Option A)
{
    priority: (val) => val.capital  // ← Unary function
}

// ✅ CORRECT (Option B)
{
    compare: (a, b) => a.capital - b.capital  // ← Binary function
}
```

**Why it fails:** `compare` expects a function `(a, b) => number`, not `(val) => number`. If you use the incorrect syntax, the heap will not be sorted correctly.

### 2. Not using an early break when `maxProfitHeap` is empty
```typescript
// ❌ INCORRECT
for (let i = 0; i < k; i++) {
    // ... move projects ...
    currentCapital += maxProfit.dequeue();  // ← Crash if empty
}

// ✅ CORRECT
for (let i = 0; i < k; i++) {
    // ... move projects ...
    if (maxProfit.isEmpty()) break;  // ← Check before dequeue
    currentCapital += maxProfit.dequeue();
}
```

**Why it's critical:** If k=10 but you can only do 3 projects, without the break, you will attempt to `dequeue()` from an empty heap.

### 3. Populating `maxProfitHeap` from the start
```typescript
// ❌ INCORRECT: Adding all initially available projects at the beginning
for (let i = 0; i < profits.length; i++) {
    if (capital[i] <= w) {
        maxProfit.enqueue(profits[i]);
    }
}

// ✅ CORRECT: Move them dynamically in each iteration
// Because currentCapital changes after each project
```

**Why it fails:** Initial capital may not give access to certain projects, but after completing the first one, you might unlock more. The static strategy misses these opportunities.

### 4. Sorting the array instead of using a heap
```typescript
// ⚠️ SUBOPTIMAL
const sorted = projects.sort((a, b) => a.capital - b.capital);
// Then perform a linear search for available projects
```

**Why it's suboptimal:** Sorting is O(n log n) once, but then you need a linear search O(n) in each iteration to find available projects. With a heap, the operation is O(log n).

### 5. Not initializing `minCapitalProfit` with all projects
```typescript
// ❌ INCORRECT: Only adding available projects
for (let i = 0; i < profits.length; i++) {
    if (capital[i] <= currentCapital) {
        minCapitalProfit.enqueue(...);
    }
}

// ✅ CORRECT: Adding ALL projects
for (let i = 0; i < profits.length; i++) {
    minCapitalProfit.enqueue({capital: capital[i], profit: profits[i]});
}
```

**Why it's critical:** You need all projects in `minCapitalProfit` because some that are initially inaccessible may become accessible after executing other projects.

## 🧪 Big O Analysis

### Time Complexity: **O((n + k) log n)**

**Breakdown:**
1. **Initialize `minCapitalProfit`:**
   - n insertions in MinHeap
   - Each insertion: O(log n)
   - Total: O(n log n)

2. **Main loop (k iterations):**
   - **Internal While loop (move to maxProfit):**
     - Each project is moved AT MOST once.
     - Cumulative total across all iterations: O(n log n)
   - **maxProfit Dequeue:**
     - k operations of O(log n)
     - Total: O(k log n)

3. **Total:**
   - O(n log n) + O(n log n) + O(k log n)
   - = O((n + k) log n)

**Typical Case:** If k ≈ n, then O(n log n).

### Space Complexity: **O(n)**

**Breakdown:**
- `minCapitalProfit`: O(n) - stores all projects initially.
- `maxProfit`: O(n) in the worst case (if all projects are accessible from the start).
- Auxiliary variables: O(1)
- **Total:** O(n)

### Applied Optimizations

1. **Heap instead of Sorting:**
   - Sort + Linear Search: O(n log n + k·n) = O(k·n)
   - Heaps: O((n + k) log n)
   - **Significant improvement** when k << n.

2. **Early Termination:**
   - Without break: k full iterations even if there are no projects.
   - With break: terminates as soon as `maxProfit` is empty.
   - **Savings:** up to (k - projects_executed) iterations.

3. **Single Processing of Each Project:**
   - Each project passes through the heaps exactly once.
   - No redundancy or re-processing.

### Comparison with Alternatives

| Approach | Time Complexity | Space | Observations |
|---------|----------------|-------|---------------|
| **Two Heaps (our solution)** | O((n+k) log n) | O(n) | Optimal for variable k |
| Sort + Greedy | O(n log n + k·n) | O(n) | Suboptimal when k is large |
| DP | O(n·W·k) | O(W·k) | Impracticable with large W |
| Brute Force | O(n^k) | O(k) | Only viable for very small n, k |

---

## 📚 Additional Resources

- **Related pattern:** Find Median from Data Stream (LC #295)
- **Key concept:** Greedy algorithms with efficient data structures.
- **Library used:** [@datastructures-js/priority-queue](https://github.com/datastructures-js/priority-queue)
