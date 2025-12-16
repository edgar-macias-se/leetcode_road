# Problem 2: Word Search II (LeetCode #212) 🔥

## 🧠 Key Concept

**Trie + Backtracking (DFS):** Combines Trie for efficient multi-word search with DFS to explore the board. The key is using the Trie to **prune searches** that cannot form valid words, dramatically reducing the search space.

## 🗺️ The Strategy

### English

**The Naive Approach Problem:**

```typescript
// Approach without Trie: O(W × M × N × 4^L)
for (const word of words) {  // W words
    if (existsOnBoard(board, word)) {  // M×N×4^L
        result.push(word);
    }
}
```

With 30,000 words, this is **too slow**.

---

**Optimization with Trie:**

Instead of searching for each word independently, build a Trie with all words and search for **all simultaneously** in a single DFS.

**Example:**
```
words = ["oath", "pea", "eat", "rain"]

Trie:
       root
      / | | \
     o  p e  r
     |  | |  |
     a  e a  a
     |  | |  |
     t  a*t* i
     |      |
     h*     n*
```

**High-Level Algorithm:**

```
1. Build Trie with all words

2. For each cell (i, j) of the board:
      DFS(i, j, Trie root, result)

3. Return result
```

**DFS with Trie:**

```
DFS(i, j, current_node, result):
   1. Get character: char = board[i][j]
   
   2. PRUNING: Does char exist in current_node.children?
      NO → return (this branch forms no valid words)
      YES → continue
   
   3. Move to child node: childNode = current_node.children[char]
   
   4. Is it a complete word?
      if (childNode.isEndOfWord):
         result.push(childNode.word)
         childNode.isEndOfWord = false  ← Avoid duplicates
   
   5. Mark current cell as visited:
      temp = board[i][j]
      board[i][j] = '#'
   
   6. Explore 4 directions (↑ ↓ ← →):
      for each direction:
         if (valid and not visited):
            DFS(ni, nj, childNode, result)
   
   7. BACKTRACKING - Unmark:
      board[i][j] = temp
   
   8. TRIE PRUNING (Advanced optimization):
      if (childNode.isEmpty()):
         delete childNode from parent
```

---

**DFS Visualization:**

```
board = [["o","a"],
         ["e","t"]]
words = ["oat", "eat"]

Trie:
    root
   / \
  o   e
  |   |
  a   a
  |   |
  t*  t*

DFS from (0,0) 'o':
├─ char='o', exists in root? ✓
├─ Move to node 'o'
├─ Mark (0,0) = '#'
├─ Explore neighbors:
│  ├─ (0,1) 'a':
│  │  ├─ exists 'a' in node 'o'? ✓
│  │  ├─ Move to node 'a'
│  │  ├─ Mark (0,1) = '#'
│  │  ├─ Explore neighbors:
│  │  │  └─ (1,1) 't':
│  │  │     ├─ exists 't' in node 'a'? ✓
│  │  │     ├─ isEndOfWord? ✓
│  │  │     └─ result.push("oat") ✅
│  │  └─ Unmark (0,1) = 'a'
│  └─ (1,0) 'e': exists 'e' in node 'o'? ✗ → PRUNING
└─ Unmark (0,0) = 'o'

DFS from (1,0) 'e':
└─ Similar... finds "eat" ✅
```

---

**Trie Pruning - Critical Optimization:**

```typescript
if (currNode.isEmpty()) {
    parentTrieNode.children.delete(char);
}
```

**Why?**

After finding all words in a branch, that branch is no longer useful. Deleting it prevents exploring it again in future DFS.

**Example:**
```
words = ["oath"]

After finding "oath":
1. Mark node 'h': word = null
2. Check if 'h' is empty: YES → DELETE
3. Check if 't' is empty: YES → DELETE
4. Continue up to root

Final Trie: empty

Subsequent DFS:
- Try starting with 'o'
- Does 'o' exist in root? NO (was deleted)
- Return immediately ✓

Without pruning:
- All DFS would explore branch 'o'→'a'→'t'→'h' ❌
```

**Impact:**
```
board = 12×12 = 144 cells
words = 30,000

Without pruning:
144 DFS × explore full Trie = VERY SLOW

With pruning:
First DFS find words and prune
Subsequent DFS return immediately
Difference: 10-100x faster ✅
```

## 💻 Implementation

```typescript
class TrieNode {
    children: Map<string, TrieNode>;
    word: string | null;
    
    constructor() {
        this.children = new Map();
        this.word = null;
    }
    
    isEmpty(): boolean {
        return this.word === null && this.children.size === 0;
    }
}

class Trie {
    root: TrieNode;
    
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word: string): void {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        node.word = word;
    }
}

function findWords(board: string[][], words: string[]): string[] {
    const rows = board.length;
    const cols = board[0].length;
    const result: string[] = [];
    
    // 1. Build Trie
    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
    }
    
    // 2. DFS from each cell
    function dfs(r: number, c: number, node: TrieNode): void {
        const char = board[r][c];
        
        // PRUNING: char exists in Trie?
        if (!node.children.has(char)) {
            return;
        }
        
        const childNode = node.children.get(char)!;
        
        // Is complete word?
        if (childNode.word !== null) {
            result.push(childNode.word);
            childNode.word = null;  // Avoid duplicates
        }
        
        // Mark as visited
        board[r][c] = '#';
        
        // Explore 4 directions
        const directions = [[0,1], [1,0], [0,-1], [-1,0]];
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            
            if (nr >= 0 && nr < rows && 
                nc >= 0 && nc < cols && 
                board[nr][nc] !== '#') {
                dfs(nr, nc, childNode);
            }
        }
        
        // BACKTRACKING - Unmark
        board[r][c] = char;
        
        // TRIE PRUNING - Advanced optimization
        if (childNode.isEmpty()) {
            node.children.delete(char);
        }
    }
    
    // Start DFS from each cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, trie.root);
        }
    }
    
    return result;
}
```

**Version with dr/dc arrays (more idiomatic):**
```typescript
function findWords(board: string[][], words: string[]): string[] {
    const rows = board.length;
    const cols = board[0].length;
    const result: string[] = [];
    
    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
    }
    
    const dr = [0, 1, 0, -1];  // → ↓ ← ↑
    const dc = [1, 0, -1, 0];
    
    function dfs(r: number, c: number, node: TrieNode): void {
        const char = board[r][c];
        
        if (!node.children.has(char)) return;
        
        const childNode = node.children.get(char)!;
        
        if (childNode.word !== null) {
            result.push(childNode.word);
            childNode.word = null;
        }
        
        board[r][c] = '#';
        
        for (let i = 0; i < 4; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];
            
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
                board[nr][nc] !== '#') {
                dfs(nr, nc, childNode);
            }
        }
        
        board[r][c] = char;
        
        if (childNode.isEmpty()) {
            node.children.delete(char);
        }
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, trie.root);
        }
    }
    
    return result;
}
```

## ⚠️ Common Pitfalls

### 1. **Processing neighbors before current cell**
```typescript
// ❌ INCORRECT - Iterates neighbors immediately
function dfs(r, c, node) {
    for (const [dr, dc] of directions) {
        // Processes neighbor without validating current cell
    }
}

// ✅ CORRECT - Process current cell first
function dfs(r, c, node) {
    const char = board[r][c];
    if (!node.children.has(char)) return;  // Validate FIRST
    
    // THEN explore neighbors
}
```

### 2. **Not unmarking cells (forgetting backtracking)**
```typescript
// ❌ INCORRECT
board[r][c] = '#';
// ... explore neighbors
// FORGOT: board[r][c] = char;

// ✅ CORRECT
const temp = board[r][c];
board[r][c] = '#';
// ... explore neighbors
board[r][c] = temp;  // CRITICAL
```

### 3. **Using isEndOfWord + word (redundant)**
```typescript
// ❌ REDUNDANT (but works)
class TrieNode {
    isEndOfWord: boolean;
    word: string | null;
}

if (node.isEndOfWord) {
    result.push(node.word);
    node.isEndOfWord = false;  // Two updates
}

// ✅ BETTER - Single field
class TrieNode {
    word: string | null;  // null = not end, !== null = is end
}

if (node.word !== null) {
    result.push(node.word);
    node.word = null;  // One update
}
```

### 4. **Validating bounds incorrectly**
```typescript
// ❌ INCORRECT
if (nr < rows && nc < cols) {  // Missing >= 0 validation
    //...
}

// ✅ CORRECT
if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
    //...
}
```

### 5. **Not implementing Trie Pruning**
```typescript
// ⚠️ WORKS but SLOW
function dfs(r, c, node) {
    // ... search
    board[r][c] = char;
    // NO pruning - empty branches remain
}

// ✅ OPTIMAL
function dfs(r, c, node) {
    // ... search
    board[r][c] = char;
    
    if (childNode.isEmpty()) {
        node.children.delete(char);  // CRITICAL for performance
    }
}
```

### 6. **Using Set for result (less efficient)**
```typescript
// ⚠️ WORKS but uses more space
const result = new Set<string>();
if (node.word !== null) {
    result.add(node.word);  // Set prevents duplicates
}
return Array.from(result);  // Extra conversion

// ✅ BETTER - Mark in Trie
const result: string[] = [];
if (node.word !== null) {
    result.push(node.word);
    node.word = null;  // Prevents duplicates, no conversion
}
return result;
```

## 🧪 Big O Analysis

**Variables:**
- `M × N` = board dimensions
- `W` = number of words
- `L` = average word length
- `K` = alphabet size (26 for lowercase a-z)

**Trie Construction:**
- **Time:** O(W × L) - Insert W words of length L
- **Space:** O(W × L × K) - Worst case (no common prefixes)

**DFS on Board:**
- **Time:** O(M × N × 4^L) - From each cell, explore up to L steps in 4 directions
  - With Trie pruning: much better in practice
  - Without Trie pruning: full worst case
- **Space:** O(L) - Recursion depth

**Total:**
- **Time:** O(W×L + M×N×4^L) → With pruning it is much better
- **Space:** O(W×L×K + L) → Trie + recursion stack

**Comparison:**

| Approach | Time | Observations |
|----------|------|--------------|
| Naive (no Trie) | O(W × M×N × 4^L) | Factor W in product ❌ |
| **With Trie** | **O(W×L + M×N × 4^L)** | **Factor W separated** ✅ |
| With Trie + Pruning | O(W×L + M×N × 4^L*) | ***Much better in practice** ✅ |

The Trie **eliminates the W factor from the product** - this is critical for 30,000 words.
