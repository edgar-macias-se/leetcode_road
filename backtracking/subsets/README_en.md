# Backtracking - Subsets (LeetCode #78)

## 🏷️ Tags
`#Backtracking` `#Recursion` `#Subsets` `#Medium` `#TypeScript`

## 🧠 Concept: What is Backtracking?
**Backtracking = "Try, and if it doesn't work, backtrack and try something else"**

The 3 key lines:
```typescript
current.push(num);      // 1. TRY
helper(index + 1);      // 2. EXPLORE
current.pop();          // 3. BACKTRACK ← This is backtracking
```

## 💻 Implementation
```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    
    function helper(index: number): void {
        if (index >= nums.length) {
            result.push([...current]);
            return;
        }
        
        // Include
        current.push(nums[index]);
        helper(index + 1);
        current.pop();
        
        // Do not include
        helper(index + 1);
    }
    
    helper(0);
    return result;
}
```

## 🧪 Big O
- Time: O(n × 2^n)
- Space: O(n)
