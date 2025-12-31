# Sliding Window Median (LeetCode #480)

## 🏷️ Tags

`#TwoHeaps` `#SlidingWindow` `#Heap` `#PriorityQueue` `#Hard` `#TypeScript`

## 🧠 Key Concept

This problem combines **Two Heaps with a Sliding Window and Lazy Deletion**. Unlike Find Median from Data Stream where we only add elements, here we must also **remove** elements when they slide out of the window.

The Two Heaps strategy divides numbers into two halves:
- **Max Heap (lower half):** Contains the smallest values with the largest at the top.
- **Min Heap (upper half):** Contains the largest values with the smallest at the top.

The median is always available in O(1) by looking at the tops of both heaps. The critical trick is using **lazy deletion**: when an element leaves the window, we mark it in a Map but do not immediately remove it from the heap (which would be O(k)). We only clean it up when it appears at the top.

## 🗺️ The Strategy

### Initial Setup
```
1. maxHeap = MaxPriorityQueue (lower half of values)
2. minHeap = MinPriorityQueue (upper half of values)
3. toRemove = Map<number, count> (tracking elements to delete)
4. maxHeapSize = 0 (logical size, not counting marked elements)
5. minHeapSize = 0 (logical size, not counting marked elements)
```

### Heap Balancing
```
Balance Rule:
- If k is odd: maxHeap has 1 more element than minHeap.
- If k is even: both heaps have the same size.

Example with k=5:
  maxHeap = [3, 2, 1]  (size = 3)
  minHeap = [4, 5]     (size = 2)
  Median = maxHeap.top() = 3

Example with k=4:
  maxHeap = [2, 1]     (size = 2)
  minHeap = [3, 4]     (size = 2)
  Median = (2 + 3) / 2 = 2.5
```

### Main Algorithm

**Phase 1: Build the initial window (first k elements)**
```
For i = 0 to k-1:
    addNum(nums[i])
result.push(getMedian())
```

**Phase 2: Sliding Window (rest of the array)**
```
For i = k to n-1:
    Step 1: Mark outgoing element (lazy deletion)
        outgoingNum = nums[i - k]
        toRemove.set(outgoingNum, count + 1)
        
        // Decrement the logical size of the corresponding heap
        if (outgoingNum <= maxHeap.top()):
            maxHeapSize--
        else:
            minHeapSize--
    
    Step 2: Add new element
        addNum(nums[i])
    
    Step 3: Calculate median
        result.push(getMedian())
```

### Helper Functions

**cleanTop(heap, isMaxHeap):**
```
Cleans the top of the heap if it is marked for deletion.

While heap is not empty:
    top = heap.front()
    if toRemove contains top with count > 0:
        heap.dequeue()
        toRemove.set(top, count - 1)
        if count == 0: toRemove.delete(top)
    else:
        break  // Top is valid
```

**addNum(num):**
```
1. Decide which heap to add to:
   if maxHeap is empty OR num <= maxHeap.top():
       maxHeap.enqueue(num)
       maxHeapSize++
   else:
       minHeap.enqueue(num)
       minHeapSize++

2. Balance heaps
```

**balance():**
```
1. Clean invalid tops.
2. Rebalance based on logical sizes:
   if maxHeapSize > minHeapSize + 1:
       move top of maxHeap to minHeap
   else if minHeapSize > maxHeapSize:
       move top of minHeap to maxHeap
```

**getMedian():**
```
1. Clean tops.
2. if k is odd:
       return maxHeap.top()
   else:
       return (maxHeap.top() + minHeap.top()) / 2
```

### Flow Diagram (nums = [1, 3, -1, -3, 5], k = 3)

```
┌─────────────────────────────────────────────────────┐
│ PHASE 1: Build Initial Window                      │
├─────────────────────────────────────────────────────┤
│ i=0: addNum(1)                                      │
│   maxHeap = [1], maxHeapSize = 1                   │
│                                                     │
│ i=1: addNum(3)                                      │
│   3 > 1 → minHeap.enqueue(3)                       │
│   minHeap = [3], minHeapSize = 1                   │
│   balance() → OK (1 == 1)                          │
│                                                     │
│ i=2: addNum(-1)                                     │
│   -1 <= 1 → maxHeap.enqueue(-1)                    │
│   maxHeap = [1, -1], maxHeapSize = 2               │
│   balance():                                        │
│     maxHeapSize (2) > minHeapSize (1) + 1? NO      │
│   Final state:                                      │
│     maxHeap = [1, -1] (top = 1)                    │
│     minHeap = [3]                                   │
│   getMedian() → k=3 (odd) → maxHeap.top() = 1 ✅   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PHASE 2: Sliding Window                            │
├─────────────────────────────────────────────────────┤
│ i=3: Remove 1, Add -3                              │
│   Step 1: Mark for deletion                         │
│     toRemove = {1: 1}                              │
│     1 <= maxHeap.top() (1)? YES                    │
│     → maxHeapSize-- (2 → 1)                        │
│                                                     │
│   Step 2: addNum(-3)                               │
│     -3 <= maxHeap.top() (1)? YES                   │
│     → maxHeap.enqueue(-3)                          │
│     → maxHeapSize++ (1 → 2)                        │
│     balance():                                      │
│       cleanTop(maxHeap):                           │
│         top = 1, is in toRemove                    │
│         → dequeue 1, maxHeap = [-1, -3]            │
│       maxHeapSize (2) > minHeapSize (1) + 1? NO    │
│                                                     │
│   Step 3: getMedian()                              │
│     k=3 (odd) → maxHeap.top() = -1 ✅              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ i=4: Remove 3, Add 5                               │
│   Step 1: Mark for deletion                         │
│     toRemove = {3: 1}                              │
│     3 <= maxHeap.top() (-1)? NO                    │
│     → minHeapSize-- (1 → 0)                        │
│                                                     │
│   Step 2: addNum(5)                                │
│     5 > -1 → minHeap.enqueue(5)                    │
│     minHeapSize++ (0 → 1)                          │
│     balance():                                      │
│       cleanTop(minHeap):                           │
│         top = 3, is in toRemove                    │
│         → dequeue 3, minHeap = [5]                 │
│                                                     │
│   Step 3: getMedian()                              │
│     k=3 (odd) → maxHeap.top() = -1 ✅              │
└─────────────────────────────────────────────────────┘
```

## 💻 TypeScript Implementation

```typescript
function medianSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    const maxHeap = new MaxPriorityQueue<number>();
    const minHeap = new MinPriorityQueue<number>();
    const toRemove = new Map<number, number>();
    
    let maxHeapSize = 0;
    let minHeapSize = 0;
    
    function cleanTop(heap: MaxPriorityQueue<number> | MinPriorityQueue<number>): void {
        while (heap.size() > 0) {
            const top = heap.front();
            if (toRemove.has(top) && toRemove.get(top)! > 0) {
                heap.dequeue();
                toRemove.set(top, toRemove.get(top)! - 1);
                if (toRemove.get(top) === 0) {
                    toRemove.delete(top);
                }
            } else {
                break;
            }
        }
    }
    
    function addNum(num: number): void {
        if (maxHeap.isEmpty() || num <= maxHeap.front()) {
            maxHeap.enqueue(num);
            maxHeapSize++;
        } else {
            minHeap.enqueue(num);
            minHeapSize++;
        }
        balance();
    }
    
    function balance(): void {
        cleanTop(maxHeap);
        cleanTop(minHeap);
        
        if (maxHeapSize > minHeapSize + 1) {
            const val = maxHeap.dequeue();
            minHeap.enqueue(val);
            maxHeapSize--;
            minHeapSize++;
        } else if (minHeapSize > maxHeapSize) {
            const val = minHeap.dequeue();
            maxHeap.enqueue(val);
            minHeapSize--;
            maxHeapSize++;
        }
    }
    
    function getMedian(): number {
        cleanTop(maxHeap);
        cleanTop(minHeap);
        
        if (k % 2 === 1) {
            return maxHeap.front();
        } else {
            return (maxHeap.front() + minHeap.front()) / 2.0;
        }
    }
    
    // Phase 1: Build the first window
    for (let i = 0; i < k; i++) {
        addNum(nums[i]);
    }
    result.push(getMedian());
    
    // Phase 2: Sliding window
    for (let i = k; i < nums.length; i++) {
        const outgoingNum = nums[i - k];
        toRemove.set(outgoingNum, (toRemove.get(outgoingNum) || 0) + 1);
        
        if (!maxHeap.isEmpty() && outgoingNum <= maxHeap.front()) {
            maxHeapSize--;
        } else {
            minHeapSize--;
        }
        
        addNum(nums[i]);
        result.push(getMedian());
    }
    
    return result;
}
```

### Implementation Highlights

1. **Lazy Deletion with Map:**
   ```typescript
   toRemove.set(outgoingNum, count + 1);  // Mark
   // We DO NOT remove from the heap immediately (would be O(k))
   ```

2. **Tracking Logical Sizes:**
   ```typescript
   let maxHeapSize = 0;  // Real size (not counting marked elements)
   let minHeapSize = 0;
   
   // These sizes are used for balance, NOT heap.size()
   ```

3. **Decrementing upon Marking:**
   ```typescript
   if (outgoingNum <= maxHeap.front()) {
       maxHeapSize--;  // Decrement logical size
   }
   // Only once, when marking
   ```

4. **cleanTop DOES NOT decrement sizes:**
   ```typescript
   function cleanTop(heap): void {
       // Only removes from the physical heap
       // DOES NOT decrement maxHeapSize/minHeapSize
   }
   ```

## ⚠️ Common Pitfalls

### 1. Not using lazy deletion (direct removal from heap)
```typescript
// ❌ INCORRECT: O(k) search in heap
function removeFromHeap(heap, val) {
    // Search for val in the heap array: O(k)
    // Remove and heapify: O(k) + O(log k)
}

// ✅ CORRECT: Lazy deletion O(1)
toRemove.set(val, count + 1);  // Just mark
```

**Why it's critical:** Directly removing from a heap requires an O(k) linear search, making the algorithm O(n·k) instead of O(n log k).

### 2. Not tracking logical sizes
```typescript
// ❌ INCORRECT: Using physical heap.size()
if (maxHeap.size() > minHeap.size() + 1) {
    // Includes elements marked for deletion
}

// ✅ CORRECT: Using logical size
if (maxHeapSize > minHeapSize + 1) {
    // Only counts valid elements
}
```

**Why it fails:** The physical heap can contain marked elements. If you don't use logical sizes, the balance will be incorrect.

### 3. Decrementing size in cleanTop
```typescript
// ❌ INCORRECT: Decrementing when cleaning
function cleanTop(heap, isMaxHeap) {
    if (toRemove.has(top)) {
        heap.dequeue();
        if (isMaxHeap) maxHeapSize--;  // ← DOUBLE decrement
    }
}

// ✅ CORRECT: Only decrement when marking
// cleanTop MUST NOT decrement sizes
```

### 4. Not cleaning tops before balance
```typescript
// ❌ INCORRECT
function balance() {
    if (maxHeapSize > minHeapSize + 1) {
        // maxHeap top might be marked for deletion
        minHeap.enqueue(maxHeap.dequeue());
    }
}

// ✅ CORRECT
function balance() {
    cleanTop(maxHeap);  // ← Clean first
    cleanTop(minHeap);
    // Now tops are valid
}
```

### 5. Using Monotonic Deque instead of Two Heaps
```typescript
// ❌ INCORRECT: Deque only gives min/max
// Cannot provide the median (middle element)

// ✅ CORRECT: Two Heaps divides into halves
// O(1) access to the middle element
```

## 🧪 Big O Analysis

### Time Complexity: **O(n log k)**

**Breakdown:**
1. **Build initial window:**
   - k heap insertions: O(k log k)

2. **Sliding window (n - k iterations):**
   - **Mark outgoing element:** O(1)
   - **addNum:**
     - Heap insertion: O(log k)
     - balance() with cleanTop: Amortized O(log k)
   - **getMedian:** O(1) after cleanTop
   - Total per iteration: O(log k)
   - Total: O((n - k) log k)

3. **Total:**
   - O(k log k) + O((n - k) log k) = O(n log k)

### Space Complexity: **O(k)**

**Breakdown:**
- `maxHeap`: O(k) worst case
- `minHeap`: O(k) worst case
- `toRemove`: O(k) (maximum of k unique marked elements)
- **Total:** O(k)

### Comparison with Alternatives

| Approach | Time | Space | Observations |
|---------|------|-------|---------------|
| **Two Heaps + Lazy Deletion** | O(n log k) | O(k) | Optimal |
| Two Heaps + Direct removal | O(n·k) | O(k) | Linear search in heap |
| Sorting each window | O(n·k log k) | O(k) | Re-sorting every time |
| Multiset (C++) | O(n log k) | O(k) | Similar but not in TS |

---

## 📚 Additional Resources

- **Related pattern:** Find Median from Data Stream (LC #295)
- **Difference with Sliding Window Maximum:** Monotonic Deque DOES NOT work for median.
- **Key concept:** Lazy deletion to avoid O(k) heap operations.
