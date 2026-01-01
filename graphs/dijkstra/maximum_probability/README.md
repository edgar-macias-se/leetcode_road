# Path with Maximum Probability

### Enunciado

Dado un grafo no dirigido con `n` nodos y aristas con probabilidades de éxito, encontrar el camino de `start` a `end` con la **máxima probabilidad** de éxito.

**Ejemplo:**
```
Input: n = 3, edges = [[0,1],[1,2],[0,2]], 
       succProb = [0.5, 0.5, 0.2], start = 0, end = 2
Output: 0.25

Grafo:
    0 --0.5-- 1
     \        |
     0.2     0.5
       \      |
        ---- 2

Camino 1: 0 → 2 (prob = 0.2)
Camino 2: 0 → 1 → 2 (prob = 0.5 × 0.5 = 0.25) ✓

Máximo: 0.25
```

---

### Conceptos Clave

**1. Probabilidades se Multiplican**

```
Probabilidad de camino = producto de probabilidades de aristas

Camino: A → B → C
Prob(A→B) = 0.8
Prob(B→C) = 0.5

Prob total: 0.8 × 0.5 = 0.4
```

**2. Multiplicar Disminuye**

```
0.8 × 0.5 = 0.4 < 0.8

Por eso necesitamos MAXIMIZAR (Max Heap)
No MINIMIZAR como en Dijkstra clásico
```

**3. Valores Iniciales**

```
prob[start] = 1.0  (100% estamos en start)
prob[otros] = 0.0  (0% estamos en otros)

Buscamos maximizar prob[end]
```

---

### Implementación

```typescript
function maxProbability(
    n: number, 
    edges: number[][], 
    succProb: number[], 
    start_node: number, 
    end_node: number
): number {
    // 1. Construir grafo bidireccional con probabilidades
    const graph = new Map<number, [number, number][]>();
    
    for(let i = 0; i < edges.length; i++){
        const [u, v] = edges[i];
        const p = succProb[i];
        
        if(!graph.has(u)) graph.set(u, []);
        if(!graph.has(v)) graph.set(v, []);
        
        graph.get(u)!.push([v, p]);  // [vecino, probabilidad]
        graph.get(v)!.push([u, p]);  // Bidireccional
    }
    
    // 2. Inicializar probabilidades
    const prob = new Array<number>(n).fill(0.0);
    prob[start_node] = 1.0;
    
    // 3. Max Heap ordenado por probabilidad (MAYOR primero)
    const maxHeap = new MaxPriorityQueue<{currProb: number, node: number}>(
        (item) => item.currProb
    );
    maxHeap.enqueue({currProb: 1.0, node: start_node});
    
    const visited = new Set<number>();
    
    // 4. Dijkstra modificado (MAXIMIZAR)
    while(!maxHeap.isEmpty()){
        const {currProb, node} = maxHeap.dequeue().element;
        
        // Early exit si encontramos destino
        if(node === end_node){
            return currProb;
        }
        
        // Skip si ya visitado
        if(visited.has(node)){
            continue;
        }
        visited.add(node);
        
        // Explorar vecinos
        if(!graph.has(node)) continue;
        
        for(const [neighbor, edgeProb] of graph.get(node)!){
            const newProb = currProb * edgeProb;  // Multiplicar probabilidades
            
            // Si encontramos MAYOR probabilidad
            if(newProb > prob[neighbor]){
                prob[neighbor] = newProb;
                maxHeap.enqueue({currProb: newProb, node: neighbor});
            }
        }
    }
    
    // 5. No hay camino
    return 0.0;
}
```

---

### Trace Completo

```typescript
n = 3, edges = [[0,1],[1,2],[0,2]], 
succProb = [0.5, 0.5, 0.2], start = 0, end = 2

Grafo:
graph = {
  0: [[1, 0.5], [2, 0.2]],
  1: [[0, 0.5], [2, 0.5]],
  2: [[1, 0.5], [0, 0.2]]
}

─────────────────────────────────────

Initial:
  prob = [1.0, 0, 0]
  maxHeap = [{1.0, 0}]
  visited = {}

─────────────────────────────────────

Step 1: Procesar node=0, currProb=1.0

node === end? 0 === 2? NO
visited.has(0)? NO
visited.add(0) → visited = {0}

Vecinos: [[1, 0.5], [2, 0.2]]

Vecino [1, 0.5]:
  newProb = 1.0 × 0.5 = 0.5
  0.5 > prob[1]=0? YES ✓
  prob[1] = 0.5
  maxHeap.enqueue({0.5, 1})

Vecino [2, 0.2]:
  newProb = 1.0 × 0.2 = 0.2
  0.2 > prob[2]=0? YES ✓
  prob[2] = 0.2
  maxHeap.enqueue({0.2, 2})

Estado:
  prob = [1.0, 0.5, 0.2]
  maxHeap = [{0.5, 1}, {0.2, 2}]  ← Max heap: 0.5 primero

─────────────────────────────────────

Step 2: Procesar node=1, currProb=0.5

node === end? 1 === 2? NO
visited.has(1)? NO
visited.add(1) → visited = {0, 1}

Vecinos: [[0, 0.5], [2, 0.5]]

Vecino [0, 0.5]:
  newProb = 0.5 × 0.5 = 0.25
  0.25 > prob[0]=1.0? NO → skip

Vecino [2, 0.5]:
  newProb = 0.5 × 0.5 = 0.25
  0.25 > prob[2]=0.2? YES ✓ (mejor camino!)
  prob[2] = 0.25
  maxHeap.enqueue({0.25, 2})

Estado:
  prob = [1.0, 0.5, 0.25]
  maxHeap = [{0.25, 2}, {0.2, 2}]

─────────────────────────────────────

Step 3: Procesar node=2, currProb=0.25

node === end? 2 === 2? YES ✓
return 0.25

─────────────────────────────────────

Resultado: 0.25 ✓
```
