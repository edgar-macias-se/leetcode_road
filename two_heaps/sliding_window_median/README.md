# Sliding Window Median (LeetCode #480)

## 🏷️ Tags

`#TwoHeaps` `#SlidingWindow` `#Heap` `#PriorityQueue` `#Hard` `#TypeScript`

## 🧠 Concepto Clave

Este problema combina **Two Heaps con Sliding Window y Lazy Deletion**. A diferencia de Find Median from Data Stream donde solo agregamos elementos, aquí también debemos **remover** elementos cuando salen de la ventana.

La estrategia de Two Heaps divide los números en dos mitades:
- **Max Heap (mitad inferior):** Contiene los valores más pequeños con el mayor al tope
- **Min Heap (mitad superior):** Contiene los valores más grandes con el menor al tope

La mediana siempre está disponible en O(1) mirando los tops de ambos heaps. El truco crítico es usar **lazy deletion**: cuando un elemento sale de la ventana, lo marcamos en un Map pero no lo removemos inmediatamente del heap (que sería O(k)). Solo lo limpiamos cuando aparece en el top.

## 🗺️ La Estrategia

### Configuración Inicial
```
1. maxHeap = MaxPriorityQueue (mitad inferior de valores)
2. minHeap = MinPriorityQueue (mitad superior de valores)
3. toRemove = Map<number, count> (tracking de elementos a eliminar)
4. maxHeapSize = 0 (tamaño lógico, sin contar elementos marcados)
5. minHeapSize = 0 (tamaño lógico, sin contar elementos marcados)
```

### Balance de Heaps
```
Regla de balance:
- Si k es impar: maxHeap tiene 1 elemento más que minHeap
- Si k es par: ambos heaps tienen el mismo tamaño

Ejemplo con k=5:
  maxHeap = [3, 2, 1]  (size = 3)
  minHeap = [4, 5]     (size = 2)
  Mediana = maxHeap.top() = 3

Ejemplo con k=4:
  maxHeap = [2, 1]     (size = 2)
  minHeap = [3, 4]     (size = 2)
  Mediana = (2 + 3) / 2 = 2.5
```

### Algoritmo Principal

**Fase 1: Construir ventana inicial (primeros k elementos)**
```
Para i = 0 hasta k-1:
    addNum(nums[i])
result.push(getMedian())
```

**Fase 2: Sliding Window (resto del array)**
```
Para i = k hasta n-1:
    Paso 1: Marcar elemento saliente (lazy deletion)
        outgoingNum = nums[i - k]
        toRemove.set(outgoingNum, count + 1)
        
        // Decrementar tamaño lógico del heap correspondiente
        if (outgoingNum <= maxHeap.top()):
            maxHeapSize--
        else:
            minHeapSize--
    
    Paso 2: Agregar nuevo elemento
        addNum(nums[i])
    
    Paso 3: Calcular mediana
        result.push(getMedian())
```

### Funciones Auxiliares

**cleanTop(heap, isMaxHeap):**
```
Limpia el top del heap si está marcado para eliminar

Mientras heap no esté vacío:
    top = heap.front()
    if toRemove contiene top con count > 0:
        heap.dequeue()
        toRemove.set(top, count - 1)
        if count == 0: toRemove.delete(top)
    else:
        break  // Top es válido
```

**addNum(num):**
```
1. Decidir a qué heap agregar:
   if maxHeap vacío O num <= maxHeap.top():
       maxHeap.enqueue(num)
       maxHeapSize++
   else:
       minHeap.enqueue(num)
       minHeapSize++

2. Balancear heaps
```

**balance():**
```
1. Limpiar tops inválidos
2. Rebalancear basado en tamaños lógicos:
   if maxHeapSize > minHeapSize + 1:
       mover top de maxHeap a minHeap
   else if minHeapSize > maxHeapSize:
       mover top de minHeap a maxHeap
```

**getMedian():**
```
1. Limpiar tops
2. if k es impar:
       return maxHeap.top()
   else:
       return (maxHeap.top() + minHeap.top()) / 2
```

### Diagrama de Flujo (nums = [1, 3, -1, -3, 5], k = 3)

```
┌─────────────────────────────────────────────────────┐
│ FASE 1: Construir ventana inicial                  │
├─────────────────────────────────────────────────────┤
│ i=0: addNum(1)                                      │
│   maxHeap = [1], maxHeapSize = 1                   │
│                                                     │
│ i=1: addNum(3)                                      │
│   3 > 1 → minHeap.enqueue(3)                       │
│   minHeap = [3], minHeapSize = 1                   │
│   balance() → OK (1 == 1)                          │
│                                                     │
│ i=2: addNum(-1)                                     │
│   -1 <= 1 → maxHeap.enqueue(-1)                    │
│   maxHeap = [1, -1], maxHeapSize = 2               │
│   balance():                                        │
│     maxHeapSize (2) > minHeapSize (1) + 1? NO      │
│   Estado final:                                     │
│     maxHeap = [1, -1] (top = 1)                    │
│     minHeap = [3]                                   │
│   getMedian() → k=3 (impar) → maxHeap.top() = 1 ✅ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FASE 2: Sliding Window                             │
├─────────────────────────────────────────────────────┤
│ i=3: Remove 1, Add -3                              │
│   Paso 1: Marcar para eliminar                     │
│     toRemove = {1: 1}                              │
│     1 <= maxHeap.top() (1)? SÍ                     │
│     → maxHeapSize-- (2 → 1)                        │
│                                                     │
│   Paso 2: addNum(-3)                               │
│     -3 <= maxHeap.top() (1)? SÍ                    │
│     → maxHeap.enqueue(-3)                          │
│     → maxHeapSize++ (1 → 2)                        │
│     balance():                                      │
│       cleanTop(maxHeap):                           │
│         top = 1, está en toRemove                  │
│         → dequeue 1, maxHeap = [-1, -3]            │
│       maxHeapSize (2) > minHeapSize (1) + 1? NO    │
│                                                     │
│   Paso 3: getMedian()                              │
│     k=3 (impar) → maxHeap.top() = -1 ✅            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ i=4: Remove 3, Add 5                               │
│   Paso 1: Marcar para eliminar                     │
│     toRemove = {3: 1}                              │
│     3 <= maxHeap.top() (-1)? NO                    │
│     → minHeapSize-- (1 → 0)                        │
│                                                     │
│   Paso 2: addNum(5)                                │
│     5 > -1 → minHeap.enqueue(5)                    │
│     minHeapSize++ (0 → 1)                          │
│     balance():                                      │
│       cleanTop(minHeap):                           │
│         top = 3, está en toRemove                  │
│         → dequeue 3, minHeap = [5]                 │
│                                                     │
│   Paso 3: getMedian()                              │
│     k=3 (impar) → maxHeap.top() = -1 ✅            │
└─────────────────────────────────────────────────────┘
```

## 💻 Implementación en TypeScript

```typescript
function medianSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    const maxHeap = new MaxPriorityQueue<number>();
    const minHeap = new MinPriorityQueue<number>();
    const toRemove = new Map<number, number>();
    
    let maxHeapSize = 0;
    let minHeapSize = 0;
    
    function cleanTop(heap: MaxPriorityQueue<number> | MinPriorityQueue<number>, isMaxHeap: boolean): void {
        while (heap.size() > 0) {
            const top = heap.front();
            if (toRemove.has(top) && toRemove.get(top)! > 0) {
                heap.dequeue();
                toRemove.set(top, toRemove.get(top)! - 1);
                if (toRemove.get(top) === 0) {
                    toRemove.delete(top);
                }
            } else {
                break;
            }
        }
    }
    
    function addNum(num: number): void {
        if (maxHeap.isEmpty() || num <= maxHeap.front()) {
            maxHeap.enqueue(num);
            maxHeapSize++;
        } else {
            minHeap.enqueue(num);
            minHeapSize++;
        }
        balance();
    }
    
    function balance(): void {
        cleanTop(maxHeap, true);
        cleanTop(minHeap, false);
        
        if (maxHeapSize > minHeapSize + 1) {
            const val = maxHeap.dequeue();
            minHeap.enqueue(val);
            maxHeapSize--;
            minHeapSize++;
        } else if (minHeapSize > maxHeapSize) {
            const val = minHeap.dequeue();
            maxHeap.enqueue(val);
            minHeapSize--;
            maxHeapSize++;
        }
    }
    
    function getMedian(): number {
        cleanTop(maxHeap, true);
        cleanTop(minHeap, false);
        
        if (k % 2 === 1) {
            return maxHeap.front();
        } else {
            return (maxHeap.front() + minHeap.front()) / 2.0;
        }
    }
    
    // Fase 1: Construir primera ventana
    for (let i = 0; i < k; i++) {
        addNum(nums[i]);
    }
    result.push(getMedian());
    
    // Fase 2: Sliding window
    for (let i = k; i < nums.length; i++) {
        const outgoingNum = nums[i - k];
        toRemove.set(outgoingNum, (toRemove.get(outgoingNum) || 0) + 1);
        
        if (!maxHeap.isEmpty() && outgoingNum <= maxHeap.front()) {
            maxHeapSize--;
        } else {
            minHeapSize--;
        }
        
        addNum(nums[i]);
        result.push(getMedian());
    }
    
    return result;
}
```

### Puntos Clave de la Implementación

1. **Lazy Deletion con Map:**
   ```typescript
   toRemove.set(outgoingNum, count + 1);  // Marcar
   // NO removemos del heap inmediatamente (sería O(k))
   ```

2. **Tracking de tamaños lógicos:**
   ```typescript
   let maxHeapSize = 0;  // Tamaño real (sin contar marcados)
   let minHeapSize = 0;
   
   // Estos tamaños se usan para balance, NO heap.size()
   ```

3. **Decrementar al marcar:**
   ```typescript
   if (outgoingNum <= maxHeap.front()) {
       maxHeapSize--;  // Decrementa tamaño lógico
   }
   // Solo 1 vez, cuando marcamos
   ```

4. **cleanTop NO decrementa tamaños:**
   ```typescript
   function cleanTop(heap, isMaxHeap): void {
       // Solo remueve del heap físico
       // NO decrementa maxHeapSize/minHeapSize
   }
   ```

## ⚠️ Errores Comunes

### 1. No usar lazy deletion (remover inmediatamente del heap)
```typescript
// ❌ INCORRECTO: Búsqueda O(k) en heap
function removeFromHeap(heap, val) {
    // Buscar val en el array del heap: O(k)
    // Remover y heapify: O(k) + O(log k)
}

// ✅ CORRECTO: Lazy deletion O(1)
toRemove.set(val, count + 1);  // Solo marcar
```

**Por qué es crítico:** Remover directamente de un heap requiere búsqueda lineal O(k), haciendo el algoritmo O(n·k) en lugar de O(n log k).

### 2. No trackear tamaños lógicos
```typescript
// ❌ INCORRECTO: Usar heap.size() físico
if (maxHeap.size() > minHeap.size() + 1) {
    // Incluye elementos marcados para eliminar
}

// ✅ CORRECTO: Usar tamaño lógico
if (maxHeapSize > minHeapSize + 1) {
    // Solo cuenta elementos válidos
}
```

**Por qué falla:** El heap físico puede contener elementos marcados. Si no usas tamaños lógicos, el balance será incorrecto.

### 3. Decrementar tamaño en cleanTop
```typescript
// ❌ INCORRECTO: Decrementar cuando limpiamos
function cleanTop(heap, isMaxHeap) {
    if (toRemove.has(top)) {
        heap.dequeue();
        if (isMaxHeap) maxHeapSize--;  // ← DOBLE decremento
    }
}

// ✅ CORRECTO: Solo decrementar al marcar
// cleanTop NO decrementa tamaños
```

**Por qué falla:** Decrementarías dos veces: una al marcar y otra al limpiar.

### 4. No limpiar tops antes de balance
```typescript
// ❌ INCORRECTO
function balance() {
    if (maxHeapSize > minHeapSize + 1) {
        // El top del maxHeap podría estar marcado
        minHeap.enqueue(maxHeap.dequeue());
    }
}

// ✅ CORRECTO
function balance() {
    cleanTop(maxHeap, true);  // ← Limpiar primero
    cleanTop(minHeap, false);
    // Ahora los tops son válidos
}
```

### 5. Usar Monotonic Deque en lugar de Two Heaps
```typescript
// ❌ INCORRECTO: Deque solo da el máximo/mínimo
// No puede dar la mediana (elemento del medio)

// ✅ CORRECTO: Two Heaps divide en mitades
// Acceso O(1) al elemento del medio
```

## 🧪 Análisis Big O

### Complejidad Temporal: **O(n log k)**

**Desglose:**
1. **Construir primera ventana:**
   - k inserciones en heaps: O(k log k)

2. **Sliding window (n - k iteraciones):**
   - **Marcar elemento saliente:** O(1)
   - **addNum:**
     - Inserción en heap: O(log k)
     - balance() con cleanTop: O(log k) amortizado
   - **getMedian:** O(1) después de cleanTop
   - Total por iteración: O(log k)
   - Total: O((n - k) log k)

3. **Total:**
   - O(k log k) + O((n - k) log k)
   - = O(n log k)

### Complejidad Espacial: **O(k)**

**Desglose:**
- `maxHeap`: O(k) en el peor caso
- `minHeap`: O(k) en el peor caso
- `toRemove`: O(k) (máximo k elementos únicos marcados)
- **Total:** O(k)

### Comparación con Alternativas

| Enfoque | Time | Space | Observaciones |
|---------|------|-------|---------------|
| **Two Heaps + Lazy Deletion** | O(n log k) | O(k) | Óptimo |
| Two Heaps + Remoción directa | O(n·k) | O(k) | Búsqueda lineal en heap |
| Ordenar cada ventana | O(n·k log k) | O(k) | Re-ordenar cada vez |
| Multiset (C++) | O(n log k) | O(k) | Similar pero no disponible en TS |

---

## 📚 Recursos Adicionales

- **Patrón relacionado:** Find Median from Data Stream (LC #295)
- **Diferencia con Sliding Window Maximum:** Monotonic Deque NO funciona para mediana
- **Concepto clave:** Lazy deletion para evitar operaciones O(k) en heaps
