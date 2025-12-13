# Problema 1: Range Sum Query - Immutable (LeetCode #303)

## 🧠 Concepto Clave

**Prefix Sum** (suma de prefijos o suma acumulada) es una técnica de pre-procesamiento que permite responder queries de suma en rangos en **O(1)** después de un setup inicial de O(n). En lugar de recalcular la suma cada vez, pre-calculamos todas las sumas desde el inicio hasta cada índice.

## 🗺️ La Estrategia


**Construcción del Prefix Array:**
```
Original:     [3,  2,  1,  4,  5]
Prefix Sum:   [3,  5,  6, 10, 15]
              ↑   ↑   ↑   ↑   ↑
              3  3+2 5+1 6+4 10+5
```

**Fórmula de Construcción:**
```
prefix[i] = suma de todos los elementos desde índice 0 hasta i (inclusive)

prefix[0] = arr[0]
prefix[1] = prefix[0] + arr[1]
prefix[i] = prefix[i-1] + arr[i]
```

**Cálculo de Suma en Rango:**
```
sum[left, right] = prefix[right] - prefix[left-1]

Ejemplo:
arr = [3, 2, 1, 4, 5]
prefix = [3, 5, 6, 10, 15]

sum[1, 3] = suma de índices [1, 2, 3] = 2 + 1 + 4 = 7
          = prefix[3] - prefix[0]
          = 10 - 3 = 7 ✅
```

**Problema con left = 0:**
```
sum[0, 2] = prefix[2] - prefix[-1]  ❌ Out of bounds!
```

**Solución: Padding con 0 al inicio**
```
nums =    [-2,  0,  3, -5,  2, -1]
prefix = [0, -2, -2,  1, -4, -2, -3]  ← Agregamos 0 al inicio
          ↑
       índice ficticio

Ahora SIEMPRE funciona:
sum[0, 2] = prefix[3] - prefix[0] = 1 - 0 = 1 ✅
sum[2, 5] = prefix[6] - prefix[2] = -3 - (-2) = -1 ✅
```

**Con padding, los índices se desplazan:**
- `prefix[i+1]` = suma desde 0 hasta i en el array original
- `sumRange(left, right) = prefix[right+1] - prefix[left]`

## 💻 Implementación

```typescript
class NumArray {
    private prefix: number[];
    
    constructor(nums: number[]) {
        // Crear prefix array con padding (tamaño n+1)
        this.prefix = new Array<number>(nums.length + 1);
        this.prefix[0] = 0;  // Padding inicial
        
        // Construir prefix sums
        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        // Fórmula simple sin casos especiales
        return this.prefix[right + 1] - this.prefix[left];
    }
}
```

**Alternativa sin padding (menos elegante):**
```typescript
class NumArray {
    private prefix: number[];
    
    constructor(nums: number[]) {
        this.prefix = new Array(nums.length);
        this.prefix[0] = nums[0];
        for (let i = 1; i < nums.length; i++) {
            this.prefix[i] = this.prefix[i-1] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        if (left === 0) {
            return this.prefix[right];  // Caso especial
        }
        return this.prefix[right] - this.prefix[left - 1];
    }
}
```

## ⚠️ Errores Comunes

### 1. **No usar padding y olvidar el caso especial `left = 0`**
```typescript
// ❌ INCORRECTO - Falla cuando left = 0
sumRange(left, right) {
    return this.prefix[right] - this.prefix[left - 1];
    // Si left = 0 → this.prefix[-1] ❌ Out of bounds!
}

// ✅ CORRECTO - Con padding
this.prefix = new Array(nums.length + 1);
this.prefix[0] = 0;
// Ahora prefix[left] siempre existe
```

### 2. **Confundir índices con padding**
```typescript
// Con padding, prefix tiene tamaño n+1
// prefix[i] = suma desde 0 hasta i-1 en nums

// ❌ INCORRECTO
this.prefix[i] = this.prefix[i-1] + nums[i];  // Desfase de índices

// ✅ CORRECTO
this.prefix[i+1] = this.prefix[i] + nums[i];
```

### 3. **Usar bucle for-of con índices**
```typescript
// ❌ INCORRECTO - Pierdes el índice
for (const num of nums) {
    this.prefix[i+1] = this.prefix[i] + num;  // i no está definido
}

// ✅ CORRECTO
for (let i = 0; i < nums.length; i++) {
    this.prefix[i+1] = this.prefix[i] + nums[i];
}
```

## 🧪 Análisis Big O

- **Constructor:** O(n) - Un recorrido del array para construir prefix
- **sumRange:** O(1) - Una resta
- **Space:** O(n) - Array prefix de tamaño n+1

**Comparación:**

| Approach | Constructor | sumRange | 10,000 queries |
|----------|-------------|----------|----------------|
| Brute Force | O(1) | O(n) | O(10^8) ❌ |
| **Prefix Sum** | **O(n)** | **O(1)** | **O(n + 10^4)** ✅ |

---




