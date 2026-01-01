# Redundant Connection II (LeetCode #685)

## 🏷️ Tags

`#UnionFind` `#DisjointSet` `#Graph` `#DirectedGraph` `#Hard` `#TypeScript`

## 🧠 Concepto Clave

Este problema combina **Union-Find con análisis de grafos dirigidos**. A diferencia de Redundant Connection I (grafo no dirigido), aquí debemos considerar que cada nodo puede tener **exactamente un padre** (excepto la raíz). La complejidad surge de que existen **3 casos distintos** cuando agregamos una arista redundante:

1. **Nodo con 2 padres, SIN ciclo:** La última arista hacia ese nodo es el problema
2. **Ciclo, SIN nodo con 2 padres:** Union-Find estándar detecta la arista redundante
3. **Nodo con 2 padres Y ciclo:** La primera arista hacia el nodo con 2 padres causa el ciclo

La clave es **detectar primero si existe un nodo con 2 padres**, y luego usar Union-Find estratégicamente para identificar cuál de las dos aristas candidatas eliminar.

## 🗺️ La Estrategia

### Paso 1: Detección de Nodo con 2 Padres
```
Recorremos todas las aristas una vez:
- Mantenemos un arreglo parent[] que registra el padre de cada nodo
- Si encontramos un nodo V con parent[V] ya asignado:
  → candidate1 = [parent[V], V]  (primera arista hacia V)
  → candidate2 = [U, V]           (segunda arista hacia V, la actual)
```

### Paso 2: Construcción del Grafo con Union-Find
```
Casos:
A) Si NO hay nodo con 2 padres:
   - Usamos Union-Find normal
   - La primera arista que cierra un ciclo es la respuesta

B) Si SÍ hay nodo con 2 padres:
   - Construimos el grafo IGNORANDO candidate2
   - Si detectamos ciclo → candidate1 causa el problema
   - Si NO hay ciclo → candidate2 es redundante
```

### Paso 3: Retorno Basado en el Caso
```
- Caso 1: Sin ciclo → return candidate2
- Caso 2: Ciclo sin 2 padres → return última arista del ciclo
- Caso 3: Ciclo con 2 padres → return candidate1
```

### Diagrama ASCII de los 3 Casos

**Caso 1: Nodo con 2 padres, SIN ciclo**
```
    2 → 1 ← 3
        ↓
        4

Aristas: [[2,1], [3,1], [1,4]]
Nodo 1 tiene 2 padres (2 y 3)
Solución: [3,1] (última arista hacia 1)
```

**Caso 2: Ciclo, SIN nodo con 2 padres**
```
    1 → 2 → 3
    ↑_______↓

Aristas: [[1,2], [2,3], [3,1]]
Hay ciclo pero cada nodo tiene 1 padre
Solución: [3,1] (cierra el ciclo)
```

**Caso 3: Nodo con 2 padres Y ciclo**
```
    2 → 1 ← 3
    ↑   ↓
    4 ← 1

Aristas: [[2,1], [3,1], [4,2], [1,4]]
Nodo 1 tiene 2 padres Y hay ciclo (2→1→4→2)
Solución: [2,1] (primera arista, parte del ciclo)
```

## 💻 Implementación en TypeScript

```typescript
function findRedundantDirectedConnection(edges: number[][]): number[] {
    const n = edges.length;
    const parent = new Array(n + 1).fill(-1);
    
    let candidate1: number[] | null = null;
    let candidate2: number[] | null = null;
    
    // Step 1: Detectar nodo con 2 padres
    for (const [u, v] of edges) {
        if (parent[v] !== -1) {
            // Nodo v ya tiene un padre
            candidate1 = [parent[v], v]; // Primera arista hacia v
            candidate2 = [u, v];          // Segunda arista hacia v (actual)
            break;
        }
        parent[v] = u;
    }
    
    // Step 2: Union-Find para detectar ciclos
    const par = new Array(n + 1).fill(0).map((_, i) => i);
    
    function find(x: number): number {
        if (par[x] !== x) {
            par[x] = find(par[x]); // Path compression
        }
        return par[x];
    }
    
    function union(x: number, y: number): boolean {
        const px = find(x);
        const py = find(y);
        
        if (px === py) {
            return false; // Ya están conectados → ciclo
        }
        
        par[px] = py;
        return true;
    }
    
    // Step 3: Intentar construir el grafo
    for (const [u, v] of edges) {
        // Si hay candidate2, ignoramos esa arista en este intento
        if (candidate2 && u === candidate2[0] && v === candidate2[1]) {
            continue;
        }
        
        if (!union(u, v)) {
            // Ciclo detectado
            if (candidate1) {
                // Caso 3: Nodo con 2 padres Y ciclo
                // El ciclo está en candidate1, no en candidate2
                return candidate1;
            } else {
                // Caso 2: Solo ciclo (sin nodo con 2 padres)
                return [u, v];
            }
        }
    }
    
    // Caso 1: Nodo con 2 padres, SIN ciclo
    // La última arista (candidate2) es el problema
    return candidate2!;
}
```

### Puntos Clave de la Implementación

1. **Dos pasadas sobre las aristas:**
   - Primera pasada: Detectar nodo con 2 padres
   - Segunda pasada: Union-Find para detectar ciclos

2. **Path Compression en find():**
   - `par[x] = find(par[x])` comprime el camino
   - Optimiza llamadas futuras a O(α(n)) ≈ O(1)

3. **Estrategia de ignorar candidate2:**
   - Al construir el grafo, ignoramos la segunda arista hacia el nodo con 2 padres
   - Esto nos permite identificar si el ciclo involucra a candidate1

4. **Retorno condicional:**
   - Si hay ciclo CON candidate1 → return candidate1
   - Si NO hay ciclo → return candidate2
   - Si hay ciclo SIN candidates → return arista actual

## ⚠️ Errores Comunes

### 1. Tratar como Grafo No Dirigido
```typescript
// ❌ INCORRECTO: Usar Union-Find estándar
for (const [u, v] of edges) {
    if (!union(u, v)) {
        return [u, v]; // Esto funciona en RC I, no en RC II
    }
}
```
**Por qué falla:** En grafos dirigidos, la dirección importa. Un nodo puede tener múltiples hijos pero solo un padre.

### 2. No Detectar el Nodo con 2 Padres
```typescript
// ❌ INCORRECTO: Asumir que solo hay ciclos
// Olvidar verificar parent[v] !== -1
```
**Por qué falla:** El Caso 1 (2 padres sin ciclo) nunca se detecta correctamente.

### 3. Ignorar la Arista Incorrecta
```typescript
// ❌ INCORRECTO: Ignorar candidate1 en lugar de candidate2
if (candidate1 && u === candidate1[0] && v === candidate1[1]) {
    continue; // WRONG!
}
```
**Por qué falla:** Debemos probar el grafo SIN la última arista (candidate2) para ver si el ciclo persiste.

### 4. No Usar Path Compression
```typescript
// ⚠️ SUBÓPTIMO: Implementación naive de find()
function find(x: number): number {
    while (par[x] !== x) {
        x = par[x];
    }
    return x;
}
```
**Por qué es subóptimo:** Sin path compression, find() puede degradarse a O(n) en el peor caso.

### 5. Confundir el Orden de Retorno
```typescript
// ❌ INCORRECTO: Retornar la primera arista encontrada
if (candidate2) return candidate2; // Sin verificar ciclos
if (candidate1) return candidate1;
```
**Por qué falla:** No distingue entre los 3 casos. El orden de verificación es crítico.

## 🧪 Análisis Big O

### Complejidad Temporal: **O(n · α(n))**
Donde α(n) es la función inversa de Ackermann (prácticamente constante).

**Desglose:**
- **Primera pasada** (detectar 2 padres): O(n)
- **Segunda pasada** (Union-Find):
  - n operaciones de union/find
  - Cada find() es O(α(n)) con path compression
  - Total: O(n · α(n))
- **Total:** O(n) + O(n · α(n)) = **O(n · α(n))** ≈ O(n)

### Complejidad Espacial: **O(n)**

**Desglose:**
- `parent[]`: O(n) - registra el padre de cada nodo
- `par[]`: O(n) - estructura de Union-Find
- `candidate1, candidate2`: O(1) - solo 2 aristas
- **Total:** O(n) + O(n) = **O(n)**

### Optimizaciones Aplicadas

1. **Path Compression en find():**
   ```typescript
   par[x] = find(par[x]); // Comprime el camino
   ```
   Reduce llamadas futuras de O(n) a O(α(n))

2. **Early termination:**
   - Si detectamos 2 padres, no seguimos buscando más
   - Si detectamos ciclo, retornamos inmediatamente

3. **Single pass cuando es posible:**
   - En Caso 2 (solo ciclo), una sola pasada de Union-Find es suficiente

### Comparación con Redundant Connection I

| Aspecto | RC I (No Dirigido) | RC II (Dirigido) |
|---------|-------------------|------------------|
| Complejidad Temporal | O(n · α(n)) | O(n · α(n)) |
| Complejidad Espacial | O(n) | O(n) |
| Número de Casos | 1 (solo ciclo) | 3 (2 padres, ciclo, ambos) |
| Pasadas requeridas | 1 | 2 |
| Dificultad | Medium | Hard |

---

## 📚 Recursos Adicionales

- **Union-Find Visualization:** [VisuAlgo - Union-Find](https://visualgo.net/en/ufds)
- **LeetCode Discuss:** [Redundant Connection II Solutions](https://leetcode.com/problems/redundant-connection-ii/discuss/)
- **Concepto relacionado:** Redundant Connection I (LC #684) - versión no dirigida
