# Backtracking - Combinations (LeetCode #77)

## 🏷️ Tags
`#Backtracking` `#Recursion` `#Combinations` `#Medium` `#TypeScript`

## 🧠 Concept
Combinations generates subsets of a specific size k. Total: C(n, k) = n! / (k! × (n-k)!)

## 💻 Implementation
```typescript
function combinations(n: number, k: number): number[][] {
    let combs: number[][] = [];
    
    function helper(i: number, curComb: number[]): void {
        if (curComb.length === k) {
            combs.push([...curComb]);
            return;
        }
        
        if (i > n) return;
        
        for (let j = i; j <= n; j++) {
            curComb.push(j);
            helper(j + 1, curComb);
            curComb.pop();
        }
    }
    
    helper(1, []);
    return combs;
}
```

## 🧪 Big O
- Time: O(k × C(n, k))
- Space: O(k)
