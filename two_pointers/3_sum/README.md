# Problema 2: 3Sum (LeetCode #15)

## 🧠 Concepto Clave

**Sorting + Two Pointers:** Combina ordenamiento inicial con búsqueda de pares usando two pointers. La clave es **evitar duplicados** durante la iteración sin usar estructuras auxiliares como Set. Este patrón reduce complejidad de O(n³) brute force a O(n²).

**English:** Sorting + Two Pointers pattern. Combines initial sorting with pair finding using two pointers. Key is avoiding duplicates during iteration without auxiliary structures like Set. Reduces O(n³) brute force to O(n²).

## 🗺️ La Estrategia

1. **Pre-procesamiento:** Ordenar el array O(n log n)
2. **Loop externo (fijar `i`):** Para cada elemento nums[i]:
   - **Optimización:** Si `nums[i] > 0`, break (imposible sumar a 0 con positivos)
   - **Skip duplicados:** Si `nums[i] === nums[i-1]`, continue
3. **Two Pointers (buscar pares):**
   - `left = i + 1`, `right = n - 1`
   - `target = 0 - nums[i]`
   - Mientras `left < right`:
     - `sum = nums[left] + nums[right]`
     - Si `sum === target`: Encontrado! Agregar triplet
       - **Skip duplicados left:** `while (nums[left] === nums[left-1]) left++`
       - **Skip duplicados right:** `while (nums[right] === nums[right+1]) right--`
     - Si `sum < target`: `left++` (necesitamos suma mayor)
     - Si `sum > target`: `right--` (necesitamos suma menor)

**¿Por qué skip duplicados de esta forma?**

Para `i`: Comparamos con `nums[i-1]` porque ya exploramos TODAS las combinaciones posibles con ese valor en la iteración anterior.

```
nums = [-1, -1, 0, 1]
        ↑   ↑
        0   1

i=0: nums[i]=-1 → Explora TODOS los pares (left, right)
i=1: nums[i]=-1 → Si exploramos, encontraríamos los MISMOS pares
     → SKIP porque nums[1] === nums[0]
```

Para `left` y `right`: Después de encontrar un triplet, saltamos valores duplicados para no agregar el mismo triplet múltiples veces.

**Diagrama:**
```
Sorted: [-4, -1, -1, 0, 1, 2]

i=0: nums[i]=-4
     [-4, -1, -1, 0, 1, 2]
       i   L           R
     target = 4
     sum = -1 + 2 = 1 (< 4) → L++
     ...
     No encontramos nada

i=1: nums[i]=-1
     [-4, -1, -1, 0, 1, 2]
           i   L       R
     target = 1
     sum = -1 + 2 = 1 ✅ FOUND! → [[-1, -1, 2]]
     Skip duplicates, continuar...
     sum = 0 + 1 = 1 ✅ FOUND! → [[-1, 0, 1]]

i=2: nums[i]=-1
     Skip porque nums[2] === nums[1] (duplicado)
```

## 💻 Implementación

```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b); // CRÍTICO: Sorting numérico
    const result: number[][] = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Optimización: si el más pequeño es positivo, imposible sumar a 0
        if (nums[i] > 0) break;
        
        // Skip duplicates para i
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        const target = 0 - nums[i];
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                
                // Skip duplicates para left
                while (left < right && nums[left] === nums[left - 1]) left++;
                
                // Skip duplicates para right
                while (left < right && nums[right] === nums[right + 1]) right--;
                
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

## ⚠️ Errores Comunes

### 1. **Sorting Lexicográfico (JavaScript pitfall)**
```typescript
// ❌ PELIGRO - Sorting lexicográfico
nums.sort(); 
// [10, 2, -5] → [-5, 1, 10, 2] ❌ (compara como strings)

// ✅ CORRECTO - Sorting numérico
nums.sort((a, b) => a - b);
// [10, 2, -5] → [-5, 2, 10] ✅
```

### 2. **Skip duplicates para `left` y `right` DESPUÉS de encontrar triplet**
```typescript
// ❌ INCORRECTO - Skip antes de encontrar
while (left < right && nums[left] === nums[left-1]) left++;
if (sum === target) { ... }

// ✅ CORRECTO - Skip después de encontrar
if (sum === target) {
    result.push([...]);
    left++;
    right--;
    while (left < right && nums[left] === nums[left-1]) left++;
    while (left < right && nums[right] === nums[right+1]) right--;
}
```

## 🧪 Análisis Big O

- **Time:** O(n²)
  - Sorting: O(n log n)
  - Outer loop: O(n)
    - Inner two pointers: O(n)
  - Total: O(n log n) + O(n²) = O(n²) dominante
  
- **Space:** O(1) o O(n) dependiendo de la implementación del sort
  - No usamos estructuras auxiliares (sin Set, sin arrays temporales)
  - El resultado no cuenta para complejidad espacial
