# Maximum Subarray (LeetCode #53)

## 🏷️ Tags
`#KadanesAlgorithm` `#Array` `#DynamicProgramming` `#TypeScript` `#Easy`

## 🧠 Concepto Principal
El núcleo del Algoritmo de Kadane es una **decisión codiciosa (greedy)** en cada paso de la iteración. La pregunta fundamental es: 
*"¿Me conviene extender el subarray actual con la suma acumulada que traigo, o me conviene cortar la racha y empezar uno nuevo desde cero con el número actual?"*

Si la "historia" (suma acumulada previa) es negativa, se convierte en un lastre para cualquier número futuro; por lo tanto, la descartamos (reiniciamos a 0). Si es positiva, la mantenemos.

## 🗺️ La Estrategia
1.  **Inicialización:** Definimos `maxSum` como `-Infinity` (para manejar arrays de solo negativos) y `currSum` en `0`.
2.  **Iteración:** Recorremos cada número `n` del array.
3.  **Decisión de Reinicio:** Antes de sumar `n`, verificamos `currSum`. 
    * Si `currSum < 0`, significa que restamos valor. Lo reiniciamos a `0`.
    * (Matemáticamente: `currSum = max(0, currSum)`).
4.  **Acumulación:** Sumamos `n` a `currSum`.
5.  **Registro:** Comparamos `currSum` con `maxSum` y guardamos el mayor.

## 💻 Implementación (TypeScript - Solución Óptima)

```typescript
function maxSubArray(nums: number[]): number {
    let maxSum: number = -Infinity;
    let currSum: number = 0;

    for (const n of nums) {
        // Si la suma acumulada es negativa, es un lastre. Reiniciamos a 0.
        currSum = Math.max(currSum, 0);
        
        // Sumamos el elemento actual
        currSum += n;
        
        // Verificamos si encontramos un nuevo máximo global
        maxSum = Math.max(maxSum, currSum);
    }

    return maxSum;
};
````

## ⚠️ Errores Comunes (Pitfalls)

  * **Inicializar `maxSum` en 0:** Fallará si el input es `[-5, -1, -3]`, devolviendo `0` en lugar de `-1`.
  * **Complejidad Innecesaria:** Intentar usar Divide and Conquer lleva a una solución $O(n \log n)$, que es aceptable pero inferior a Kadane ($O(n)$).

## 🧪 Análisis Big O

  * **Tiempo:** $O(n)$ — Recorremos el array exactamente una vez.
  * **Espacio:** $O(1)$ — Solo utilizamos dos variables auxiliares (`maxSum`, `currSum`).

<!-- end list -->



