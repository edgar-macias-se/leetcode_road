function findRedundantDirectedConnection(edges: number[][]): number[] {
    const n = edges.length;
    const parent = new Array(n + 1).fill(-1);

    let candidate1: number[] | null = null;
    let candidate2: number[] | null = null;

    // Step 1: Detectar nodo con 2 padres
    for (const [u, v] of edges) {
        if (parent[v] !== -1) {
            // Nodo v ya tiene un padre
            candidate1 = [parent[v], v]; // Primera arista hacia v
            candidate2 = [u, v];          // Segunda arista hacia v (actual)
            break;
        }
        parent[v] = u;
    }

    // Step 2: Union-Find para detectar ciclos
    const par = new Array(n + 1).fill(0).map((_, i) => i);

    function find(x: number): number {
        if (par[x] !== x) {
            par[x] = find(par[x]); // Path compression
        }
        return par[x];
    }

    function union(x: number, y: number): boolean {
        const px = find(x);
        const py = find(y);

        if (px === py) {
            return false; // Ya están conectados → ciclo
        }

        par[px] = py;
        return true;
    }

    // Step 3: Intentar construir el grafo
    for (const [u, v] of edges) {
        // Si hay candidate2, ignoramos esa arista en este intento
        if (candidate2 && u === candidate2[0] && v === candidate2[1]) {
            continue;
        }

        if (!union(u, v)) {
            // Ciclo detectado
            if (candidate1) {
                // Caso 3: Nodo con 2 padres Y ciclo
                // El ciclo está en candidate1, no en candidate2
                return candidate1;
            } else {
                // Caso 2: Solo ciclo (sin nodo con 2 padres)
                return [u, v];
            }
        }
    }

    // Caso 1: Nodo con 2 padres, SIN ciclo
    // La última arista (candidate2) es el problema
    return candidate2!;
}