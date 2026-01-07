# Dynamic Programming - Visión General

## 🏷️ Tags

`#DynamicProgramming` `#DP` `#Knapsack` `#LCS` `#Memoization` `#Tabulation` `#TypeScript`

---

## 🧠 ¿Qué es Dynamic Programming?

**Dynamic Programming (DP)** es una técnica de optimización que resuelve problemas complejos dividiéndolos en **subproblemas superpuestos** y almacenando sus resultados para evitar cálculos repetidos.

### Características Clave

1. **Subestructura Óptima:** La solución óptima del problema contiene soluciones óptimas de subproblemas
2. **Subproblemas Superpuestos:** Los mismos subproblemas se resuelven múltiples veces
3. **Memoization:** Almacenar resultados para evitar recalcular

---

## 🗺️ Patrones Fundamentales

### 1. 0/1 Knapsack (Mochila 0/1)

**Característica:** Cada elemento se puede usar **0 o 1 vez**

**Cuándo Usarlo:**
- Un array/lista de items
- Cada item se usa una sola vez
- Alcanzar cierta suma/capacidad
- Preguntas: "¿Es posible?" o "¿Cuántas formas?"

**Estado:** `dp[i][suma]`

**Problemas en este Repo:**
- Partition Equal Subset Sum (LC #416)
- Target Sum (LC #494)

---

### 2. Unbounded Knapsack (Mochila Ilimitada)

**Característica:** Cada elemento se puede usar **infinitas veces**

**Cuándo Usarlo:**
- Un array/lista de items
- Cada item se puede reutilizar
- Minimizar/maximizar o contar combinaciones
- Orden NO importa

**Estado:** `dp[amount]`

**Problemas en este Repo:**
- Coin Change (LC #322) - Minimización
- Coin Change II (LC #518) - Conteo de Combinaciones

---

### 3. LCS (Longest Common Subsequence)

**Característica:** Comparar **dos strings/arrays**

**Cuándo Usarlo:**
- Dos strings/arrays para comparar
- Encontrar subsecuencia/substring común
- Orden de caracteres importa
- Se pueden saltar caracteres

**Estado:** `dp[i][j]`

**Problemas en este Repo:**
- Longest Common Subsequence (LC #1143)

---

## 📊 Comparación de Patrones

| Patrón | Dimensión | Items | Operación | Complejidad |
|--------|-----------|-------|-----------|-------------|
| **0/1 Knapsack** | 2D `dp[i][s]` | Una vez | `OR` / `+` | O(n × sum) |
| **Unbounded** | 1D `dp[amount]` | Infinitas | `min` / `+` | O(amount × items) |
| **LCS** | 2D `dp[i][j]` | Dos arrays | `max` | O(M × N) |

---

## 🎯 Guía de Decisión Rápida

```
¿Cuántos arrays/strings tengo?
├─ 1 array + suma/capacidad
│  ├─ ¿Cada item una vez? → 0/1 Knapsack
│  └─ ¿Cada item infinitas veces? → Unbounded Knapsack
└─ 2 strings/arrays → LCS
```

---

## 💡 Conceptos Clave

### Memoization vs Tabulation

**Memoization (Top-Down):**
```typescript
function fib(n: number, memo: Map<number, number>): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    
    const result = fib(n-1, memo) + fib(n-2, memo);
    memo.set(n, result);
    return result;
}
```

**Tabulation (Bottom-Up):**
```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

---

## ⚠️ Errores Comunes

### 1. Array.fill() con Referencias

```typescript
// ❌ INCORRECTO
const dp = Array(n).fill(Array(m).fill(0));

// ✅ CORRECTO
const dp = Array(n).fill(0).map(() => Array(m).fill(0));
```

### 2. Índices Incorrectos

```typescript
// dp[i] representa el i-ésimo elemento
// Pero accedemos al array original con [i-1]

// ❌ INCORRECTO
dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i]];

// ✅ CORRECTO
dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i-1]];
```

### 3. Orden de Loops Importa

En **Coin Change II** (contar combinaciones):

```typescript
// ❌ INCORRECTO - Cuenta permutaciones
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) { }
}

// ✅ CORRECTO - Cuenta combinaciones
for (const coin of coins) {
    for (let amount = coin; amount <= target; amount++) { }
}
```

---

## 🧪 Análisis de Complejidad

### Time Complexity

| Patrón | Complejidad | Variables |
|--------|-------------|-----------|
| 0/1 Knapsack | O(n × sum) | n items, sum objetivo |
| Unbounded Knapsack | O(amount × C) | C monedas/items |
| LCS | O(M × N) | M, N longitudes strings |

### Space Complexity

Todos los patrones tienen optimizaciones:
- 2D → 1D usando rolling array
- O(n × sum) → O(sum)
- O(M × N) → O(min(M, N))

---

## 🎓 Técnicas de Optimización

### Space Optimization (0/1 Knapsack)

```typescript
// Original: O(n × sum)
const dp: boolean[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(sum + 1).fill(false));

// Optimizado: O(sum)
const dp: boolean[] = Array(sum + 1).fill(false);
dp[0] = true;

for (const num of nums) {
    // CRÍTICO: Iterar de derecha a izquierda
    for (let s = sum; s >= num; s--) {
        dp[s] = dp[s] || dp[s - num];
    }
}
```

**¿Por qué de derecha a izquierda?**
- Izquierda → Derecha: usa valores ya actualizados (incorrecto)
- Derecha → Izquierda: usa valores de iteración anterior (correcto)

---

## 📚 Estructura del Repositorio

```
dynamic_programming/
├── 0-1_knapsack/
│   ├── partition_equal_subset_sum/
│   └── target_sum/
├── unbounded_knapsack/
│   ├── coin_change/
│   └── coin_change_II/
└── lcs/
    └── longest_common_subsequence/
```

Cada problema incluye:
- `README.md` (Español) - Explicación completa
- `README_en.md` (English) - Complete explanation
- `solution.ts` - Implementación optimizada

---

## 🚀 Próximos Pasos

1. **Dominar los 3 patrones fundamentales** ✅
2. Practicar problemas adicionales
3. Aprender patrones avanzados (Palindromes, Matrix Chain)
4. Optimizar espacio en soluciones 2D

---

## 💡 Tips para Entrevistas

### Paso 1: Identificar el Patrón
```
Preguntas clave:
- ¿Cuántos arrays/strings? (1 → Knapsack, 2 → LCS)
- ¿Cuántas veces uso cada item? (1 vez → 0/1, ∞ → Unbounded)
- ¿Qué optimizo? (Posible/Formas → boolean/count, Minimizar → min)
```

### Paso 2: Definir el Estado
```
¿Qué información necesito?
- Items + capacidad → dp[i][capacity]
- Dos strings → dp[i][j]
- Solo cantidad → dp[amount]
```

### Paso 3: Encontrar la Recurrencia
```
¿Cómo se relacionan subproblemas?
- 0/1: ¿Usar o no? → dp[i-1][s] OR dp[i-1][s-num]
- Unbounded: ¿Cuántas veces? → dp[amount-coin]
- LCS: ¿Coinciden? → dp[i-1][j-1]+1 : max(...)
```

### Paso 4: Implementar y Optimizar
```
1. Escribir versión 2D clara
2. Verificar con ejemplo pequeño
3. Optimizar a 1D si es posible
4. Analizar complejidad
```

---

## 🎯 Progreso

**Patrones Dominados:** 3/3 ✅
- ✅ 0/1 Knapsack
- ✅ Unbounded Knapsack
- ✅ LCS

**Problemas Resueltos:** 5 ✅

**Target:** Febrero 2025 🎯
