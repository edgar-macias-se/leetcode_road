# Problema 3: Continuous Subarray Sum (LeetCode #523) 🔥

## 🧠 Concepto Clave

**Prefix Sum + HashMap + Módulo:** Usa la propiedad matemática: si `(a - b) % k == 0`, entonces `a % k == b % k`. Almacenamos índices (no frecuencias) para validar que el subarray tenga longitud >= 2. Solo guardamos la **primera** aparición de cada remainder para maximizar la distancia.


## 🗺️ La Estrategia

### Español

**Propiedad Matemática del Módulo:**
```
Si (a - b) % k == 0
Entonces: a % k == b % k
```

**Aplicando a Prefix Sums:**
```
Queremos: sum[left, right] % k == 0
Con prefix: (prefix[right] - prefix[left-1]) % k == 0

Por la propiedad:
prefix[right] % k == prefix[left-1] % k
```

**Estrategia con HashMap:**
```
En el índice i:
- remainder = prefixSum % k
- ¿Este remainder apareció antes?
- Si SÍ y distancia >= 2: return true
```

**¿Por qué Índices y NO Frecuencias?**
```
Necesitamos validar: length >= 2

Con índices:
  map = {5: 0}  // remainder=5 en índice 0
  En i=2: distancia = 2 - 0 = 2 >= 2 ✅

Con frecuencias:
  map = {5: 3}  // apareció 3 veces
  ¿Cómo sabes la distancia? ❌
```

**¿Por qué Solo la PRIMERA Aparición?**
```
Guardar primera aparición → maximiza distancia

nums = [1, 2, 3], k = 6

Si guardamos primera: map[1] = 0
  En i=2: 2 - 0 = 2 >= 2 ✅

Si guardamos última: map[1] = 2
  En i=3: 3 - 2 = 1 < 2 ❌
```

**Inicialización `{0: -1}`:**

El `-1` representa "antes del inicio del array" (ficticio).

Permite detectar subarrays desde índice 0:
```
nums = [2, 4], k = 6

i=0: remainder=2, map={0:-1, 2:0}
i=1: remainder=(2+4)%6=0
     Existe 0 en índice -1
     Distancia: 1 - (-1) = 2 >= 2 ✅
     Subarray: [2, 4] ✅
```

**Edge Case: k = 0**

No se puede hacer `% 0` (división por cero).

Solución especial: El único múltiplo de 0 es 0.
```
Buscar dos ceros consecutivos:
nums = [0, 0] → true
nums = [1, 0] → false
```

**Algoritmo:**
```
1. Si k == 0:
      Buscar dos ceros consecutivos
      
2. map = {0: -1}

3. prefixSum = 0

4. Para cada i:
      prefixSum += nums[i]
      remainder = prefixSum % k
      
      Si map.has(remainder):
         Si (i - map[remainder]) >= 2:
            return true
      Sino:  ← Solo guardar si NO existe
         map.set(remainder, i)
         
5. return false
```

**Ejemplo Completo:**
```
nums = [23, 2, 4, 6, 7], k = 6

prefix = [23, 25, 29, 35, 42]
remainders = [5, 1, 5, 5, 0]

i=0: remainder=5, map={0:-1, 5:0}
i=1: remainder=1, map={0:-1, 5:0, 1:1}
i=2: remainder=5, existe en i=0
     Distancia: 2 - 0 = 2 >= 2 ✅
     Subarray: [2, 4] suma 6 ✅
     return true
```

## 💻 Implementación

```typescript
function checkSubarraySum(nums: number[], k: number): boolean {
    // Edge case: k = 0 (no se puede hacer módulo 0)
    if (k === 0) {
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] === 0 && nums[i + 1] === 0) {
                return true;
            }
        }
        return false;
    }
    
    // Inicializar map con {0: -1} para subarrays desde el inicio
    const map = new Map<number, number>();
    map.set(0, -1);
    
    let prefixSum = 0;
    
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        const remainder = prefixSum % k;
        
        if (map.has(remainder)) {
            // Validar longitud >= 2
            if (i - map.get(remainder)! >= 2) {
                return true;
            }
        } else {
            // Solo guardar la PRIMERA aparición
            map.set(remainder, i);
        }
    }
    
    return false;
}
```

## ⚠️ Errores Comunes

### 1. **Return prematuro en edge case k = 0**
```typescript
// ❌ INCORRECTO - Retorna en primera iteración
if (k === 0) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0 && nums[i + 1] === 0) {
            return true;
        }
        return false;  // ← BUG: Retorna sin revisar todo
    }
}

// ✅ CORRECTO - Return fuera del loop
if (k === 0) {
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === 0 && nums[i + 1] === 0) {
            return true;
        }
    }
    return false;  // ← Fuera del loop
}
```

### 2. **Out of bounds en edge case**
```typescript
// ❌ INCORRECTO
for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0 && nums[i + 1] === 0) {
        // nums[i+1] puede estar fuera de bounds
    }
}

// ✅ CORRECTO
for (let i = 0; i < nums.length - 1; i++) {
//                                ^^^^
    if (nums[i] === 0 && nums[i + 1] === 0) {
        // Seguro: i+1 siempre existe
    }
}
```

### 3. **Actualizar índices en lugar de solo guardar primero**
```typescript
// ❌ INCORRECTO - Actualiza siempre
if (map.has(remainder)) {
    if (i - map.get(remainder)! >= 2) {
        return true;
    }
}
map.set(remainder, i);  // Siempre actualiza

// ✅ CORRECTO - Solo guarda si no existe
if (map.has(remainder)) {
    if (i - map.get(remainder)! >= 2) {
        return true;
    }
} else {  // ← Solo en else
    map.set(remainder, i);
}
```

### 4. **Almacenar frecuencias en lugar de índices**
```typescript
// ❌ INCORRECTO - No puedes validar distancia
const map = new Map<number, number>();
map.set(remainder, (map.get(remainder) || 0) + 1);

// ✅ CORRECTO - Almacena índices
map.set(remainder, i);
```

### 5. **Inicializar con {0: 0} en lugar de {0: -1}**
```typescript
// ❌ INCORRECTO
map.set(0, 0);

nums = [6, 3], k = 6
i=0: remainder=0, existe en 0
     0 - 0 = 0 < 2 ❌ (debería ser >= 2)

// ✅ CORRECTO
map.set(0, -1);

nums = [6, 3], k = 6
i=0: remainder=0, existe en -1
     0 - (-1) = 1 < 2 ✅ (correcto, no cuenta)
```

## 🧪 Análisis Big O

- **Time:** O(n) - Un recorrido del array
- **Space:** O(min(n, k)) - HashMap puede tener hasta k remainders únicos

**Comparación con brute force:**

| Approach | Time | Space |
|----------|------|-------|
| Brute Force | O(n²) | O(1) |
| **Prefix Sum + HashMap** | **O(n)** | **O(k)** ✅ |

---

## 🎓 Prefix Sums Pattern - Resumen

### Variantes del Patrón

**1. Prefix Sum Básico (Range Query):**
- Pre-calcular sumas acumuladas
- Responder queries O(1)
- Usar padding para evitar casos especiales

**2. Prefix Sum + HashMap (Subarray con suma específica):**
- Buscar `prefixSum - target` en el map
- Almacenar frecuencias (no índices)
- Inicializar `{0: 1}` para subarrays desde inicio

**3. Prefix Sum + HashMap + Módulo (Múltiplos):**
- Usar propiedad: `(a-b) % k == 0` ⟺ `a % k == b % k`
- Almacenar índices (no frecuencias)
- Solo guardar primera aparición
- Validar longitud mínima

---

### Templates Reutilizables

**Template 1: Range Query**
```typescript
class PrefixSum {
    private prefix: number[];
    
    constructor(arr: number[]) {
        this.prefix = new Array(arr.length + 1);
        this.prefix[0] = 0;
        for (let i = 0; i < arr.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + arr[i];
        }
    }
    
    rangeSum(left: number, right: number): number {
        return this.prefix[right + 1] - this.prefix[left];
    }
}
```

**Template 2: Subarray Sum con Target**
```typescript
function subarrayWithTarget(arr: number[], target: number): number {
    const map = new Map<number, number>();
    map.set(0, 1);
    
    let prefixSum = 0, count = 0;
    
    for (const num of arr) {
        prefixSum += num;
        if (map.has(prefixSum - target)) {
            count += map.get(prefixSum - target)!;
        }
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

**Template 3: Subarray Múltiplo de k**
```typescript
function subarrayDivisibleByK(arr: number[], k: number): boolean {
    const map = new Map<number, number>();
    map.set(0, -1);
    
    let prefixSum = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];
        const remainder = prefixSum % k;
        
        if (map.has(remainder)) {
            if (i - map.get(remainder)! >= minLength) {
                return true;
            }
        } else {
            map.set(remainder, i);
        }
    }
    
    return false;
}
```

---

### Cuándo Usar Prefix Sums

✅ **Usa este patrón cuando:**
- Necesitas responder **múltiples queries** de suma en rangos
- Buscas subarrays con **suma específica**
- Necesitas encontrar subarrays cuya suma sea **múltiplo de k**
- El problema involucra **sumas acumuladas** o **diferencias de rangos**
- Quieres optimizar de O(n × q) a O(n + q) para q queries

❌ **NO uses este patrón cuando:**
- Solo hay **una query** (no justifica pre-procesamiento)
- El array cambia frecuentemente (prefix se invalida)
- Necesitas **maximum/minimum** en rangos (usa Segment Tree)
- Buscas subarrays **no contiguos**

---

### Diferencias Clave Entre Variantes

| Aspecto | Range Query | Sum = K | Múltiplo de K |
|---------|-------------|---------|---------------|
| HashMap | No usa | Sí (frecuencias) | Sí (índices) |
| Inicialización | `prefix[0] = 0` | `map.set(0, 1)` | `map.set(0, -1)` |
| Búsqueda | No aplica | `prefixSum - k` | `prefixSum % k` |
| Retorna | Suma | Count | Boolean |
| Validación extra | No | No | Length >= 2 |

---

### Progresión Completa

- [x] **Easy:** Range Sum Query - Immutable (#303) - Prefix sum básico con padding
- [x] **Medium:** Subarray Sum Equals K (#560) - Prefix sum + HashMap con frecuencias
- [x] **Hard:** Continuous Subarray Sum (#523) - Prefix sum + HashMap + Módulo con índices

**Estado:** 🏆 **PATRÓN DOMINADO** - 3/3 completo

---

### Tips de Implementación

1. **Padding siempre:** Usar `prefix[0] = 0` evita casos especiales
2. **HashMap según objetivo:**
   - Contar subarrays → Frecuencias
   - Validar longitud → Índices
3. **Inicialización correcta:**
   - `{0: 1}` para conteo desde inicio
   - `{0: -1}` para validación de longitud
4. **Módulo negativo:** En algunos lenguajes, `(-5) % 3 = -2`, usar `((n % k) + k) % k` para forzar positivo
5. **Edge cases de k = 0:** Manejar antes de operaciones de módulo
