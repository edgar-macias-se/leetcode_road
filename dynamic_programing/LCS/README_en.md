# Longest Common Subsequence (LeetCode #1143)

## 🏷️ Tags

`#LCS` `#DynamicProgramming` `#Medium` `#TypeScript` `#TwoStrings` `#Subsequence`

---

## 🧠 Main Concept

Given two strings `text1` and `text2`, find the length of the **longest common subsequence**.

A **subsequence** is a sequence that can be derived from another by deleting some (or no) characters **without changing the order** of the remaining elements.

This is the **LCS (Longest Common Subsequence)** pattern which compares **two strings/arrays**.

---

## 🔑 Difference: Substring vs Subsequence

### Substring

```
Must be CONSECUTIVE (no gaps)

text = "abcde"

Valid substrings:
  "abc" ✓ (consecutive)
  "bcd" ✓ (consecutive)
  "de" ✓ (consecutive)

INVALID substrings:
  "ace" ✗ (has gaps: missing 'b' and 'd')
  "acd" ✗ (has gaps)
  "bd" ✗ (has gaps)
```

### Subsequence ⭐

```
Can have GAPS, but maintains ORDER

text = "abcde"

Valid subsequences:
  "ace" ✓ (a→c→e, maintains order, gaps allowed)
  "bd" ✓ (b→d, maintains order)
  "abcde" ✓ (complete, no gaps)
  "e" ✓ (last only)
  "" ✓ (empty)
  "a" ✓ (first only)

INVALID subsequences:
  "eca" ✗ (inverted order)
  "dba" ✗ (inverted order)
  "cba" ✗ (inverted order)
```

---

## 🎯 Visual Examples

### Example 1

```
text1 = "abcde", text2 = "ace"

We look for common characters that maintain the order:

text1:  a  b  c  d  e
        ↓     ↓     ↓
text2:  a     c     e

Common characters in order:
  'a' is in both ✓
  'c' is in both ✓ (after 'a')
  'e' is in both ✓ (after 'c')

Longest common subsequence: "ace"
Length: 3
```

### Example 2

```
text1 = "abc", text2 = "abc"

text1:  a  b  c
        ↓  ↓  ↓
text2:  a  b  c

Everything matches in order:
  'a' → 'b' → 'c'

Longest common subsequence: "abc"
Length: 3
```

### Example 3

```
text1 = "abc", text2 = "def"

text1:  a  b  c
        
text2:  d  e  f

No common characters.

Longest common subsequence: ""
Length: 0
```

---

## 🗺️ The DP Strategy

### Difference from Knapsack

```
Knapsack (One Array):
  State: dp[i] or dp[i][capacity]
  Question: "What can I do with the first i elements?"

LCS (Two Strings):
  State: dp[i][j]
  Question: "What is the LCS of text1[0..i-1] and text2[0..j-1]?"
```

### DP State

```
dp[i][j] = Length of the LCS of text1[0..i-1] and text2[0..j-1]

Example:
  text1 = "abc"
  text2 = "ac"
  
  dp[2][1] = LCS of "ab" and "a"
           = "a"
           = length 1
```

### Initial DP Table

```
text1 = "abc"
text2 = "ac"

    ""  a   c
""  0   0   0
a   0   ?   ?
b   0   ?   ?
c   0   ?   ?
```

**Row 0 and column 0 are 0 (base case):**
- dp[0][j] = 0 (text1 empty)
- dp[i][0] = 0 (text2 empty)

---

### Recurrence

```
For each position (i, j):

CASE 1: Characters MATCH
  If text1[i-1] == text2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1
    
    Interpretation:
      "Characters match, we take the previous LCS
       and add 1 for this matching character"

CASE 2: Characters DO NOT MATCH
  If text1[i-1] != text2[j-1]:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    Interpretation:
      "They don't match, we take the best result from:
       - Ignoring this char from text1: dp[i-1][j]
       - Ignoring this char from text2: dp[i][j-1]"
```

---

## 💻 Implementation

```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
    const M = text1.length;
    const N = text2.length;
    
    // Create DP table (M+1) × (N+1)
    const dp = Array(M + 1)
        .fill(0)
        .map(() => Array(N + 1).fill(0));
    
    // Base case already initialized at 0
    // dp[0][j] = 0 (text1 empty)
    // dp[i][0] = 0 (text2 empty)
    
    // Fill table
    for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= N; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // Characters match
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // Don't match, take best
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[M][N];
}
```

---

## 📊 Full Step-by-Step Trace

```typescript
Input: text1 = "abcde", text2 = "ace"

M = 5, N = 3

 ═══════════════════════════════════════
INITIALIZATION
 ═══════════════════════════════════════

dp[6][4] Table:

       ""  a   c   e
   ""  0   0   0   0
   a   0   0   0   0
   b   0   0   0   0
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

Row 0 and column 0 are 0 (base case)

 ═══════════════════════════════════════
ROW i=1 (char 'a' from text1)
 ═══════════════════════════════════════

j=1: text1[0]='a', text2[0]='a'
  'a' === 'a'? YES ✓
  dp[1][1] = dp[0][0] + 1 = 0 + 1 = 1
  
  LCS of "a" and "a" = "a" (length 1)

j=2: text1[0]='a', text2[1]='c'
  'a' === 'c'? NO ✗
  dp[1][2] = max(dp[0][2], dp[1][1])
           = max(0, 1)
           = 1
  
  LCS of "a" and "ac" = "a" (length 1)

j=3: text1[0]='a', text2[2]='e'
  'a' === 'e'? NO ✗
  dp[1][3] = max(dp[0][3], dp[1][2])
           = max(0, 1)
           = 1
  
  LCS of "a" and "ace" = "a" (length 1)

Table after row 1:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   0   0   0
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

 ═══════════════════════════════════════
ROW i=2 (char 'b' from text1)
 ═══════════════════════════════════════

j=1: 'b' === 'a'? NO
  dp[2][1] = max(dp[1][1], dp[2][0]) = 1

j=2: 'b' === 'c'? NO
  dp[2][2] = max(dp[1][2], dp[2][1]) = 1

j=3: 'b' === 'e'? NO
  dp[2][3] = max(dp[1][3], dp[2][2]) = 1

Table after row 2:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

 ═══════════════════════════════════════
ROW i=3 (char 'c' from text1)
 ═══════════════════════════════════════

j=1: 'c' === 'a'? NO
  dp[3][1] = max(1, 0) = 1

j=2: 'c' === 'c'? YES ✓
  dp[3][2] = dp[2][1] + 1 = 1 + 1 = 2
  
  LCS of "abc" and "ac" = "ac" (length 2)

j=3: 'c' === 'e'? NO
  dp[3][3] = max(1, 2) = 2

Table after row 3:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   0   0   0
   e   0   0   0   0

 ═══════════════════════════════════════
ROW i=4 (char 'd' from text1)
 ═══════════════════════════════════════

j=1,2,3: No matches
  dp[4][1] = 1
  dp[4][2] = 2
  dp[4][3] = 2

 ═══════════════════════════════════════
ROW i=5 (char 'e' from text1)
 ═══════════════════════════════════════

j=1,2: No matches
  dp[5][1] = 1
  dp[5][2] = 2

j=3: 'e' === 'e'? YES ✓
  dp[5][3] = dp[4][2] + 1 = 2 + 1 = 3
  
  LCS of "abcde" and "ace" = "ace" (length 3)

FINAL Table:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   1   2   2
   e   0   1   2   3
                   ↑
             ANSWER = 3

 ═══════════════════════════════════════
VERIFICATION
 ═══════════════════════════════════════

text1 = "abcde", text2 = "ace"
LCS = "ace"
Result: 3 ✓
```

---

## 📊 Additional Example

```typescript
Input: text1 = "abc", text2 = "def"

No characters match.
All dp[i][j] = max(dp[i-1][j], dp[i][j-1])
Always copies the 0.

Result: dp[3][3] = 0 ✓
```

---

## ⚠️ Common Pitfalls

### 1. Incorrect Indices

```typescript
// ❌ INCORRECT
if (text1[i] === text2[j]) {
    dp[i][j] = dp[i-1][j-1] + 1;
}

// Problem:
// When i=M and j=N:
//   text1[M] is out of range (max index is M-1)
//   text2[N] is out of range (max index is N-1)

// ✅ CORRECT
if (text1[i-1] === text2[j-1]) {
    dp[i][j] = dp[i-1][j-1] + 1;
}

// dp[1] represents text1[0]
// dp[i] represents text1[i-1]
```

### 2. Forgetting Base Case

```typescript
// ❌ INCORRECT
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(1));  // Initializes with 1

// ✅ CORRECT
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(0));  // Initializes with 0
```

### 3. Using OR instead of Max

```typescript
// ❌ INCORRECT - From Knapsack (boolean)
if (text1[i-1] !== text2[j-1]) {
    dp[i][j] = dp[i-1][j] || dp[i][j-1];
}

// ✅ CORRECT - LCS uses max
if (text1[i-1] !== text2[j-1]) {
    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
}
```

### 4. Array.fill() with References

```typescript
// ❌ INCORRECT
const dp = Array(M + 1).fill(Array(N + 1).fill(0));
// All rows share the same reference

// ✅ CORRECT
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(0));
// Each row is independent
```

---

## 🧪 Big O Analysis

### Time Complexity: O(M × N)

```
Variables:
  M = length of text1
  N = length of text2

Operations:
  - Fill table: M rows × N columns
  - Each cell: O(1)

Total: O(M × N)
```

### Space Complexity: O(M × N)

```
dp Table: (M + 1) × (N + 1)

Possible Optimization:
  - Reduce to O(min(M, N)) with a rolling array.
  - We only need the previous row to calculate the current one.
```

---

## 🎯 Reconstructing the Subsequence

DP only returns the **length**. To get the actual **subsequence**:

```typescript
function getLCS(text1: string, text2: string): string {
    const M = text1.length, N = text2.length;
    
    // Build dp table
    const dp = Array(M + 1).fill(0).map(() => Array(N + 1).fill(0));
    
    for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= N; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Backtracking to reconstruct
    let i = M, j = N;
    const lcs: string[] = [];
    
    while (i > 0 && j > 0) {
        if (text1[i-1] === text2[j-1]) {
            lcs.unshift(text1[i-1]);
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs.join('');
}
```

---

## 🔗 Related Problems

- Edit Distance (LC #72) - Similar but with operations.
- Shortest Common Supersequence (LC #1092) - Inverse of LCS.
- Uncrossed Lines (LC #1035) - Same as LCS.
- Longest Palindromic Subsequence (LC #516) - LCS variant.

---

## 📝 Implementation Notes

1. **Indices:** `dp[i]` uses `text1[i-1]` and `text2[j-1]`.
2. **Base case:** Row 0 and Column 0 are 0.
3. **Two cases:** Match (+ 1) or Don't match (max).
4. **Use .map()** for independent rows.
5. **Return:** `dp[M][N]` (bottom-right corner).
6. **Subsequence ≠ Substring:** Gaps allowed.
