# Target Sum (LeetCode #494)

## 🏷️ Tags

`#0/1Knapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Counting`

---

## 🧠 Concepto Principal

Dado un array de enteros y un número target, asignar un signo **+** o **-** a cada número para alcanzar exactamente el target. Retornar el **número de formas diferentes** de lograrlo.

Este es un problema de **0/1 Knapsack con transformación matemática** porque cada número se usa exactamente una vez, pero necesitamos decidir su signo.

---

## 🎯 La Transformación Matemática (La Clave)

### Paso 1: Separar en Dos Grupos

```
En cualquier solución válida, dividimos los números en dos grupos:

Grupo P (Positivos): números con signo +
Grupo N (Negativos): números con signo -

Ejemplo:
nums = [1, 1, 1, 1, 1], target = 3

Una solución: +1 +1 +1 -1 -1 = 3
  P = {1, 1, 1} → suma = 3
  N = {1, 1}    → suma = 2
  
Resultado: P - N = 3 - 2 = 1 ❌ (incorrecto, target=3)

Otra solución: +1 +1 +1 +1 -1 = 3
  P = {1, 1, 1, 1} → suma = 4
  N = {1}          → suma = 1
  
Resultado: P - N = 4 - 1 = 3 ✓
```

### Paso 2: Ecuaciones del Sistema

```
Sabemos dos cosas:

1. P - N = target  (esto es lo que queremos)

2. P + N = sum(todos los números)
   Porque usamos TODOS los números,
   unos con + y otros con -
```

### Paso 3: Resolver para P

```
Tenemos:
  P - N = target         ... (ecuación 1)
  P + N = sum            ... (ecuación 2)

Sumando (1) + (2):
  (P - N) + (P + N) = target + sum
  P - N + P + N = target + sum
  2P = target + sum
  
  P = (target + sum) / 2
```

### Paso 4: Problema Transformado

```
Problema Original:
  "¿Cuántas formas de asignar +/- para hacer target?"

Problema Transformado:
  "¿Cuántos subsets suman exactamente (target + sum) / 2?"

¡Esto es EXACTAMENTE Partition Equal Subset Sum!
Pero en lugar de boolean (¿es posible?), 
contamos CUÁNTAS formas hay.
```

---

## 🔍 ¿Por Qué Funciona la Transformación?

### Demostración Visual

```
nums = [1, 2, 3], target = 0

sum = 1 + 2 + 3 = 6
P = (0 + 6) / 2 = 3

Pregunta transformada: ¿Cuántos subsets suman 3?

Todos los subsets:
  {}           → 0
  {1}          → 1
  {2}          → 2
  {3}          → 3 ✓ (suma 3)
  {1, 2}       → 3 ✓ (suma 3)
  {1, 3}       → 4
  {2, 3}       → 5
  {1, 2, 3}    → 6

2 subsets suman 3: {3} y {1, 2}

Verificación:

Subset {3} con +:
  Números con +: {3}
  Números con -: {1, 2}
  Expresión: -1 -2 +3 = 0 ✓

Subset {1, 2} con +:
  Números con +: {1, 2}
  Números con -: {3}
  Expresión: +1 +2 -3 = 0 ✓

¡Coincide! 2 formas ✓
```

---

## 🗺️ La Estrategia DP

### Estado

```
dp[i][s] = Número de formas de hacer suma 's' 
           usando los primeros 'i' números

Diferencia con Partition:
  Partition: dp[i][s] = boolean (¿es posible?)
  Target Sum: dp[i][s] = number (¿cuántas formas?)
```

### Recurrencia

```
Para cada número nums[i-1]:

Opción 1: NO usar este número en el subset
  dp[i][s] = dp[i-1][s]
  (Formas sin usar este número)

Opción 2: SÍ usar este número en el subset
  dp[i][s] = dp[i-1][s - nums[i-1]]
  (Formas de hacer el resto, luego agregar este número)

Combinado (SUMAR ambas opciones):
  dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i-1]]
             ───────────   ───────────────────────
             Formas sin    Formas usando
             este número   este número
```

### Caso Base

```
dp[0][0] = 1

¿Por qué?
  Hay 1 forma de hacer suma 0 sin números: el subset vacío {}
  
dp[0][s] = 0 para s > 0
  Hay 0 formas de hacer suma >0 sin números
```

### Validaciones Importantes

```
1. Si |target| > sum → Imposible
   Ejemplo: nums=[1,1], target=5
   sum=2, pero target=5 > 2 → return 0

2. Si (target + sum) es IMPAR → Imposible
   No se puede dividir un número impar en dos partes enteras

3. Si newTarget < 0 → Imposible
   Ejemplo: nums=[1], target=-2
   newTarget = (-2+1)/2 = -0.5 → imposible
```

---

## 💻 Implementación

```typescript
function findTargetSumWays(nums: number[], target: number): number {
    // 1. Calcular suma total
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // 2. Validaciones
    if (Math.abs(target) > sum) return 0;
    if ((target + sum) % 2 !== 0) return 0;
    
    // 3. Calcular nuevo objetivo
    const newTarget = (target + sum) / 2;
    if (newTarget < 0) return 0;
    
    const n = nums.length;
    
    // 4. Crear tabla DP
    const dp: number[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(newTarget + 1).fill(0));
    
    // 5. Base case
    dp[0][0] = 1;
    
    // 6. Llenar tabla
    for (let i = 1; i <= n; i++) {
        for (let s = 0; s <= newTarget; s++) {
            if (s < nums[i - 1]) {
                // No cabe, solo copiar
                dp[i][s] = dp[i - 1][s];
            } else {
                // Sumar ambas opciones
                dp[i][s] = dp[i - 1][s] + dp[i - 1][s - nums[i - 1]];
            }
        }
    }
    
    // 7. Respuesta final
    return dp[n][newTarget];
}
```

---

## 📊 Trace Completo Paso a Paso

```typescript
Input: nums = [1, 1, 1], target = 1

═══════════════════════════════════════
PASO 1: Validaciones y Transformación
═══════════════════════════════════════

sum = 1 + 1 + 1 = 3

|target| > sum? |1| > 3? NO ✓
(target + sum) % 2 = (1 + 3) % 2 = 4 % 2 = 0 ✓ (par)

newTarget = (1 + 3) / 2 = 2

Pregunta transformada:
  ¿Cuántos subsets de [1,1,1] suman 2?

═══════════════════════════════════════
PASO 2: Inicialización
═══════════════════════════════════════

dp[4][3] (n+1=4, newTarget+1=3)

    s:  0   1   2
i=0     1   0   0  ← Base case: dp[0][0]=1
i=1     0   0   0
i=2     0   0   0
i=3     0   0   0

═══════════════════════════════════════
PASO 3: Procesar nums[0] = 1 (i=1)
═══════════════════════════════════════

s=0:
  nums[0]=1 > 0? SÍ, no cabe
  dp[1][0] = dp[0][0] = 1

s=1:
  nums[0]=1 <= 1? SÍ, cabe
  dp[1][1] = dp[0][1] + dp[0][1-1]
           = 0 + dp[0][0]
           = 0 + 1
           = 1
  
  Forma nueva: {} + {1} = {1}

s=2:
  nums[0]=1 <= 2? SÍ, cabe
  dp[1][2] = dp[0][2] + dp[0][2-1]
           = 0 + dp[0][1]
           = 0 + 0
           = 0

Tabla después de i=1:
    s:  0   1   2
i=1     1   1   0

Formas actuales:
  suma 0: {} (1 forma)
  suma 1: {1} (1 forma)
  suma 2: ninguna (0 formas)

═══════════════════════════════════════
PASO 4: Procesar nums[1] = 1 (i=2)
═══════════════════════════════════════

s=0:
  dp[2][0] = dp[1][0] = 1

s=1:
  nums[1]=1 <= 1? SÍ
  dp[2][1] = dp[1][1] + dp[1][1-1]
           = dp[1][1] + dp[1][0]
           = 1 + 1
           = 2
  
  Formas:
    - No usar segundo 1: {1₁}
    - Usar segundo 1: {} + {1₂} = {1₂}
  Total: 2 formas

s=2:
  nums[1]=1 <= 2? SÍ
  dp[2][2] = dp[1][2] + dp[1][2-1]
           = dp[1][2] + dp[1][1]
           = 0 + 1
           = 1
  
  Forma nueva: {1₁} + {1₂} = {1₁, 1₂}

Tabla después de i=2:
    s:  0   1   2
i=2     1   2   1

Formas actuales:
  suma 0: {} (1 forma)
  suma 1: {1₁}, {1₂} (2 formas)
  suma 2: {1₁, 1₂} (1 forma)

═══════════════════════════════════════
PASO 5: Procesar nums[2] = 1 (i=3)
═══════════════════════════════════════

s=0:
  dp[3][0] = dp[2][0] = 1

s=1:
  nums[2]=1 <= 1? SÍ
  dp[3][1] = dp[2][1] + dp[2][0]
           = 2 + 1
           = 3
  
  Formas:
    - De dp[2][1]: {1₁}, {1₂} (2 formas)
    - Agregar tercer 1: {} + {1₃} = {1₃} (1 forma)
  Total: 3 formas

s=2:
  nums[2]=1 <= 2? SÍ
  dp[3][2] = dp[2][2] + dp[2][1]
           = 1 + 2
           = 3
  
  Formas:
    - De dp[2][2]: {1₁, 1₂} (1 forma)
    - Agregar tercer 1 a dp[2][1]: 
      {1₁} + {1₃} = {1₁, 1₃}
      {1₂} + {1₃} = {1₂, 1₃}
      (2 formas)
  Total: 3 formas

Tabla FINAL:
    s:  0   1   2
i=3     1   3   3
                ↑
         RESPUESTA = 3

═══════════════════════════════════════
PASO 6: Verificación
═══════════════════════════════════════

Subsets que suman 2:
  1. {1₁, 1₂} (posiciones 0, 1)
  2. {1₁, 1₃} (posiciones 0, 2)
  3. {1₂, 1₃} (posiciones 1, 2)

Convirtiendo a expresiones +/-:

Subset {1₁, 1₂}:
  Con +: {1₁, 1₂}
  Con -: {1₃}
  Expresión: +1 +1 -1 = 1 ✓

Subset {1₁, 1₃}:
  Con +: {1₁, 1₃}
  Con -: {1₂}
  Expresión: +1 -1 +1 = 1 ✓

Subset {1₂, 1₃}:
  Con +: {1₂, 1₃}
  Con -: {1₁}
  Expresión: -1 +1 +1 = 1 ✓

¡3 expresiones diferentes que dan target=1! ✓
```

---

## 📊 Ejemplo Adicional

```typescript
Input: nums = [1, 2, 3], target = 0

═══════════════════════════════════════
TRANSFORMACIÓN
═══════════════════════════════════════

sum = 1 + 2 + 3 = 6
newTarget = (0 + 6) / 2 = 3

Pregunta: ¿Cuántos subsets suman 3?

═══════════════════════════════════════
TRACE
═══════════════════════════════════════

    s:  0   1   2   3
i=0     1   0   0   0
i=1     1   1   0   0  ← nums[0]=1
i=2     1   1   1   1  ← nums[1]=2
i=3     1   1   1   2  ← nums[2]=3
                    ↑
            RESPUESTA = 2

═══════════════════════════════════════
SUBSETS QUE SUMAN 3
═══════════════════════════════════════

1. {3} → solo el 3
2. {1, 2} → el 1 y el 2

═══════════════════════════════════════
EXPRESIONES RESULTANTES
═══════════════════════════════════════

Subset {3}:
  Con +: {3}
  Con -: {1, 2}
  Expresión: -1 -2 +3 = 0 ✓

Subset {1, 2}:
  Con +: {1, 2}
  Con -: {3}
  Expresión: +1 +2 -3 = 0 ✓

2 formas ✓
```

---

## ⚠️ Errores Comunes

### 1. No Validar newTarget Negativo

```typescript
// ❌ INCORRECTO
const newTarget = (target + sum) / 2;
// Si target=-5 y sum=2:
// newTarget = (-5+2)/2 = -1.5
// Intentar crear dp con índice negativo → ERROR

// ✅ CORRECTO
const newTarget = (target + sum) / 2;
if (newTarget < 0) return 0;
```

### 2. Olvidar Validar Paridad

```typescript
// ❌ INCORRECTO
// Si (target + sum) es impar, newTarget no es entero
const newTarget = (target + sum) / 2;  // Puede ser decimal

// ✅ CORRECTO
if ((target + sum) % 2 !== 0) return 0;
const newTarget = (target + sum) / 2;
```

### 3. Usar OR en Lugar de Suma

```typescript
// ❌ INCORRECTO - Es de Partition (boolean)
dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i-1]];

// ✅ CORRECTO - Target Sum cuenta formas
dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i-1]];
```

### 4. Índices Incorrectos

```typescript
// ❌ INCORRECTO
dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i]];

// ✅ CORRECTO
dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i-1]];
//                                      ↑
//                                    i-1
```

---

## 🧪 Análisis Big O

### Time Complexity: O(n × sum)

```
Variables:
  n = longitud del array
  sum = (target + sum(nums)) / 2

Operaciones:
  - Llenar tabla: n filas × sum columnas
  - Cada celda: O(1)

Total: O(n × sum)

Nota: En el peor caso, sum puede ser grande
```

### Space Complexity: O(n × sum)

```
Tabla dp: (n + 1) × (sum + 1)

Optimización posible:
  - Reducir a O(sum) con 1D array
  - Similar a Partition Equal Subset Sum
```

---

## 🎯 Casos Especiales

### Caso 1: Zeros en el Array

```typescript
nums = [0, 0, 1], target = 1

sum = 1
newTarget = (1 + 1) / 2 = 1

Cada 0 puede ser +0 o -0 (dos opciones por cada 0)

Subsets que suman 1:
  {1}          → expresión: +0 +0 +1 = 1
  {0, 1}       → expresión: +0 -0 +1 = 1
  {0, 1}       → expresión: -0 +0 +1 = 1
  {0, 0, 1}    → expresión: +0 +0 +1 = 1
  
Cuenta correctamente porque DP trata cada 0 como elemento único
```

### Caso 2: Target Negativo

```typescript
nums = [1, 1], target = -2

sum = 2
newTarget = (-2 + 2) / 2 = 0

¿Cuántos subsets suman 0?
Solo {} → 1 subset

Expresión: -1 -1 = -2 ✓

Funciona correctamente
```

---

## 🔗 Conexión con Partition Equal Subset Sum

### Similitudes

| Aspecto | Partition | Target Sum |
|---------|-----------|------------|
| **Patrón** | 0/1 Knapsack | 0/1 Knapsack |
| **Estado** | `dp[i][s]` | `dp[i][s]` |
| **Cada item** | Una vez | Una vez |
| **Transformación** | sum/2 | (target+sum)/2 |

### Diferencias

| Aspecto | Partition | Target Sum |
|---------|-----------|------------|
| **Tipo DP** | `boolean` | `number` |
| **Objetivo** | ¿Es posible? | ¿Cuántas formas? |
| **Operación** | `OR` | `+` (suma) |
| **Base case** | `dp[i][0] = true` | `dp[0][0] = 1` |
| **Resultado** | true/false | count |

---

## 🔗 Problemas Relacionados

- Partition Equal Subset Sum (LC #416) - Misma transformación, boolean
- Subset Sum - Variante directa
- Ones and Zeroes (LC #474) - 0/1 Knapsack con dos dimensiones

---

## 📝 Notas de Implementación

1. **Validar TODAS las condiciones** antes de crear DP
2. **newTarget < 0** es caso especial importante
3. **Base case: dp[0][0] = 1** (no true)
4. **Sumar (+=), no OR** en la recurrencia
5. **Transformación matemática** es la clave del problema
6. El problema **parece difícil** pero es estándar 0/1 Knapsack
