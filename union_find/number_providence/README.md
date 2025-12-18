# Problema 1: Number of Provinces (LeetCode #547)

## 🧠 Concepto Clave

**Union-Find** (también llamado **Disjoint Set Union - DSU**) es una estructura de datos que mantiene una colección de **conjuntos disjuntos** (no se solapan) y soporta dos operaciones principales: **Find** (¿a qué conjunto pertenece este elemento?) y **Union** (unir dos conjuntos). Es ideal para problemas de **conectividad** y **componentes conectados** en grafos.


## 🗺️ La Estrategia

### Español

**Visualización de la Estructura:**
```
Elementos: [0, 1, 2, 3, 4, 5]

Inicial: Cada elemento es su propio conjunto
{0} {1} {2} {3} {4} {5}

parent = [0, 1, 2, 3, 4, 5]  // Cada uno es su propio padre

Después de union(0, 1):
{0, 1} {2} {3} {4} {5}

    0       2   3   4   5
    |
    1

parent = [0, 0, 2, 3, 4, 5]

Después de union(2, 3):
{0, 1} {2, 3} {4} {5}

    0       2       4   5
    |       |
    1       3

parent = [0, 0, 2, 2, 4, 5]

Después de union(0, 2):
{0, 1, 2, 3} {4} {5}

        0           4   5
       / \
      1   2
          |
          3

parent = [0, 0, 0, 2, 4, 5]
```

**Operaciones Fundamentales:**

**1. FIND - Encontrar la raíz (representante del conjunto)**
```typescript
// Versión básica (sin optimización)
find(x: number): number {
    while (x !== parent[x]) {
        x = parent[x];  // Sube al padre
    }
    return x;
}
// Complejidad: O(n) en peor caso (árbol degenerado)

// Versión optimizada: Path Compression ⚡
find(x: number): number {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);  // Comprimir camino
    }
    return this.parent[x];
}
// Complejidad: O(α(n)) ≈ O(1) amortizado
```

**Path Compression - ¿Qué hace?**
```
Antes de find(5):
5 → 4 → 3 → 2 → 1 → 0

Durante find(5) con path compression:
1. Encontrar raíz: 5 → 4 → 3 → 2 → 1 → 0 (raíz = 0)
2. Comprimir: hacer que todos apunten directamente a 0

Después:
5 → 0
4 → 0
3 → 0
2 → 0
1 → 0

Próxima vez find(5): 5 → 0  (O(1)) ✅
```

**2. UNION - Unir dos conjuntos**
```typescript
// Versión básica (sin optimización)
union(x: number, y: number): void {
    let rootX = this.find(x);
    let rootY = this.find(y);
    
    if (rootX !== rootY) {
        this.parent[rootX] = rootY;  // Cualquier dirección
    }
}

// Versión optimizada: Union by Rank ⚡
union(x: number, y: number): void {
    let rootX = this.find(x);
    let rootY = this.find(y);
    
    if (rootX === rootY) return;  // Ya en el mismo conjunto
    
    // Unir árbol más bajo bajo árbol más alto
    if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
    } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;  // Solo incrementar cuando alturas iguales
    }
}
```

**Union by Rank - ¿Por qué?**
```
Sin optimización:
0 → 1 → 2 → 3 → 4 → 5  (árbol degenerado, altura = n)

Con union by rank:
        0
       /|\
      1 2 3  (árbol balanceado, altura = log n)
```

**Concepto de Rank:**
- `rank` es una **aproximación de la altura** del árbol
- Solo incrementa cuando unes dos árboles de **igual altura**
- Garantiza que la altura del árbol sea O(log n)

**Aplicación al Problema:**

```
isConnected = [[1,1,0],
               [1,1,0],
               [0,0,1]]

Grafo implícito:
0 — 1    2

Algoritmo:
1. Crear Union-Find con n=3 ciudades
2. Para cada conexión isConnected[i][j] = 1:
   union(i, j)
3. Contar cuántos conjuntos distintos (provincias)

Estado inicial:
parent = [0, 1, 2]
rank   = [0, 0, 0]

Procesar isConnected[0][1] = 1:
union(0, 1)
parent = [0, 0, 2]
rank   = [1, 0, 0]

Contar provincias:
- parent[0] = 0 ✓ (es raíz)
- parent[1] = 0 ✗ (no es raíz)
- parent[2] = 2 ✓ (es raíz)

Resultado: 2 provincias
```

**Optimización de Recorrido:**

La matriz es **simétrica**: `isConnected[i][j] = isConnected[j][i]`

```typescript
// ❌ Recorrer toda la matriz (redundante)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (isConnected[i][j] === 1) {
            union(i, j);  // union(0,1) y union(1,0) son lo mismo
        }
    }
}

// ✅ Solo recorrer mitad superior
for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {  // j empieza en i+1
        if (isConnected[i][j] === 1) {
            union(i, j);
        }
    }
}
```

## 💻 Implementación

```typescript
class UnionFind {
    parent: number[];
    rank: number[];
    
    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = Array(n).fill(0);
    }
    
    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    union(x: number, y: number): void {
        let rootX = this.find(x);
        let rootY = this.find(y);
        
        if (rootX === rootY) return;
        
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }
}

function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const uf = new UnionFind(n);
    
    // Procesar conexiones (solo mitad superior)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    // Contar provincias (conjuntos distintos)
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (i === uf.parent[i]) {  // Es raíz
            count++;
        }
    }
    
    return count;
}
```

**Versión alternativa con DFS (más simple para este problema):**
```typescript
function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let count = 0;
    
    function dfs(city: number): void {
        visited[city] = true;
        for (let j = 0; j < n; j++) {
            if (isConnected[city][j] === 1 && !visited[j]) {
                dfs(j);
            }
        }
    }
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            count++;
        }
    }
    
    return count;
}
```

## ⚠️ Errores Comunes

### 1. **Asignar parent[raíz] en lugar de raíz directamente**
```typescript
// ❌ INCORRECTO
union(x: number, y: number): void {
    if (rank[rootX] < rank[rootY]) {
        this.parent[rootX] = this.parent[rootY];  // ❌ Podría no ser rootY
    }
}

// ✅ CORRECTO
union(x: number, y: number): void {
    if (rank[rootX] < rank[rootY]) {
        this.parent[rootX] = rootY;  // ✅ Usa la raíz directamente
    }
}
```

### 2. **Sumar ranks en lugar de solo incrementar cuando iguales**
```typescript
// ❌ INCORRECTO
union(x: number, y: number): void {
    this.parent[rootY] = rootX;
    this.rank[rootX] += this.rank[rootY];  // ❌ NO sumar
}

// ✅ CORRECTO
union(x: number, y: number): void {
    if (this.rank[rootX] === this.rank[rootY]) {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;  // ✅ Solo incrementar cuando iguales
    }
}
```

**Explicación:**
- `rank` es **altura aproximada**, no tamaño
- Solo incrementa cuando unes árboles de igual altura
- Si unes árbol altura 2 con árbol altura 1, la altura final sigue siendo 2

### 3. **No optimizar find() con path compression**
```typescript
// ⚠️ FUNCIONA pero es LENTO
find(x: number): number {
    while (x !== this.parent[x]) {
        x = this.parent[x];
    }
    return x;
}
// Complejidad: O(n) en peor caso

// ✅ ÓPTIMO
find(x: number): number {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
}
// Complejidad: O(α(n)) ≈ O(1) amortizado
```

### 4. **Recorrer toda la matriz en lugar de mitad superior**
```typescript
// ⚠️ FUNCIONA pero INEFICIENTE (hace union redundante)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (isConnected[i][j] === 1) {
            union(i, j);  // union(0,1) y union(1,0) duplicado
        }
    }
}

// ✅ ÓPTIMO
for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {  // Evita duplicados
        if (isConnected[i][j] === 1) {
            union(i, j);
        }
    }
}
```

### 5. **Usar Set para contar en lugar de iterar parent**
```typescript
// ⚠️ FUNCIONA pero usa O(n) espacio extra
const roots = new Set<number>();
for (let i = 0; i < n; i++) {
    roots.add(find(i));
}
return roots.size;

// ✅ MEJOR - O(1) espacio
let count = 0;
for (let i = 0; i < n; i++) {
    if (i === parent[i]) count++;
}
return count;
```

## 🧪 Análisis Big O

**Variables:**
- `n` = número de ciudades
- `α(n)` = función inversa de Ackermann (crece extremadamente lento, prácticamente constante)

**Construcción Union-Find:**
- **Time:** O(n) - Inicializar arrays
- **Space:** O(n) - Arrays parent y rank

**Operación find() con path compression:**
- **Time:** O(α(n)) ≈ O(1) amortizado
- **Space:** O(α(n)) - Stack de recursión

**Operación union() con union by rank:**
- **Time:** O(α(n)) ≈ O(1) amortizado (2 calls a find)
- **Space:** O(1)

**Procesar matriz isConnected:**
- **Time:** O(n²) - Recorrer matriz
- **Space:** O(1) - Solo variables

**Contar provincias:**
- **Time:** O(n) - Iterar parent
- **Space:** O(1)

**Total:**
- **Time:** O(n²) - Dominado por recorrido de matriz
- **Space:** O(n) - Union-Find structure

**Comparación:**

| Approach | Time | Space | Notas |
|----------|------|-------|-------|
| **Union-Find** | **O(n²)** | **O(n)** | Mejor para queries dinámicas ✅ |
| DFS/BFS | O(n²) | O(n) | Más simple para este problema ✅ |

**¿Cuándo usar Union-Find vs DFS?**

| Escenario | Union-Find | DFS/BFS |
|-----------|------------|---------|
| Grafo estático | O(n²) | O(n²) - **Más simple** ✅ |
| Actualizaciones dinámicas | O(α(n)) por operación ✅ | O(n) - Rehacer todo ❌ |
| Queries de conectividad | O(α(n)) ✅ | O(n) ❌ |
| Grafo dirigido | ❌ No aplica bien | ✅ Funciona |
