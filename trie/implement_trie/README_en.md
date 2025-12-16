# Problem 1: Implement Trie (Prefix Tree) (LeetCode #208)

## 🧠 Key Concept

**Trie** (pronounced "try", from re**trie**val) is a tree-like data structure specialized in storing and searching strings efficiently. Each node represents a **character** (not a complete word), and paths from the root form complete words.

## 🗺️ The Strategy

**Visual Structure:**
```
Words: ["cat", "car", "dog"]

        root
       / | \
      c  d  ...
      |  |
      a  o
     / \ |
    t   r g
    *   * *  (* = end of word)
```

**Node Components:**
```typescript
class TrieNode {
    children: Map<string, TrieNode>  // char → child node
    isEndOfWord: boolean             // Is it the end of a word?
}
```

**Why Map instead of Array?**

| Aspect | Array[26] | Map |
|--------|-----------|-----|
| Access | O(1) | O(1) amortized |
| Space per node | 26 pointers | Only real children |
| Special characters | Needs resizing | ✅ Supports any |
| Memory with few letters | Wastes space | ✅ Efficient |

**Operation: INSERT**
```
insert("cat"):

1. Start at root
2. For 'c':
   - Child 'c' exists? NO → Create new node
   - Move to node 'c'
3. For 'a':
   - Child 'a' exists? NO → Create new node
   - Move to node 'a'
4. For 't':
   - Child 't' exists? NO → Create new node
   - Move to node 't'
5. Mark node 't': isEndOfWord = true

State after:
root → c → a → t*
```

**Operation: SEARCH (complete word)**
```
search("cat"):

1. Start at root
2. For 'c':
   - Child 'c' exists? YES → Move
3. For 'a':
   - Child 'a' exists? YES → Move
4. For 't':
   - Child 't' exists? YES → Move
5. Node 't' has isEndOfWord = true? YES
6. Return true

search("ca"):
- Reach node 'a'
- isEndOfWord = true? NO
- Return false (not a complete word)
```

**Operation: STARTSWITH (prefix)**
```
startsWith("ca"):

1. Start at root
2. For 'c':
   - Child 'c' exists? YES → Move
3. For 'a':
   - Child 'a' exists? YES → Move
4. Reached end of prefix
5. Return true (isEndOfWord doesn't matter)
```

**Key Difference: search vs startsWith**

| Operation | Validates isEndOfWord? | Example |
|-----------|------------------------|---------|
| search("app") | ✅ YES | false if "apple" exists but "app" doesn't |
| startsWith("app") | ❌ NO | true if "apple" exists |

## 💻 Implementation

```typescript
class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    private root: TrieNode;
    
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word: string): void {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char)!;
        }
        
        current.isEndOfWord = true;
    }
    
    search(word: string): boolean {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char)!;
        }
        
        return current.isEndOfWord;
    }
    
    startsWith(prefix: string): boolean {
        let current = this.root;
        
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char)!;
        }
        
        return true;
    }
}
```

**Alternative version with object literal:**
```typescript
class TrieNode {
    children: {[key: string]: TrieNode};
    isEndOfWord: boolean;
    
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

// Usage:
if (!current.children[char]) {
    current.children[char] = new TrieNode();
}
current = current.children[char];
```

## ⚠️ Common Pitfalls

### 1. **Confusing has() with array access**
```typescript
// ❌ INCORRECT
if (!current.children.has[char]) {  // Incorrect syntax
//                        ^^^
}

// ✅ CORRECT
if (!current.children.has(char)) {  // Map method
//                        ^^^^^
}
```

### 2. **Not marking isEndOfWord in insert**
```typescript
// ❌ INCORRECT
insert(word: string): void {
    let current = this.root;
    for (const char of word) {
        // ... create nodes
        current = current.children.get(char);
    }
    // FORGOT: current.isEndOfWord = true;
}

// ✅ CORRECT
insert(word: string): void {
    // ...
    current.isEndOfWord = true;  // CRITICAL
}
```

### 3. **Validating isEndOfWord in startsWith**
```typescript
// ❌ INCORRECT - startsWith must NOT validate isEndOfWord
startsWith(prefix: string): boolean {
    // ...
    return current.isEndOfWord;  // ❌ Returns false for prefixes
}

// ✅ CORRECT
startsWith(prefix: string): boolean {
    // ...
    return true;  // Only matters that path exists
}
```

### 4. **Not initializing children in constructor**
```typescript
// ❌ INCORRECT
class TrieNode {
    children: Map<string, TrieNode>;
    
    constructor() {
        // Does not initialize children
    }
}

// ✅ CORRECT
class TrieNode {
    children: Map<string, TrieNode>;
    
    constructor() {
        this.children = new Map();  // CRITICAL
    }
}
```

### 5. ** returning prematurely in search**
```typescript
// ❌ INCORRECT
search(word: string): boolean {
    for (const char of word) {
        if (!current.children.has(char)) {
            return current.isEndOfWord;  // ❌ Evaluates isEndOfWord before finishing
        }
    }
}

// ✅ CORRECT
search(word: string): boolean {
    for (const char of word) {
        if (!current.children.has(char)) {
            return false;  // Word does not exist
        }
        current = current.children.get(char);
    }
    return current.isEndOfWord;  // Evaluate AFTER loop
}
```

## 🧪 Big O Analysis

For word of length `m`:

**Insert:**
- **Time:** O(m) - One character per iteration
- **Space:** O(m) - Worst case, create m new nodes

**Search:**
- **Time:** O(m) - Traverse m characters
- **Space:** O(1) - Does not create anything

**StartsWith:**
- **Time:** O(m) - Traverse m characters
- **Space:** O(1) - Does not create anything

**Comparison with other structures:**

| Operation | HashSet | Trie |
|-----------|---------|------|
| Insert word | O(m) | O(m) |
| Search word | O(m) | O(m) |
| Search prefix | O(n×m) ❌ | O(m) ✅ |
| Total Space | O(n×m) | O(ALPHABET_SIZE × n × m) |

**n** = number of words, **m** = average length

**Key advantage of Trie:** Prefix search in O(m) vs O(n×m) with HashSet.
