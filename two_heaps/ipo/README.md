# IPO (LeetCode #502)

## 🏷️ Tags

`#TwoHeaps` `#Greedy` `#PriorityQueue` `#Heap` `#Hard` `#TypeScript`

## 🧠 Concepto Clave

Este problema combina **Two Heaps con estrategia Greedy**. A diferencia de otros problemas de Two Heaps donde ambos heaps mantienen un balance de tamaños (como en Find Median), aquí cada heap tiene un **propósito distinto**:

1. **Min Heap (ordenado por capital):** Mantiene TODOS los proyectos ordenados por capital mínimo requerido
2. **Max Heap (ordenado por profit):** Mantiene solo los proyectos DISPONIBLES (que podemos hacer con nuestro capital actual) ordenados por profit máximo

La estrategia greedy es: **En cada iteración, siempre elegimos el proyecto con mayor profit de entre los que podemos hacer.**

El truco clave es que el capital aumenta con cada proyecto completado, lo que desbloquea nuevos proyectos en iteraciones futuras.

## 🗺️ La Estrategia

### Configuración Inicial
```
1. Crear minCapitalHeap con TODOS los proyectos
   - Ordenados por capital mínimo requerido
   - Estructura: {capital, profit}

2. Crear maxProfitHeap vacío
   - Ordenado por profit (mayor primero)
   - Estructura: solo el profit

3. currentCapital = W (capital inicial)
```

### Algoritmo Principal (k iteraciones)

Para cada uno de los k proyectos permitidos:

**Paso 1: Desbloquear proyectos disponibles**
```
Mientras el minCapitalHeap no esté vacío 
  Y el proyecto con menor capital <= currentCapital:
    - Sacar ese proyecto del minCapitalHeap
    - Agregarlo al maxProfitHeap (solo su profit)
```

**Paso 2: Ejecutar el mejor proyecto disponible**
```
Si maxProfitHeap no está vacío:
    - Sacar el proyecto con mayor profit
    - currentCapital += profit
Sino:
    - No hay proyectos disponibles, terminar early
```

### Diagrama de Flujo

```
Proyectos iniciales:
  P0: capital=0, profit=1
  P1: capital=1, profit=2
  P2: capital=1, profit=3

┌─────────────────────────────────────────────────────┐
│ ESTADO INICIAL (W=0, k=2)                          │
├─────────────────────────────────────────────────────┤
│ minCapitalHeap (por capital):                      │
│   [(0,1), (1,2), (1,3)]                           │
│        ↑                                           │
│   menor capital                                    │
│                                                     │
│ maxProfitHeap (por profit):                        │
│   []                                               │
│                                                     │
│ currentCapital = 0                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ITERACIÓN 1                                         │
├─────────────────────────────────────────────────────┤
│ Paso 1: Desbloquear proyectos                      │
│   ¿(0,1) disponible? (0 <= 0) → SÍ                │
│   → Mover a maxProfitHeap                          │
│   ¿(1,2) disponible? (1 <= 0) → NO                │
│   → STOP                                           │
│                                                     │
│ Paso 2: Ejecutar mejor proyecto                    │
│   maxProfitHeap.pop() = 1                          │
│   currentCapital = 0 + 1 = 1                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ITERACIÓN 2                                         │
├─────────────────────────────────────────────────────┤
│ Paso 1: Desbloquear proyectos                      │
│   ¿(1,2) disponible? (1 <= 1) → SÍ                │
│   → Mover a maxProfitHeap                          │
│   ¿(1,3) disponible? (1 <= 1) → SÍ                │
│   → Mover a maxProfitHeap                          │
│                                                     │
│ maxProfitHeap = [3, 2] (max heap)                  │
│                  ↑                                  │
│             mayor profit                            │
│                                                     │
│ Paso 2: Ejecutar mejor proyecto                    │
│   maxProfitHeap.pop() = 3                          │
│   currentCapital = 1 + 3 = 4 ✅                    │
└─────────────────────────────────────────────────────┘
```

## 💻 Implementación en TypeScript

```typescript
import { MaxPriorityQueue, MinPriorityQueue } from '@datastructures-js/priority-queue';

function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
    const maxProfit = new MaxPriorityQueue<number>();
    const minCapitalProfit = new MinPriorityQueue<{capital: number, profit: number}>({
        priority: (val) => val.capital  // Ordenar por capital (menor primero)
    });

    // Poblar minCapitalProfit con todos los proyectos
    for (let i = 0; i < profits.length; i++) {
        minCapitalProfit.enqueue({
            capital: capital[i], 
            profit: profits[i]
        });
    }

    let currentCapital = w;

    // Ejecutar hasta k proyectos
    for (let i = 0; i < k; i++) {
        // Paso 1: Mover todos los proyectos disponibles al maxProfitHeap
        while (!minCapitalProfit.isEmpty() &&
               minCapitalProfit.front().capital <= currentCapital) {
            maxProfit.enqueue(minCapitalProfit.dequeue().profit);
        }

        // Paso 2: Si no hay proyectos disponibles, terminar
        if (maxProfit.isEmpty()) break;

        // Paso 3: Ejecutar el proyecto con mayor profit
        currentCapital += maxProfit.dequeue();
    }

    return currentCapital;
}
```

### Puntos Clave de la Implementación

1. **Constructor del MinPriorityQueue:**
   ```typescript
   new MinPriorityQueue<{capital: number, profit: number}>({
       priority: (val) => val.capital  // ← Función unaria que extrae prioridad
   });
   ```
   **Alternativa válida:**
   ```typescript
   {
       compare: (a, b) => a.capital - b.capital  // ← Función binaria de comparación
   }
   ```

2. **No necesitamos balancear heaps:**
   - A diferencia de Find Median, aquí no hay restricción de tamaño
   - minCapitalProfit se vacía gradualmente
   - maxProfitHeap crece/decrece según disponibilidad

3. **Early termination es crítico:**
   ```typescript
   if (maxProfit.isEmpty()) break;
   ```
   - Si no hay proyectos disponibles, no podemos continuar
   - Previene loops innecesarios cuando k > proyectos posibles

4. **Los proyectos se procesan una sola vez:**
   - Cada proyecto pasa de minCapitalProfit → maxProfitHeap → ejecutado
   - Nunca regresa al minCapitalProfit

## ⚠️ Errores Comunes

### 1. Usar `compare` incorrectamente en el constructor
```typescript
// ❌ INCORRECTO
new MinPriorityQueue<{capital: number, profit: number}>({
    compare: (val) => val.capital  // ← "compare" espera 2 argumentos
});

// ✅ CORRECTO (Opción A)
{
    priority: (val) => val.capital  // ← Función unaria
}

// ✅ CORRECTO (Opción B)
{
    compare: (a, b) => a.capital - b.capital  // ← Función binaria
}
```

**Por qué falla:** `compare` espera una función `(a, b) => number`, no `(val) => number`. Si usas la sintaxis incorrecta, el heap no se ordena correctamente.

### 2. No hacer early break cuando maxProfitHeap está vacío
```typescript
// ❌ INCORRECTO
for (let i = 0; i < k; i++) {
    // ... mover proyectos ...
    currentCapital += maxProfit.dequeue();  // ← Crash si está vacío
}

// ✅ CORRECTO
for (let i = 0; i < k; i++) {
    // ... mover proyectos ...
    if (maxProfit.isEmpty()) break;  // ← Verificar antes de dequeue
    currentCapital += maxProfit.dequeue();
}
```

**Por qué es crítico:** Si k=10 pero solo puedes hacer 3 proyectos, sin el break intentarás hacer `dequeue()` en un heap vacío.

### 3. Poblar maxProfitHeap desde el inicio
```typescript
// ❌ INCORRECTO: Agregar todos los proyectos disponibles al inicio
for (let i = 0; i < profits.length; i++) {
    if (capital[i] <= w) {
        maxProfit.enqueue(profits[i]);
    }
}

// ✅ CORRECTO: Moverlos dinámicamente en cada iteración
// Porque currentCapital cambia después de cada proyecto
```

**Por qué falla:** El capital inicial puede no dar acceso a ciertos proyectos, pero después de completar el primer proyecto, podrías desbloquear más. La estrategia estática pierde estas oportunidades.

### 4. Ordenar el array en lugar de usar heap
```typescript
// ⚠️ SUBÓPTIMO
const sorted = projects.sort((a, b) => a.capital - b.capital);
// Luego buscar linealmente los disponibles

// ✅ ÓPTIMO
// Usar MinHeap que mantiene el orden automáticamente
```

**Por qué es subóptimo:** Ordenar es O(n log n) una sola vez, pero luego necesitas búsqueda lineal O(n) en cada iteración para encontrar proyectos disponibles. Con heap, la operación es O(log n).

### 5. No inicializar minCapitalProfit con todos los proyectos
```typescript
// ❌ INCORRECTO: Solo agregar proyectos disponibles
for (let i = 0; i < profits.length; i++) {
    if (capital[i] <= currentCapital) {
        minCapitalProfit.enqueue(...);
    }
}

// ✅ CORRECTO: Agregar TODOS los proyectos
for (let i = 0; i < profits.length; i++) {
    minCapitalProfit.enqueue({capital: capital[i], profit: profits[i]});
}
```

**Por qué es crítico:** Necesitas todos los proyectos en minCapitalProfit porque algunos que inicialmente no son accesibles pueden serlo después de ejecutar otros proyectos.

## 🧪 Análisis Big O

### Complejidad Temporal: **O((n + k) log n)**

**Desglose:**
1. **Inicialización del minCapitalProfit:**
   - n inserciones en MinHeap
   - Cada inserción: O(log n)
   - Total: O(n log n)

2. **Loop principal (k iteraciones):**
   - **While interno (mover a maxProfit):**
     - Cada proyecto se mueve MÁXIMO 1 vez
     - Total acumulado en todas las iteraciones: O(n log n)
   - **Dequeue de maxProfit:**
     - k operaciones de O(log n)
     - Total: O(k log n)

3. **Total:**
   - O(n log n) + O(n log n) + O(k log n)
   - = O((n + k) log n)

**Caso típico:** Si k ≈ n, entonces O(n log n)

### Complejidad Espacial: **O(n)**

**Desglose:**
- `minCapitalProfit`: O(n) - almacena todos los proyectos inicialmente
- `maxProfit`: O(n) en el peor caso (si todos los proyectos son accesibles desde el inicio)
- Variables auxiliares: O(1)
- **Total:** O(n)

### Optimizaciones Aplicadas

1. **Heap en lugar de ordenamiento:**
   - Ordenar + búsqueda lineal: O(n log n + k·n) = O(k·n)
   - Heaps: O((n + k) log n)
   - **Mejora significativa** cuando k << n

2. **Early termination:**
   - Sin break: k iteraciones completas incluso si no hay proyectos
   - Con break: termina en cuanto maxProfit está vacío
   - **Ahorro:** hasta (k - proyectos_ejecutados) iteraciones

3. **Procesamiento único de cada proyecto:**
   - Cada proyecto pasa por los heaps exactamente 1 vez
   - No hay reprocesamiento ni verificaciones redundantes

### Comparación con Alternativas

| Enfoque | Time Complexity | Space | Observaciones |
|---------|----------------|-------|---------------|
| **Two Heaps (nuestra solución)** | O((n+k) log n) | O(n) | Óptimo para k variable |
| Ordenar + Greedy | O(n log n + k·n) | O(n) | Subóptimo cuando k es grande |
| DP | O(n·W·k) | O(W·k) | Impracticable con W grande |
| Brute Force | O(n^k) | O(k) | Solo viable para n,k muy pequeños |

---

## 📚 Recursos Adicionales

- **Patrón relacionado:** Find Median from Data Stream (LC #295)
- **Concepto clave:** Greedy algorithms con estructuras de datos eficientes
- **Librería usada:** [@datastructures-js/priority-queue](https://github.com/datastructures-js/priority-queue)
