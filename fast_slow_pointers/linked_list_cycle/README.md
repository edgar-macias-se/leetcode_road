# Problema 1: Linked List Cycle (LeetCode #141)

## 🧠 Concepto Clave

**Fast & Slow Pointers** (también llamado "Floyd's Cycle Detection" o "Tortoise and Hare") es una técnica donde usamos dos punteros que se mueven a **diferentes velocidades**. El slow pointer avanza 1 paso, el fast pointer avanza 2 pasos. Si hay un ciclo, eventualmente se encuentran; si no hay ciclo, fast llega a null.

## 🗺️ La Estrategia

### Español

**Analogía de la Pista de Carreras:**

Imagina dos corredores en una pista:
- **Tortuga (slow):** Corre a velocidad normal
- **Liebre (fast):** Corre al doble de velocidad

**Pista lineal (sin ciclo):**
```
Slow: S → → → → → null
Fast: F → → → → → → → → null
      ↑ Fast llega al final primero
```

**Pista circular (con ciclo):**
```
Slow: S → → → → → →
Fast: F → → → → → → → → (da vueltas más rápido)
      ↑ Eventualmente se encuentran
```

**¿Por qué NUNCA se saltan?**

Fast se acerca a Slow en **1 posición por iteración**:
- Slow avanza 1 → nueva posición: `pos + 1`
- Fast avanza 2 → nueva posición: `pos + 2`
- Distancia relativa: Fast se acerca en `2 - 1 = 1` posición

**Algoritmo:**
```
1. Inicializar:
   slow = head
   fast = head

2. Mientras fast != null y fast.next != null:
   slow = slow.next      (avanza 1 paso)
   fast = fast.next.next (avanza 2 pasos)
   
   Si slow === fast:
      return true  (se encontraron = hay ciclo)

3. return false  (fast llegó a null = no hay ciclo)
```

**Validaciones críticas:**
```typescript
while (fast !== null && fast.next !== null)
//     ^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^
//     Si fast es null,  Si fast.next es null,
//     llegamos al final fast.next.next causaría error
```

**Ejemplo trace:**
```
Lista: 1 → 2 → 3 → 4
            ↑______|

Inicio: slow = 1, fast = 1

Iteración 1:
slow = 2
fast = 3

Iteración 2:
slow = 3
fast = 3  ← Se encontraron!
return true
```

## 💻 Implementación

```typescript
/**
 * Definition for singly-linked list.
 */
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}

function hasCycle(head: ListNode | null): boolean {
    if (head === null) {
        return false;
    }
    
    let turtle = head;
    let hare = head;
    
    while (hare !== null && hare.next !== null) {
        turtle = turtle.next!;
        hare = hare.next.next;
        
        if (turtle === hare) {
            return true;
        }
    }
    
    return false;
}
```

## ⚠️ Errores Comunes

### 1. **Solo validar `fast !== null`**
```typescript
// ❌ INCORRECTO
while (fast !== null) {
    slow = slow.next;
    fast = fast.next.next;  // Si fast.next = null → Error!
}

// ✅ CORRECTO
while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;  // Seguro
}
```

### 2. **Comparar ANTES de mover**
```typescript
// ❌ INCORRECTO - Siempre retorna true
slow = head;
fast = head;

if (slow === fast) return true;  // Ambos son head!

// ✅ CORRECTO - Mover primero, comparar después
while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;  // Comparar después de mover
}
```

### 3. **No manejar lista vacía**
```typescript
// ❌ INCORRECTO
let slow = head;
while (fast !== null && fast.next !== null) {
    slow = slow.next;  // Si head = null → Error!
}

// ✅ CORRECTO
if (head === null) return false;
let slow = head;
```

### 4. **Inicializar punteros en posiciones diferentes**
```typescript
// ❌ INCORRECTO
let slow = head;
let fast = head.next;  // Empiezan en lugares diferentes

// ✅ CORRECTO
let slow = head;
let fast = head;  // Empiezan en el mismo lugar
```

## 🧪 Análisis Big O

- **Time:** O(n)
  - Sin ciclo: Fast recorre n/2 nodos → O(n)
  - Con ciclo: Ambos dan máximo una vuelta completa → O(n)
- **Space:** O(1) - Solo dos punteros

**Comparación:**

| Approach | Time | Space |
|----------|------|-------|
| HashSet | O(n) | O(n) ❌ |
| **Fast & Slow** | **O(n)** | **O(1)** ✅ |
