# Topological Sort - Kahn's Algorithm (Dominio Completo)

## 🏷️ Tags

`#TopologicalSort` `#Kahn` `#DAG` `#Graph` `#BFS` `#Queue` `#Medium` `#TypeScript`

---

# Course Schedule (LeetCode #207)

## 🧠 Concepto Clave

**Topological Sort** es un ordenamiento lineal de los nodos de un grafo dirigido acíclico (DAG) donde para cada arista dirigida `u → v`, el nodo `u` aparece **ANTES** que `v` en el ordenamiento.

**Kahn's Algorithm** usa BFS con una cola para procesar nodos en orden topológico, detectando ciclos en el proceso.

---

## 🗺️ La Estrategia

### Español

**El Problema:**
```
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: true

Interpretación:
- prerequisites[i] = [a, b] significa:
  "Para tomar curso a, debes completar curso b PRIMERO"

- [1,0]: Para tomar curso 1, necesitas curso 0
- [2,0]: Para tomar curso 2, necesitas curso 0
- [3,1]: Para tomar curso 3, necesitas curso 1
- [3,2]: Para tomar curso 3, necesitas curso 2

Grafo de dependencias:
       0
      / \
     1   2
      \ /
       3

Orden válido: [0, 1, 2, 3] o [0, 2, 1, 3]
Ambos respetan: curso antes de sus dependientes
```

---

**¿Qué es Topological Sort?**

```
Definición:
  Ordenamiento de nodos donde cada nodo aparece
  ANTES de todos los nodos a los que apunta.

Aplicación:
  - Scheduling de tareas con dependencias
  - Build systems (compilación)
  - Instalación de paquetes
  - Resolución de dependencias

Requisito:
  El grafo DEBE ser DAG (Directed Acyclic Graph)
  Si hay ciclo → NO existe ordenamiento topológico
```

**Ejemplo Visual:**

```
Tareas para vestirse:

    Ropa Interior
         ↓
      Pantalón
         ↓
      Zapatos

Orden topológico: [Ropa Interior, Pantalón, Zapatos]

NO puedes hacer: [Zapatos, Pantalón, Ropa Interior] ❌
```

**Con Ciclo (Imposible):**

```
    A → B
    ↑   ↓
    └─ C

Ciclo: A → B → C → A

¿A antes de B? Sí (A → B)
¿B antes de C? Sí (B → C)
¿C antes de A? Sí (C → A)
¿A antes de A? ❌ IMPOSIBLE

No existe orden topológico válido.
```

---

**Concepto Clave: In-Degree**

```
In-degree (grado de entrada) = número de aristas que APUNTAN hacia un nodo

Ejemplo:
    A → B → C
        ↑
        D

indegree[A] = 0  (nada apunta a A)
indegree[B] = 2  (A y D apuntan a B)
indegree[C] = 1  (B apunta a C)
indegree[D] = 0  (nada apunta a D)
```

**Propiedad Fundamental:**

```
Nodos con indegree = 0 NO tienen prerequisitos
→ Pueden procesarse PRIMERO

Al procesar un nodo, "removemos" sus aristas salientes
→ Decrementamos indegree de sus vecinos
→ Si un vecino llega a indegree = 0, ahora puede procesarse
```

---

**Algoritmo de Kahn (Paso a Paso):**

```
1. Calcular indegree de todos los nodos
   indegree[node] = # de aristas apuntando a node

2. Agregar nodos con indegree = 0 a la cola
   (Estos no tienen prerequisitos)

3. Mientras la cola no esté vacía:
   a. Sacar nodo de la cola
   b. Procesar el nodo (agregar a resultado)
   c. Para cada vecino del nodo:
      - Decrementar su indegree (remover dependencia)
      - Si llega a 0, agregarlo a la cola

4. Verificar si se procesaron todos los nodos:
   - Si todos procesados → No hay ciclo ✓
   - Si algunos sin procesar → Hay ciclo ❌
```

**¿Por Qué Funciona?**

```
Si hay ciclo:
    A → B → C → A

Todos tienen indegree ≥ 1 siempre
Nunca hay un nodo "libre" (indegree = 0)
Algunos nodos quedan sin procesar
→ Detectamos el ciclo

Si NO hay ciclo:
Siempre hay al menos un nodo con indegree = 0
Procesamos todos eventualmente
→ Ordenamiento válido
```

---

**Visualización del Proceso:**

```
Grafo: 0 → 1 → 3
       0 → 2 → 3

Step 1: Calcular indegree
  indegree = [0, 1, 1, 2]
              0  1  2  3

Step 2: Queue inicial = [0] (solo 0 tiene indegree=0)

Step 3: Procesar 0
  Resultado = [0]
  Remover aristas 0→1, 0→2
  indegree = [0, 0, 0, 2]
  Queue = [1, 2]

Step 4: Procesar 1
  Resultado = [0, 1]
  Remover arista 1→3
  indegree = [0, 0, 0, 1]
  Queue = [2]

Step 5: Procesar 2
  Resultado = [0, 1, 2]
  Remover arista 2→3
  indegree = [0, 0, 0, 0]
  Queue = [3]

Step 6: Procesar 3
  Resultado = [0, 1, 2, 3]
  Queue = []

Resultado: [0, 1, 2, 3] ✓ Orden topológico válido
```

## 💻 Implementación

### Versión TypeScript (Completa)

```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // 1. Inicializar estructuras
    const indegree: number[] = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    
    // 2. Construir grafo
    // prerequisites[i] = [course, prerequisite]
    // "Para tomar 'course', necesitas 'prerequisite' primero"
    // Arista: prerequisite → course
    for (const [course, prerequisite] of prerequisites) {
        indegree[course]++;              // course depende de prerequisite
        adj[prerequisite].push(course);   // prerequisite → course
    }
    
    // 3. Cola con cursos sin prerequisitos
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    // 4. Procesar cursos en orden topológico
    let processed = 0;
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        processed++;
        
        // Remover este curso como prerequisito de otros
        for (const neighbor of adj[course]) {
            indegree[neighbor]--;
            
            // Si ya no tiene prerequisitos, puede tomarse
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // 5. Verificar si todos los cursos fueron procesados
    return processed === numCourses;
}
```

---

### Versión JavaScript (LeetCode)

```javascript
class Solution {
    /**
     * @param {number} numCourses
     * @param {number[][]} prerequisites
     * @return {boolean}
     */
    canFinish(numCourses, prerequisites) {
        const indegree = Array(numCourses).fill(0);
        const adj = Array.from({ length: numCourses }, () => []);
        
        // Construir grafo: prerequisite → course
        for (const [course, prerequisite] of prerequisites) {
            indegree[course]++;
            adj[prerequisite].push(course);
        }
        
        // Cola con cursos sin prerequisitos
        const queue = [];
        for (let i = 0; i < numCourses; i++) {
            if (indegree[i] === 0) {
                queue.push(i);
            }
        }
        
        let processed = 0;
        
        while (queue.length > 0) {
            const course = queue.shift();
            processed++;
            
            for (const neighbor of adj[course]) {
                indegree[neighbor]--;
                if (indegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }
        
        return processed === numCourses;
    }
}
```

---

### Variante: Retornar el Orden Topológico

```typescript
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const indegree: number[] = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    
    for (const [course, prerequisite] of prerequisites) {
        indegree[course]++;
        adj[prerequisite].push(course);
    }
    
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result: number[] = [];
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        result.push(course);  // Agregar al resultado
        
        for (const neighbor of adj[course]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Si hay ciclo, retornar array vacío
    return result.length === numCourses ? result : [];
}
```

---

## 📊 Trace Completo

### Ejemplo 1: Sin Ciclo (Posible)

```typescript
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]

Grafo:
       0
      / \
     1   2
      \ /
       3

─────────────────────────────────────

Step 1: Construir grafo

for ([course=1, prerequisite=0]):
    indegree[1]++  → indegree = [0, 1, 0, 0]
    adj[0].push(1) → adj = [[1], [], [], []]

for ([course=2, prerequisite=0]):
    indegree[2]++  → indegree = [0, 1, 1, 0]
    adj[0].push(2) → adj = [[1,2], [], [], []]

for ([course=3, prerequisite=1]):
    indegree[3]++  → indegree = [0, 1, 1, 1]
    adj[1].push(3) → adj = [[1,2], [3], [], []]

for ([course=3, prerequisite=2]):
    indegree[3]++  → indegree = [0, 1, 1, 2]
    adj[2].push(3) → adj = [[1,2], [3], [3], []]

Estado final:
    indegree = [0, 1, 1, 2]
    adj = [[1,2], [3], [3], []]

─────────────────────────────────────

Step 2: Inicializar cola

for i=0: indegree[0]=0 → queue.push(0)
for i=1: indegree[1]=1 → skip
for i=2: indegree[2]=1 → skip
for i=3: indegree[3]=2 → skip

queue = [0]
processed = 0

─────────────────────────────────────

Step 3: Procesar curso 0

course = queue.shift() → course = 0
processed = 1

for neighbor=1 in adj[0]=[1,2]:
    indegree[1]-- → indegree[1] = 0
    indegree[1]==0? YES → queue.push(1)

for neighbor=2 in adj[0]=[1,2]:
    indegree[2]-- → indegree[2] = 0
    indegree[2]==0? YES → queue.push(2)

queue = [1, 2]
indegree = [0, 0, 0, 2]

─────────────────────────────────────

Step 4: Procesar curso 1

course = queue.shift() → course = 1
processed = 2

for neighbor=3 in adj[1]=[3]:
    indegree[3]-- → indegree[3] = 1
    indegree[3]==0? NO

queue = [2]
indegree = [0, 0, 0, 1]

─────────────────────────────────────

Step 5: Procesar curso 2

course = queue.shift() → course = 2
processed = 3

for neighbor=3 in adj[2]=[3]:
    indegree[3]-- → indegree[3] = 0
    indegree[3]==0? YES → queue.push(3)

queue = [3]
indegree = [0, 0, 0, 0]

─────────────────────────────────────

Step 6: Procesar curso 3

course = queue.shift() → course = 3
processed = 4

for neighbor in adj[3]=[]:
    (vacío)

queue = []

─────────────────────────────────────

Resultado:
processed = 4 === numCourses = 4 ✓

return true

Orden topológico: [0, 1, 2, 3]
```

---

### Ejemplo 2: Con Ciclo (Imposible)

```typescript
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]

Grafo (CICLO):
    0 ⇄ 1

─────────────────────────────────────

Step 1: Construir grafo

for ([course=1, prerequisite=0]):
    indegree[1]++  → indegree = [0, 1]
    adj[0].push(1) → adj = [[1], []]

for ([course=0, prerequisite=1]):
    indegree[0]++  → indegree = [1, 1]
    adj[1].push(0) → adj = [[1], [0]]

Estado final:
    indegree = [1, 1]  ← Ambos tienen prerequisitos
    adj = [[1], [0]]

─────────────────────────────────────

Step 2: Inicializar cola

for i=0: indegree[0]=1 → skip
for i=1: indegree[1]=1 → skip

queue = []  ← ¡VACÍA! No hay cursos sin prerequisitos
processed = 0

─────────────────────────────────────

Step 3: While loop

queue.length = 0
No se ejecuta el loop

─────────────────────────────────────

Resultado:
processed = 0 !== numCourses = 2 ❌

return false

Hay ciclo → Imposible completar todos los cursos
```

---

### Ejemplo 3: Múltiples Caminos

```typescript
Input: numCourses = 6, prerequisites = [[3,0],[4,1],[5,2],[3,1],[4,2],[5,3],[5,4]]

Grafo:
    0   1   2
     \ / \ / 
      3   4
       \ /
        5

Construcción:
    indegree = [0, 0, 0, 2, 2, 3]
    adj = [[3], [3,4], [4,5], [5], [5], []]

Proceso:
    Queue inicial: [0, 1, 2]
    
    Procesar 0:
      indegree[3]-- → indegree[3] = 1
      Queue: [1, 2]
    
    Procesar 1:
      indegree[3]-- → indegree[3] = 0 → queue.push(3)
      indegree[4]-- → indegree[4] = 1
      Queue: [2, 3]
    
    Procesar 2:
      indegree[4]-- → indegree[4] = 0 → queue.push(4)
      indegree[5]-- → indegree[5] = 2
      Queue: [3, 4]
    
    Procesar 3:
      indegree[5]-- → indegree[5] = 1
      Queue: [4]
    
    Procesar 4:
      indegree[5]-- → indegree[5] = 0 → queue.push(5)
      Queue: [5]
    
    Procesar 5:
      Queue: []

Resultado:
    processed = 6 === numCourses ✓
    Orden: [0, 1, 2, 3, 4, 5] o [1, 0, 2, 3, 4, 5], etc.
```

---

## ⚠️ Errores Comunes

### 1. **Invertir la dirección de las aristas**

```typescript
// ❌ INCORRECTO - aristas invertidas
for (const [a, b] of prerequisites) {
    indegree[b]++;      // b no depende de a
    adj[a].push(b);     // a → b (invertido)
}

// ✅ CORRECTO - prerequisite → course
for (const [course, prerequisite] of prerequisites) {
    indegree[course]++;              // course depende de prerequisite
    adj[prerequisite].push(course);   // prerequisite → course
}
```

**Recordatorio:** `[course, prerequisite]` significa "para tomar course, necesitas prerequisite".

---

### 2. **No verificar todos los nodos procesados**

```typescript
// ❌ INCORRECTO - solo verifica si cola vacía
while (queue.length > 0) {
    // ...
}
return true;  // Siempre retorna true

// ✅ CORRECTO - cuenta nodos procesados
let processed = 0;
while (queue.length > 0) {
    processed++;
    // ...
}
return processed === numCourses;
```

---

### 3. **Usar array.shift() en lugar de cola eficiente**

```typescript
// ⚠️ FUNCIONA pero ineficiente O(n) por shift
const course = queue.shift();

// ✅ MEJOR para producción - usar índice
let front = 0;
while (front < queue.length) {
    const course = queue[front++];
    // ...
}

// O usar estructura Queue real
```

---

### 4. **Olvidar manejar múltiples cursos sin prerequisitos**

```typescript
// ❌ INCORRECTO - solo agrega el primero
for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) {
        queue.push(i);
        break;  // ← ERROR: solo agrega uno
    }
}

// ✅ CORRECTO - agregar TODOS
for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) {
        queue.push(i);  // Agregar todos los que no tienen prerequisitos
    }
}
```

---

### 5. **No decrementar indegree antes de verificar**

```typescript
// ❌ INCORRECTO - verifica antes de decrementar
for (const neighbor of adj[course]) {
    if (indegree[neighbor] === 0) {
        queue.push(neighbor);
    }
    indegree[neighbor]--;
}

// ✅ CORRECTO - decrementar primero
for (const neighbor of adj[course]) {
    indegree[neighbor]--;
    if (indegree[neighbor] === 0) {
        queue.push(neighbor);
    }
}
```

---

## 🧪 Análisis Big O

**Variables:**
- V = número de nodos (cursos)
- E = número de aristas (prerequisitos)

**Time Complexity: O(V + E)**

```
Desglose:
1. Construir grafo: O(E)
   - Procesar cada prerequisito una vez

2. Inicializar cola: O(V)
   - Revisar indegree de cada nodo

3. Procesar nodos: O(V + E)
   - Cada nodo se procesa una vez: O(V)
   - Cada arista se visita una vez: O(E)

Total: O(E) + O(V) + O(V + E) = O(V + E)
```

**Space Complexity: O(V + E)**

```
- indegree array: O(V)
- adjacency list: O(V + E)
  - V listas
  - E aristas totales
- queue: O(V) en peor caso
- result array: O(V) si guardamos orden

Total: O(V + E)
```

**Comparación Práctica:**

| V | E | Operaciones (V+E) | Tiempo Aprox |
|---|---|-------------------|--------------|
| 10 | 20 | 30 | < 1ms |
| 100 | 500 | 600 | ~1ms |
| 1,000 | 5,000 | 6,000 | ~10ms |
| 10,000 | 50,000 | 60,000 | ~100ms |

**Muy eficiente:** Lineal en el tamaño del grafo.

---

## 🎯 Comparación: DFS vs BFS (Kahn)

| Aspecto | DFS (Recursivo) | BFS (Kahn) |
|---------|-----------------|------------|
| **Estructura** | Stack (recursión) | Queue (explícita) |
| **Complejidad** | O(V + E) | O(V + E) |
| **Detecta ciclos** | Con colores/estados | Con contador |
| **Orden** | Post-order reverso | Directo |
| **Implementación** | Más compleja | Más simple ✅ |
| **Iterativo** | Necesita stack explícito | Natural con cola |

**Kahn es preferido porque:**
- ✅ Más intuitivo
- ✅ Más fácil de implementar
- ✅ Detección de ciclos natural
- ✅ Iterativo (no stack overflow)

---

## 🎓 Template de Kahn's Algorithm

```typescript
function topologicalSort(n: number, edges: number[][]): number[] {
    // 1. Construir grafo
    const indegree = new Array(n).fill(0);
    const adj = Array.from({ length: n }, () => []);
    
    for (const [to, from] of edges) {
        indegree[to]++;
        adj[from].push(to);
    }
    
    // 2. Cola con nodos sin dependencias
    const queue: number[] = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    // 3. Procesar en orden topológico
    const result: number[] = [];
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node);
        
        for (const neighbor of adj[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // 4. Verificar si hay ciclo
    return result.length === n ? result : [];
}
```

---

## 💡 Casos de Uso Reales

**Topological Sort se usa en:**

- ✅ **Build systems:** Make, Maven, Gradle (orden de compilación)
- ✅ **Package managers:** npm, pip (resolución de dependencias)
- ✅ **Task scheduling:** Planificación con prerequisitos
- ✅ **Course planning:** Planificación de curriculum universitario
- ✅ **Excel formulas:** Orden de cálculo de celdas
- ✅ **Symbol resolution:** Compiladores (orden de resolución)
- ✅ **Lazy evaluation:** Orden de evaluación de expresiones

---

## 📊 Progreso Global

**Estado:** 🏆 **TOPOLOGICAL SORT (KAHN'S) DOMINADO**

**Sección 4: Graphs** (COMPLETA ✅)
- [x] Dijkstra's Algorithm (1/3) ✅
- [x] Prim's & Kruskal's (MST) (2/3) ✅
- [x] **Topological Sort (Kahn's)** (3/3) ✅

**Problemas Resueltos:** 28/45  
**Progreso:** 62% del Syllabus  
**Patrones Dominados:** 13/15

**¡Sección 4: Graphs COMPLETA!** 🎉

---

## 🔥 Tips de Implementación

1. **Naming claro:** `[course, prerequisite]` mejor que `[a, b]`
2. **Aristas correctas:** `prerequisite → course`
3. **Decrementar primero:** Antes de verificar `indegree === 0`
4. **Contar procesados:** No solo verificar cola vacía
5. **Todos los iniciales:** Agregar TODOS con `indegree=0`
6. **Cola eficiente:** Considerar índice en lugar de `shift()`
7. **DAG requirement:** Solo funciona sin ciclos

---

## 🎯 Cuándo Usar Topological Sort

### ✅ Usar Cuando:

1. **Grafo dirigido acíclico (DAG)**
2. **Dependencias entre tareas**
3. **Necesitas orden de procesamiento**
4. **Detectar ciclos en dependencias**

### ❌ NO Usar Cuando:

1. **Grafo no dirigido** → Usar otros algoritmos
2. **Se permite ciclos** → No hay orden topológico
3. **Solo necesitas conectividad** → Usar DFS/BFS
4. **Shortest path** → Usar Dijkstra

---

## 🚀 Próxima Sección

**¡Has completado la Sección 4: Graphs!** 🎉

**Siguiente:** Sección 5: Dynamic Programming
- 0/1 Knapsack
- Unbounded Knapsack
- LCS (Longest Common Subsequence)
- Palindromes

**Target:** Febrero 2025 🎯
