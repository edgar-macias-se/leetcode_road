import { MinPriorityQueue } from "datastructures-js";

function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    if (n === 1) return 0;

    const visited = new Set<number>();
    const heap = new MinPriorityQueue<[number, number]>(([w, _]) => w);

    visited.add(0);

    for (let i = 1; i < n; i++) {
        const cost = manhattanDistance(points[0], points[i]);
        heap.enqueue([cost, i]);
    }

    let totalCost = 0;

    while (visited.size < n) {
        const [cost, idx] = heap.dequeue()!;

        if (visited.has(idx)) continue;

        visited.add(idx);
        totalCost += cost;

        for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
                const newCost = manhattanDistance(points[idx], points[i]);
                heap.enqueue([newCost, i]);
            }
        }
    }

    return totalCost;
}

function manhattanDistance(p1: number[], p2: number[]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}