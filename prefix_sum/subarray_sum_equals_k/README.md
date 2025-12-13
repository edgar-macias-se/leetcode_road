# Problema 2: Subarray Sum Equals K (LeetCode #560)

## 🧠 Concepto Clave

**Prefix Sum + HashMap:** Combina prefix sums con un HashMap para encontrar subarrays con suma específica en O(n). La clave es reformular el problema: en lugar de buscar `sum[left, right] = k`, buscamos cuántas veces apareció `prefixSum - k` anteriormente.

## 🗺️ La Estrategia

**Reformulación del Problema:**

Queremos: `sum[left, right] = k`

Con prefix sums:
```
prefix[right] - prefix[left-1] = k
```

Reorganizando:
```
prefix[left-1] = prefix[right] - k
```

**En el índice i (nuestro "right"):**
```
Buscamos: ¿Cuántas veces apareció (prefix[i] - k) ANTES?
Cada aparición = un subarray que termina en i con suma k
```

**HashMap almacena:**
- **Key:** Suma prefix
- **Value:** Cuántas veces apareció esa suma

**¿Por qué frecuencias?**
```
nums = [1, -1, 1, -1, 1], k = 0

prefix = [1, 0, 1, 0, 1]

En i=3: prefix=0, buscamos 0-0=0
        0 apareció 2 veces antes (en inicio y en i=1)
        → Hay 2 subarrays que terminan en i=3 con suma 0
```

**Inicialización `{0: 1}`:**

Representa "suma 0 apareció 1 vez antes de empezar" (subarray vacío ficticio).

Permite detectar subarrays desde el inicio:
```
nums = [3], k = 3

i=0: prefix=3, buscamos 3-3=0
     ¿Existe 0? SÍ (inicialización) → count = 1
     Subarray: [3] desde inicio ✅
```

**Algoritmo:**
```
1. map = {0: 1}
2. prefixSum = 0, count = 0

3. Para cada num:
   prefixSum += num
   
   Si map.has(prefixSum - k):
      count += map.get(prefixSum - k)  ← Agregar FRECUENCIA
   
   map.set(prefixSum, (map.get(prefixSum) || 0) + 1)
   
4. Retornar count
```

**Por qué agregar frecuencia y NO solo incrementar count:**
```
Si (prefixSum - k) apareció 3 veces, hay 3 subarrays diferentes
que terminan en la posición actual con suma k.
```

**Visualización de Cancelación:**
```
prefix[5] - prefix[2] = ?

prefix[5] = [1 + 2 + 3 + 4 + 5 + 6]
prefix[2] = [1 + 2 + 3]

Resta: [1+2+3+4+5+6] - [1+2+3] = [4+5+6]
       ↑ Se cancelan ↑

= suma del subarray [3, 5] (índices)
```

## 💻 Implementación

```typescript
function subarraySum(nums: number[], k: number): number {
    const map = new Map<number, number>();
    map.set(0, 1);  // Inicializar para subarrays desde el inicio
    
    let prefixSum = 0;
    let count = 0;
    
    for (const num of nums) {
        prefixSum += num;
        
        // Buscar cuántas veces apareció (prefixSum - k)
        if (map.has(prefixSum - k)) {
            count += map.get(prefixSum - k)!;  // Agregar FRECUENCIA
        }
        
        // Incrementar frecuencia de prefixSum actual
        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }
    
    return count;
}
```

## ⚠️ Errores Comunes

### 1. **Solo incrementar count en lugar de agregar frecuencia**
```typescript
// ❌ INCORRECTO
if (map.has(prefixSum - k)) {
    count++;  // Solo cuenta 1, ignora múltiples apariciones
}

// ✅ CORRECTO
if (map.has(prefixSum - k)) {
    count += map.get(prefixSum - k)!;  // Agrega todas las apariciones
}
```

**Ejemplo del error:**
```
nums = [1, -1, 0], k = 0

Con count++:
  Resultado: 2 ❌
  
Con count += frecuencia:
  Resultado: 3 ✅
  
Subarrays correctos: [1,-1], [0], [1,-1,0]
```

### 2. **Almacenar índices en lugar de frecuencias**
```typescript
// ❌ INCORRECTO - Pierde información de apariciones múltiples
map.set(prefixSum, i);  // Solo guardas el último índice

// ✅ CORRECTO - Guarda frecuencias
map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
```

### 3. **Olvidar inicializar `{0: 1}`**
```typescript
// ❌ INCORRECTO
const map = new Map<number, number>();  // Vacío

nums = [3], k = 3
i=0: prefix=3, buscar 0
     No existe → count = 0 ❌ (perdemos [3])

// ✅ CORRECTO
const map = new Map<number, number>();
map.set(0, 1);  // Para subarrays desde el inicio
```

### 4. **Confundir qué buscar**
```typescript
// ❌ INCORRECTO
if (map.has(k - prefixSum)) { ... }

// ✅ CORRECTO
if (map.has(prefixSum - k)) { ... }
```

**Demostración:**
```
Queremos: sum[left, right] = k
Con prefix: prefix[right] - prefix[left-1] = k
Despejamos: prefix[left-1] = prefix[right] - k
                              ↑ esto es prefixSum

Buscamos: prefixSum - k (NO k - prefixSum)
```

## 🧪 Análisis Big O

- **Time:** O(n) - Un recorrido del array
- **Space:** O(n) - HashMap puede tener hasta n entradas únicas
