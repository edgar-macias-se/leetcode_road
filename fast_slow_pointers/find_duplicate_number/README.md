# Problema 3: Find the Duplicate Number (LeetCode #287) 🔥

## 🧠 Concepto Clave

**Fast & Slow en Array:** Este problema usa una transformación brillante: trata el array como una **linked list implícita** donde cada valor es un puntero al siguiente índice. El número duplicado crea un ciclo. Aplicamos Floyd's Cycle Detection en el array para encontrar el inicio del ciclo, que es el número duplicado.

## 🗺️ La Estrategia

### Español

**El Problema:**
- Array de `n + 1` elementos
- Valores en rango `[1, n]`
- **Pigeonhole Principle:** 5 elementos en 4 "cajones" → al menos uno se repite

**Restricciones que eliminan soluciones simples:**
- ❌ No modificar el array (elimina sorting, marcar negativos)
- ❌ O(1) espacio (elimina HashSet)

**La Transformación Clave: Array → Linked List**

Cada valor es un índice válido (porque `1 <= nums[i] <= n`):
```
nums[i] → nums[nums[i]]
```

**Ejemplo:**
```
nums = [1, 3, 4, 2, 2]
índice: 0  1  2  3  4

Como "linked list":
índice 0 → valor 1 → índice 1 → valor 3 → índice 3 → valor 2 → índice 2 → valor 4 → índice 4 → valor 2 → índice 2...

Camino: 0 → 1 → 3 → 2 → 4 → 2 → 4 → 2...
                      ↑________|
                      Ciclo!
```

**¿Por qué el duplicado crea un ciclo?**

Si el número `2` aparece dos veces (en índices 3 y 4):
- Ambas ocurrencias apuntan al mismo índice siguiente (índice 2)
- Esto crea convergencia → ciclo
- El inicio del ciclo es el índice al que múltiples valores apuntan
- Ese índice es el número duplicado

**Diferencia con Linked List Cycle II:**

1. **Inicialización:** Empezamos en índice 0 (no en head)
   - Índice 0 nunca es parte del ciclo (valores están en [1, n])

2. **Movimiento:** Usamos valores como índices
   ```typescript
   slow = nums[slow]
   fast = nums[nums[fast]]
   ```

3. **Fase 1:** Usamos `do-while` (no `while`)
   ```typescript
   // ❌ Con while: slow = 0, fast = 0 → no entra al loop
   while (slow !== fast) { ... }
   
   // ✅ Con do-while: ejecuta primero, luego compara
   do { ... } while (slow !== fast)
   ```

**Algoritmo Completo:**
```
Fase 1: Detectar ciclo
─────────────────────
slow = 0
fast = 0

do {
    slow = nums[slow]
    fast = nums[nums[fast]]
} while (slow !== fast)

Fase 2: Encontrar inicio (el duplicado)
────────────────────────────────────
ptr1 = 0
ptr2 = slow (punto de encuentro)

while (ptr1 !== ptr2) {
    ptr1 = nums[ptr1]
    ptr2 = nums[ptr2]
}

return ptr1  (el número duplicado)
```

**Visualización completa:**
```
nums = [1, 3, 4, 2, 2]
        0  1  2  3  4

FASE 1:
──────
slow = 0, fast = 0

Iteración 1:
slow = nums[0] = 1
fast = nums[nums[0]] = nums[1] = 3

Iteración 2:
slow = nums[1] = 3
fast = nums[nums[3]] = nums[2] = 4

Iteración 3:
slow = nums[3] = 2
fast = nums[nums[4]] = nums[2] = 4

Iteración 4:
slow = nums[2] = 4
fast = nums[nums[4]] = nums[2] = 4

slow === fast (ambos en 4) ✅

FASE 2:
──────
ptr1 = 0
ptr2 = 4

Iteración 1:
ptr1 = nums[0] = 1
ptr2 = nums[4] = 2

Iteración 2:
ptr1 = nums[1] = 3
ptr2 = nums[2] = 4

Iteración 3:
ptr1 = nums[3] = 2
ptr2 = nums[4] = 2

ptr1 === ptr2 (ambos en 2) ✅

Resultado: 2
```

## 💻 Implementación

```typescript
function findDuplicate(nums: number[]): number {
    let slow = 0;
    let fast = 0;
    
    // Fase 1: Detectar ciclo (usar do-while)
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Fase 2: Encontrar inicio del ciclo (el duplicado)
    let ptr1 = 0;
    let ptr2 = slow;
    
    while (ptr1 !== ptr2) {
        ptr1 = nums[ptr1];
        ptr2 = nums[ptr2];
    }
    
    return ptr1;
}
```

## ⚠️ Errores Comunes

### 1. **Usar `while` en lugar de `do-while` en Fase 1**
```typescript
// ❌ INCORRECTO
slow = 0;
fast = 0;
while (slow !== fast) {  // No entra porque slow === fast (ambos 0)
    slow = nums[slow];
    fast = nums[nums[fast]];
}

// ✅ CORRECTO
do {
    slow = nums[slow];
    fast = nums[nums[fast]];
} while (slow !== fast);  // Ejecuta primero, luego compara
```

### 2. **Confundir índices con valores**
```typescript
// ❌ INCORRECTO - Avanza como en linked list
slow = slow.next;
fast = fast.next.next;

// ✅ CORRECTO - Usa valores como índices
slow = nums[slow];
fast = nums[nums[fast]];
```

### 3. **Inicializar en índice diferente de 0**
```typescript
// ❌ INCORRECTO
slow = nums[0];  // Empezar en el valor
fast = nums[0];

// ✅ CORRECTO
slow = 0;  // Empezar en el índice 0
fast = 0;
```

### 4. **Pensar que el inicio del ciclo es directamente el duplicado**
```
Común confusión: "El índice donde empieza el ciclo es el duplicado"

❌ INCORRECTO: El ÍNDICE donde empieza el ciclo
✅ CORRECTO: El VALOR que apunta a ese índice es el duplicado

Ejemplo:
Ciclo empieza en índice 2
El valor que apunta a índice 2 es 2
El duplicado es 2 ✅
```

### 5. **Intentar resolver con HashSet (violando constraints)**
```typescript
// ❌ INCORRECTO - O(n) espacio
const seen = new Set();
for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
}

// ✅ CORRECTO - O(1) espacio
// Usar Fast & Slow Pointers
```

## 🧪 Análisis Big O

- **Time:** O(n)
  - Fase 1: O(n) para detectar ciclo
  - Fase 2: O(n) para encontrar inicio
  - Total: O(n)
- **Space:** O(1) - Solo variables escalares

**Comparación con otros approaches:**

| Approach | Time | Space | Modifica Array | Notas |
|----------|------|-------|----------------|-------|
| Sorting | O(n log n) | O(1) | ✅ Sí ❌ | Viola constraints |
| HashSet | O(n) | O(n) ❌ | No | Viola space constraint |
| Marcar negativos | O(n) | O(1) | ✅ Sí ❌ | Viola constraints |
| **Fast & Slow** | **O(n)** | **O(1)** | **No** ✅ | **Cumple todos** ✅ |
