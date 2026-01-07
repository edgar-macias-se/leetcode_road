# Longest Common Subsequence (LeetCode #1143)

## 🏷️ Tags

`#LCS` `#DynamicProgramming` `#Medium` `#TypeScript` `#TwoStrings` `#Subsequence`

---

## 🧠 Concepto Principal

Dados dos strings `text1` y `text2`, encontrar la longitud de la **subsecuencia común más larga**.

Una **subsecuencia** es una secuencia que se puede derivar de otra eliminando algunos (o ningún) caracteres **sin cambiar el orden** de los elementos restantes.

Este es el patrón **LCS (Longest Common Subsequence)** que compara **dos strings/arrays**.

---

## 🔑 Diferencia: Substring vs Subsequence

### Substring (Subcadena)

```
Debe ser CONSECUTIVA (sin saltos)

text = "abcde"

Substrings válidos:
  "abc" ✓ (consecutivo)
  "bcd" ✓ (consecutivo)
  "de" ✓ (consecutivo)

Substrings NO válidos:
  "ace" ✗ (tiene saltos: falta 'b' y 'd')
  "acd" ✗ (tiene saltos)
  "bd" ✗ (tiene salto)
```

### Subsequence (Subsecuencia) ⭐

```
Puede tener SALTOS, pero mantiene ORDEN

text = "abcde"

Subsequences válidos:
  "ace" ✓ (a→c→e, mantiene orden, saltos permitidos)
  "bd" ✓ (b→d, mantiene orden)
  "abcde" ✓ (completo, sin saltos)
  "e" ✓ (solo último)
  "" ✓ (vacío)
  "a" ✓ (solo primero)

Subsequences NO válidos:
  "eca" ✗ (orden invertido)
  "dba" ✗ (orden invertido)
  "cba" ✗ (orden invertido)
```

---

## 🎯 Ejemplos Visuales

### Ejemplo 1

```
text1 = "abcde"
text2 = "ace"

Buscamos caracteres comunes que mantengan el orden:

text1:  a  b  c  d  e
        ↓     ↓     ↓
text2:  a     c     e

Caracteres comunes en orden:
  'a' está en ambos ✓
  'c' está en ambos ✓ (después de 'a')
  'e' está en ambos ✓ (después de 'c')

Subsecuencia común más larga: "ace"
Longitud: 3
```

### Ejemplo 2

```
text1 = "abc"
text2 = "abc"

text1:  a  b  c
        ↓  ↓  ↓
text2:  a  b  c

Todo coincide en orden:
  'a' → 'b' → 'c'

Subsecuencia común más larga: "abc"
Longitud: 3
```

### Ejemplo 3

```
text1 = "abc"
text2 = "def"

text1:  a  b  c
        
text2:  d  e  f

No hay caracteres comunes

Subsecuencia común más larga: ""
Longitud: 0
```

---

## 🗺️ La Estrategia DP

### Diferencia con Knapsack

```
Knapsack (Un Array):
  Estado: dp[i] o dp[i][capacity]
  Pregunta: "¿Qué puedo hacer con primeros i elementos?"

LCS (Dos Strings):
  Estado: dp[i][j]
  Pregunta: "¿Cuál es el LCS de text1[0..i-1] y text2[0..j-1]?"
```

### Estado del DP

```
dp[i][j] = Longitud del LCS de text1[0..i-1] y text2[0..j-1]

Ejemplo:
  text1 = "abc"
  text2 = "ac"
  
  dp[2][1] = LCS de "ab" y "a"
           = "a"
           = longitud 1
```

### Tabla DP Inicial

```
text1 = "abc"
text2 = "ac"

    ""  a   c
""  0   0   0
a   0   ?   ?
b   0   ?   ?
c   0   ?   ?
```

**Fila 0 y columna 0 son 0 (base case):**
- dp[0][j] = 0 (text1 vacío)
- dp[i][0] = 0 (text2 vacío)

---

### Recurrencia

```
Para cada posición (i, j):

CASO 1: Caracteres COINCIDEN
  Si text1[i-1] == text2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1
    
    Interpretación:
      "Los caracteres coinciden, tomamos el LCS anterior
       y le sumamos 1 por este carácter que coincide"

CASO 2: Caracteres NO COINCIDEN
  Si text1[i-1] != text2[j-1]:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    Interpretación:
      "No coinciden, tomamos el mejor resultado de:
       - Ignorar este char de text1: dp[i-1][j]
       - Ignorar este char de text2: dp[i][j-1]"
```

---

## 💻 Implementación

```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
    const M = text1.length;
    const N = text2.length;
    
    // Crear tabla DP (M+1) × (N+1)
    const dp = Array(M + 1)
        .fill(0)
        .map(() => Array(N + 1).fill(0));
    
    // Base case ya inicializado en 0
    // dp[0][j] = 0 (text1 vacío)
    // dp[i][0] = 0 (text2 vacío)
    
    // Llenar tabla
    for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= N; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // Caracteres coinciden
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // No coinciden, tomar mejor
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[M][N];
}
```

---

## 📊 Trace Completo Paso a Paso

```typescript
Input: text1 = "abcde", text2 = "ace"

M = 5, N = 3

═══════════════════════════════════════
INICIALIZACIÓN
═══════════════════════════════════════

Tabla dp[6][4]:

       ""  a   c   e
   ""  0   0   0   0
   a   0   0   0   0
   b   0   0   0   0
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

Fila 0 y columna 0 son 0 (base case)

═══════════════════════════════════════
FILA i=1 (char 'a' de text1)
═══════════════════════════════════════

j=1: text1[0]='a', text2[0]='a'
  'a' === 'a'? SÍ ✓
  dp[1][1] = dp[0][0] + 1 = 0 + 1 = 1
  
  LCS de "a" y "a" = "a" (longitud 1)

j=2: text1[0]='a', text2[1]='c'
  'a' === 'c'? NO ✗
  dp[1][2] = max(dp[0][2], dp[1][1])
           = max(0, 1)
           = 1
  
  LCS de "a" y "ac" = "a" (longitud 1)

j=3: text1[0]='a', text2[2]='e'
  'a' === 'e'? NO ✗
  dp[1][3] = max(dp[0][3], dp[1][2])
           = max(0, 1)
           = 1
  
  LCS de "a" y "ace" = "a" (longitud 1)

Tabla después de fila 1:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   0   0   0
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

═══════════════════════════════════════
FILA i=2 (char 'b' de text1)
═══════════════════════════════════════

j=1: text1[1]='b', text2[0]='a'
  'b' === 'a'? NO
  dp[2][1] = max(dp[1][1], dp[2][0])
           = max(1, 0)
           = 1

j=2: text1[1]='b', text2[1]='c'
  'b' === 'c'? NO
  dp[2][2] = max(dp[1][2], dp[2][1])
           = max(1, 1)
           = 1

j=3: text1[1]='b', text2[2]='e'
  'b' === 'e'? NO
  dp[2][3] = max(dp[1][3], dp[2][2])
           = max(1, 1)
           = 1

Tabla después de fila 2:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   0   0   0
   d   0   0   0   0
   e   0   0   0   0

═══════════════════════════════════════
FILA i=3 (char 'c' de text1)
═══════════════════════════════════════

j=1: text1[2]='c', text2[0]='a'
  'c' === 'a'? NO
  dp[3][1] = max(dp[2][1], dp[3][0])
           = max(1, 0)
           = 1

j=2: text1[2]='c', text2[1]='c'
  'c' === 'c'? SÍ ✓
  dp[3][2] = dp[2][1] + 1
           = 1 + 1
           = 2
  
  LCS de "abc" y "ac" = "ac" (longitud 2)

j=3: text1[2]='c', text2[2]='e'
  'c' === 'e'? NO
  dp[3][3] = max(dp[2][3], dp[3][2])
           = max(1, 2)
           = 2

Tabla después de fila 3:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   0   0   0
   e   0   0   0   0

═══════════════════════════════════════
FILA i=4 (char 'd' de text1)
═══════════════════════════════════════

j=1: 'd' === 'a'? NO
  dp[4][1] = max(dp[3][1], dp[4][0]) = max(1, 0) = 1

j=2: 'd' === 'c'? NO
  dp[4][2] = max(dp[3][2], dp[4][1]) = max(2, 1) = 2

j=3: 'd' === 'e'? NO
  dp[4][3] = max(dp[3][3], dp[4][2]) = max(2, 2) = 2

Tabla después de fila 4:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   1   2   2
   e   0   0   0   0

═══════════════════════════════════════
FILA i=5 (char 'e' de text1)
═══════════════════════════════════════

j=1: 'e' === 'a'? NO
  dp[5][1] = max(dp[4][1], dp[5][0]) = max(1, 0) = 1

j=2: 'e' === 'c'? NO
  dp[5][2] = max(dp[4][2], dp[5][1]) = max(2, 1) = 2

j=3: 'e' === 'e'? SÍ ✓
  dp[5][3] = dp[4][2] + 1
           = 2 + 1
           = 3
  
  LCS de "abcde" y "ace" = "ace" (longitud 3)

Tabla FINAL:
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   1   2   2
   e   0   1   2   3
                   ↑
            RESPUESTA = 3

═══════════════════════════════════════
VERIFICACIÓN
═══════════════════════════════════════

text1 = "abcde"
text2 = "ace"

LCS = "ace"

Camino en la tabla:
  (0,0) → (1,1) 'a' coincide → +1
  (1,1) → (2,2) 'b' vs 'c' no coincide → max
  (2,2) → (3,2) 'c' coincide → +1
  (3,2) → (4,3) 'd' vs 'e' no coincide → max
  (4,3) → (5,3) 'e' coincide → +1

Resultado: 0 + 1 + 1 + 1 = 3 ✓
```

---

## 📊 Ejemplo Adicional

```typescript
Input: text1 = "abc", text2 = "def"

═══════════════════════════════════════
TABLA COMPLETA
═══════════════════════════════════════

       ""  d   e   f
   ""  0   0   0   0
   a   0   0   0   0
   b   0   0   0   0
   c   0   0   0   0

Proceso:
  Ningún carácter coincide
  Todos los dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  Siempre se copia el 0

Resultado: dp[3][3] = 0 ✓

No hay subsecuencia común
```

---

## ⚠️ Errores Comunes

### 1. Índices Incorrectos

```typescript
// ❌ INCORRECTO
if (text1[i] === text2[j]) {
    dp[i][j] = dp[i-1][j-1] + 1;
}

// Problema:
// Cuando i=M y j=N:
//   text1[M] está fuera de rango (índice máximo es M-1)
//   text2[N] está fuera de rango (índice máximo es N-1)

// ✅ CORRECTO
if (text1[i-1] === text2[j-1]) {
    dp[i][j] = dp[i-1][j-1] + 1;
}

// dp[1] representa text1[0]
// dp[2] representa text1[1]
// dp[i] representa text1[i-1]
```

### 2. Olvidar Base Case

```typescript
// ❌ INCORRECTO
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(1));  // Inicializa con 1

// ✅ CORRECTO
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(0));  // Inicializa con 0

// La fila 0 y columna 0 deben ser 0
```

### 3. Usar OR en Lugar de Max

```typescript
// ❌ INCORRECTO - Es de Knapsack (boolean)
if (text1[i-1] !== text2[j-1]) {
    dp[i][j] = dp[i-1][j] || dp[i][j-1];
}

// ✅ CORRECTO - LCS usa max
if (text1[i-1] !== text2[j-1]) {
    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
}
```

### 4. Array.fill() con Referencias

```typescript
// ❌ INCORRECTO
const dp = Array(M + 1).fill(Array(N + 1).fill(0));
// Todas las filas comparten la misma referencia

// ✅ CORRECTO
const dp = Array(M + 1).fill(0)
    .map(() => Array(N + 1).fill(0));
// Cada fila es independiente
```

---

## 🧪 Análisis Big O

### Time Complexity: O(M × N)

```
Variables:
  M = longitud de text1
  N = longitud de text2

Operaciones:
  - Llenar tabla: M filas × N columnas
  - Cada celda: O(1)

Total: O(M × N)

Ejemplo: M=5, N=3
  5 × 3 = 15 celdas a calcular
```

### Space Complexity: O(M × N)

```
Tabla dp: (M + 1) × (N + 1)

Optimización posible:
  - Reducir a O(min(M, N)) con rolling array
  - Solo necesitamos fila anterior para calcular actual
```

---

## 🎯 Reconstruir la Subsecuencia

El DP solo retorna la **longitud**. Para obtener la **subsecuencia** real:

```typescript
function getLCS(text1: string, text2: string): string {
    const M = text1.length;
    const N = text2.length;
    
    // Construir tabla dp (mismo código)
    const dp = Array(M + 1).fill(0)
        .map(() => Array(N + 1).fill(0));
    
    for (let i = 1; i <= M; i++) {
        for (let j = 1; j <= N; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruir subsecuencia (backtracking)
    let i = M, j = N;
    const lcs: string[] = [];
    
    while (i > 0 && j > 0) {
        if (text1[i-1] === text2[j-1]) {
            // Caracteres coinciden, parte del LCS
            lcs.unshift(text1[i-1]);
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            // Vino de arriba
            i--;
        } else {
            // Vino de la izquierda
            j--;
        }
    }
    
    return lcs.join('');
}
```

**Ejemplo:**
```typescript
text1 = "abcde", text2 = "ace"

Backtracking desde dp[5][3] = 3:
  (5,3): text1[4]='e' === text2[2]='e' → lcs = ['e'], ir a (4,2)
  (4,2): 'd' !== 'c', dp[3][2]=2 > dp[4][1]=1 → ir a (3,2)
  (3,2): text1[2]='c' === text2[1]='c' → lcs = ['c','e'], ir a (2,1)
  (2,1): 'b' !== 'a', dp[1][1]=1 = dp[2][0]=0 → ir a (1,1)
  (1,1): text1[0]='a' === text2[0]='a' → lcs = ['a','c','e'], ir a (0,0)
  
LCS = "ace" ✓
```

---

## 🔗 Problemas Relacionados

- Edit Distance (LC #72) - Similar pero con operaciones
- Shortest Common Supersequence (LC #1092) - Inverso de LCS
- Uncrossed Lines (LC #1035) - Mismo que LCS
- Longest Palindromic Subsequence (LC #516) - Variante de LCS

---

## 📝 Notas de Implementación

1. **Índices:** `dp[i]` usa `text1[i-1]` y `text2[j-1]`
2. **Base case:** Fila 0 y columna 0 son 0
3. **Dos casos:** Coinciden (+ 1) o No coinciden (max)
4. **Usar .map()** para crear filas independientes
5. **Retornar:** `dp[M][N]` (esquina inferior derecha)
6. **Subsecuencia ≠ Substring:** Puede tener saltos
