# Backtracking - Subsets (LeetCode #78)

## 🏷️ Tags
`#Backtracking` `#Recursion` `#Subsets` `#Medium` `#TypeScript`

## 🧠 Concepto: ¿Qué es Backtracking?
**Backtracking = "Probar, y si no funciona, retroceder y probar otra cosa"**

Las 3 líneas clave:
```typescript
current.push(num);      // 1. PROBAR
helper(index + 1);      // 2. EXPLORAR
current.pop();          // 3. RETROCEDER ← Esto es backtracking
```

## 💻 Implementación
```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];
    
    function helper(index: number): void {
        if (index >= nums.length) {
            result.push([...current]);
            return;
        }
        
        // Incluir
        current.push(nums[index]);
        helper(index + 1);
        current.pop();
        
        // No incluir
        helper(index + 1);
    }
    
    helper(0);
    return result;
}
```

## 🧪 Big O
- Time: O(n × 2^n)
- Space: O(n)
