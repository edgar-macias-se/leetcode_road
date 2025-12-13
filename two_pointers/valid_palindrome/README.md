# Problema 1: Valid Palindrome (LeetCode #125)

## 🧠 Concepto Clave

Este problema introduce el patrón **Two Pointers convergentes**: dos índices que se mueven desde los extremos opuestos hacia el centro. La validación se hace **in-place** sin crear estructuras auxiliares, logrando O(1) espacio.

**English:** Converging two pointers pattern - two indices moving from opposite ends toward the center. Validation done in-place without auxiliary structures, achieving O(1) space.

## 🗺️ La Estrategia

### Español

1. **Setup:** Dos punteros `left` (inicio) y `right` (final)
2. **Iteración:** Mientras `left < right`:
   - Saltar caracteres no alfanuméricos desde `left` (espacios, puntuación)
   - Saltar caracteres no alfanuméricos desde `right`
   - Comparar `s[left]` con `s[right]` (case-insensitive)
   - Si diferentes → retornar `false`
   - Avanzar ambos punteros: `left++`, `right--`
3. **Resultado:** Si completa el loop → retornar `true`

**Key Insight:** No crear un nuevo string limpio (O(n) space). Validar in-place saltando caracteres inválidos (O(1) space).

**Diagrama:**
```
s = "A man, a plan, a canal: Panama"

     A   m a n ,   a   p l a n ,   a   c a n a l :   P a n a m a
     ^                                                           ^
     L                                                           R

Si s[L].toLowerCase() === s[R].toLowerCase():
    L++, R-- (convergen al centro)
    
Si s[L] no es alfanumérico:
    L++ (saltar)
```

## 💻 Implementación

```typescript
function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Saltar caracteres no alfanuméricos desde la izquierda
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        
        // Saltar caracteres no alfanuméricos desde la derecha
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        
        // Comparar caracteres válidos
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

// Helper function
function isAlphanumeric(char: string): boolean {
    const code = char.toLowerCase().charCodeAt(0);
    // '0'-'9': 48-57, 'a'-'z': 97-122
    return (code >= 48 && code <= 57) || (code >= 97 && code <= 122);
}
```

## ⚠️ Errores Comunes

### 1. **Crear nuevo string con regex (O(n) space)**
```typescript
// ❌ INCORRECTO - O(n) space
const cleaned = s.replace(/[^a-z0-9]/gi, '').toLowerCase();
// Luego comparar con two pointers

// ✅ CORRECTO - O(1) space
// Saltar caracteres inválidos in-place
```

### 2. **Olvidar `left < right` en inner while loops**
```typescript
// ❌ INCORRECTO - Puede causar out-of-bounds
while (!isAlphanumeric(s[left])) left++;

// ✅ CORRECTO
while (left < right && !isAlphanumeric(s[left])) left++;
```

**Edge case crítico:**
```typescript
s = "   " (solo espacios)

Sin protección:
left avanza indefinidamente → left > right → out-of-bounds

Con protección:
left < right se vuelve false → STOP ✅
```

## 🧪 Análisis Big O

- **Time:** O(n) - Cada carácter visitado máximo una vez por cada puntero
- **Space:** O(1) - Solo variables escalares (left, right)
