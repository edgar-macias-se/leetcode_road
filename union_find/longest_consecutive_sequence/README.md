# Problema 2: Longest Consecutive Sequence (LeetCode #128) 🔥

## 🧠 Concepto Clave

**Union-Find + HashMap:** Usa Union-Find con una variante llamada **Union by Size** para rastrear automáticamente el tamaño del componente más grande. Cada número es un nodo, y números consecutivos se unen. El tamaño máximo de cualquier componente es la longitud de la secuencia consecutiva más larga.

## 🗺️ La Estrategia

### Español

**El Problema:**
```
nums = [100, 4, 200, 1, 3, 2]

Secuencias consecutivas:
[1, 2, 3, 4]  → longitud 4 ✅
[100]         → longitud 1
[200]         → longitud 1

Resultado: 4
```

**¿Por qué Union-Find?**

Podemos modelar el problema como un grafo:
- Cada número es un **nodo**
- Si dos números son **consecutivos**, los conectamos

```
Grafo para [100, 4, 200, 1, 3, 2]:

1 — 2 — 3 — 4    100    200

Componentes:
{1, 2, 3, 4}  → tamaño 4 ✅
{100}         → tamaño 1
{200}         → tamaño 1
```

**Union by Size vs Union by Rank:**

```typescript
// Union by Rank (problema anterior)
class UnionFind {
    rank: number[];  // Altura aproximada del árbol
    
    union(x, y) {
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;  // Solo incrementar cuando iguales
        }
    }
}

// Union by Size (este problema) ✅
class UnionFind {
    size: number[];   // Tamaño exacto del componente
    maxSize: number;  // Tamaño del componente más grande
    
    union(x, y) {
        size[rootX] += size[rootY];  // Sumar tamaños
        maxSize = Math.max(maxSize, size[rootX]);  // Actualizar máximo
    }
}
```

**¿Por qué Union by Size aquí?**

Porque necesitamos el **tamaño exacto** del componente más grande, no solo una aproximación de altura.

**Algoritmo Paso a Paso:**

```
nums = [100, 4, 200, 1, 3, 2]

1. Eliminar duplicados con HashMap:
   map = {100: 0, 4: 1, 200: 2, 1: 3, 3: 4, 2: 5}
   //     num  idx

2. Crear Union-Find con 6 elementos:
   parent  = [0, 1, 2, 3, 4, 5]
   size    = [1, 1, 1, 1, 1, 1]
   maxSize = 1

3. Para cada número, verificar si num+1 existe:
   
   100: ¿Existe 101? NO → skip
   
   4: ¿Existe 5? NO → skip
   
   200: ¿Existe 201? NO → skip
   
   1: ¿Existe 2? SÍ (índice 5)
      union(3, 5)
      parent  = [0, 1, 2, 3, 4, 3]
      size    = [1, 1, 1, 2, 1, 1]
                         ↑ tamaño de componente {1,2}
      maxSize = 2
   
   3: ¿Existe 4? SÍ (índice 1)
      union(4, 1)
      parent  = [0, 1, 2, 3, 4, 4]
      size    = [1, 1, 1, 2, 2, 1]
                            ↑ tamaño de componente {3,4}
      maxSize = 2
   
   2: ¿Existe 3? SÍ (índice 4)
      union(5, 4)
      find(5) = 3, find(4) = 4
      union(3, 4)
      parent  = [0, 1, 2, 4, 4, 3]
      size    = [1, 1, 1, 2, 4, 1]
                            ↑ tamaño de componente {1,2,3,4}
      maxSize = 4 ✅

4. Retornar maxSize = 4
```

**Visualización de Componentes:**

```
Después de union(1, 2):
    3       1       0   4   2
            |
            5
{1,2} tamaño=2

Después de union(3, 4):
    3       4       0   2
            |
            1
{3,4} tamaño=2, {1,2} tamaño=2

Después de union(2, 3):
        4           0
       / \
      1   3
      |
      5

{1,2,3,4} tamaño=4, maxSize=4 ✅
```

**¿Por qué usar HashMap?**

```
nums = [100, 4, 200, 1, 3, 2]

Sin HashMap:
Necesitarías Union-Find de tamaño 201 (0 a 200)
Espacio: O(max(nums)) ❌

Con HashMap:
Mapear números a índices contiguos [0, 1, 2, 3, 4, 5]
Espacio: O(n) ✅
```

**Optimización de Union by Size:**

```typescript
union(i: number, j: number): void {
    let rootI = this.find(i);
    let rootJ = this.find(j);
    
    if (rootI !== rootJ) {
        // Optimización: siempre poner el más pequeño bajo el más grande
        if (this.size[rootI] < this.size[rootJ]) {
            [rootI, rootJ] = [rootJ, rootI];  // Swap
        }
        this.parent[rootJ] = rootI;
        this.size[rootI] += this.size[rootJ];  // Sumar tamaños
        this.maxSize = Math.max(this.maxSize, this.size[rootI]);
    }
}
```

## 💻 Implementación

```typescript
class UnionFind {
    parent: number[];
    size: number[];
    maxSize: number;

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.size = new Array(n).fill(1);
        this.maxSize = n > 0 ? 1 : 0;
    }

    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);  // Path compression
    }

    union(i: number, j: number): void {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by Size: poner el más pequeño bajo el más grande
            if (this.size[rootI] < this.size[rootJ]) {
                [rootI, rootJ] = [rootJ, rootI];
            }
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
            this.maxSize = Math.max(this.maxSize, this.size[rootI]);
        }
    }
}

function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;

    const uf = new UnionFind(nums.length);
    const map = new Map<number, number>();

    // 1. Eliminar duplicados y asignar índices
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) continue;
        map.set(nums[i], i);
    }

    // 2. Unir números consecutivos
    for (const [num, index] of map) {
        if (map.has(num + 1)) {
            uf.union(index, map.get(num + 1)!);
        }
    }

    return uf.maxSize;
}
```

**Versión alternativa con HashSet (más simple):**
```typescript
function longestConsecutive(nums: number[]): number {
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (const num of numSet) {
        // Solo empezar secuencia si es el inicio (num-1 no existe)
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;
            
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = Math.max(maxLength, currentLength);
        }
    }
    
    return maxLength;
}
```

## ⚠️ Errores Comunes

### 1. **Usar Union by Rank en lugar de Union by Size**
```typescript
// ⚠️ FUNCIONA pero NO mantiene tamaño exacto
class UnionFind {
    rank: number[];  // Altura aproximada
    
    union(x, y) {
        if (rank[rootX] === rank[rootY]) {
            rank[rootX]++;  // Incremento, NO suma
        }
    }
}
// ¿Cómo sabes el tamaño del componente? ❌

// ✅ CORRECTO - Union by Size
class UnionFind {
    size: number[];  // Tamaño exacto
    
    union(x, y) {
        size[rootX] += size[rootY];  // Suma de tamaños
        maxSize = Math.max(maxSize, size[rootX]);
    }
}
```

### 2. **No eliminar duplicados antes de crear Union-Find**
```typescript
// ❌ INCORRECTO
nums = [1, 2, 1, 3, 2]
uf = new UnionFind(nums.length)  // Tamaño 5

map.set(1, 0)
map.set(2, 1)
map.set(1, 2)  // Sobrescribe índice 0 con 2
// Ahora el índice 0 está huérfano

// ✅ CORRECTO - Verificar duplicados
for (let i = 0; i < nums.length; i++) {
    if (map.has(nums[i])) continue;  // Skip duplicados
    map.set(nums[i], i);
}
```

### 3. **Verificar num-1 en lugar de num+1**
```typescript
// ❌ INCORRECTO - Une en la dirección equivocada
for (const [num, index] of map) {
    if (map.has(num - 1)) {  // Busca hacia atrás
        uf.union(index, map.get(num - 1)!);
    }
}

// ✅ CORRECTO - Une hacia adelante
for (const [num, index] of map) {
    if (map.has(num + 1)) {  // Busca hacia adelante
        uf.union(index, map.get(num + 1)!);
    }
}
```

**Explicación:** Ambos funcionan, pero `num+1` es más natural (construir secuencia hacia adelante).

### 4. **No inicializar maxSize correctamente**
```typescript
// ❌ INCORRECTO
constructor(n: number) {
    this.maxSize = 0;  // Si n=1, nunca se actualiza
}

// ✅ CORRECTO
constructor(n: number) {
    this.maxSize = n > 0 ? 1 : 0;  // Mínimo es 1 si hay elementos
}
```

### 5. **Olvidar actualizar maxSize en union**
```typescript
// ❌ INCORRECTO
union(i, j) {
    this.size[rootI] += this.size[rootJ];
    // OLVIDÓ: actualizar maxSize
}

// ✅ CORRECTO
union(i, j) {
    this.size[rootI] += this.size[rootJ];
    this.maxSize = Math.max(this.maxSize, this.size[rootI]);
}
```

## 🧪 Análisis Big O

**Variables:**
- `n` = longitud de nums
- `α(n)` = inversa de Ackermann ≈ O(1)

**Eliminar duplicados con HashMap:**
- **Time:** O(n)
- **Space:** O(n)

**Construcción Union-Find:**
- **Time:** O(n)
- **Space:** O(n)

**Unir números consecutivos:**
- **Time:** O(n × α(n)) ≈ O(n) - Iterar map + union operations
- **Space:** O(1)

**Total:**
- **Time:** O(n) - Lineal con optimizaciones
- **Space:** O(n) - HashMap + Union-Find

**Comparación:**

| Approach | Time | Space | Notas |
|----------|------|-------|-------|
| Sorting | O(n log n) | O(1) | Simple pero más lento |
| HashSet | O(n) | O(n) | Más simple ✅ |
| **Union-Find** | **O(n)** | **O(n)** | Elegante, mantiene componentes ✅ |
