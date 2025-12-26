import { MinPriorityQueue } from "datastructures-js";

function networkDelayTime(times: number[][], n: number, k: number): number {
    // 1. Construir adjacency list

    const adjList = new Map<number, number[][]>();

    for (let i = 1; i <= n; i++) {
        adjList.set(i, []);
    }

    for (const [src, dest, weight] of times) {
        adjList.get(src)!.push([dest, weight]);
    }
    // 2. Inicializar distancias
    const distances: number[] = new Array(n + 1).fill(Infinity);
    distances[k] = 0;

    // 3. Min Priority Queue
    const minHeap = new MinPriorityQueue<[number, number]>(([, tw]) => tw);
    minHeap.enqueue([k, 0]);

    const visited = new Set<number>();

    // 4. Dijkstra
    while (!minHeap.isEmpty()) {
        const [node, dist] = minHeap.dequeue()!;

        // Skip si ya visitado
        if (visited.has(node)) {
            continue;
        }

        visited.add(node);

        // Relajar aristas
        for (const [neighbor, weight] of adjList.get(node)!) {

            const newDist = dist + weight;

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                minHeap.enqueue([neighbor, newDist]);
            }
        }
    }

    // 5. Encontrar máxima distancia
    const maxDist = Math.max(...distances.slice(1));

    return maxDist < Infinity ? maxDist : -1;
}