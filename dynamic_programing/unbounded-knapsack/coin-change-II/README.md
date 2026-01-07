# Coin Change II (LeetCode #518)

## 🏷️ Tags

`#UnboundedKnapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Counting` `#Combinations`

---

## 🧠 Concepto Principal

Dado un array de monedas y un amount, retornar el **número de combinaciones** diferentes para formar ese amount.

Puedes usar **cada moneda infinitas veces**.

**Diferencia con Coin Change:**
- Coin Change: **Minimizar** número de monedas
- Coin Change II: **Contar** combinaciones

---

## 🔑 CRÍTICO: Combinaciones vs Permutaciones

Esta es **LA DIFERENCIA MÁS IMPORTANTE** de este problema.

### Combinaciones (Lo que queremos) ✅

```
amount = 3, coins = [1, 2]

Combinaciones:
1. {1, 1, 1}    → 1+1+1 = 3
2. {1, 2}       → 1+2 = 3

Total: 2 combinaciones

El ORDEN NO IMPORTA:
  {1, 2} = {2, 1}  → Cuentan como UNA combinación
```

### Permutaciones (Lo que NO queremos) ❌

```
amount = 3, coins = [1, 2]

Permutaciones:
1. {1, 1, 1}    → 1+1+1 = 3
2. {1, 2}       → 1+2 = 3
3. {2, 1}       → 2+1 = 3

Total: 3 permutaciones

El ORDEN SÍ IMPORTA:
  {1, 2} ≠ {2, 1}  → Cuentan como DOS permutaciones
```

---

## ⚡ La Clave: Orden de Loops

### ❌ ORDEN INCORRECTO (Cuenta Permutaciones)

```typescript
// INCORRECTO - Cuenta permutaciones
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) {
        dp[amount] += dp[amount - coin];
    }
}
```

**¿Por qué cuenta permutaciones?**

```
amount = 3, coins = [1, 2]

Procesando amount=3:
  
  coin=1:
    dp[3] += dp[2]
    dp[2] tiene la combinación {2}
    Ahora {2} + {1} = {2, 1} ✓
  
  coin=2:
    dp[3] += dp[1]
    dp[1] tiene la combinación {1}
    Ahora {1} + {2} = {1, 2} ✓

Resultado: Cuenta {1, 2} y {2, 1} como diferentes ❌
```

---

### ✅ ORDEN CORRECTO (Cuenta Combinaciones)

```typescript
// CORRECTO - Cuenta combinaciones
for (const coin of coins) {
    for (let amount = coin; amount <= target; amount++) {
        dp[amount] += dp[amount - coin];
    }
}
```

**¿Por qué cuenta solo combinaciones?**

```
amount = 3, coins = [1, 2]

Procesando coin=1:
  amount=1: dp[1] += dp[0] = 1  → {1}
  amount=2: dp[2] += dp[1] = 1  → {1,1}
  amount=3: dp[3] += dp[2] = 1  → {1,1,1}

Procesando coin=2:
  amount=2: dp[2] += dp[0] = 1+1 = 2  → {2} y {1,1}
  amount=3: dp[3] += dp[1] = 1+1 = 2  → {1,2} y {1,1,1}

Solo creamos {1, 2} UNA VEZ ✓
Nunca creamos {2, 1} porque:
  - Cuando procesamos moneda 2
  - Solo agregamos 2 a combinaciones que YA tienen solo 1's
  - Nunca agregamos 1 a combinaciones que tienen 2
```

---

## 🎨 Visualización del Orden de Loops

### Por Qué Funciona

```
Loop por MONEDAS primero:

Procesamos monedas EN ORDEN: [1, 2, 5]

Moneda 1:
  Crea todas las combinaciones SOLO con 1's
  {1}, {1,1}, {1,1,1}, ...

Moneda 2:
  Agrega 2 a combinaciones existentes
  {2}, {1,2}, {1,1,2}, {2,2}, ...
  
  PERO nunca crea {2,1} porque:
    - Ya procesamos todas las combinaciones con 1
    - Ahora solo AGREGAMOS 2's
    - Mantenemos el orden: primero 1's, luego 2's

Moneda 5:
  Agrega 5 a combinaciones existentes
  {5}, {1,5}, {2,5}, {1,1,5}, ...
  
  Orden mantenido: 1's → 2's → 5's
```

---

## 🗺️ La Estrategia DP

### Estado

```
dp[amount] = Número de combinaciones para hacer amount

No necesitamos índice i porque procesamos
monedas de forma secuencial
```

### Recurrencia

```
Para cada moneda coin (en orden):
  Para cada cantidad amount >= coin:
    
    dp[amount] += dp[amount - coin]
    
    Significado:
      "Las formas de hacer amount
       = Las formas que ya tenía
       + Las formas de hacer (amount - coin) 
         agregándole esta moneda"
```

### Caso Base

```
dp[0] = 1

¿Por qué?
  Hay 1 forma de hacer 0: no usar ninguna moneda {}
  
dp[1..amount] = 0 (inicialmente)
```

---

## 💻 Implementación

```typescript
function change(amount: number, coins: number[]): number {
    // 1. Crear array DP
    const dp: number[] = Array(amount + 1).fill(0);
    
    // 2. Base case: 1 forma de hacer 0
    dp[0] = 1;
    
    // 3. CRÍTICO: Loop por MONEDAS primero
    for (const coin of coins) {
        // 4. Para cada cantidad >= coin
        for (let i = coin; i <= amount; i++) {
            // 5. Sumar formas
            dp[i] += dp[i - coin];
        }
    }
    
    // 6. Respuesta final
    return dp[amount];
}
```

---

## 📊 Trace Completo Paso a Paso

```typescript
Input: coins = [1, 2, 5], amount = 5

═══════════════════════════════════════
INICIALIZACIÓN
═══════════════════════════════════════

dp = [1, 0, 0, 0, 0, 0]
     0  1  2  3  4  5

dp[0] = 1 ✓ (1 forma de hacer 0: {})

═══════════════════════════════════════
PROCESAR MONEDA coin=1
═══════════════════════════════════════

i=1:
  dp[1] += dp[1-1] = dp[1] + dp[0] = 0 + 1 = 1
  Nueva forma: {} + {1} = {1}

i=2:
  dp[2] += dp[2-1] = dp[2] + dp[1] = 0 + 1 = 1
  Nueva forma: {1} + {1} = {1,1}

i=3:
  dp[3] += dp[3-1] = dp[3] + dp[2] = 0 + 1 = 1
  Nueva forma: {1,1} + {1} = {1,1,1}

i=4:
  dp[4] += dp[4-1] = dp[4] + dp[3] = 0 + 1 = 1
  Nueva forma: {1,1,1} + {1} = {1,1,1,1}

i=5:
  dp[5] += dp[5-1] = dp[5] + dp[4] = 0 + 1 = 1
  Nueva forma: {1,1,1,1} + {1} = {1,1,1,1,1}

Estado después de coin=1:
dp = [1, 1, 1, 1, 1, 1]

Formas creadas (solo con 1's):
  0: {} (1 forma)
  1: {1} (1 forma)
  2: {1,1} (1 forma)
  3: {1,1,1} (1 forma)
  4: {1,1,1,1} (1 forma)
  5: {1,1,1,1,1} (1 forma)

═══════════════════════════════════════
PROCESAR MONEDA coin=2
═══════════════════════════════════════

i=2:
  dp[2] += dp[2-2] = dp[2] + dp[0] = 1 + 1 = 2
  Nueva forma: {} + {2} = {2}
  Formas totales para 2: {1,1} y {2}

i=3:
  dp[3] += dp[3-2] = dp[3] + dp[1] = 1 + 1 = 2
  Nueva forma: {1} + {2} = {1,2}
  Formas totales para 3: {1,1,1} y {1,2}

i=4:
  dp[4] += dp[4-2] = dp[4] + dp[2] = 1 + 2 = 3
  Nuevas formas:
    {1,1} + {2} = {1,1,2}
    {2} + {2} = {2,2}
  Formas totales para 4: {1,1,1,1}, {1,1,2}, {2,2}

i=5:
  dp[5] += dp[5-2] = dp[5] + dp[3] = 1 + 2 = 3
  Nuevas formas:
    {1,1,1} + {2} = {1,1,1,2}
    {1,2} + {2} = {1,2,2}
  Formas totales para 5: {1,1,1,1,1}, {1,1,1,2}, {1,2,2}

Estado después de coin=2:
dp = [1, 1, 2, 2, 3, 3]

Formas usando monedas [1, 2]:
  0: {} (1 forma)
  1: {1} (1 forma)
  2: {1,1}, {2} (2 formas)
  3: {1,1,1}, {1,2} (2 formas)
  4: {1,1,1,1}, {1,1,2}, {2,2} (3 formas)
  5: {1,1,1,1,1}, {1,1,1,2}, {1,2,2} (3 formas)

═══════════════════════════════════════
PROCESAR MONEDA coin=5
═══════════════════════════════════════

i=5:
  dp[5] += dp[5-5] = dp[5] + dp[0] = 3 + 1 = 4
  Nueva forma: {} + {5} = {5}
  Formas totales para 5:
    {1,1,1,1,1}
    {1,1,1,2}
    {1,2,2}
    {5}

Estado FINAL:
dp = [1, 1, 2, 2, 3, 4]
                      ↑
               RESPUESTA = 4

═══════════════════════════════════════
VERIFICACIÓN FINAL
═══════════════════════════════════════

Todas las formas de hacer 5:
1. {1, 1, 1, 1, 1}  → 1+1+1+1+1 = 5 ✓
2. {1, 1, 1, 2}     → 1+1+1+2 = 5 ✓
3. {1, 2, 2}        → 1+2+2 = 5 ✓
4. {5}              → 5 = 5 ✓

Total: 4 combinaciones ✓

NOTA: No hay {2,1,2} ni {2,2,1} porque
esas son PERMUTACIONES, no combinaciones
```

---

## 📊 Comparación de Orden de Loops

### Ejemplo: coins = [1, 2], amount = 3

**Orden INCORRECTO (permutaciones):**

```typescript
for (let amount = 1; amount <= 3; amount++) {
    for (const coin of [1, 2]) { ... }
}

Resultado:
  amount=1: dp[1] = 1  → {1}
  amount=2: dp[2] = 2  → {1,1}, {2}
  amount=3: 
    coin=1: dp[3] += dp[2] = 2  → {1,1,1}, {2,1}
    coin=2: dp[3] += dp[1] = 2+1 = 3  → + {1,2}
  
  dp[3] = 3 ❌
  Formas: {1,1,1}, {2,1}, {1,2}
  Cuenta {2,1} y {1,2} como diferentes
```

**Orden CORRECTO (combinaciones):**

```typescript
for (const coin of [1, 2]) {
    for (let amount = coin; amount <= 3; amount++) { ... }
}

Resultado:
  coin=1:
    dp[1] = 1  → {1}
    dp[2] = 1  → {1,1}
    dp[3] = 1  → {1,1,1}
  
  coin=2:
    dp[2] += dp[0] = 1+1 = 2  → {2}, {1,1}
    dp[3] += dp[1] = 1+1 = 2  → {1,2}, {1,1,1}
  
  dp[3] = 2 ✓
  Formas: {1,1,1}, {1,2}
  Solo cuenta combinaciones únicas
```

---

## ⚠️ Errores Comunes

### 1. Orden de Loops Incorrecto (El Más Crítico)

```typescript
// ❌ INCORRECTO - Cuenta permutaciones
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) {
        dp[amount] += dp[amount - coin];
    }
}

// ✅ CORRECTO - Cuenta combinaciones
for (const coin of coins) {
    for (let amount = coin; amount <= target; amount++) {
        dp[amount] += dp[amount - coin];
    }
}
```

### 2. Inicializar dp[0] con 0

```typescript
// ❌ INCORRECTO
const dp = Array(amount + 1).fill(0);
// dp[0] = 0 → 0 formas de hacer 0 ❌

// ✅ CORRECTO
const dp = Array(amount + 1).fill(0);
dp[0] = 1;  // 1 forma de hacer 0 (subset vacío)
```

### 3. Usar Operador OR en Lugar de Suma

```typescript
// ❌ INCORRECTO - Es de Partition (boolean)
dp[i] = dp[i] || dp[i - coin];

// ✅ CORRECTO - Coin Change II cuenta formas
dp[i] += dp[i - coin];
//    ──
//    Sumar
```

### 4. Empezar Loop Interno en 1

```typescript
// ❌ INCORRECTO
for (const coin of coins) {
    for (let i = 1; i <= amount; i++) {  // Empieza en 1
        if (coin <= i) {
            dp[i] += dp[i - coin];
        }
    }
}

// ✅ CORRECTO - Optimización
for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {  // Empieza en coin
        dp[i] += dp[i - coin];
    }
}
```

---

## 🧪 Análisis Big O

### Time Complexity: O(coins.length × amount)

```
Variables:
  C = número de monedas
  amount = cantidad objetivo

Operaciones:
  - Para cada moneda: C iteraciones
  - Para cada cantidad: ~amount iteraciones

Total: O(C × amount)
```

### Space Complexity: O(amount)

```
Array dp: amount + 1 elementos
```

---

## 🔍 Profundizando: ¿Por Qué el Orden Importa?

### La Invariante del Orden

```
Al procesar monedas en orden [1, 2, 5]:

Cuando estoy en moneda 2:
  - Ya procesé TODAS las combinaciones con 1
  - Ahora solo AGREGO 2's a esas combinaciones
  - Nunca voy hacia atrás a agregar 1's

Esto garantiza:
  {1, 2} se crea (al agregar 2 a {1}) ✓
  {2, 1} NO se crea (nunca agregamos 1 después de 2) ✓
```

### Ejemplo Visual

```
Orden de creación de combinaciones:

Moneda 1:
  {} → {1} → {1,1} → {1,1,1} → ...

Moneda 2:
  {} → {2}
  {1} → {1,2}
  {1,1} → {1,1,2}
  {2} → {2,2}
  
  Todas empiezan con 0 o más 1's, luego 2's

Moneda 5:
  {} → {5}
  {1} → {1,5}
  {2} → {2,5}
  {1,2} → {1,2,5}
  
  Todas empiezan con 1's, luego 2's, luego 5's

NUNCA creamos {2,1} o {5,2,1} o {5,1,2}
porque mantenemos el ORDEN de procesamiento
```

---

## 🔗 Comparación con Coin Change

| Aspecto | Coin Change | Coin Change II |
|---------|-------------|----------------|
| **Objetivo** | Minimizar monedas | Contar combinaciones |
| **Tipo DP** | `number` (min) | `number` (count) |
| **Operación** | `Math.min(...)` | `+=` |
| **Orden loops** | Cualquiera | **MONEDAS primero** ⭐ |
| **Base case** | `dp[0] = 0` | `dp[0] = 1` |
| **Imposible** | Return -1 | Return 0 |

---

## 🔗 Problemas Relacionados

- Coin Change (LC #322) - Minimización (Unbounded)
- Combination Sum IV (LC #377) - Cuenta permutaciones (diferente)
- Perfect Squares (LC #279) - Minimización con cuadrados

---

## 📝 Notas de Implementación

1. **CRÍTICO:** Loop por monedas PRIMERO
2. **Base case:** `dp[0] = 1` (no 0)
3. **Optimización:** Empezar en `coin` en loop interno
4. **Operador:** Usar `+=` (sumar), no `=` ni `||`
5. **Retorno:** `dp[amount]` directamente (no verificar Infinity)
6. **Combinaciones ≠ Permutaciones** - El orden de loops lo controla
