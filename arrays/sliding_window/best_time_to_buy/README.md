# Problema 1: Best Time to Buy and Sell Stock (LeetCode #121)

## 🧠 Concepto Principal

Este problema introduce el concepto básico de **Ventana Deslizante de Variable Única**: rastrear un valor óptimo del pasado (precio mínimo de compra) mientras se recorre el arreglo. Aunque técnicamente es más simple que una ventana deslizante tradicional, establece los cimientos del patrón: mantener información relevante mientras se avanza linealmente.

## 🗺️ La Estrategia

1. **Inicializar:** `buy` (precio mínimo visto) y `profit` (ganancia máxima)
2. **Recorrer:** Para cada precio:
   - Actualizar `buy` al mínimo entre el precio actual y `buy`
   - Calcular ganancia potencial: `precio actual - buy`
   - Actualizar `profit` si se encuentra uno mejor
3. **Retornar:** Ganancia máxima

**Insight Clave:** Solo necesitas recordar el precio mínimo del pasado, no la ventana completa.

## 💻 Implementación de Código

```typescript
function maxProfit(prices: number[]): number {
    let buy = prices[0];
    let profit = 0;
    
    for (const price of prices) {
        buy = Math.min(price, buy);
        profit = Math.max(profit, price - buy);
    }
    
    return profit;
}
```

## ⚠️ Errores Comunes

1. **Comparar cada precio con todos los futuros:** O(n²) - innecesario
2. **Usar `Infinity` cuando `prices[0]` es suficiente** (las restricciones garantizan longitud >= 1)
3. **Verificar `price - buy > 0`:** Redundante, `Math.max` ya maneja negativos

## 🧪 Análisis Big O

- **Tiempo:** O(n) - Una sola pasada por el arreglo
- **Espacio:** O(1) - Solo dos variables escalares
