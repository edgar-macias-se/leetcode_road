import { MaxPriorityQueue } from "datastructures-js";

function maxProbability(
    n: number,
    edges: number[][],
    succProb: number[],
    start_node: number,
    end_node: number
): number {
    // 1. Construir grafo bidireccional con probabilidades
    const graph = new Map<number, [number, number][]>();

    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        const p = succProb[i];

        if (!graph.has(u)) graph.set(u, []);
        if (!graph.has(v)) graph.set(v, []);

        graph.get(u)!.push([v, p]);  // [vecino, probabilidad]
        graph.get(v)!.push([u, p]);  // Bidireccional
    }

    // 2. Inicializar probabilidades
    const prob = new Array<number>(n).fill(0.0);
    prob[start_node] = 1.0;

    // 3. Max Heap ordenado por probabilidad (MAYOR primero)
    const maxHeap = new MaxPriorityQueue<{ currProb: number, node: number }>(
        (item) => item.currProb
    );
    maxHeap.enqueue({ currProb: 1.0, node: start_node });

    const visited = new Set<number>();

    // 4. Dijkstra modificado (MAXIMIZAR)
    while (!maxHeap.isEmpty()) {
        const { currProb, node } = maxHeap.dequeue()!;

        // Early exit si encontramos destino
        if (node === end_node) {
            return currProb;
        }

        // Skip si ya visitado
        if (visited.has(node)) {
            continue;
        }
        visited.add(node);

        // Explorar vecinos
        if (!graph.has(node)) continue;

        for (const [neighbor, edgeProb] of graph.get(node)!) {
            const newProb = currProb * edgeProb;  // Multiplicar probabilidades

            // Si encontramos MAYOR probabilidad
            if (newProb > prob[neighbor]) {
                prob[neighbor] = newProb;
                maxHeap.enqueue({ currProb: newProb, node: neighbor });
            }
        }
    }

    // 5. No hay camino
    return 0.0;
}