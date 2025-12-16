# Problem 1: Linked List Cycle (LeetCode #141)

## 🧠 Key Concept

**Fast & Slow Pointers** (also called "Floyd's Cycle Detection" or "Tortoise and Hare") is a technique where we use two pointers moving at **different speeds**. The slow pointer moves 1 step, the fast pointer moves 2 steps. If there is a cycle, they will eventually meet; if there is no cycle, fast reaches null.

## 🗺️ The Strategy

### English

**Racetrack Analogy:**

Imagine two runners on a track:
- **Turtle (slow):** Runs at normal speed
- **Hare (fast):** Runs at double speed

**Linear track (no cycle):**
```
Slow: S → → → → → null
Fast: F → → → → → → → → null
      ↑ Fast reaches the end first
```

**Circular track (with cycle):**
```
Slow: S → → → → → →
Fast: F → → → → → → → → (laps faster)
      ↑ Eventually they meet
```

**Why do they NEVER skip each other?**

Fast approaches Slow by **1 position per iteration**:
- Slow moves 1 → new position: `pos + 1`
- Fast moves 2 → new position: `pos + 2`
- Relative distance: Fast approaches by `2 - 1 = 1` position

**Algorithm:**
```
1. Initialize:
   slow = head
   fast = head

2. While fast != null and fast.next != null:
   slow = slow.next      (moves 1 step)
   fast = fast.next.next (moves 2 steps)
   
   If slow === fast:
      return true  (they met = there is a cycle)

3. return false  (fast reached null = no cycle)
```

**Critical Validations:**
```typescript
while (fast !== null && fast.next !== null)
//     ^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^
//     If fast is null,  If fast.next is null,
//     we reached end    fast.next.next would error
```

**Trace Example:**
```
List: 1 → 2 → 3 → 4
            ↑______|

Start: slow = 1, fast = 1

Iteration 1:
slow = 2
fast = 3

Iteration 2:
slow = 3
fast = 3  ← They met!
return true
```

## 💻 Implementation

```typescript
/**
 * Definition for singly-linked list.
 */
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}

function hasCycle(head: ListNode | null): boolean {
    if (head === null) {
        return false;
    }
    
    let turtle = head;
    let hare = head;
    
    while (hare !== null && hare.next !== null) {
        turtle = turtle.next!;
        hare = hare.next.next;
        
        if (turtle === hare) {
            return true;
        }
    }
    
    return false;
}
```

## ⚠️ Common Pitfalls

### 1. **Only validating `fast !== null`**
```typescript
// ❌ INCORRECT
while (fast !== null) {
    slow = slow.next;
    fast = fast.next.next;  // If fast.next = null → Error!
}

// ✅ CORRECT
while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;  // Safe
}
```

### 2. **Comparing BEFORE moving**
```typescript
// ❌ INCORRECT - Always returns true
slow = head;
fast = head;

if (slow === fast) return true;  // Both are head!

// ✅ CORRECT - Move first, compare later
while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;  // Compare after moving
}
```

### 3. **Not handling empty list**
```typescript
// ❌ INCORRECT
let slow = head;
while (fast !== null && fast.next !== null) {
    slow = slow.next;  // If head = null → Error!
}

// ✅ CORRECT
if (head === null) return false;
let slow = head;
```

### 4. **Initializing pointers at different positions**
```typescript
// ❌ INCORRECT
let slow = head;
let fast = head.next;  // Start at different places

// ✅ CORRECT
let slow = head;
let fast = head;  // Start at the same place
```

## 🧪 Big O Analysis

- **Time:** O(n)
  - No cycle: Fast traverses n/2 nodes → O(n)
  - With cycle: Both do at most one full lap → O(n)
- **Space:** O(1) - Only two pointers

**Comparison:**

| Approach | Time | Space |
|----------|------|-------|
| HashSet | O(n) | O(n) ❌ |
| **Fast & Slow** | **O(n)** | **O(1)** ✅ |
