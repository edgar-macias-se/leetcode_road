# Problema 1: Implement Trie (Prefix Tree) (LeetCode #208)

## 🧠 Concepto Clave

**Trie** (pronunciado "try", de re**trie**val) es una estructura de datos en forma de **árbol** especializada en almacenar y buscar strings de manera eficiente. Cada nodo representa un **carácter** (no una palabra completa), y los caminos desde la raíz forman palabras completas.

## 🗺️ La Estrategia

**Estructura Visual:**
```
Palabras: ["cat", "car", "dog"]

        root
       / | \
      c  d  ...
      |  |
      a  o
     / \ |
    t   r g
    *   * *  (* = fin de palabra)
```

**Componentes del Nodo:**
```typescript
class TrieNode {
    children: Map<string, TrieNode>  // char → nodo hijo
    isEndOfWord: boolean             // ¿Es fin de palabra?
}
```

**¿Por qué Map en lugar de Array?**

| Aspecto | Array[26] | Map |
|---------|-----------|-----|
| Acceso | O(1) | O(1) amortizado |
| Espacio por nodo | 26 punteros | Solo hijos reales |
| Caracteres especiales | Necesita redimensionar | ✅ Soporta cualquiera |
| Memoria con pocas letras | Desperdicia espacio | ✅ Eficiente |

**Operación: INSERT**
```
insert("cat"):

1. Empezar en root
2. Para 'c':
   - ¿Existe hijo 'c'? NO → Crear nuevo nodo
   - Moverse a nodo 'c'
3. Para 'a':
   - ¿Existe hijo 'a'? NO → Crear nuevo nodo
   - Moverse a nodo 'a'
4. Para 't':
   - ¿Existe hijo 't'? NO → Crear nuevo nodo
   - Moverse a nodo 't'
5. Marcar nodo 't': isEndOfWord = true

Estado después:
root → c → a → t*
```

**Operación: SEARCH (palabra completa)**
```
search("cat"):

1. Empezar en root
2. Para 'c':
   - ¿Existe hijo 'c'? SÍ → Moverse
3. Para 'a':
   - ¿Existe hijo 'a'? SÍ → Moverse
4. Para 't':
   - ¿Existe hijo 't'? SÍ → Moverse
5. ¿nodo 't' tiene isEndOfWord = true? SÍ
6. Return true

search("ca"):
- Llegar a nodo 'a'
- ¿isEndOfWord = true? NO
- Return false (no es palabra completa)
```

**Operación: STARTSWITH (prefijo)**
```
startsWith("ca"):

1. Empezar en root
2. Para 'c':
   - ¿Existe hijo 'c'? SÍ → Moverse
3. Para 'a':
   - ¿Existe hijo 'a'? SÍ → Moverse
4. Llegamos al final del prefijo
5. Return true (no importa isEndOfWord)
```

**Diferencia clave: search vs startsWith**

| Operación | ¿Valida isEndOfWord? | Ejemplo |
|-----------|----------------------|---------|
| search("app") | ✅ SÍ | false si "apple" existe pero "app" no |
| startsWith("app") | ❌ NO | true si "apple" existe |

## 💻 Implementación

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

**Versión alternativa con object literal:**
```typescript
class TrieNode {
    children: {[key: string]: TrieNode};
    isEndOfWord: boolean;
    
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

// Uso:
if (!current.children[char]) {
    current.children[char] = new TrieNode();
}
current = current.children[char];
```

## ⚠️ Errores Comunes

### 1. **Confundir has() con acceso de array**
```typescript
// ❌ INCORRECTO
if (!current.children.has[char]) {  // Sintaxis incorrecta
//                        ^^^
}

// ✅ CORRECTO
if (!current.children.has(char)) {  // Método de Map
//                        ^^^^^
}
```

### 2. **No marcar isEndOfWord en insert**
```typescript
// ❌ INCORRECTO
insert(word: string): void {
    let current = this.root;
    for (const char of word) {
        // ... crear nodos
        current = current.children.get(char);
    }
    // OLVIDÓ: current.isEndOfWord = true;
}

// ✅ CORRECTO
insert(word: string): void {
    // ...
    current.isEndOfWord = true;  // CRÍTICO
}
```

### 3. **Validar isEndOfWord en startsWith**
```typescript
// ❌ INCORRECTO - startsWith NO debe validar isEndOfWord
startsWith(prefix: string): boolean {
    // ...
    return current.isEndOfWord;  // ❌ Retorna false para prefijos
}

// ✅ CORRECTO
startsWith(prefix: string): boolean {
    // ...
    return true;  // Solo importa que el camino exista
}
```

### 4. **No inicializar children en constructor**
```typescript
// ❌ INCORRECTO
class TrieNode {
    children: Map<string, TrieNode>;
    
    constructor() {
        // No inicializa children
    }
}

// ✅ CORRECTO
class TrieNode {
    children: Map<string, TrieNode>;
    
    constructor() {
        this.children = new Map();  // CRÍTICO
    }
}
```

### 5. **Retornar prematuro en búsqueda**
```typescript
// ❌ INCORRECTO
search(word: string): boolean {
    for (const char of word) {
        if (!current.children.has(char)) {
            return current.isEndOfWord;  // ❌ Evalúa isEndOfWord antes de terminar
        }
    }
}

// ✅ CORRECTO
search(word: string): boolean {
    for (const char of word) {
        if (!current.children.has(char)) {
            return false;  // Palabra no existe
        }
        current = current.children.get(char);
    }
    return current.isEndOfWord;  // Evalúa DESPUÉS del loop
}
```

## 🧪 Análisis Big O

Para palabra de longitud `m`:

**Insert:**
- **Time:** O(m) - Un carácter por iteración
- **Space:** O(m) - En peor caso, crear m nodos nuevos

**Search:**
- **Time:** O(m) - Recorrer m caracteres
- **Space:** O(1) - No crea nada

**StartsWith:**
- **Time:** O(m) - Recorrer m caracteres
- **Space:** O(1) - No crea nada

**Comparación con otras estructuras:**

| Operación | HashSet | Trie |
|-----------|---------|------|
| Insert palabra | O(m) | O(m) |
| Search palabra | O(m) | O(m) |
| Search prefijo | O(n×m) ❌ | O(m) ✅ |
| Space total | O(n×m) | O(ALPHABET_SIZE × n × m) |

**n** = número de palabras, **m** = longitud promedio

**Ventaja clave de Trie:** Búsqueda de prefijos en O(m) vs O(n×m) con HashSet.