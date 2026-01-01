### Cheapest Flights Within K Stops

Dado un grafo dirigido de `n` ciudades con vuelos `[from, to, price]`, encontrar el vuelo más barato de `src` a `dst` con **a lo más `k` paradas**.

**Ejemplo:**
```
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 
       src = 0, dst = 3, k = 1
Output: 700

Grafo:
    0 --100--> 1 --600--> 3
    ^          |
   100        100
    |          v
    2 --200--> 3

Caminos:
- 0 → 1 → 3 (costo 700, 1 stop) ✓
- 0 → 1 → 2 → 3 (costo 400, 2 stops) ✗ Excede k=1

Resultado: 700
```

---

### Conceptos Clave

**1. Estado Tridimensional**

```
Estado normal Dijkstra: (costo, nodo)
Estado aquí: (costo, nodo, stops)

Mismo nodo puede visitarse con diferentes #stops:
- Nodo 2 con 1 stop
- Nodo 2 con 3 stops
Ambos son estados DIFERENTES
```

**2. No Marcar Visitados Globalmente**

```
❌ INCORRECTO:
visited = Set<number>  // Solo nodo

✅ CORRECTO:
dist[nodo][stops] = mejor_costo
// Trackear por (nodo, stops)
```

**3. k Stops vs k+1 Flights**

```
k = 1 (máximo 1 parada)
significa hasta 2 vuelos:
  Vuelo 1: src → intermedio (0 stops hasta ahora)
  Vuelo 2: intermedio → dst (1 stop)

Por eso: stops <= k+1 en el código
```

---

### Implementación

```typescript
function findCheapestPrice(
    n: number, 
    flights: number[][], 
    src: number, 
    dst: number, 
    k: number
): number {
    // 1. Construir grafo dirigido
    const graph = new Map<number, [number, number][]>();
    
    for(const [from, to, price] of flights){
        if(!graph.has(from)) graph.set(from, []);
        graph.get(from)!.push([to, price]);  // [destino, precio]
    }
    
    // 2. Min Heap ordenado por COSTO
    const minHeap = new MinPriorityQueue<{cost: number, node: number, stops: number}>(
        (item) => item.cost  // Ordenar por costo acumulado
    );
    minHeap.enqueue({cost: 0, node: src, stops: 0});
    
    // 3. Trackear mejor costo por (nodo, #stops)
    const dist: number[][] = Array(n).fill(0).map(() => Array(k + 2).fill(Infinity));
    dist[src][0] = 0;
    
    // 4. Dijkstra modificado con límite de stops
    while(!minHeap.isEmpty()){
        const {cost, node, stops} = minHeap.dequeue().element;
        
        // Early exit si encontramos destino
        if(node === dst){
            return cost;  // Retornar costo del heap
        }
        
        // Si excedemos stops, skip
        if(stops > k) continue;
        
        // Explorar vecinos
        if(!graph.has(node)) continue;
        
        for(const [neighbor, price] of graph.get(node)!){
            const newCost = cost + price;  // Sumar costos
            const newStops = stops + 1;
            
            // Solo procesar si no excede límite Y es mejor
            if(newStops <= k + 1 && newCost < dist[neighbor][newStops]){
                dist[neighbor][newStops] = newCost;
                minHeap.enqueue({cost: newCost, node: neighbor, stops: newStops});
            }
        }
    }
    
    // 5. No encontramos camino
    return -1;
}
```

---

### Trace Completo

```typescript
n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], 
src = 0, dst = 2, k = 1

Grafo:
graph = {
  0: [[1, 100], [2, 500]],
  1: [[2, 100]]
}

─────────────────────────────────────

Initial:
  minHeap = [{cost: 0, node: 0, stops: 0}]
  dist[nodo][stops] = Infinity para todos
  dist[0][0] = 0

─────────────────────────────────────

Step 1: Procesar {cost=0, node=0, stops=0}

node === dst? 0 === 2? NO
stops=0 <= k=1? YES ✓

Vecinos: [[1, 100], [2, 500]]

Vecino [1, 100]:
  newCost = 0 + 100 = 100
  newStops = 0 + 1 = 1
  1 <= k+1=2? YES ✓
  100 < dist[1][1]=Inf? YES ✓
  dist[1][1] = 100
  minHeap.enqueue({100, 1, 1})

Vecino [2, 500]:
  newCost = 0 + 500 = 500
  newStops = 1
  1 <= k+1=2? YES ✓
  500 < dist[2][1]=Inf? YES ✓
  dist[2][1] = 500
  minHeap.enqueue({500, 2, 1})

Estado:
  minHeap = [{100, 1, 1}, {500, 2, 1}]
  dist[1][1] = 100
  dist[2][1] = 500

─────────────────────────────────────

Step 2: Procesar {cost=100, node=1, stops=1}

node === dst? 1 === 2? NO
stops=1 <= k=1? YES ✓

Vecinos: [[2, 100]]

Vecino [2, 100]:
  newCost = 100 + 100 = 200
  newStops = 1 + 1 = 2
  2 <= k+1=2? YES ✓
  200 < dist[2][2]=Inf? YES ✓
  dist[2][2] = 200
  minHeap.enqueue({200, 2, 2})

Estado:
  minHeap = [{200, 2, 2}, {500, 2, 1}]
  dist[2][2] = 200

─────────────────────────────────────

Step 3: Procesar {cost=200, node=2, stops=2}

node === dst? 2 === 2? YES ✓
return 200

─────────────────────────────────────

Resultado: 200 ✓

Nota: Camino 0 → 1 → 2 con 1 stop (costo 200)
      es mejor que 0 → 2 directo (costo 500)
```

---

## ⚠️ Errores Comunes

### Problema 1: Maximum Probability

**1. No guardar probabilidad con vecino**

```typescript
// ❌ INCORRECTO - Pierdes la asociación
graph.set(u, [...graph.get(u) || [], v]);  // Solo vecino

// ✅ CORRECTO - Guardar [vecino, probabilidad]
graph.get(u)!.push([v, succProb[i]]);
```

---

**2. Usar Min Heap en lugar de Max Heap**

```typescript
// ❌ INCORRECTO
const minHeap = new MinPriorityQueue<{prob: number, node: number}>();

// ✅ CORRECTO - MAX heap para maximizar
const maxHeap = new MaxPriorityQueue<{currProb: number, node: number}>(
    (item) => item.currProb
);
```

---

**3. Array de tamaño incorrecto**

```typescript
// ❌ INCORRECTO
const prob = new Array(edges.length).fill(0);  // # aristas

// ✅ CORRECTO
const prob = new Array(n).fill(0);  // # nodos
```

---

**4. Comparación incorrecta**

```typescript
// ❌ INCORRECTO
if(newProb > succProb[neighbor])  // succProb es el input

// ✅ CORRECTO
if(newProb > prob[neighbor])  // prob es el array de probabilidades
```

---

### Problema 2: Cheapest Flights

**1. Heap sin el costo**

```typescript
// ❌ INCORRECTO - Falta el costo
minHeap.enqueue({node: src, stops: 0});

// ✅ CORRECTO - Incluir costo
minHeap.enqueue({cost: 0, node: src, stops: 0});
```

---

**2. Ordenar por stops en lugar de costo**

```typescript
// ❌ INCORRECTO
new MinPriorityQueue<...>({compare: (a,b) => a.stops - b.stops});

// ✅ CORRECTO - Ordenar por COSTO
new MinPriorityQueue<...>((item) => item.cost);
```

---

**3. Retornar valor incorrecto**

```typescript
// ❌ INCORRECTO
if(node === dst) return prices[node];  // Array puede estar desactualizado

// ✅ CORRECTO - Retornar costo del heap
if(node === dst) return cost;  // cost viene del heap
```

---

**4. Calcular nuevo costo incorrectamente**

```typescript
// ❌ INCORRECTO
const newCost = prices[node] + price;  // prices puede estar mal

// ✅ CORRECTO
const newCost = cost + price;  // cost del heap
```

---

**5. No trackear (nodo, stops)**

```typescript
// ❌ INCORRECTO - Solo por nodo
const prices = new Array(n).fill(Infinity);

// ✅ CORRECTO - Por (nodo, stops)
const dist: number[][] = Array(n).fill(0).map(() => Array(k + 2).fill(Infinity));
```

---

## 🧪 Análisis Big O

### Maximum Probability

**Time Complexity: O(E log V)**

```
- Construcción grafo: O(E)
- Heap operations: O(E log V)
  - Cada arista se relaja máximo una vez
  - Cada inserción: O(log V)

Total: O(E log V)
```

**Space Complexity: O(V + E)**

```
- Graph: O(E) aristas + O(V) nodos
- prob array: O(V)
- maxHeap: O(V)
- visited: O(V)

Total: O(V + E)
```

---

### Cheapest Flights

**Time Complexity: O(E × k × log(V × k))**

```
- Cada (nodo, stops) es un estado diferente
- Máximo V × k estados
- Heap operations: O(log(V × k))
- Cada arista puede procesarse k veces

Total: O(E × k × log(V × k))
```

**Space Complexity: O(V × k)**

```
- Graph: O(E)
- dist[V][k+2]: O(V × k)
- minHeap: O(V × k) en peor caso

Total: O(V × k + E)
```

---

## 🎯 Comparación: Tres Variantes de Dijkstra

| Aspecto | Clásico | Max Probability | Cheapest Flights |
|---------|---------|-----------------|------------------|
| **Tipo** | Minimización | **Maximización** | Minimización con restricción |
| **Heap** | Min | **Max** | Min |
| **Estado** | `(dist, node)` | `(prob, node)` | **(cost, node, stops)** |
| **Operación** | Suma | **Producto** | Suma |
| **Inicial** | 0 / ∞ | **1.0 / 0** | 0 |
| **Visitados** | Set simple | Set simple | **Por (node, stops)** |
| **Complejidad** | O(E log V) | O(E log V) | **O(E×k × log(V×k))** |

---

## 🎓 Template General

```typescript
// Template modificable para variantes de Dijkstra

function dijkstraVariant(graph, start, end, constraint?) {
    // 1. Inicializar heap (min o max según problema)
    const heap = new PriorityQueue<State>();
    heap.enqueue(initialState);
    
    // 2. Trackear visitados o distancias
    const dist = initializeDistances();
    
    // 3. Loop principal
    while(!heap.isEmpty()){
        const state = heap.dequeue();
        
        // Early exit
        if(state.node === end) return state.value;
        
        // Verificar restricciones
        if(violated(constraint)) continue;
        
        // Marcar visitado (si aplica)
        markVisited(state);
        
        // Explorar vecinos
        for(const neighbor of graph.get(state.node)){
            const newState = computeNewState(state, neighbor);
            
            if(isBetter(newState, dist[neighbor])){
                updateDist(neighbor, newState);
                heap.enqueue(newState);
            }
        }
    }
    
    return notFound;
}
```

---

## 💡 Casos de Uso Reales

**Maximum Probability:**
- ✅ Redes de comunicación (maximizar confiabilidad)
- ✅ Rutas de transporte (maximizar probabilidad de éxito)
- ✅ Routing con pérdida de paquetes

**Cheapest Flights:**
- ✅ Sistemas de reserva de vuelos
- ✅ Optimización de rutas con restricciones
- ✅ Planificación de transporte multimodal

---

## 📊 Progreso Global

**Estado:** 🏆 **DIJKSTRA VARIANTS DOMINADO**

**Sección 4: Graphs** (COMPLETA ✅)
- [x] Dijkstra's Algorithm (Network Delay) ✅
- [x] **Dijkstra Variant 1 (Max Probability)** ✅
- [x] **Dijkstra Variant 2 (Cheapest Flights)** ✅
- [x] Prim's & Kruskal's (MST) ✅
- [x] Topological Sort ✅

**Problemas Resueltos:** 30/45  
**Progreso:** 67% del Syllabus  
**Patrones Dominados:** 13/15

---

## 🔥 Tips de Implementación

### Maximum Probability:
1. **Max Heap**, no Min Heap
2. **Multiplicar** probabilidades, no sumar
3. Guardar `[vecino, probabilidad]` juntos
4. Inicial: `prob[start] = 1.0`, resto `0.0`
5. Comparar: `newProb > prob[neighbor]`

### Cheapest Flights:
1. Estado: `(cost, node, stops)` - **tridimensional**
2. **Ordenar por costo**, no por stops
3. **NO marcar visitados** globalmente
4. Trackear: `dist[node][stops]`
5. Retornar `cost` del heap, no de array
6. k stops = k+1 flights máximo

### General:
- Identificar qué se maximiza/minimiza
- Determinar estado necesario (2D o 3D)
- Heap correcto (Min o Max)
- Verificar operación (suma, producto, etc)
- Early exit cuando encuentres destino
