# Problem 3: Minimum Window Substring (LeetCode #76) 🔥

## 🧠 Core Concept

**Advanced Sliding Window:** Requires tracking multiple characters with specific frequencies. Use TWO HashMaps and a "completeness" counter to determine when window is valid. The challenge: expand to find valid window, then contract to minimize it.

## 🗺️ The Strategy

**Key Insight:** Don't compare entire maps each step (would be O(26) per iteration). Instead, use `formed` counter tracking how many **unique** characters from `t` we've fully satisfied.

1. **Setup:**
   - `tMap`: Required frequencies from `t` (e.g., `{'A':2, 'B':1}`)
   - `window`: Current frequencies in window
   - `formed`: Unique characters satisfied (0 to `tMap.size`)
   - `required`: Number of unique characters in `t` (`tMap.size`)

2. **Expansion Phase (right++):**
   - Add `s[right]` to `window`
   - If `window[char] === tMap[char]`: `formed++` (completed this char)

3. **Contraction Phase (while formed === required):**
   - Save window if smallest found
   - Remove `s[left]` from `window`
   - If `window[char] < tMap[char]`: `formed--` (lost this char)
   - `left++`

4. **Return:** Saved substring or `""` if impossible

**Diagram:**
```
s = "ADOBECODEBANC", t = "ABC"
tMap = {'A':1, 'B':1, 'C':1}, required = 3

Step 1: Expand until formed === required
     ADOBEC  ← First valid window (formed=3)
     
Step 2: Contract while formed === required
     ADOBEC  → minLen=6
      DOBEC  → Lost 'A', formed=2, STOP
      
Step 3: Continue expanding...
           CODEBA  → formed=3 again
           ODEBAN  → formed=3, minLen still 6
                BANC  → formed=3, minLen=4 ✅
                 ANC  → Lost 'B', STOP
```

## 💻 Code Implementation

```typescript
function minWindow(s: string, t: string): string {
    const tMap = new Map<string, number>();
    for (const char of t) {
        tMap.set(char, (tMap.get(char) || 0) + 1);
    }
    
    const window = new Map<string, number>();
    let left = 0;
    let formed = 0;
    const required = tMap.size; // UNIQUE characters, not t.length
    let minLength = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window.set(char, (window.get(char) || 0) + 1);
        
        // Increment formed only when EXACTLY reaching required count
        if (tMap.has(char) && window.get(char) === tMap.get(char)) {
            formed++;
        }
        
        // Contract while window is valid
        while (formed === required) {
            // Save if smallest
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }
            
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar)! - 1);
            
            // Decrement formed only when falling BELOW required count
            if (tMap.has(leftChar) && window.get(leftChar)! < tMap.get(leftChar)!) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}
```

## ⚠️ Common Pitfalls

### 1. **Critical Bug: `required = t.length` instead of `tMap.size`**
```typescript
// ❌ INCORRECT
t = "AAB"
required = 3 // Expecting 3 characters

// ✅ CORRECT
required = tMap.size // = 2 (only 'A' and 'B' are unique)
```

### 2. **Incorrect `formed` increment**
```typescript
// ❌ INCORRECT - Double counting
if (window.get(char) <= tMap.get(char)) {
    formed++; // Increments multiple times for 'A' in "AAB"
}

// ✅ CORRECT - Only when exactly reaching required
if (window.get(char) === tMap.get(char)) {
    formed++; // Once per unique character
}
```

### 3. **Not checking `tMap.has(char)` before comparing**
```typescript
// ❌ Can be undefined if char not in t
if (window.get(leftChar) < tMap.get(leftChar)) {
    formed--;
}

// ✅ CORRECT
if (tMap.has(leftChar) && window.get(leftChar)! < tMap.get(leftChar)!) {
    formed--;
}
```

### 4. **Comparing entire maps each iteration**
```typescript
// ❌ O(n) per iteration → O(n²) total
while (mapsAreEqual(window, tMap)) { ... }

// ✅ O(1) per iteration → O(n) total
while (formed === required) { ... }
```

## 🧪 Big O Analysis

- **Time:** O(m + n) where:
  - `m` = length of `s`
  - `n` = length of `t`
  - `O(n)` to build `tMap`
  - `O(m)` to traverse `s` (each index visited at most twice)
  
- **Space:** O(m + n) where:
  - `tMap`: O(n) or O(1) if limited alphabet
  - `window`: O(m) worst case (all unique characters)
  - In practice: O(52) for English letters = O(1)

---
