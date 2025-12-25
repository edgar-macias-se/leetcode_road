# Segment Tree Pattern - Dominio Completo

## 🏷️ Tags
`#SegmentTree` `#RangeQuery` `#DataStructures` `#BinaryTree` `#BitManipulation` `#Medium` `#TypeScript`

# Range Sum Query - Mutable (LeetCode #307)

## 🧠 Concepto Clave

**Segment Tree** es una estructura de árbol binario que permite **queries de rango** (suma, mínimo, máximo) y **actualizaciones** eficientes en O(log n). Solución óptima cuando necesitas tanto queries como updates frecuentes.

## 🗺️ La Estrategia

**¿Por Qué Segment Tree?**

| Operación | Array | Prefix Sum | Segment Tree |
|-----------|-------|------------|--------------|
| Build | O(n) | O(n) | O(n) |
| Range Query | O(n) ❌ | O(1) ✅ | O(log n) ✅ |
| Update | O(1) ✅ | O(n) ❌ | O(log n) ✅ |

**Ventaja:** Única estructura con queries Y updates eficientes.

**Visualización:**
```
Array: [1, 3, 5, 7]

Segment Tree:
        16 [0-3]
       /        \
    4 [0-1]    12 [2-3]
    /    \      /    \
  1[0] 3[1]  5[2] 7[3]

Cada nodo almacena la suma de su rango
```

## 💻 Implementación Iterativa (Avanzada)

```typescript
class SegmentTree {
    private n: number;
    private tree: Int32Array;
    
    constructor(N: number, A: number[]) {
        this.n = N;
        // Redondear a potencia de 2
        while ((this.n & (this.n - 1)) !== 0) {
            this.n++;
        }
        this.build(N, A);
    }
    
    build(N: number, A: number[]): void {
        this.tree = new Int32Array(2 * this.n);
        
        // Colocar elementos en hojas [n, 2n)
        for (let i = 0; i < N; i++) {
            this.tree[this.n + i] = A[i];
        }
        
        // Construir padres bottom-up
        for (let i = this.n - 1; i > 0; i--) {
            this.tree[i] = this.tree[i << 1] + this.tree[(i << 1) | 1];
        }
    }
    
    update(i: number, val: number): void {
        this.tree[this.n + i] = val;
        for (let j = (this.n + i) >> 1; j >= 1; j >>= 1) {
            this.tree[j] = this.tree[j << 1] + this.tree[(j << 1) | 1];
        }
    }
    
    query(l: number, r: number): number {
        let res = 0;
        l += this.n;
        r += this.n + 1;
        
        while (l < r) {
            if (l & 1) res += this.tree[l++];
            if (r & 1) res += this.tree[--r];
            l >>= 1;
            r >>= 1;
        }
        
        return res;
    }
}

class NumArray {
    private segTree: SegmentTree;
    
    constructor(nums: number[]) {
        this.segTree = new SegmentTree(nums.length, nums);
    }
    
    update(index: number, val: number): void {
        this.segTree.update(index, val);
    }
    
    sumRange(left: number, right: number): number {
        return this.segTree.query(left, right);
    }
}
```

## 🧪 Análisis Big O

- **Build:** O(n)
- **Query:** O(log n)
- **Update:** O(log n)
- **Space:** O(2n) = O(n)

## 🎯 Cuándo Usar

✅ Queries de rango frecuentes  
✅ Updates frecuentes  
✅ Array mutable  
❌ Solo queries (usar Prefix Sum)  
❌ Solo updates (usar Array)

