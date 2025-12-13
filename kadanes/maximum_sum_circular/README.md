# Maximum Sum Circular Subarray (LeetCode #918)

## 🏷️ Tags
`#KadanesAlgorithm` `#Array` `#Math` `#TypeScript` `#Hard`

## 🧠 Concepto Principal
En un array circular, el subarray con la suma máxima puede estar en dos lugares:
1.  **En el centro (Caso Normal):** Un subarray contiguo estándar (ej: `[... -2, {5, 6}, -1 ...]`). Se resuelve con Kadane tradicional.
2.  **En los bordes (Caso Circular):** El subarray envuelve el final y el inicio (ej: `{5, ...} ... -10 ... {... , 6}`).

## 🗺️ La Estrategia (Lógica Inversa)
Para el caso circular, en lugar de intentar conectar los bordes, usamos la lógica de **"Restar el Mínimo"**:
* Calculamos la **Suma Total** del array.
* Encontramos el **Subarray Mínimo** (la parte más "tóxica" del centro) usando un Kadane invertido.
* La suma de los bordes (circular) es matemáticamente: `Total - SubarrayMínimo`.

Finalmente, el resultado es el máximo entre el **Caso Normal** y el **Caso Circular**.

### Excepción (Edge Case)
Si todos los números son negativos, `Total` será igual a `SubarrayMínimo`, resultando en 0. Como debemos tomar al menos un número, en este caso devolvemos simplemente el `maxSum` normal (el número menos negativo).

## 💻 Implementación (TypeScript - Solución Óptima)

```typescript
function maxSubarraySumCircular(nums: number[]): number {
   let totalSum = 0;
   let maxSum = nums[0];
   let curMax = 0;
   let minSum = nums[0];
   let curMin = 0;

    for(let num of nums){
        // Kadane para Máximo (Caso Normal)
        curMax = Math.max(curMax + num, num);
        maxSum = Math.max(curMax, maxSum);
        
        // Kadane para Mínimo (Para eliminar el centro en caso Circular)
        curMin = Math.min(curMin + num, num);
        minSum = Math.min(curMin, minSum);
        
        totalSum += num;
    }

    // Si maxSum <= 0, significa que todos los números son negativos.
    // Devolvemos maxSum para evitar devolver 0 (subarray vacío).
    return maxSum > 0 ? Math.max(maxSum, totalSum - minSum) : maxSum;
};
````

## 🧪 Análisis Big O

  * **Tiempo:** $O(N)$ — Una sola pasada calculamos ambos escenarios.
  * **Espacio:** $O(1)$ — Solo variables escalares.

