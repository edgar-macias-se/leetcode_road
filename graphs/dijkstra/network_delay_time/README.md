# Dijkstra's Algorithm - Network Delay Time (Dominio Completo)

## 🏷️ Tags

`#Dijkstra` `#ShortestPath` `#Graph` `#PriorityQueue` `#Greedy` `#Medium` `#TypeScript`

---

# Network Delay Time (LeetCode #743)

## 🧠 Concepto Clave

**Dijkstra's Algorithm** es un algoritmo greedy para encontrar el **shortest path** (camino más corto) desde un nodo origen a todos los demás nodos en un grafo con **pesos positivos**. Usa una Priority Queue (Min Heap) para siempre procesar el nodo con la menor distancia actual.

---

## 🗺️ La Estrategia

**El Problema:**
```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2

Grafo:
    1
   ↗ (1)
  2 → 3 → 4
    (1) (1)

Desde k=2, encontrar tiempo mínimo para que TODOS los nodos reciban señal.
```

**¿Por Qué Dijkstra?**

Este problema requiere:
1. ✅ Shortest path desde un nodo a todos los demás
2. ✅ Grafo con pesos positivos (0 ≤ wi ≤ 100)
3. ✅ Eficiencia O((V + E) log V)

**Algoritmos de Shortest Path:**

| Algoritmo | Complejidad | Pesos Negativos | Mejor Para |
|-----------|-------------|-----------------|------------|
| **BFS** | O(V + E) | ❌ Solo peso=1 | Grafos no ponderados |
| **Dijkstra** | O((V+E) log V) | ❌ | Pesos positivos ✅ |
| **Bellman-Ford** | O(V × E) | ✅ | Pesos negativos |

---

**Idea Intuitiva:**

**Analogía:** GPS navegando por una ciudad.
- Siempre exploras el camino que parece más corto
- Marcas lugares ya visitados
- Actualizas distancias si encuentras un camino mejor

**El Algoritmo:**

```
1. Inicializar todas las distancias a ∞, excepto el nodo inicial (0)
2. Usar Min Heap para trackear nodos por distancia
3. Mientras haya nodos por procesar:
   a. Sacar el nodo con menor distancia
   b. Si ya fue visitado, skip
   c. Marcar como visitado
   d. Relajar aristas: para cada vecino, si encontramos
      un camino más corto, actualizar su distancia
4. Retornar la máxima distancia (tiempo del nodo más lejano)
```

---

**Visualización Paso a Paso:**

```
Grafo: times = [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2

Adjacency List:
{
  1: [],
  2: [[1,1], [3,1]],
  3: [[4,1]],
  4: []
}

Proceso:

Initial State:
  distances = [∞, ∞, 0, ∞, ∞]
                   1  2  3  4
  minHeap = [[2, 0]]  (nodo, distancia)
  visited = {}

─────────────────────────────────────

Step 1: Process node 2 (dist=0)
  
  visited = {2}
  
  Vecinos de 2: [[1,1], [3,1]]
  
  Relajar arista 2→1 (peso 1):
    newDist = 0 + 1 = 1
    1 < ∞ ? YES ✓
    distances[1] = 1
    minHeap.enqueue([1, 1])
  
  Relajar arista 2→3 (peso 1):
    newDist = 0 + 1 = 1
    1 < ∞ ? YES ✓
    distances[3] = 1
    minHeap.enqueue([3, 1])
  
  Estado:
    distances = [∞, 1, 0, 1, ∞]
    minHeap = [[1,1], [3,1]]

─────────────────────────────────────

Step 2: Process node 1 (dist=1)
  
  visited = {2, 1}
  
  Vecinos de 1: [] (ninguno)
  
  Estado:
    distances = [∞, 1, 0, 1, ∞]
    minHeap = [[3,1]]

─────────────────────────────────────

Step 3: Process node 3 (dist=1)
  
  visited = {2, 1, 3}
  
  Vecinos de 3: [[4,1]]
  
  Relajar arista 3→4 (peso 1):
    newDist = 1 + 1 = 2
    2 < ∞ ? YES ✓
    distances[4] = 2
    minHeap.enqueue([4, 2])
  
  Estado:
    distances = [∞, 1, 0, 1, 2]
    minHeap = [[4,2]]

─────────────────────────────────────

Step 4: Process node 4 (dist=2)
  
  visited = {2, 1, 3, 4}
  
  Vecinos de 4: []
  
  Estado:
    distances = [∞, 1, 0, 1, 2]
    minHeap = []

─────────────────────────────────────

Resultado Final:
  distances = [∞, 1, 0, 1, 2]
  
  Máxima distancia = max(1, 0, 1, 2) = 2 ✓
  
  Todos los nodos alcanzables → return 2
```

---

**¿Por Qué el Máximo?**

```
El problema pregunta: "¿Cuánto tarda en llegar la señal a TODOS?"

Desde k=2:
- Nodo 1 recibe señal en tiempo 1
- Nodo 3 recibe señal en tiempo 1
- Nodo 4 recibe señal en tiempo 2

¿Cuándo han recibido TODOS la señal?
→ Cuando el nodo MÁS LEJANO la recibe
→ max(1, 1, 2) = 2
```

---

**Relajación de Aristas (Relaxation):**

```
La "relajación" es actualizar la distancia si encontramos un camino mejor.

Ejemplo:
  distances[4] = 10  (camino actual conocido)
  
  Descubrimos nuevo camino: 3 → 4 con peso 1
  Distancia desde origen a 3 = 8
  
  newDist = 8 + 1 = 9
  
  9 < 10 ? YES ✓
  distances[4] = 9  ← RELAJAMOS (actualizamos a mejor distancia)
```


## 💻 Implementación

### Versión 1: API Estándar (Elemento + Prioridad Separados)

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Construir adjacency list
    const adjList = new Map<number, number[][]>();
    for(let i = 1; i <= n; i++){
        adjList.set(i, []);
    }

    for(const [src, dest, weight] of times){
        adjList.get(src)!.push([dest, weight]);
    }
    
    // 2. Inicializar distancias
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    // 3. Min Priority Queue (API estándar)
    const minHeap = new MinPriorityQueue<number>();
    minHeap.enqueue(k, 0);  // (elemento, prioridad)

    const visited = new Set<number>();

    // 4. Dijkstra
    while(!minHeap.isEmpty()){
        const {element: node, priority: dist} = minHeap.dequeue();
        
        // Skip si ya visitado
        if(visited.has(node)){
            continue;
        }
        
        visited.add(node);

        // Relajar aristas
        for(const [neighbor, weight] of adjList.get(node)!){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue(neighbor, newDist);
            }
        }
    }

    // 5. Encontrar máxima distancia
    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Características:**
- ✅ API explícita: `enqueue(elemento, prioridad)`
- ✅ Destructuring de objeto: `{element, priority}`
- ✅ Clara separación de elemento y prioridad

---

### Versión 2: Comparador Custom (Tuplas) ⭐

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Construir adjacency list
    const adjList = new Map<number, number[][]>();
    for(let i = 1; i <= n; i++){
        adjList.set(i, []);
    }

    for(const [src, dest, weight] of times){
        adjList.get(src)!.push([dest, weight]);
    }
    
    // 2. Inicializar distancias
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    // 3. Min Priority Queue con comparador custom
    const minHeap = new MinPriorityQueue<[number,number]>(([,tw]) => tw); 
    minHeap.enqueue([k, 0]);  // [nodo, distancia]

    const visited = new Set<number>();

    // 4. Dijkstra
    while(!minHeap.isEmpty()){
        const [node, dist] = minHeap.dequeue();
        
        if(visited.has(node)) continue;
        visited.add(node);

        for(const [neighbor, weight] of adjList.get(node)!){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue([neighbor, newDist]);
            }
        }
    }

    // 5. Encontrar máxima distancia
    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Características:**
- ✅ Comparador: `([,tw]) => tw` extrae la prioridad
- ✅ Tuplas: `[nodo, distancia]`
- ✅ Destructuring de array: `[node, dist]`
- ✅ Más conciso

---

### Versión 3: Sin Heap (Array Simple)

Para n ≤ 100, un array simple es aceptable:

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Construir adjacency list
    const adjList: Record<number, number[][]> = {};
    for(let i = 1; i <= n; i++){
        adjList[i] = [];
    }

    for(const [src, dest, weight] of times){
        adjList[src].push([dest, weight]);
    }
    
    // 2. Inicializar distancias
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    const visited = new Set<number>();

    // 3. Dijkstra sin heap
    for(let i = 0; i < n; i++){
        // Encontrar nodo no visitado con menor distancia
        let minDist = Infinity;
        let node = -1;
        
        for(let j = 1; j <= n; j++){
            if(!visited.has(j) && distances[j] < minDist){
                minDist = distances[j];
                node = j;
            }
        }
        
        if(node === -1) break;  // No más nodos alcanzables
        
        visited.add(node);

        // Relajar aristas
        for(const [neighbor, weight] of adjList[node]){
            const newDist = distances[node] + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
            }
        }
    }

    const maxDist = Math.max(...distances.slice(1));
    return maxDist < Infinity ? maxDist : -1;
}
```

**Complejidad:** O(V²) - aceptable para n ≤ 100

---

## 🎯 Comparación de Versiones

| Versión | API | Destructuring | Concisión | Complejidad |
|---------|-----|---------------|-----------|-------------|
| **Versión 1** | `enqueue(k, 0)` | `{element, priority}` | Media | O((V+E) log V) |
| **Versión 2** | `enqueue([k, 0])` | `[node, dist]` | Alta ✅ | O((V+E) log V) |
| **Versión 3** | Sin heap | N/A | Baja | O(V²) |

**Recomendación:** Versión 2 (comparador custom) es más elegante para entrevistas.

---

## ⚠️ Errores Comunes

### 1. **No marcar nodos como visitados**

```typescript
// ❌ INCORRECTO - procesa nodos múltiples veces
while(!minHeap.isEmpty()){
    const [node, dist] = minHeap.dequeue();
    // FALTA: verificar si ya visitado
    
    for(const [neighbor, weight] of adjList.get(node)!){
        // ...
    }
}

// ✅ CORRECTO
while(!minHeap.isEmpty()){
    const [node, dist] = minHeap.dequeue();
    
    if(visited.has(node)) continue;  // ← CRÍTICO
    visited.add(node);
    
    // ...
}
```

**¿Por qué?** Sin tracking, un nodo puede procesarse múltiples veces → complejidad peor.

---

### 2. **Usar distancia obsoleta del heap**

```typescript
// ❌ INCORRECTO - usar dist del heap
const [node, dist] = minHeap.dequeue();

for(const [neighbor, weight] of adjList.get(node)!){
    const newDist = dist + weight;  // ← Puede ser obsoleto
    // ...
}

// ✅ CORRECTO - usar distancia actualizada
const [node, dist] = minHeap.dequeue();

if(visited.has(node)) continue;  // ← Skip obsoletos
visited.add(node);

for(const [neighbor, weight] of adjList.get(node)!){
    const newDist = dist + weight;  // ← Ahora es correcto
    // ...
}
```

**Explicación:** El heap puede contener múltiples entradas para el mismo nodo con diferentes distancias. Solo la primera (menor) es válida.

---

### 3. **Olvidar verificar nodos inalcanzables**

```typescript
// ❌ INCORRECTO
const maxDist = Math.max(...distances.slice(1));
return maxDist;  // ← Retorna Infinity si hay nodos inalcanzables

// ✅ CORRECTO
const maxDist = Math.max(...distances.slice(1));
return maxDist < Infinity ? maxDist : -1;  // ← Retornar -1
```

---

### 4. **Usar Map pero acceder como objeto**

```typescript
// ❌ INCORRECTO
const adjList = new Map<number, number[][]>();
for(const [neighbor, weight] of adjList[node]){  // ← Error!

// ✅ CORRECTO
const adjList = new Map<number, number[][]>();
for(const [neighbor, weight] of adjList.get(node)!){  // ← .get()
```

---

### 5. **No inicializar todos los nodos en adjacency list**

```typescript
// ❌ INCORRECTO - solo crear nodos que tienen aristas salientes
const adjList = new Map<number, number[][]>();
for(const [src, dest, weight] of times){
    if(!adjList.has(src)) adjList.set(src, []);
    adjList.get(src)!.push([dest, weight]);
}
// Nodos sin aristas salientes no existen en el Map

// ✅ CORRECTO - inicializar TODOS los nodos
const adjList = new Map<number, number[][]>();
for(let i = 1; i <= n; i++){
    adjList.set(i, []);  // ← Crear todos
}
for(const [src, dest, weight] of times){
    adjList.get(src)!.push([dest, weight]);
}
```

---

## 🧪 Análisis Big O

**Variables:**
- V = número de nodos (vertices)
- E = número de aristas (edges)

### Con Min Heap (Priority Queue)

**Time Complexity: O((V + E) log V)**

```
Desglose:
- Inicialización: O(V) para crear adjacency list y distances
- Push/Pop del heap: O(log V) por operación
  - Cada nodo se procesa una vez: V × O(log V)
  - Cada arista se relaja una vez: E × O(log V)
- Total: O(V log V + E log V) = O((V + E) log V)
```

**Space Complexity: O(V + E)**

```
- Adjacency list: O(E) aristas + O(V) nodos
- Distances array: O(V)
- MinHeap: O(V) máximo
- Visited set: O(V)
Total: O(V + E)
```

---

### Sin Heap (Array Simple)

**Time Complexity: O(V²)**

```
- Encontrar mínimo: O(V) por cada iteración
- V iteraciones: O(V²)
- Relajar aristas: O(E) total
- Total: O(V² + E) = O(V²) si grafo denso
```

**Cuándo usar cada versión:**

| Caso | Versión | Razón |
|------|---------|-------|
| n ≤ 100 | Array simple | Más simple, complejidad aceptable |
| n > 100 | Min Heap | Mucho más rápido |
| Grafo denso (E ≈ V²) | Min Heap | O(V² log V) vs O(V²) |
| Grafo disperso (E ≈ V) | Min Heap | O(V log V) vs O(V²) |

---

## 🎯 Comparación: Dijkstra vs BFS vs Bellman-Ford

| Algoritmo | Complejidad | Pesos | Mejor Para | Limitación |
|-----------|-------------|-------|------------|------------|
| **BFS** | O(V + E) | Todos = 1 | Grafos no ponderados | Solo peso unitario |
| **Dijkstra** | O((V+E) log V) | **Positivos** ✅ | Shortest path con pesos | No pesos negativos |
| **Bellman-Ford** | O(V × E) | Positivos y negativos | Detectar ciclos negativos | Muy lento |

**Ejemplo de cuándo usar cada uno:**

```typescript
// BFS: Todos los pesos = 1
times = [[1,2,1], [2,3,1], [3,4,1]]
→ Usar BFS (más simple)

// Dijkstra: Pesos variados positivos
times = [[1,2,5], [2,3,2], [3,4,10]]
→ Usar Dijkstra ✅

// Bellman-Ford: Pesos negativos
times = [[1,2,5], [2,3,-3], [3,4,10]]
→ Usar Bellman-Ford (Dijkstra falla)
```

---

## 🚀 Cuándo Usar Dijkstra

### ✅ Usar Dijkstra Cuando:

1. **Single-source shortest path** (un origen a todos)
2. **Pesos positivos** (0 ≤ weight)
3. **Grafo dirigido o no dirigido**
4. **Necesitas eficiencia** O((V+E) log V)

### ❌ NO Usar Dijkstra Cuando:

1. **Pesos negativos** → Usar Bellman-Ford
2. **All-pairs shortest path** → Usar Floyd-Warshall
3. **Todos los pesos = 1** → Usar BFS (más simple)
4. **Grafo acíclico dirigido (DAG)** → Usar Topological Sort

---

## 💡 Casos de Uso Reales

**Dijkstra se usa en:**

- ✅ **GPS y navegación:** Google Maps, Waze
- ✅ **Redes de telecomunicaciones:** Routing de paquetes
- ✅ **Juegos:** Pathfinding en videojuegos
- ✅ **Redes sociales:** Sugerencias de amigos
- ✅ **Logística:** Optimización de rutas de entrega
- ✅ **Internet:** Protocolos de routing (OSPF)

---

## 🎓 Template de Dijkstra

```typescript
function dijkstra(graph: Graph, start: number): number[] {
    const distances = new Array(n + 1).fill(Infinity);
    distances[start] = 0;
    
    const minHeap = new MinPriorityQueue<[number, number]>(([,d]) => d);
    minHeap.enqueue([start, 0]);
    
    const visited = new Set<number>();
    
    while(!minHeap.isEmpty()){
        const [node, dist] = minHeap.dequeue();
        
        if(visited.has(node)) continue;
        visited.add(node);
        
        for(const [neighbor, weight] of graph[node]){
            const newDist = dist + weight;
            
            if(newDist < distances[neighbor]){
                distances[neighbor] = newDist;
                minHeap.enqueue([neighbor, newDist]);
            }
        }
    }
    
    return distances;
}
```

**Pasos del template:**
1. Inicializar distancias a ∞
2. Usar Min Heap ordenado por distancia
3. Trackear visitados
4. Mientras hay nodos: procesar el de menor distancia
5. Relajar aristas de vecinos

---

## 📊 Progreso Global

**Estado:** 🏆 **Dijkstra DOMINADO**

**Sección 4: Graphs**
- [x] **Dijkstra's Algorithm** (1/3) ✅
- [ ] Prim's & Kruskal's (MST)
- [ ] Topological Sort (Kahn's)

**Problemas Resueltos:** 26/45  
**Progreso:** 58% del Syllabus  
**Patrones Dominados:** 11/15

---

## 🔥 Tips de Implementación

1. **Siempre inicializar todos los nodos** en adjacency list
2. **Usar Set para visited**, no array
3. **Verificar visited inmediatamente** después de dequeue
4. **Comparador custom** hace el código más limpio
5. **No olvidar `.get()`** con Map
6. **Retornar -1** si hay nodos inalcanzables
7. **Para n ≤ 100**: array simple funciona bien
