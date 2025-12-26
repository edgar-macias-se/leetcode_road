# Minimum Spanning Tree (MST) - Prim's & Kruskal's (Dominio Completo)

## 🏷️ Tags

`#MST` `#MinimumSpanningTree` `#Prim` `#Kruskal` `#UnionFind` `#Graph` `#Greedy` `#Medium` `#TypeScript`

---

# Min Cost to Connect All Points (LeetCode #1584)

## 🧠 Concepto Clave

**Minimum Spanning Tree (MST)** es un subgrafo que:
1. Conecta **TODOS** los nodos del grafo
2. Es un **árbol** (sin ciclos)
3. Tiene la **mínima suma** de pesos de aristas

Dos algoritmos clásicos para encontrar MST:
- **Prim's Algorithm:** Greedy que crece un árbol nodo por nodo
- **Kruskal's Algorithm:** Greedy que agrega aristas ordenadas por peso

---

## 🗺️ La Estrategia

### Español

**El Problema:**
```
Input: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20

Visualización:
    (3,10)
       |
      9|
       |
    (0,0)--4--(2,2)--3--(5,2)--4--(7,0)

Conexiones óptimas del MST:
- (0,0) a (2,2): |0-2| + |0-2| = 4
- (2,2) a (5,2): |2-5| + |2-2| = 3  
- (5,2) a (7,0): |5-7| + |2-0| = 4
- (2,2) a (3,10): |2-3| + |2-10| = 9

Total MST: 4 + 3 + 4 + 9 = 20
```

---

**¿Qué es un Spanning Tree?**

```
Definiciones:

Tree (Árbol):
  - Grafo conectado (todos alcanzables)
  - Sin ciclos
  - n nodos → n-1 aristas

Spanning Tree:
  - Tree que incluye TODOS los nodos
  - Usa exactamente n-1 aristas

Minimum Spanning Tree (MST):
  - Spanning tree con MENOR suma de pesos
```

**Ejemplo Visual:**

```
Grafo:
    1 ----5---- 2
    |  \    /  |
   2|   \ /   1|
    |    X     |
    3 ----3---- 4

MST óptimo:
    1 ----5---- 2
    |           |
   2|          1|
    |           |
    3 ----3---- 4

Total: 2 + 5 + 1 + 3 = 11
```

---

**Diferencia: MST vs Dijkstra**

| Aspecto | Dijkstra | MST |
|---------|----------|-----|
| **Objetivo** | Shortest path desde UN nodo | Conectar TODOS |
| **Output** | Distancias | Árbol (aristas) |
| **Criterio** | Camino individual mínimo | Suma total mínima |

---

## 💻 Algoritmo 1: Prim's

### Idea

Crecer árbol agregando siempre la arista MÁS BARATA que conecte un nodo nuevo.

### Implementación

```typescript
function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    if (n === 1) return 0;
    
    const visited = new Set<number>();
    const heap = new MinPriorityQueue<[number, number]>(([w,_]) => w);
    
    visited.add(0);
    
    for(let i = 1; i < n; i++){
        const cost = manhattanDistance(points[0], points[i]);
        heap.enqueue([cost, i]);
    }
    
    let totalCost = 0;

    while(visited.size < n){
        const [cost, idx] = heap.dequeue();
        
        if(visited.has(idx)) continue;
        
        visited.add(idx);
        totalCost += cost;

        for(let i = 0; i < n; i++){
            if(!visited.has(i)){
                const newCost = manhattanDistance(points[idx], points[i]);
                heap.enqueue([newCost, i]);
            }
        }
    }

    return totalCost;
}

function manhattanDistance(p1: number[], p2: number[]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}
```

### Complejidad
- **Time:** O(E log V) = O(n² log n)
- **Space:** O(n²)

---

## 💻 Algoritmo 2: Kruskal's

### Idea

Ordenar TODAS las aristas y agregar las más baratas, evitando ciclos con Union-Find.

### Union-Find

```typescript
class UnionFind {
    private parent: number[];
    private rank: number[];
    
    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
}
```

### Implementación

```typescript
function minCostConnectPointsKruskal(points: number[][]): number {
    const n = points.length;
    if (n === 1) return 0;
    
    const edges: [number, number, number][] = [];
    
    for(let i = 0; i < n; i++){
        for(let j = i + 1; j < n; j++){
            const cost = manhattanDistance(points[i], points[j]);
            edges.push([cost, i, j]);
        }
    }
    
    edges.sort((a, b) => a[0] - b[0]);
    
    const uf = new UnionFind(n);
    let totalCost = 0;
    let edgesUsed = 0;
    
    for(const [cost, u, v] of edges){
        if(uf.union(u, v)){
            totalCost += cost;
            if(++edgesUsed === n - 1) break;
        }
    }
    
    return totalCost;
}
```

### Complejidad
- **Time:** O(E log E) = O(n² log n)
- **Space:** O(n²)

---

## 🎯 Comparación

| Aspecto | Prim's | Kruskal's |
|---------|--------|-----------|
| **Approach** | Crece árbol | Agrega aristas |
| **Estructura** | Min Heap | Sort + Union-Find |
| **Implementación** | Similar a Dijkstra | Más simple |
| **Mejor para** | Grafos densos | Grafos dispersos |

---

## ⚠️ Errores Comunes

### 1. Usar Arrays en Set

```typescript
// ❌ INCORRECTO
const visited = new Set([points[0]]);
visited.has(punto);  // Compara referencias ❌

// ✅ CORRECTO
const visited = new Set<number>([0]);
visited.has(idx);  // Compara valores ✓
```

### 2. Confundir con Dijkstra

```typescript
// ❌ Dijkstra (distancia acumulada)
const newDist = dist + weight;

// ✅ Prim's (costo de arista)
const cost = manhattanDistance(p1, p2);
```

### 3. Sin path compression

```typescript
// ❌ INCORRECTO
find(x) {
    return this.parent[x] === x ? x : this.find(this.parent[x]);
}

// ✅ CORRECTO
find(x) {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);  // ← Path compression
    }
    return this.parent[x];
}
```

---

## 🧪 Big O

**Ambos algoritmos:**
- Time: O(n² log n) para grafo completo
- Space: O(n²)

**Prim's ligeramente más eficiente en práctica.**

---

## 💡 Casos de Uso

- ✅ Redes de telecomunicaciones
- ✅ Redes eléctricas
- ✅ Diseño de transporte
- ✅ Clustering en ML
- ✅ Diseño de circuitos

---

## 📊 Progreso

**Sección 4: Graphs**
- [x] Dijkstra's ✅
- [x] **Prim's & Kruskal's** ✅
- [ ] Topological Sort

**Problemas:** 27/45 (60%)  
**Patrones:** 12/15

---

## 🔥 Tips

**Prim's:**
1. Usar índices, no arrays
2. Heap con tuplas `[costo, índice]`
3. Similar a Dijkstra

**Kruskal's:**
1. Generar todas las aristas
2. Ordenar por costo
3. Union-Find con path compression
4. Parar en n-1 aristas

**General:**
- MST = n-1 aristas siempre
- Manhattan: `|x1-x2| + |y1-y2|`
