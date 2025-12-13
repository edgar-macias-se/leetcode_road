# Problem 2: Longest Substring Without Repeating Characters (LeetCode #3)

## 🧠 Core Concept

**Variable Sliding Window** with HashMap: The window grows and shrinks dynamically based on a condition (no repeating characters). This is the classic two-pointer sliding window pattern.

## 🗺️ The Strategy

1. **Structure:** Use `Map<char, index>` to track last position of each character
2. **Expand (right):** Add characters to window
3. **Contract (left):** When duplicate found:
   - Move `left` right after last occurrence of character
   - **Critical:** Use `Math.max(left, map.get(char) + 1)` to never move backward
4. **Update:** Track maximum length at each step

**Diagram:**
```
s = "abcabcbb"
     lr         window="a" (len=1)
     l r        window="ab" (len=2)
     l  r       window="abc" (len=3)
     l   r      'a' duplicate! → left jumps to index 1
       l r      window="bca" (len=3)
       l  r     'b' duplicate! → left jumps to index 2
         lr     window="cab" (len=3)
```

## 💻 Code Implementation

```typescript
function lengthOfLongestSubstring(s: string): number {
    const map = new Map<string, number>();
    let maxLen = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (map.has(char)) {
            left = Math.max(left, map.get(char)! + 1);
        }
        
        map.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

## ⚠️ Common Pitfalls

1. **Forgetting `Math.max` when moving `left`:**
   ```typescript
   // ❌ INCORRECT
   left = map.get(char)! + 1; // Can move backward
   
   // ✅ CORRECT
   left = Math.max(left, map.get(char)! + 1);
   ```
   **Example:** `s = "abba"` - without `Math.max`, `left` would move backward on last step

2. **Updating map BEFORE moving left:** Causes inconsistent states

3. **Checking for duplicates without updating map:** Produces incorrect results

## 🧪 Big O Analysis

- **Time:** O(n) - Each character visited at most twice (by `right` and `left`)
- **Space:** O(min(n, m)) where:
  - `n` = string length
  - `m` = alphabet size
  - Worst case: all unique characters → O(n)
  - Limited alphabet (26 letters): O(1) in practice

---
