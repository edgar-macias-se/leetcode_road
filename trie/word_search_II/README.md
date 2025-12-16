# Problema 2: Word Search II (LeetCode #212) 🔥

## 🧠 Concepto Clave

**Trie + Backtracking (DFS):** Combina Trie para búsqueda eficiente de múltiples palabras con DFS para explorar el board. La clave es usar el Trie para **podar búsquedas** que no pueden formar palabras válidas, reduciendo dramáticamente el espacio de búsqueda.

## 🗺️ La Estrategia

### Español

**El Problema del Approach Naive:**

```typescript
// Approach sin Trie: O(W × M × N × 4^L)
for (const word of words) {  // W palabras
    if (existsOnBoard(board, word)) {  // M×N×4^L
        result.push(word);
    }
}
```

Con 30,000 palabras, esto es **demasiado lento**.

---

**Optimización con Trie:**

En lugar de buscar cada palabra independientemente, construye un Trie con todas las palabras y busca **todas simultáneamente** en un solo DFS.

**Ejemplo:**
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

**Algoritmo de Alto Nivel:**

```
1. Construir Trie con todas las palabras

2. Para cada celda (i, j) del board:
      DFS(i, j, root del Trie, result)

3. Retornar result
```

**DFS con Trie:**

```
DFS(i, j, nodo_actual, result):
   1. Obtener carácter: char = board[i][j]
   
   2. PODA: ¿char existe en nodo_actual.children?
      NO → return (esta rama no forma palabras válidas)
      SÍ → continuar
   
   3. Moverse al nodo hijo: childNode = nodo_actual.children[char]
   
   4. ¿Es palabra completa?
      if (childNode.isEndOfWord):
         result.push(childNode.word)
         childNode.isEndOfWord = false  ← Evitar duplicados
   
   5. Marcar celda actual como visitada:
      temp = board[i][j]
      board[i][j] = '#'
   
   6. Explorar 4 direcciones (↑ ↓ ← →):
      for each direction:
         if (válido y no visitado):
            DFS(ni, nj, childNode, result)
   
   7. BACKTRACKING - Desmarcar:
      board[i][j] = temp
   
   8. TRIE PRUNING (Optimización avanzada):
      if (childNode.isEmpty()):
         delete childNode from parent
```

---

**Visualización del DFS:**

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

DFS desde (0,0) 'o':
├─ char='o', ¿existe en root? ✓
├─ Moverse a nodo 'o'
├─ Marcar (0,0) = '#'
├─ Explorar vecinos:
│  ├─ (0,1) 'a':
│  │  ├─ ¿existe 'a' en nodo 'o'? ✓
│  │  ├─ Moverse a nodo 'a'
│  │  ├─ Marcar (0,1) = '#'
│  │  ├─ Explorar vecinos:
│  │  │  └─ (1,1) 't':
│  │  │     ├─ ¿existe 't' en nodo 'a'? ✓
│  │  │     ├─ ¿isEndOfWord? ✓
│  │  │     └─ result.push("oat") ✅
│  │  └─ Desmarcar (0,1) = 'a'
│  └─ (1,0) 'e': ¿existe 'e' en nodo 'o'? ✗ → PODA
└─ Desmarcar (0,0) = 'o'

DFS desde (1,0) 'e':
└─ Similar... encuentra "eat" ✅
```

---

**Trie Pruning - Optimización Crítica:**

```typescript
if (currNode.isEmpty()) {
    parentTrieNode.children.delete(char);
}
```

**¿Por qué?**

Después de encontrar todas las palabras en una rama, esa rama ya no sirve. Eliminarla evita explorarla de nuevo en futuros DFS.

**Ejemplo:**
```
words = ["oath"]

Después de encontrar "oath":
1. Marcar nodo 'h': word = null
2. Verificar si 'h' está vacío: SÍ → DELETE
3. Verificar si 't' está vacío: SÍ → DELETE
4. Continuar hasta root

Trie final: vacío

DFS posteriores:
- Intentan empezar con 'o'
- ¿Existe 'o' en root? NO (fue eliminado)
- Return inmediatamente ✓

Sin pruning:
- Todos los DFS explorarían la rama 'o'→'a'→'t'→'h' ❌
```

**Impacto:**
```
board = 12×12 = 144 celdas
words = 30,000

Sin pruning:
144 DFS × explorar Trie completo = MUY LENTO

Con pruning:
Primeros DFS encuentran palabras y podan
DFS posteriores retornan inmediatamente
Diferencia: 10-100x más rápido ✅
```

## 💻 Implementación

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
    
    // 1. Construir Trie
    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
    }
    
    // 2. DFS desde cada celda
    function dfs(r: number, c: number, node: TrieNode): void {
        const char = board[r][c];
        
        // PODA: ¿carácter existe en Trie?
        if (!node.children.has(char)) {
            return;
        }
        
        const childNode = node.children.get(char)!;
        
        // ¿Es palabra completa?
        if (childNode.word !== null) {
            result.push(childNode.word);
            childNode.word = null;  // Evitar duplicados
        }
        
        // Marcar como visitado
        board[r][c] = '#';
        
        // Explorar 4 direcciones
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
        
        // BACKTRACKING - Desmarcar
        board[r][c] = char;
        
        // TRIE PRUNING - Optimización avanzada
        if (childNode.isEmpty()) {
            node.children.delete(char);
        }
    }
    
    // Iniciar DFS desde cada celda
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, trie.root);
        }
    }
    
    return result;
}
```

**Versión con arrays dr/dc (más idiomática):**
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

## ⚠️ Errores Comunes

### 1. **Procesar vecinos antes que la celda actual**
```typescript
// ❌ INCORRECTO - Itera vecinos inmediatamente
function dfs(r, c, node) {
    for (const [dr, dc] of directions) {
        // Procesa vecino sin validar celda actual
    }
}

// ✅ CORRECTO - Procesa celda actual primero
function dfs(r, c, node) {
    const char = board[r][c];
    if (!node.children.has(char)) return;  // Validar PRIMERO
    
    // LUEGO explorar vecinos
}
```

### 2. **No desmarcar celdas (olvidar backtracking)**
```typescript
// ❌ INCORRECTO
board[r][c] = '#';
// ... explorar vecinos
// OLVIDÓ: board[r][c] = char;

// ✅ CORRECTO
const temp = board[r][c];
board[r][c] = '#';
// ... explorar vecinos
board[r][c] = temp;  // CRÍTICO
```

### 3. **Usar isEndOfWord + word (redundante)**
```typescript
// ❌ REDUNDANTE (pero funciona)
class TrieNode {
    isEndOfWord: boolean;
    word: string | null;
}

if (node.isEndOfWord) {
    result.push(node.word);
    node.isEndOfWord = false;  // Dos actualizaciones
}

// ✅ MEJOR - Un solo campo
class TrieNode {
    word: string | null;  // null = no es fin, !== null = es fin
}

if (node.word !== null) {
    result.push(node.word);
    node.word = null;  // Una actualización
}
```

### 4. **Validar bounds incorrectamente**
```typescript
// ❌ INCORRECTO
if (nr < rows && nc < cols) {  // Falta validar >= 0
    //...
}

// ✅ CORRECTO
if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
    //...
}
```

### 5. **No implementar Trie Pruning**
```typescript
// ⚠️ FUNCIONA pero es LENTO
function dfs(r, c, node) {
    // ... búsqueda
    board[r][c] = char;
    // NO hace pruning - ramas vacías permanecen
}

// ✅ ÓPTIMO
function dfs(r, c, node) {
    // ... búsqueda
    board[r][c] = char;
    
    if (childNode.isEmpty()) {
        node.children.delete(char);  // CRÍTICO para performance
    }
}
```

### 6. **Usar Set para resultado (menos eficiente)**
```typescript
// ⚠️ FUNCIONA pero usa más espacio
const result = new Set<string>();
if (node.word !== null) {
    result.add(node.word);  // Set previene duplicados
}
return Array.from(result);  // Conversión extra

// ✅ MEJOR - Marcar en Trie
const result: string[] = [];
if (node.word !== null) {
    result.push(node.word);
    node.word = null;  // Previene duplicados, sin conversión
}
return result;
```

## 🧪 Análisis Big O

**Variables:**
- `M × N` = dimensiones del board
- `W` = número de palabras
- `L` = longitud promedio de palabra
- `K` = tamaño del alfabeto (26 para lowercase a-z)

**Construcción del Trie:**
- **Time:** O(W × L) - Insertar W palabras de longitud L
- **Space:** O(W × L × K) - En peor caso (sin prefijos comunes)

**DFS en Board:**
- **Time:** O(M × N × 4^L) - Desde cada celda, explorar hasta L pasos en 4 direcciones
  - Con Trie pruning: mucho mejor en práctica
  - Sin Trie pruning: peor caso completo
- **Space:** O(L) - Profundidad de recursión

**Total:**
- **Time:** O(W×L + M×N×4^L) → Con pruning es mucho mejor
- **Space:** O(W×L×K + L) → Trie + stack de recursión

**Comparación:**

| Approach | Time | Observaciones |
|----------|------|---------------|
| Naive (sin Trie) | O(W × M×N × 4^L) | Factor W en el producto ❌ |
| **Con Trie** | **O(W×L + M×N × 4^L)** | **Factor W separado** ✅ |
| Con Trie + Pruning | O(W×L + M×N × 4^L*) | ***Mucho mejor en práctica** ✅ |

El Trie **elimina el factor W del producto** - esto es crítico para 30,000 palabras.
