# Problema 3: Trapping Rain Water (LeetCode #42) 🔥

## 🧠 Concepto Clave

**Two Pointers con máximos dinámicos:** En lugar de pre-calcular arrays de máximos izquierdo/derecho (O(n) space), mantenemos variables `maxLeft` y `maxRight` que se actualizan dinámicamente. El insight clave: solo necesitamos saber qué lado es el **limitante** para calcular el agua en cada posición.

## 🗺️ La Estrategia

**Fórmula del agua en posición `i`:**
```
water[i] = min(maxLeft, maxRight) - height[i]
```

**Insight crítico:** No necesitamos conocer `maxLeft` y `maxRight` exactos de ambos lados.

1. **Si `height[left] < height[right]`:**
   - El lado limitante es `left` (porque su máximo será menor)
   - `min(maxLeft, maxRight) = maxLeft` (garantizado)
   - Calcular agua en `left` usando solo `maxLeft`
   - `left++`

2. **Si `height[right] <= height[left]`:**
   - El lado limitante es `right`
   - `min(maxLeft, maxRight) = maxRight` (garantizado)
   - Calcular agua en `right` usando solo `maxRight`
   - `right--`

**Algoritmo:**
```
1. left = 0, right = n-1
2. maxLeft = 0, maxRight = 0
3. water = 0

4. Mientras left < right:
   
   Si height[left] < height[right]:
      maxLeft = max(maxLeft, height[left])
      water += maxLeft - height[left]
      left++
   
   Sino:
      maxRight = max(maxRight, height[right])
      water += maxRight - height[right]
      right--

5. Retornar water
```

**Diagrama Visual:**
```
height = [3, 0, 2, 0, 4]

█       █
█   █   █
█ ~ █ ~ █
█~~~█~~~█

Agua en index 1: 3 units (maxLeft=3, height=0 → 3-0=3)
Agua en index 2: 1 unit  (maxLeft=3, height=2 → 3-2=1)
Agua en index 3: 3 units (maxLeft=3, height=0 → 3-0=3)

Total: 3 + 1 + 3 = 7
```

**Trace paso a paso:**
```
height = [3, 0, 2, 0, 4]
          L           R
maxLeft=0, maxRight=0, water=0

Step 1: height[L]=3 < height[R]=4
        maxLeft = max(0, 3) = 3
        water += 3 - 3 = 0
        L++ → L=1

Step 2: height[L]=0 < height[R]=4
        maxLeft = max(3, 0) = 3 (no cambia)
        water += 3 - 0 = 3
        L++ → L=2

Step 3: height[L]=2 < height[R]=4
        maxLeft = max(3, 2) = 3
        water += 3 - 2 = 1
        L++ → L=3

Step 4: height[L]=0 < height[R]=4
        maxLeft = max(3, 0) = 3
        water += 3 - 0 = 3
        L++ → L=4

Step 5: L == R → STOP
        water = 7 ✅
```

### English

**Water formula at position `i`:**
```
water[i] = min(maxLeft, maxRight) - height[i]
```

**Critical insight:** Don't need exact `maxLeft` and `maxRight` from both sides.

1. **If `height[left] < height[right]`:**
   - Limiting side is `left`
   - `min(maxLeft, maxRight) = maxLeft` (guaranteed)
   - Calculate water at `left` using only `maxLeft`
   - `left++`

2. **If `height[right] <= height[left]`:**
   - Limiting side is `right`
   - `min(maxLeft, maxRight) = maxRight` (guaranteed)
   - Calculate water at `right` using only `maxRight`
   - `right--`

## 💻 Implementación

### Versión Elegante (recomendada)
```typescript
function trap(height: number[]): number {
    if (!height || height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;
    let maxLeft = height[left];
    let maxRight = height[right];
    let water = 0;

    while (left < right) {
        if (maxLeft < maxRight) {
            left++;
            maxLeft = Math.max(height[left], maxLeft);
            water += maxLeft - height[left];
        } else {
            right--;
            maxRight = Math.max(height[right], maxRight);
            water += maxRight - height[right];
        }
    }
    
    return water;
}
```

**¿Por qué funciona `Math.max` + agregar siempre?**
- Si `height[left]` es un pico nuevo: `maxLeft` se actualiza, `water += 0` (no se agrega agua)
- Si `height[left]` está bajo agua: `maxLeft` no cambia, `water += diferencia` (se agrega agua)

### Versión Verbose (más clara conceptualmente)
```typescript
function trap(height: number[]): number {
    if (!height || height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left]; // Actualizar máximo
            } else {
                water += maxLeft - height[left]; // Agregar agua
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right]; // Actualizar máximo
            } else {
                water += maxRight - height[right]; // Agregar agua
            }
            right--;
        }
    }
    
    return water;
}
```

## ⚠️ Errores Comunes

### 1. **Usar arrays auxiliares de máximos (O(n) space)**
```typescript
// ❌ INEFICIENTE - O(n) space
const leftMax = new Array(n);
const rightMax = new Array(n);
// Pre-calcular máximos...

// ✅ EFICIENTE - O(1) space
// Usar variables maxLeft y maxRight que se actualizan dinámicamente
```

### 2. **Confundir cuándo usar maxLeft vs maxRight**
```typescript
// ❌ INCORRECTO
if (height[left] < height[right]) {
    water += maxRight - height[left]; // Usar el max incorrecto
}

// ✅ CORRECTO
if (height[left] < height[right]) {
    water += maxLeft - height[left]; // Usar maxLeft porque left es limitante
}
```

**Regla:** Si procesas `left`, usa `maxLeft`. Si procesas `right`, usa `maxRight`.

### 3. **Olvidar mover el puntero**
```typescript
// ❌ LOOP INFINITO
if (height[left] < height[right]) {
    maxLeft = Math.max(height[left], maxLeft);
    water += maxLeft - height[left];
    // left++; ← FALTA ESTO
}

// ✅ CORRECTO - Siempre mover el puntero
```

### 4. **Intentar calcular agua en ambos lados simultáneamente**
```typescript
// ❌ INCORRECTO - No puedes calcular ambos a la vez
water += (maxLeft - height[left]) + (maxRight - height[right]);

// ✅ CORRECTO - Solo calcular en el lado limitante
```

## 🧪 Análisis Big O

- **Time:** O(n) - Un solo recorrido con dos punteros convergiendo
- **Space:** O(1) - Solo variables escalares (left, right, maxLeft, maxRight, water)

**Comparación con otros approaches:**

| Approach | Time | Space | Notas |
|----------|------|-------|-------|
| Brute Force | O(n²) | O(1) | Para cada i, buscar max izq/der |
| Arrays auxiliares | O(n) | O(n) | Pre-calcular leftMax[], rightMax[] |
| **Two Pointers** | **O(n)** | **O(1)** | **Óptimo** ✅ |
| Stack | O(n) | O(n) | Otro approach válido pero más espacio |