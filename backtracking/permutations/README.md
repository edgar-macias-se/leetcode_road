
# Problema: Permutations (LeetCode #46)

## 🧠 Concepto Clave

**Permutations** genera todas las ordenaciones posibles de un conjunto de elementos. A diferencia de Subsets y Combinations donde el **orden NO importa**, en Permutations el **orden SÍ importa**: [1,2,3] es diferente de [2,1,3].

## 🗺️ La Estrategia

### Español

**El Problema:**
```
Input: nums = [1, 2, 3]
Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]

El ORDEN SÍ IMPORTA:
[1,2,3] ≠ [1,3,2] ≠ [2,1,3]

Total: 3! = 6 permutaciones
```

**¿Cuántas Permutaciones?**

Fórmula: **n!** (factorial)

```
n = 3: 3! = 3 × 2 × 1 = 6
n = 4: 4! = 4 × 3 × 2 × 1 = 24
n = 5: 5! = 5 × 4 × 3 × 2 × 1 = 120
```

**¿Por qué n!?**

```
Primera posición: n opciones
Segunda posición: n-1 opciones (ya usamos una)
Tercera posición: n-2 opciones
...
Última posición: 1 opción

Total: n × (n-1) × (n-2) × ... × 1 = n!
```

---

**Visualización del Árbol:**

```
nums = [1, 2, 3]

                        []
            /           |           \
          [1]          [2]          [3]
         /   \        /   \        /   \
      [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
        |     |      |     |      |     |
     [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
       ✓     ✓      ✓     ✓      ✓     ✓

Nivel 1: Elegir primer elemento (3 opciones)
Nivel 2: Elegir segundo (2 opciones - sin repetir)
Nivel 3: Elegir tercero (1 opción)

Total: 3 × 2 × 1 = 6 permutaciones
```

**Diferencia Clave con Otros Patrones:**

| Pattern | Orden Importa | Total | Tracking Necesario |
|---------|--------------|-------|-------------------|
| **Subsets** | No | 2^n | No |
| **Combinations** | No | C(n,k) | No |
| **Permutations** | **Sí** ✅ | **n!** | **Sí** ✅ |

```
Ejemplo:
Subsets/Combinations: [1,2] === [2,1] (mismo)
Permutations: [1,2] ≠ [2,1] (diferentes)
```

---

**Dos Approaches Principales:**

### 1. Con Array `used` (Tracking Explícito) - Recomendado ✅

```typescript
function permute(nums: number[]): number[][] {
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        // Caso base: permutación completa
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        // Loop COMPLETO (0 a n) - no startIndex
        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;  // Skip si ya usado

            // Hacer elección
            curr.push(nums[i]);
            used[i] = true;
            
            // Explorar
            helper();
            
            // Backtrack
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res; 
}
```

**Características:**
- ✅ Muy clara y fácil de entender
- ✅ Array `used` trackea elementos ya incluidos
- ✅ Loop va de 0 a n (no usa startIndex)
- ✅ Preferida en entrevistas

**Trace Detallado:**
```
nums = [1, 2, 3]
used = [F, F, F]
curr = []

helper():
  curr.length=0 !== 3
  
  Loop i=0 (nums[0]=1):
    used[0]=F ✓
    curr = [1]
    used = [T, F, F]
    
    helper():
      curr.length=1 !== 3
      
      Loop i=0: used[0]=T → skip
      
      Loop i=1 (nums[1]=2):
        used[1]=F ✓
        curr = [1, 2]
        used = [T, T, F]
        
        helper():
          curr.length=2 !== 3
          
          Loop i=0: used[0]=T → skip
          Loop i=1: used[1]=T → skip
          
          Loop i=2 (nums[2]=3):
            used[2]=F ✓
            curr = [1, 2, 3]
            used = [T, T, T]
            
            helper():
              curr.length=3 === 3 ✓
              res.push([1,2,3]) → [[1,2,3]]
              return
            
            curr.pop() → [1, 2]
            used[2] = F → [T, T, F]
          
          return
        
        curr.pop() → [1]
        used[1] = F → [T, F, F]
      
      Loop i=2 (nums[2]=3):
        used[2]=F ✓
        curr = [1, 3]
        used = [T, F, T]
        
        helper():
          curr.length=2 !== 3
          
          Loop i=1 (nums[1]=2):
            curr = [1, 3, 2]
            used = [T, T, T]
            
            helper():
              res.push([1,3,2]) → [[1,2,3], [1,3,2]]
              return
            
            curr.pop() → [1, 3]
            used[1] = F → [T, F, T]
          
          return
        
        curr.pop() → [1]
        used[2] = F → [T, F, F]
      
      return
    
    curr.pop() → []
    used[0] = F → [F, F, F]
  
  Loop i=1 (nums[1]=2):
    curr = [2]
    used = [F, T, F]
    
    helper():
      Loop i=0: curr = [2, 1]
        helper():
          Loop i=2: curr = [2, 1, 3]
            res.push([2,1,3]) → [[1,2,3], [1,3,2], [2,1,3]]
      
      Loop i=2: curr = [2, 3]
        helper():
          Loop i=0: curr = [2, 3, 1]
            res.push([2,3,1]) → [..., [2,3,1]]
    
    curr.pop() → []
    used[1] = F
  
  Loop i=2 (nums[2]=3):
    curr = [3]
    used = [F, F, T]
    
    helper():
      Loop i=0: curr = [3, 1]
        Loop i=1: curr = [3, 1, 2]
          res.push([3,1,2])
      
      Loop i=1: curr = [3, 2]
        Loop i=0: curr = [3, 2, 1]
          res.push([3,2,1])

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]] ✓
```

**Estado en Cada Paso:**
```
curr: []              used: [F, F, F]
curr: [1]             used: [T, F, F]
curr: [1, 2]          used: [T, T, F]
curr: [1, 2, 3]       used: [T, T, T] → ✓ Guardar
curr: [1, 2]          used: [T, T, F] ← Backtrack
curr: [1]             used: [T, F, F] ← Backtrack
curr: [1, 3]          used: [T, F, T]
curr: [1, 3, 2]       used: [T, T, T] → ✓ Guardar
...
```

---

### 2. Con Swap In-Place (Más Eficiente en Espacio)

```typescript
function permute(nums: number[]): number[][] {
    let res: number[][] = [];

    function helper(start: number){
        // Caso base: fijamos todos los elementos
        if(start === nums.length){
            res.push([...nums]);
            return;
        }

        // Probar cada elemento en posición 'start'
        for(let i = start; i < nums.length; i++){
            // Swap: poner nums[i] en posición start
            [nums[start], nums[i]] = [nums[i], nums[start]];
            
            // Explorar con este elemento fijo
            helper(start+1);
            
            // Backtrack: deshacer swap
            [nums[i], nums[start]] = [nums[start], nums[i]];
        }
    }

    helper(0);
    return res;
}
```

**Características:**
- ✅ Eficiente en espacio O(1) extra
- ✅ Swap usando destructuring ES6
- ✅ Fija elementos de izquierda a derecha
- ✅ Bonus points en entrevistas

**Trace Detallado:**
```
nums = [1, 2, 3]

helper(0):
  start=0 !== 3
  
  Loop i=0:
    swap(0,0): [1, 2, 3] → [1, 2, 3] (no cambia)
    
    helper(1):
      start=1 !== 3
      
      Loop i=1:
        swap(1,1): [1, 2, 3] → [1, 2, 3]
        
        helper(2):
          start=2 !== 3
          
          Loop i=2:
            swap(2,2): [1, 2, 3] → [1, 2, 3]
            
            helper(3):
              start=3 === 3 ✓
              res.push([1, 2, 3]) → [[1,2,3]]
              return
            
            swap(2,2): [1, 2, 3] → [1, 2, 3]
          
          return
        
        swap(1,1): [1, 2, 3] → [1, 2, 3]
      
      Loop i=2:
        swap(1,2): [1, 2, 3] → [1, 3, 2]
        
        helper(2):
          start=2 !== 3
          
          Loop i=2:
            swap(2,2): [1, 3, 2] → [1, 3, 2]
            
            helper(3):
              res.push([1, 3, 2]) → [[1,2,3], [1,3,2]]
              return
            
            swap(2,2): [1, 3, 2] → [1, 3, 2]
          
          return
        
        swap(1,2): [1, 3, 2] → [1, 2, 3]
      
      return
    
    swap(0,0): [1, 2, 3] → [1, 2, 3]
  
  Loop i=1:
    swap(0,1): [1, 2, 3] → [2, 1, 3]
    
    helper(1):
      start=1 !== 3
      
      Loop i=1:
        swap(1,1): [2, 1, 3] → [2, 1, 3]
        
        helper(2):
          Loop i=2:
            helper(3):
              res.push([2, 1, 3]) → [..., [2,1,3]]
      
      Loop i=2:
        swap(1,2): [2, 1, 3] → [2, 3, 1]
        
        helper(2):
          Loop i=2:
            helper(3):
              res.push([2, 3, 1]) → [..., [2,3,1]]
        
        swap(1,2): [2, 3, 1] → [2, 1, 3]
      
      return
    
    swap(0,1): [2, 1, 3] → [1, 2, 3]
  
  Loop i=2:
    swap(0,2): [1, 2, 3] → [3, 2, 1]
    
    helper(1):
      Loop i=1:
        swap(1,1): [3, 2, 1]
        helper(2):
          res.push([3, 2, 1]) → [..., [3,2,1]]
      
      Loop i=2:
        swap(1,2): [3, 2, 1] → [3, 1, 2]
        helper(2):
          res.push([3, 1, 2]) → [..., [3,1,2]]
    
    swap(0,2): [3, 2, 1] → [1, 2, 3]

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]]
```

**Visualización del Swap:**
```
Posición start: Elemento a fijar

start=0: Probar 1, 2, 3 en posición 0
  ↓
  swap(0,0): [1, 2, 3] - Fija 1 en pos 0
  swap(0,1): [2, 1, 3] - Fija 2 en pos 0
  swap(0,2): [3, 2, 1] - Fija 3 en pos 0

start=1: Probar elementos restantes en posición 1
  ↓
  [1, 2, 3]: Probar 2, 3 en pos 1
  [2, 1, 3]: Probar 1, 3 en pos 1
  [3, 2, 1]: Probar 2, 1 en pos 1

start=2: Solo queda 1 elemento → guardar
```

---

**Comparación de Approaches:**

| Aspecto | Con `used` Array | Con Swap In-Place |
|---------|------------------|-------------------|
| **Space Extra** | O(n) - array used | **O(1)** ✅ |
| **Time** | O(n × n!) | O(n × n!) |
| **Claridad** | ✅ Muy clara | ⚠️ Requiere entender swap |
| **Modificación** | No modifica nums | Modifica temporalmente |
| **Debuggear** | ✅ Más fácil | ⚠️ Más complejo |
| **Para entrevistas** | ✅ **Preferida** | ✅ Bonus points |
| **Orden output** | Lexicográfico | Diferente orden |

**Recomendación:** Usar versión con `used` en entrevistas (más clara), mencionar versión swap como optimización.

## 💻 Implementación

### Versión 1: Con Array `used` (Recomendada)

```typescript
function permute(nums: number[]): number[][] {
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;

            curr.push(nums[i]);
            used[i] = true;
            helper();
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res; 
}
```

### Versión 2: Con Swap In-Place (Eficiente)

```typescript
function permute(nums: number[]): number[][] {
    let res: number[][] = [];

    function helper(start: number){
        if(start === nums.length){
            res.push([...nums]);
            return;
        }

        for(let i = start; i < nums.length; i++){
            [nums[start], nums[i]] = [nums[i], nums[start]];
            helper(start+1);
            [nums[i], nums[start]] = [nums[start], nums[i]];
        }
    }

    helper(0);
    return res;
}
```

## ⚠️ Errores Comunes

### 1. **Usar startIndex en lugar de loop completo**

```typescript
// ❌ INCORRECTO - esto es para Combinations
for(let i = startIndex; i < nums.length; i++) {
    // Genera combinations, NO permutations
}

// ✅ CORRECTO - loop completo para Permutations
for(let i = 0; i < nums.length; i++) {
    if(used[i]) continue;  // Skip usados
    // ...
}
```

**¿Por qué?**
- Combinations: [1,2] === [2,1] → usar startIndex evita duplicados
- Permutations: [1,2] ≠ [2,1] → necesitamos loop completo

---

### 2. **Olvidar marcar used[i] = false en backtrack**

```typescript
// ❌ INCORRECTO
curr.push(nums[i]);
used[i] = true;
helper();
curr.pop();
// FALTA: used[i] = false;

// ✅ CORRECTO
curr.push(nums[i]);
used[i] = true;
helper();
curr.pop();
used[i] = false;  // ← CRÍTICO
```

---

### 3. **No hacer swap back**

```typescript
// ❌ INCORRECTO
[nums[start], nums[i]] = [nums[i], nums[start]];
helper(start + 1);
// FALTA: swap back

// ✅ CORRECTO
[nums[start], nums[i]] = [nums[i], nums[start]];
helper(start + 1);
[nums[i], nums[start]] = [nums[start], nums[i]];  // ← Deshacer
```

---

### 4. **No copiar el array al agregar**

```typescript
// ❌ INCORRECTO (versión swap)
res.push(nums);  // Referencia - todos apuntan al mismo array

// ✅ CORRECTO
res.push([...nums]);  // Copia
```

---

### 5. **Confundir con Combinations**

```typescript
// Combinations (orden NO importa):
if(curr.length === k) {  // Tamaño específico k
    for(let i = start; i < n; i++) {  // startIndex
        // ...
    }
}

// Permutations (orden SÍ importa):
if(curr.length === n) {  // Tamaño completo n
    for(let i = 0; i < n; i++) {  // Loop completo
        if(used[i]) continue;  // Tracking necesario
        // ...
    }
}
```

## 🧪 Análisis Big O

**Variables:**
- `n` = tamaño del array

### Ambas Versiones

**Time Complexity: O(n × n!)**

```
Generar n! permutaciones
Copiar cada una: O(n)
Total: O(n × n!)

Explicación:
- Primer nivel: n opciones
- Segundo nivel: n-1 opciones por rama
- Tercer nivel: n-2 opciones por rama
- ...
- Total ramas: n! permutaciones
- Copiar cada permutación: O(n)
```

**Space Complexity:**

```
Versión 1 (con used):
- Recursion stack: O(n) profundidad
- Array used: O(n)
- Array curr: O(n)
Total: O(n)

Versión 2 (con swap):
- Recursion stack: O(n) profundidad
- Sin arrays extra
Total: O(n) - solo stack
```

**Comparación Práctica:**

| n | n! | Operaciones (n × n!) | Tiempo Estimado* |
|---|----|--------------------|-----------------|
| 3 | 6 | 18 | < 1ms |
| 4 | 24 | 96 | < 1ms |
| 5 | 120 | 600 | ~1ms |
| 6 | 720 | 4,320 | ~10ms |
| 7 | 5,040 | 35,280 | ~100ms |
| 8 | 40,320 | 322,560 | ~1s |
| 10 | 3,628,800 | 36,288,000 | ~2min |

*Tiempo aproximado en hardware moderno

**¡El crecimiento factorial es EXTREMADAMENTE rápido!**

---

## 🎯 Comparación: Subsets vs Combinations vs Permutations

| Aspecto | Subsets | Combinations | Permutations |
|---------|---------|--------------|--------------|
| **Orden importa** | No | No | **Sí** ✅ |
| **Tamaño** | Variable (0 a n) | Fijo (k) | Fijo (n) |
| **Total** | 2^n | C(n,k) | **n!** |
| **Loop range** | `i=start to n` | `i=start to n` | **`i=0 to n`** |
| **Tracking** | No necesario | No necesario | **Sí necesario** |
| **Caso base** | `index >= n` | `length === k` | **`length === n`** |
| **Complejidad** | O(n × 2^n) | O(k × C(n,k)) | **O(n × n!)** |

**Ejemplo Visual:**

```
nums = [1, 2, 3]

Subsets (orden NO importa):
[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
Total: 2^3 = 8

Combinations k=2 (orden NO importa):
[[1,2], [1,3], [2,3]]
Total: C(3,2) = 3

Permutations (orden SÍ importa):
[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
Total: 3! = 6
```

**Diferencia Clave:**
```
Subsets/Combinations:
[1,2] === [2,1]  (mismo subset/combination)

Permutations:
[1,2] ≠ [2,1]  (diferentes permutaciones)
```

---

## 🔥 Variante: Permutations II (Con Duplicados)

**Problema:** Si el array contiene duplicados, evitar permutaciones duplicadas.

```
Input: nums = [1, 1, 2]
Output: [[1,1,2], [1,2,1], [2,1,1]]

Sin manejar duplicados:
[[1,1,2], [1,2,1], [1,1,2], [1,2,1], [2,1,1], [2,1,1]]
                    ↑ duplicados
```

**Solución:**

```typescript
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);  // CRÍTICO: ordenar
    
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];
   
    function helper(){
        if(curr.length === nums.length){
            res.push([...curr]);
            return;
        }

        for(let i = 0; i < nums.length; i++){
            if(used[i]) continue;
            
            // Skip duplicados: si el elemento anterior es igual
            // y no ha sido usado, skipear este
            if(i > 0 && nums[i] === nums[i-1] && !used[i-1]) {
                continue;
            }

            curr.push(nums[i]);
            used[i] = true;
            helper();
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res;
}
```

**Explicación del Skip:**

```
nums = [1, 1, 2] (ordenado)

En cada nivel, si tenemos duplicados:
- Usar el primero: OK
- Usar el segundo SIN haber usado el primero: ❌ Skip

¿Por qué?
Si usamos el segundo 1 sin usar el primero:
  [1₂, ...] generará las mismas permutaciones que [1₁, ...]
  
Por eso skipear cuando:
  nums[i] === nums[i-1] && !used[i-1]
```

---

## 🎓 Template General de Permutations

```typescript
// Template para Permutations
function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);
    
    function backtrack(): void {
        // 1. Caso base: permutación completa
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        // 2. Loop COMPLETO (0 a n)
        for (let i = 0; i < nums.length; i++) {
            // 3. Skip si ya usado
            if (used[i]) continue;
            
            // 4. Hacer elección
            current.push(nums[i]);
            used[i] = true;
            
            // 5. Explorar
            backtrack();
            
            // 6. Deshacer (backtrack)
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}
```

**Puntos Clave:**
1. Loop va de `0` a `n` (no startIndex)
2. Necesita tracking con `used` array
3. Genera n! permutaciones
4. Orden importa: [1,2] ≠ [2,1]

---

## 🚀 Progresión Completa del Patrón Backtracking

- [x] **Medium:** Subsets (#78)
- [x] **Medium:** Subsets II (#90)
- [x] **Medium:** Combinations (#77)
- [x] **Medium:** Permutations (#46)

**Estado:** 🏆 **PATRÓN DOMINADO** - 4/4 problemas core completos

**Patrón Backtracking completado al 100%!** 🎉

---

## 💡 Tips de Implementación

1. **Elegir versión:** `used` array es más clara para entrevistas
2. **Loop completo:** `i=0 to n` (no startIndex como en Combinations)
3. **Tracking obligatorio:** Sin `used`, generarás permutaciones inválidas
4. **Siempre copiar:** `[...current]` o `[...nums]`
5. **Backtrack completo:** `pop()` + `used[i] = false`
6. **Para duplicados:** Ordenar + skip duplicados
7. **Swap elegante:** Usar destructuring ES6 `[a, b] = [b, a]`

---

## 🔍 Casos de Uso Reales

**Permutations se usa en:**
- ✅ Scheduling y ordenamiento de tareas
- ✅ Traveling Salesman Problem (TSP)
- ✅ Generación de test cases
- ✅ Puzzle solving (Rubik's cube)
- ✅ Cryptography (permutaciones de claves)
- ✅ Anagram detection y generación
- ✅ Tournament bracket generation
- ✅ Resource allocation con prioridades
