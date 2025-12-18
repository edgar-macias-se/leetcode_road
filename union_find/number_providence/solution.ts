class UnionFind {
    parent: number[];
    rank: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }

    union(x: number, y: number): void {
        let rootX = this.find(x);
        let rootY = this.find(y);

        if (rootX === rootY) return;

        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }
}

function findCircleNum(isConnected: number[][]): number {
    const n = isConnected.length;
    const uf = new UnionFind(n);

    // Procesar conexiones (solo mitad superior)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }

    // Contar provincias (conjuntos distintos)
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (i === uf.parent[i]) {  // Es raíz
            count++;
        }
    }

    return count;
}