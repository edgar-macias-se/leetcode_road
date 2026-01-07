# Coin Change (LeetCode #322)

## 🏷️ Tags

`#UnboundedKnapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Minimization`

---

## 🧠 Concepto Principal

Dado un array de monedas de diferentes denominaciones y un amount (cantidad objetivo), retornar el **mínimo número de monedas** necesarias para formar ese amount.

Puedes usar **cada moneda infinitas veces**. Si no es posible formar el amount, retornar `-1`.

Este es un problema clásico de **Unbounded Knapsack** porque cada moneda se puede usar **ilimitadas veces**.

---

## 🔄 Diferencia Clave: 0/1 vs Unbounded

### 0/1 Knapsack

```typescript
Ejemplo: nums = [1, 2, 5], hacer suma 11

Cada número UNA VEZ:
  No puedes hacer: 5 + 5 + 1 (usa el 5 dos veces) ❌
  
Estado: dp[i][sum]
  i = ¿cuántos items he considerado?
  sum = ¿qué suma quiero hacer?

Recurrencia:
  dp[i][s] = dp[i-1][s - num]
             ───────
             Fila ANTERIOR (item ya no disponible)
```

### Unbounded Knapsack

```typescript
Ejemplo: coins = [1, 2, 5], amount = 11

Cada moneda INFINITAS VECES:
  Puedes hacer: 5 + 5 + 1 (usa el 5 dos veces) ✓
  
Estado: dp[amount]
  amount = ¿qué cantidad quiero hacer?
  (No necesitamos índice i)

Recurrencia:
  dp[amount] = dp[amount - coin]
               ──────────────────
               MISMO array (moneda sigue disponible)
```

---

## 🗺️ La Estrategia

### Estado del DP

```
dp[i] = Mínimo número de monedas para hacer amount i

Ejemplo: coins = [1, 2, 5]

dp[0] = 0   (0 monedas para hacer 0)
dp[1] = ?   (¿mínimo para hacer 1?)
dp[2] = ?   (¿mínimo para hacer 2?)
dp[5] = ?   (¿mínimo para hacer 5?)
dp[11] = ?  (¿mínimo para hacer 11?)
```

### Recurrencia

```
Para cada cantidad 'amount':
  Para cada moneda 'coin':
    Si coin <= amount:
      
      Opción: Usar esta moneda
        dp[amount] = dp[amount - coin] + 1
                     ─────────────────   ─
                     Hacer el resto      Esta moneda
      
      Tomar el MÍNIMO de todas las opciones

Fórmula:
  dp[amount] = min(dp[amount], dp[amount - coin] + 1)
               ────────────    ───────────────────────
               Mejor actual    Usar coin
```

### Caso Base

```
dp[0] = 0

¿Por qué?
  Necesito 0 monedas para hacer amount 0
  
dp[1..amount] = Infinity (inicialmente imposible)
```

---

## 💻 Implementación

```typescript
function coinChange(coins: number[], amount: number): number {
    // 1. Crear array DP
    const dp: number[] = Array(amount + 1).fill(Infinity);
    
    // 2. Base case
    dp[0] = 0;
    
    // 3. Para cada cantidad
    for (let i = 1; i <= amount; i++) {
        // 4. Probar cada moneda
        for (const coin of coins) {
            // 5. Skip si moneda muy grande
            if (coin > i) continue;
            
            // 6. Actualizar mínimo
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    // 7. Verificar si es posible
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

## 📊 Trace Completo Paso a Paso

```typescript
Input: coins = [1, 2, 5], amount = 11

═══════════════════════════════════════
INICIALIZACIÓN
═══════════════════════════════════════

dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]
     0  1  2  3  4  5  6  7  8  9  10 11

dp[0] = 0 ✓ (base case)

═══════════════════════════════════════
CANTIDAD i=1
═══════════════════════════════════════

Moneda 1: ¿1 <= 1? SÍ
  dp[1] = min(∞, dp[1-1] + 1)
        = min(∞, dp[0] + 1)
        = min(∞, 0 + 1)
        = 1
  Solución: {1} (1 moneda)

Moneda 2: ¿2 <= 1? NO → skip
Moneda 5: ¿5 <= 1? NO → skip

dp = [0, 1, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=2
═══════════════════════════════════════

Moneda 1: ¿1 <= 2? SÍ
  dp[2] = min(∞, dp[2-1] + 1)
        = min(∞, dp[1] + 1)
        = min(∞, 1 + 1)
        = 2
  Solución temporal: {1, 1} (2 monedas)

Moneda 2: ¿2 <= 2? SÍ
  dp[2] = min(2, dp[2-2] + 1)
        = min(2, dp[0] + 1)
        = min(2, 0 + 1)
        = 1
  Solución mejor: {2} (1 moneda) ✓

Moneda 5: ¿5 <= 2? NO → skip

dp = [0, 1, 1, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=3
═══════════════════════════════════════

Moneda 1:
  dp[3] = min(∞, dp[2] + 1) = min(∞, 1+1) = 2
  Solución: {2, 1}

Moneda 2:
  dp[3] = min(2, dp[1] + 1) = min(2, 1+1) = 2
  Solución: {1, 2} (mismo resultado)

Moneda 5: skip

dp = [0, 1, 1, 2, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=4
═══════════════════════════════════════

Moneda 1:
  dp[4] = min(∞, dp[3] + 1) = min(∞, 2+1) = 3

Moneda 2:
  dp[4] = min(3, dp[2] + 1) = min(3, 1+1) = 2
  Mejor: {2, 2}

Moneda 5: skip

dp = [0, 1, 1, 2, 2, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=5
═══════════════════════════════════════

Moneda 1:
  dp[5] = min(∞, dp[4] + 1) = min(∞, 2+1) = 3
  Solución: {2, 2, 1}

Moneda 2:
  dp[5] = min(3, dp[3] + 1) = min(3, 2+1) = 3
  Solución: {2, 2, 1} o {2, 1, 2}

Moneda 5: ¿5 <= 5? SÍ
  dp[5] = min(3, dp[0] + 1) = min(3, 0+1) = 1
  Mucho mejor: {5} ✓

dp = [0, 1, 1, 2, 2, 1, ∞, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=6
═══════════════════════════════════════

Moneda 1: dp[6] = min(∞, 1+1) = 2
Moneda 2: dp[6] = min(2, 2+1) = 2
Moneda 5: dp[6] = min(2, 1+1) = 2

dp = [0, 1, 1, 2, 2, 1, 2, ∞, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=7
═══════════════════════════════════════

Moneda 1: dp[7] = min(∞, 2+1) = 3
Moneda 2: dp[7] = min(3, 1+1) = 2
Moneda 5: dp[7] = min(2, 2+1) = 2

dp = [0, 1, 1, 2, 2, 1, 2, 2, ∞, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=8
═══════════════════════════════════════

Moneda 1: dp[8] = min(∞, 2+1) = 3
Moneda 2: dp[8] = min(3, 2+1) = 3
Moneda 5: dp[8] = min(3, 2+1) = 3

dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, ∞, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=9
═══════════════════════════════════════

Moneda 1: dp[9] = min(∞, 3+1) = 4
Moneda 2: dp[9] = min(4, 2+1) = 3
Moneda 5: dp[9] = min(3, 3+1) = 3

dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, ∞, ∞]

═══════════════════════════════════════
CANTIDAD i=10
═══════════════════════════════════════

Moneda 1: dp[10] = min(∞, 3+1) = 4
Moneda 2: dp[10] = min(4, 1+1) = 2
Moneda 5: dp[10] = min(2, 2+1) = 2

dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, ∞]
Solución para 10: {5, 5}

═══════════════════════════════════════
CANTIDAD i=11 (OBJETIVO)
═══════════════════════════════════════

Moneda 1: ¿1 <= 11? SÍ
  dp[11] = min(∞, dp[10] + 1)
         = min(∞, 2 + 1)
         = 3
  Solución: {5, 5, 1}

Moneda 2: ¿2 <= 11? SÍ
  dp[11] = min(3, dp[9] + 1)
         = min(3, 3 + 1)
         = 3
  No mejora

Moneda 5: ¿5 <= 11? SÍ
  dp[11] = min(3, dp[6] + 1)
         = min(3, 2 + 1)
         = 3
  No mejora

dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
                                        ↑
                                  RESPUESTA = 3

═══════════════════════════════════════
VERIFICACIÓN
═══════════════════════════════════════

dp[11] = 3 monedas
Solución: {5, 5, 1}

5 + 5 + 1 = 11 ✓
3 monedas ✓
```

---

## 📊 Tabla Completa Final

```
amount:  0   1   2   3   4   5   6   7   8   9  10  11
coins:  [1,  2,  5]

dp:     [0,  1,  1,  2,  2,  1,  2,  2,  3,  3,  2,  3]

Soluciones:
  0: {} (0 monedas)
  1: {1} (1 moneda)
  2: {2} (1 moneda)
  3: {2,1} o {1,2} (2 monedas)
  4: {2,2} (2 monedas)
  5: {5} (1 moneda)
  6: {5,1} (2 monedas)
  7: {5,2} (2 monedas)
  8: {5,2,1} (3 monedas)
  9: {5,2,2} (3 monedas)
 10: {5,5} (2 monedas)
 11: {5,5,1} (3 monedas) ✓
```

---

## 📊 Ejemplo 2: Caso Imposible

```typescript
Input: coins = [2], amount = 3

═══════════════════════════════════════
TRACE
═══════════════════════════════════════

Inicialización:
dp = [0, ∞, ∞, ∞]
     0  1  2  3

i=1:
  Moneda 2: ¿2 <= 1? NO → skip
  dp[1] = ∞ (sin cambios)

i=2:
  Moneda 2: ¿2 <= 2? SÍ
  dp[2] = min(∞, dp[0] + 1) = 1
  
i=3:
  Moneda 2: ¿2 <= 3? SÍ
  dp[3] = min(∞, dp[1] + 1)
        = min(∞, ∞ + 1)
        = ∞
  No puede mejorar porque dp[1] es imposible

dp = [0, ∞, 1, ∞]

Resultado: dp[3] === Infinity → return -1 ✓

No se puede hacer 3 con monedas de 2
```

---

## ⚠️ Errores Comunes

### 1. Usar Fila Anterior (0/1 Knapsack)

```typescript
// ❌ INCORRECTO - Es 0/1 Knapsack
for (let i = 1; i <= n; i++) {
    for (let amount = 1; amount <= target; amount++) {
        dp[i][amount] = dp[i-1][amount - coin];
        //              ───────
        //              Fila anterior (moneda ya no disponible)
    }
}

// ✅ CORRECTO - Unbounded Knapsack
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) {
        dp[amount] = dp[amount - coin];
        //           ──────────────────
        //           Misma fila (moneda sigue disponible)
    }
}
```

### 2. No Skip Monedas Grandes

```typescript
// ❌ INCORRECTO - Causa errores con índices negativos
for (const coin of coins) {
    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    // Si coin > i, dp[i - coin] es índice negativo
}

// ✅ CORRECTO
for (const coin of coins) {
    if (coin > i) continue;  // Skip si no cabe
    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
}
```

### 3. Olvidar Verificar Infinity al Final

```typescript
// ❌ INCORRECTO
return dp[amount];  // Puede retornar Infinity

// ✅ CORRECTO
return dp[amount] === Infinity ? -1 : dp[amount];
```

### 4. Inicializar con 0 en Lugar de Infinity

```typescript
// ❌ INCORRECTO
const dp = Array(amount + 1).fill(0);
// 0 significa "puedo hacer con 0 monedas" ❌

// ✅ CORRECTO
const dp = Array(amount + 1).fill(Infinity);
dp[0] = 0;  // Solo dp[0] es 0
```

---

## 🧪 Análisis Big O

### Time Complexity: O(amount × coins.length)

```
Variables:
  amount = cantidad objetivo
  C = número de monedas

Operaciones:
  - Para cada amount: 1 a amount (amount iteraciones)
  - Probar cada moneda: C monedas

Total: O(amount × C)

Ejemplo: amount=11, coins=3
  11 × 3 = 33 operaciones básicas
```

### Space Complexity: O(amount)

```
Array dp: amount + 1 elementos

Mucho mejor que 0/1 Knapsack que usa O(n × amount)
```

---

## 🔑 Por Qué Funciona: La Intuición

### Construcción Incremental

```
dp[i] depende de dp[i - coin]

Ejemplo: amount = 7, coins = [1, 2, 5]

Para calcular dp[7]:
  Opción 1: Usar moneda 1
    dp[7] = dp[6] + 1
    "Si ya sé cómo hacer 6, agregar moneda 1 me da 7"
  
  Opción 2: Usar moneda 2
    dp[7] = dp[5] + 1
    "Si ya sé cómo hacer 5, agregar moneda 2 me da 7"
  
  Opción 3: Usar moneda 5
    dp[7] = dp[2] + 1
    "Si ya sé cómo hacer 2, agregar moneda 5 me da 7"
  
  Tomar el MÍNIMO de todas las opciones
```

### ¿Por Qué Funciona Usar MISMA Fila?

```
En Unbounded Knapsack:
  dp[amount - coin] ya fue calculado en esta iteración
  
  Cuando calculo dp[7]:
    dp[6] ya está calculado ✓
    dp[5] ya está calculado ✓
    dp[2] ya está calculado ✓
  
  Puedo usar cualquier moneda otra vez porque:
    1. Ya procesé amounts menores
    2. Las monedas siguen disponibles
```

---

## 🔗 Problemas Relacionados

- Coin Change II (LC #518) - Contar combinaciones (Unbounded)
- Perfect Squares (LC #279) - Minimización con cuadrados perfectos
- Minimum Cost For Tickets (LC #983) - Unbounded con restricciones

---

## 📝 Notas de Implementación

1. **Infinity como valor inicial** (no 0)
2. **dp[0] = 0** es el único base case
3. **Skip monedas grandes** para evitar índices negativos
4. **Verificar Infinity al final** y retornar -1
5. **No necesitas 2D array** - 1D es suficiente
6. **Orden de loops no importa** (a diferencia de Coin Change II)
