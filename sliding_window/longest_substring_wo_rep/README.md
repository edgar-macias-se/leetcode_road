# Problema 2: Longest Substring Without Repeating Characters (LeetCode #3)

## 🧠 Concepto Principal

**Ventana Deslizante Variable** con HashMap: La ventana crece y se encoge dinámicamente basada en una condición (sin caracteres repetidos). Este es el patrón clásico de ventana deslizante de dos punteros.

## 🗺️ La Estrategia

1. **Estructura:** Usar `Map<char, index>` para rastrear la última posición de cada caracter
2. **Expandir (derecha):** Agregar caracteres a la ventana
3. **Contraer (izquierda):** Cuando se encuentra un duplicado:
   - Mover `left` justo después de la última ocurrencia del caracter
   - **Crítico:** Usar `Math.max(left, map.get(char) + 1)` para nunca mover hacia atrás
4. **Actualizar:** Rastrear la longitud máxima en cada paso

**Diagrama:**
```
s = "abcabcbb"
     lr         ventana="a" (len=1)
     l r        ventana="ab" (len=2)
     l  r       ventana="abc" (len=3)
     l   r      'a' duplicado! → left salta al índice 1
       l r      ventana="bca" (len=3)
       l  r     'b' duplicado! → left salta al índice 2
         lr     ventana="cab" (len=3)
```

## 💻 Implementación de Código

```typescript
function lengthOfLongestSubstring(s: string): number {
    const map = new Map<string, number>();
    let maxLen = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (map.has(char)) {
            left = Math.max(left, map.get(char)! + 1);
        }
        
        map.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

## ⚠️ Errores Comunes

1. **Olvidar `Math.max` al mover `left`:**
   ```typescript
   // ❌ INCORRECTO
   left = map.get(char)! + 1; // Puede mover hacia atrás
   
   // ✅ CORRECTO
   left = Math.max(left, map.get(char)! + 1);
   ```
   **Ejemplo:** `s = "abba"` - sin `Math.max`, `left` se movería hacia atrás en el último paso

2. **Actualizar el mapa ANTES de mover left:** Causa estados inconsistentes

3. **Verificar duplicados sin actualizar el mapa:** Produce resultados incorrectos

## 🧪 Análisis Big O

- **Tiempo:** O(n) - Cada caracter visitado como máximo dos veces (por `right` y `left`)
- **Espacio:** O(min(n, m)) donde:
  - `n` = longitud de la cadena
  - `m` = tamaño del alfabeto
  - Peor caso: todos caracteres únicos → O(n)
  - Alfabeto limitado (26 letras): O(1) en la práctica

---
