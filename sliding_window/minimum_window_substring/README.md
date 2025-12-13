# Problema 3: Minimum Window Substring (LeetCode #76) 🔥

## 🧠 Concepto Principal

**Ventana Deslizante Avanzada:** Requiere rastrear múltiples caracteres con frecuencias específicas. Usar DOS HashMaps y un contador de "completitud" para determinar cuándo la ventana es válida. El desafío: expandir para encontrar una ventana válida, luego contraer para minimizarla.

## 🗺️ La Estrategia

**Insight Clave:** No compares mapas completos en cada paso (sería O(26) por iteración). En su lugar, usa un contador `formed` que rastree cuántos caracteres **únicos** de `t` hemos satisfecho completamente.

1. **Configuración:**
   - `tMap`: Frecuencias requeridas de `t` (e.g., `{'A':2, 'B':1}`)
   - `window`: Frecuencias actuales en la ventana
   - `formed`: Caracteres únicos satisfechos (0 a `tMap.size`)
   - `required`: Número de caracteres únicos en `t` (`tMap.size`)

2. **Fase de Expansión (right++):**
   - Agregar `s[right]` to `window`
   - Si `window[char] === tMap[char]`: `formed++` (completó este char)

3. **Fase de Contracción (mientras formed === required):**
   - Guardar ventana si es la más pequeña encontrada
   - Remover `s[left]` de `window`
   - Si `window[char] < tMap[char]`: `formed--` (perdió este char)
   - `left++`

4. **Retornar:** Subcadena guardada o `""` si es imposible

**Diagrama:**
```
s = "ADOBECODEBANC", t = "ABC"
tMap = {'A':1, 'B':1, 'C':1}, required = 3

Paso 1: Expandir hasta que formed === required
     ADOBEC  ← Primera ventana válida (formed=3)
     
Paso 2: Contraer mientras formed === required
     ADOBEC  → minLen=6
      DOBEC  → Perdió 'A', formed=2, PARAR
      
Paso 3: Continuar expandiendo...
           CODEBA  → formed=3 otra vez
           ODEBAN  → formed=3, minLen sigue 6
                BANC  → formed=3, minLen=4 ✅
                 ANC  → Perdió 'B', PARAR
```

## 💻 Implementación de Código

```typescript
function minWindow(s: string, t: string): string {
    const tMap = new Map<string, number>();
    for (const char of t) {
        tMap.set(char, (tMap.get(char) || 0) + 1);
    }
    
    const window = new Map<string, number>();
    let left = 0;
    let formed = 0;
    const required = tMap.size; // Caracteres ÚNICOS, no t.length
    let minLength = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window.set(char, (window.get(char) || 0) + 1);
        
        // Incrementar formed solo cuando se alcanza EXACTAMENTE el conteo requerido
        if (tMap.has(char) && window.get(char) === tMap.get(char)) {
            formed++;
        }
        
        // Contraer mientras la ventana sea válida
        while (formed === required) {
            // Guardar si es la más pequeña
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }
            
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar)! - 1);
            
            // Decrementar formed solo cuando cae POR DEBAJO del conteo requerido
            if (tMap.has(leftChar) && window.get(leftChar)! < tMap.get(leftChar)!) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}
```

## ⚠️ Errores Comunes

### 1. **Bug Crítico: `required = t.length` en lugar de `tMap.size`**
```typescript
// ❌ INCORRECTO
t = "AAB"
required = 3 // Esperando 3 caracteres

// ✅ CORRECTO
required = tMap.size // = 2 (solo 'A' y 'B' son únicos)
```

### 2. **Incremento incorrecto de `formed`**
```typescript
// ❌ INCORRECTO - Conteo doble
if (window.get(char) <= tMap.get(char)) {
    formed++; // Incrementa múltiples veces para 'A' en "AAB"
}

// ✅ CORRECTO - Solo cuando alcanza exactamente lo requerido
if (window.get(char) === tMap.get(char)) {
    formed++; // Una vez por caracter único
}
```

### 3. **No verificar `tMap.has(char)` antes de comparar**
```typescript
// ❌ Puede ser undefined si char no está en t
if (window.get(leftChar) < tMap.get(leftChar)) {
    formed--;
}

// ✅ CORRECTO
if (tMap.has(leftChar) && window.get(leftChar)! < tMap.get(leftChar)!) {
    formed--;
}
```

### 4. **Comparar mapas completos en cada iteración**
```typescript
// ❌ O(n) por iteración → O(n²) total
while (mapsAreEqual(window, tMap)) { ... }

// ✅ O(1) por iteración → O(n) total
while (formed === required) { ... }
```

## 🧪 Análisis Big O

- **Tiempo:** O(m + n) donde:
  - `m` = longitud de `s`
  - `n` = longitud de `t`
  - `O(n)` para construir `tMap`
  - `O(m)` para recorrer `s` (cada índice visitado como máximo dos veces)
  
- **Espacio:** O(m + n) donde:
  - `tMap`: O(n) o O(1) si el alfabeto es limitado
  - `window`: O(m) en el peor caso (todos caracteres únicos)
  - En la práctica: O(52) para letras en inglés = O(1)

---
