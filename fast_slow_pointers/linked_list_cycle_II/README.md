# Problema 2: Linked List Cycle II (LeetCode #142)

## 🧠 Concepto Clave

**Floyd's Cycle Detection + Matemáticas:** Después de detectar un ciclo con Fast & Slow, usamos una propiedad matemática para encontrar el **inicio** del ciclo. Si pones un puntero en `head` y otro en el `punto de encuentro`, y ambos avanzan 1 paso a la vez, se encontrarán exactamente en el inicio del ciclo.


## 🗺️ La Estrategia

### Español

**El Algoritmo en Dos Fases:**

**FASE 1: Detectar que hay ciclo**
```
Usar Fast & Slow (igual que problema anterior)
Si se encuentran → hay ciclo
Guardar el punto de encuentro
Si fast llega a null → no hay ciclo, return null
```

**FASE 2: Encontrar el inicio del ciclo**
```
ptr1 = head
ptr2 = punto de encuentro (de Fase 1)

Mientras ptr1 !== ptr2:
    ptr1 = ptr1.next  (avanza 1)
    ptr2 = ptr2.next  (avanza 1)

return ptr1  (o ptr2, son iguales)
```

**¿Por qué funciona? (Opcional - Matemáticas)**

Setup:
- `L` = distancia desde head hasta inicio del ciclo
- `M` = distancia desde inicio del ciclo hasta punto de encuentro
- `C` = longitud del ciclo

Cuando se encuentran:
- Slow recorrió: `L + M`
- Fast recorrió: `L + M + nC` (dio n vueltas extras)

Como Fast es el doble de rápido:
```
2(L + M) = L + M + nC
L + M = nC
L = nC - M
```

Esto significa: si avanzas `L` pasos desde el encuentro, llegas al inicio del ciclo. Y si avanzas `L` pasos desde head, también llegas al inicio.

**Visualización:**
```
Lista: 1 → 2 → 3 → 4 → 5
            ↑__________|

FASE 1: Detectar
slow y fast se encuentran en nodo 4

FASE 2: Encontrar inicio
ptr1 = 1 (head)
ptr2 = 4 (encuentro)

Iteración 1:
ptr1 = 2
ptr2 = 5

Iteración 2:
ptr1 = 3  ← ¡Se encontraron en el inicio!
ptr2 = 3
```

## 💻 Implementación

```typescript
function detectCycle(head: ListNode | null): ListNode | null {
    // Fase 1: Detectar ciclo
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Ciclo detectado, pasar a Fase 2
            let ptr1 = head;
            let ptr2 = slow;
            
            // Fase 2: Encontrar inicio del ciclo
            while (ptr1 !== ptr2) {
                ptr1 = ptr1!.next;
                ptr2 = ptr2!.next;
            }
            
            return ptr1;
        }
    }
    
    return null;  // No hay ciclo
}
```
## ⚠️ Errores Comunes

### 1. **Ejecutar Fase 2 cuando NO hay ciclo**
```typescript
// ❌ INCORRECTO
while (fast !== null && fast.next !== null) {
    // ...
}
// Fase 2 siempre se ejecuta, incluso sin ciclo ❌

// ✅ CORRECTO
if (slow === fast) {
    // Solo ejecutar Fase 2 si HAY ciclo
}
return null;  // Si llegamos aquí, no hay ciclo
```

### 2. **Olvidar mover ptr1 desde head**
```typescript
// ❌ INCORRECTO
let ptr1 = slow;  // Ambos empiezan en el mismo lugar
let ptr2 = slow;
// Nunca se moverán!

// ✅ CORRECTO
let ptr1 = head;   // Uno desde head
let ptr2 = slow;   // Otro desde encuentro
```

### 3. **Avanzar a diferentes velocidades en Fase 2**
```typescript
// ❌ INCORRECTO
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;
    ptr2 = ptr2.next.next;  // Velocidades diferentes
}

// ✅ CORRECTO
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;
    ptr2 = ptr2.next;  // Ambos avanzan 1 paso
}
```

### 4. **No validar null en Fase 2**
```typescript
// ⚠️ En TypeScript strict mode
while (ptr1 !== ptr2) {
    ptr1 = ptr1.next;   // Puede ser null
    ptr2 = ptr2.next;   // Puede ser null
}

// ✅ CORRECTO (con non-null assertion)
while (ptr1 !== ptr2) {
    ptr1 = ptr1!.next!;
    ptr2 = ptr2!.next!;
}
// Seguro porque sabemos que hay ciclo
```

## 🧪 Análisis Big O

- **Time:** O(n)
  - Fase 1: O(n) para detectar ciclo
  - Fase 2: O(n) para encontrar inicio
  - Total: O(n) + O(n) = O(n)
- **Space:** O(1) - Solo punteros
