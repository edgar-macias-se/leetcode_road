class UnionFind {
    parent: number[];
    size: number[];
    maxSize: number;

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.size = new Array(n).fill(1);
        this.maxSize = n > 0 ? 1 : 0;
    }

    find(i: number): number {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);  // Path compression
    }

    union(i: number, j: number): void {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by Size: poner el más pequeño bajo el más grande
            if (this.size[rootI] < this.size[rootJ]) {
                [rootI, rootJ] = [rootJ, rootI];
            }
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
            this.maxSize = Math.max(this.maxSize, this.size[rootI]);
        }
    }
}

function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;

    const uf = new UnionFind(nums.length);
    const map = new Map<number, number>();

    // 1. Eliminar duplicados y asignar índices
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) continue;
        map.set(nums[i], i);
    }

    // 2. Unir números consecutivos
    for (const [num, index] of map) {
        if (map.has(num + 1)) {
            uf.union(index, map.get(num + 1)!);
        }
    }

    return uf.maxSize;
}