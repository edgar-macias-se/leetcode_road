# Partition Equal Subset Sum (LeetCode #416)

## 🏷️ Tags

`#0/1Knapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#SubsetSum`

---

## 🧠 Concepto Principal

Dado un array de enteros positivos, determinar si se puede particionar en dos subsets con **suma igual**.

Este es un problema clásico de **0/1 Knapsack** porque cada número se puede usar **0 o 1 vez** (una sola vez).

---

## 🗺️ La Estrategia

### Transformación del Problema

```
Problema original:
  ¿Puedo dividir el array en dos subsets con suma igual?

Observación:
  Si suma total = S
  Si divido en dos partes iguales:
    Parte 1 + Parte 2 = S
    Parte 1 = Parte 2 = S/2

Problema transformado:
  ¿Existe un subset que sume exactamente S/2?
```

### Validaciones Iniciales

```
1. Si suma total es IMPAR → Imposible
   Ejemplo: [1, 2, 4] → suma = 7
   No se puede dividir 7 en dos partes iguales

2. Si suma total es PAR → Buscar subset que sume S/2
   Ejemplo: [1, 5, 11, 5] → suma = 22
   ¿Existe subset que sume 11?
```

### Estado del DP

```
dp[i][s] = ¿Es posible hacer suma 's' usando los primeros 'i' números?

Dimensiones:
  i: de 0 a n (número de elementos considerados)
  s: de 0 a target (sumas posibles)

Ejemplo:
  nums = [1, 5, 11, 5], target = 11
  dp[2][6] = ¿Puedo hacer suma 6 con {1, 5}?
```

### Recurrencia

```
Para cada número nums[i-1]:

Opción 1: NO usar este número
  dp[i][s] = dp[i-1][s]
  (Copiamos el resultado sin este número)

Opción 2: SÍ usar este número (si cabe)
  Si nums[i-1] <= s:
    dp[i][s] = dp[i-1][s - nums[i-1]]
    (¿Podía hacer el resto sin este número?)

Combinado:
  dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i-1]]
```

### Caso Base

```
dp[i][0] = true  (para todo i)

¿Por qué?
  Siempre puedo hacer suma 0 con el subset vacío {}
```

---

## 💻 Implementación

```typescript
function canPartition(nums: number[]): boolean {
    // 1. Calcular suma total
    const totalSum = nums.reduce((a, b) => a + b, 0);
    
    // 2. Si suma impar, imposible
    if (totalSum % 2 !== 0) return false;
    
    const target = totalSum / 2;
    const n = nums.length;
    
    // 3. Crear tabla DP
    const dp: boolean[][] = Array(n + 1)
        .fill(0)
        .map(() => Array(target + 1).fill(false));
    
    // 4. Base case: suma 0 siempre posible
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    // 5. Llenar tabla
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        
        for (let s = 0; s <= target; s++) {
            // Opción 1: NO usar este número
            dp[i][s] = dp[i - 1][s];
            
            // Opción 2: SÍ usar este número (si cabe)
            if (num <= s) {
                const resto = s - num;
                if (dp[i - 1][resto]) {
                    dp[i][s] = true;
                }
            }
        }
    }
    
    // 6. Respuesta final
    return dp[n][target];
}
```

---

## 📊 Ejemplo de Trace

```typescript
Input: nums = [1, 5, 11, 5]

Step 1: totalSum = 22, target = 11

Step 2: Inicializar tabla dp[5][12]

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=0     T   F   F   F   F   F   F   F   F   F   F   F
i=1     T   ?   ?   ?   ?   ?   ?   ?   ?   ?   ?   ?

Step 3: Procesar nums[0] = 1

dp[1][1]: nums[0]=1 <= 1? SÍ
  dp[1][1] = dp[0][0] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=1     T   T   F   F   F   F   F   F   F   F   F   F

Step 4: Procesar nums[1] = 5

dp[2][5]: nums[1]=5 <= 5? SÍ
  dp[2][5] = dp[1][0] = T

dp[2][6]: nums[1]=5 <= 6? SÍ
  dp[2][6] = dp[1][1] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=2     T   T   F   F   F   T   T   F   F   F   F   F

Step 5: Procesar nums[2] = 11

dp[3][11]: nums[2]=11 <= 11? SÍ
  dp[3][11] = dp[2][0] = T

    s:  0   1   2   3   4   5   6   7   8   9  10  11
i=3     T   T   F   F   F   T   T   F   F   F   F   T

Step 6: Procesar nums[3] = 5

dp[4][11]: nums[3]=5 <= 11? SÍ
  Sin usar 5: dp[3][11] = T
  Usando 5: dp[3][6] = T
  dp[4][11] = T OR T = T

Resultado: dp[4][11] = true ✓

Subsets válidos que suman 11:
  - {1, 5, 5}
  - {11}
```

---

## ⚠️ Errores Comunes

### 1. Valor de n Incorrecto

```typescript
// ❌ INCORRECTO
let n = nums.length - 1;  // Si length=4, n=3

// ✅ CORRECTO
let n = nums.length;  // Si length=4, n=4
// dp necesita n+1 filas (0, 1, 2, 3, 4)
```

### 2. Array.fill() Crea Referencias

```typescript
// ❌ INCORRECTO - Todas las filas comparten referencia
let dp = new Array(n+1).fill(new Array(target + 1).fill(false));

// ✅ CORRECTO - Cada fila es independiente
let dp: boolean[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(target + 1).fill(false));
```

### 3. Índice de nums Incorrecto

```typescript
// ❌ INCORRECTO
for(let i = 1; i <= n; i++){
    if(nums[i] > s){  // nums[i] fuera de rango
        //...
    }
}

// ✅ CORRECTO
for(let i = 1; i <= n; i++){
    if(nums[i - 1] > s){  // nums[i-1]
        // dp[1] usa nums[0]
        // dp[2] usa nums[1]
        // dp[i] usa nums[i-1]
    }
}
```

---

## 🧪 Análisis Big O

### Time Complexity: O(n × sum)

```
Variables:
  n = longitud del array
  sum = totalSum / 2

Operaciones:
  - Llenar tabla: n filas × sum columnas
  - Cada celda: O(1)

Total: O(n × sum)
```

### Space Complexity: O(n × sum)

```
Tabla dp: (n + 1) × (sum + 1)

Optimización posible:
  - Reducir a O(sum) usando 1D array
  - Iterar de derecha a izquierda
```

---

## 🎯 Optimización: Space O(sum)

```typescript
function canPartitionOptimized(nums: number[]): boolean {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    
    const target = sum / 2;
    const dp: boolean[] = Array(target + 1).fill(false);
    dp[0] = true;
    
    // CRÍTICO: Iterar de derecha a izquierda
    for (const num of nums) {
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
    }
    
    return dp[target];
}
```

**¿Por qué de derecha a izquierda?**

```
Si iteramos izquierda → derecha:
  dp[1] se actualiza usando dp[0]
  dp[2] se actualiza usando dp[1] YA ACTUALIZADO ❌
  (Estaríamos usando el mismo número múltiples veces)

Si iteramos derecha → izquierda:
  dp[2] se actualiza usando dp[1] SIN ACTUALIZAR ✓
  dp[1] se actualiza usando dp[0]
  (Cada número se usa máximo una vez)
```

---

## 🔗 Problemas Relacionados

- Target Sum (LC #494) - Mismo patrón con transformación
- Subset Sum - Variante directa
- Last Stone Weight II (LC #1049) - Minimización con mismo concepto

---

## 📝 Notas de Implementación

1. **Siempre validar suma par** antes de crear la tabla DP
2. **Usar .map()** para crear arrays independientes
3. **Índices correctos:** `dp[i]` usa `nums[i-1]`
4. **Base case importante:** `dp[i][0] = true`
5. **Optimización de espacio** es aplicable y muy elegante
