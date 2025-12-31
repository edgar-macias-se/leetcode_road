import { MaxPriorityQueue, MinPriorityQueue } from "datastructures-js";

function medianSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    const maxHeap = new MaxPriorityQueue<number>();
    const minHeap = new MinPriorityQueue<number>();
    const toRemove = new Map<number, number>();

    let maxHeapSize = 0;
    let minHeapSize = 0;

    function cleanTop(heap: MaxPriorityQueue<number> | MinPriorityQueue<number>, isMaxHeap: boolean): void {
        while (heap.size() > 0) {
            const top = heap.front()!;
            if (toRemove.has(top) && toRemove.get(top)! > 0) {
                heap.dequeue();
                toRemove.set(top, toRemove.get(top)! - 1);
                if (toRemove.get(top) === 0) {
                    toRemove.delete(top);
                }
            } else {
                break;
            }
        }
    }

    function addNum(num: number): void {
        if (maxHeap.isEmpty() || num <= maxHeap.front()!) {
            maxHeap.enqueue(num);
            maxHeapSize++;
        } else {
            minHeap.enqueue(num);
            minHeapSize++;
        }
        balance();
    }

    function balance(): void {
        cleanTop(maxHeap, true);
        cleanTop(minHeap, false);

        if (maxHeapSize > minHeapSize + 1) {
            const val = maxHeap.dequeue()!;
            minHeap.enqueue(val);
            maxHeapSize--;
            minHeapSize++;
        } else if (minHeapSize > maxHeapSize) {
            const val = minHeap.dequeue()!;
            maxHeap.enqueue(val);
            minHeapSize--;
            maxHeapSize++;
        }
    }

    function getMedian(): number {
        cleanTop(maxHeap, true);
        cleanTop(minHeap, false);

        if (k % 2 === 1) {
            return maxHeap.front()!;
        } else {
            return (maxHeap.front()! + minHeap.front()!) / 2.0;
        }
    }

    // Fase 1: Construir primera ventana
    for (let i = 0; i < k; i++) {
        addNum(nums[i]);
    }
    result.push(getMedian());

    // Fase 2: Sliding window
    for (let i = k; i < nums.length; i++) {
        const outgoingNum = nums[i - k];
        toRemove.set(outgoingNum, (toRemove.get(outgoingNum) || 0) + 1);

        if (!maxHeap.isEmpty() && outgoingNum <= maxHeap.front()!) {
            maxHeapSize--;
        } else {
            minHeapSize--;
        }

        addNum(nums[i]);
        result.push(getMedian());
    }

    return result;
}