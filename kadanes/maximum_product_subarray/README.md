# Maximum Product Subarray (LeetCode #152)

## 🏷️ Tags
`#DynamicProgramming` `#KadanesAlgorithm` `#Array` `#TypeScript` `#Medium`

## 🧠 Concepto Principal
A diferencia de la suma máxima, cuando trabajamos con productos, los números negativos alteran el orden natural: un número muy pequeño (negativo) puede convertirse en el máximo global si se multiplica por otro negativo.

Por esta razón, no basta con rastrear el máximo. Debemos mantener **dos estados** en cada iteración:
1.  **Max Product actual:** El valor más alto que podemos lograr terminando en la posición actual.
2.  **Min Product actual:** El valor más bajo (más negativo) que podemos lograr, esperando que un futuro número negativo lo invierta y lo convierta en un máximo masivo.

## 🗺️ La Estrategia
1.  **Inicialización:** `maxProduct` inicia en el valor más bajo posible (o el primer elemento). `currMax` y `currMin` inician en 1 (neutro multiplicativo) o en el primer elemento.
2.  **Iteración:** Recorremos cada número `n`.
3.  **Cálculo de Candidatos:** En cada paso, el nuevo máximo y mínimo pueden surgir de tres fuentes:
    * El número `n` por sí solo (reiniciar la racha).
    * `n * currMax` (continuar una racha positiva).
    * `n * currMin` (invertir una racha negativa).
4.  **Actualización:**
    * `currMax = max(n, n * currMax, n * currMin)`
    * `currMin = min(n, n * currMax, n * currMin)`
    * *Nota:* Es vital usar una variable temporal para `currMax` antes de calcular `currMin`.
5.  **Global:** Actualizamos `maxProduct`.

## 💻 Implementación (TypeScript - Solución Óptima)

```typescript
function maxProduct(nums: number[]): number {
    // Inicializamos el máximo global muy bajo
    let maxProduct: number = nums[0]; 
    
    let currMax: number = 1;
    let currMin: number = 1;

    for(const n of nums){
        // Guardamos el currMax anterior porque lo vamos a sobreescribir
        let maxTemp = currMax;
        
        // Calculamos los nuevos extremos. 
        // Incluimos 'n' solo para permitir el "reinicio" de la racha.
        currMax = Math.max(n, n * maxTemp, n * currMin);
        currMin = Math.min(n, n * maxTemp, n * currMin);

        // Actualizamos el resultado global
        maxProduct = Math.max(maxProduct, currMax);
    }

    return maxProduct;
};
````

## ⚠️ Errores Comunes (Pitfalls)

  * **Olvidar el Mínimo:** Solo rastrear el máximo fallará en inputs como `[-2, 3, -4]`.
  * **Actualización Secuencial sin Temp:** Calcular `currMin` usando el `currMax` que *acabas* de modificar en la línea anterior.
  * **Ignorar el Cero:** El cero "rompe" la cadena. La lógica `Math.max(n, ...)` maneja esto implícitamente reiniciando la cuenta en 0 (o en el siguiente número), pero conceptualmente es un reinicio.

## 🧪 Análisis Big O

  * **Tiempo:** $O(n)$ — Un solo pase por el array.
  * **Espacio:** $O(1)$ — Variables constantes.
