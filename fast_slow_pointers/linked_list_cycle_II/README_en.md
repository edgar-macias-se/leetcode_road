# Problem 2: Linked List Cycle II (LeetCode #142)

## 🧠 Key Concept

**Floyd's Cycle Detection + Math:** After detecting a cycle with Fast & Slow, we use a mathematical property to find the **start** of the cycle. If you place one pointer at `head` and another at the `meeting point`, and both move 1 step at a time, they will meet exactly at the start of the cycle.

## 🗺️ The Strategy

### English

**The Algorithm in Two Phases:**

**PHASE 1: Detect that there is a cycle**
```
Use Fast & Slow (same as previous problem)
If they meet → there is a cycle
Save the meeting point
If fast reaches null → no cycle, return null
```

**PHASE 2: Find the start of the cycle**
```
ptr1 = head
ptr2 = meeting point (from Phase 1)

While ptr1 !== ptr2:
    ptr1 = ptr1.next  (advances 1)
    ptr2 = ptr2.next  (advances 1)

return ptr1  (or ptr2, they are equal)
```

**Why does it work? (Optional - Math)**

Setup:
- `L` = distance from head to cycle start
- `M` = distance from cycle start to meeting point
- `C` = cycle length

When they meet:
- Slow traveled: `L + M`
- Fast traveled: `L + M + nC` (did n extra laps)

Since Fast is twice as fast:
```
2(L + M) = L + M + nC
L + M = nC
L = nC - M
```

This means: if you advance `L` steps from the meeting point, you reach the cycle start. And if you advance `L` steps from head, you also reach the start.

**Visualization:**
```
List: 1 → 2 → 3 → 4 → 5
            ↑__________|

PHASE 1: Detect
slow and fast meet at node 4

PHASE 2: Find start
ptr1 = 1 (head)
ptr2 = 4 (meeting)

Iteration 1:
ptr1 = 2
ptr2 = 5

Iteration 2:
ptr1 = 3  ← They met at the start!
ptr2 = 3
```

## 💻 Implementation

```typescript
function detectCycle(head: ListNode | null): ListNode | null {
    // Phase 1: Detect cycle
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Cycle detected, go to Phase 2
            let ptr1 = head;
            let ptr2 = slow;
            
            // Phase 2: Find cycle start
            while (ptr1 !== ptr2) {
                ptr1 = ptr1!.next;
                ptr2 = ptr2!.next;
            }
            
            return ptr1;
        }
    }
    
    return null;  // No cycle
}
```

## ⚠️ Common Pitfalls

### 1. **Executing Phase 2 when there is NO cycle**
```typescript
// ❌ INCORRECT
while (fast !== null && fast.next !== null) {
    // ...
}
// Phase 2 always executes, even without cycle ❌

// ✅ CORRECT
if (slow === fast) {
    // Only execute Phase 2 if cycle EXISTS
}
return null;  // If we reach here, no cycle
```

### 2. **Forgetting to move ptr1 from head**
```typescript
// ❌ INCORRECT
let ptr1 = slow;  // Both start at the same place
let ptr2 = slow;
// They will never move!

// ✅ CORRECT
let ptr1 = head;   // One from head
let ptr2 = slow;   // Another from meeting
```

### 3. **Advancing at different speeds in Phase 2**
```typescript
// ❌ INCORRECT
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;
    ptr2 = ptr2.next.next;  // Different speeds
}

// ✅ CORRECT
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;
    ptr2 = ptr2.next;  // Both advance 1 step
}
```

### 4. **Not validating null in Phase 2**
```typescript
// ⚠️ In TypeScript strict mode
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;   // Could be null
    ptr2 = ptr2.next;   // Could be null
}

// ✅ CORRECT (with non-null assertion)
while (ptr1 !== ptr2) {
    ptr1 = ptr1!.next!;
    ptr2 = ptr2!.next!;
}
// Safe because we know there is a cycle
```

## 🧪 Big O Analysis

- **Time:** O(n)
  - Phase 1: O(n) to detect cycle
  - Phase 2: O(n) to find start
  - Total: O(n) + O(n) = O(n)
- **Space:** O(1) - Only pointers
