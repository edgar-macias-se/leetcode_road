import { MinPriorityQueue, MaxPriorityQueue } from "datastructures-js";

class MedianFinder {
    private minHeap: MinPriorityQueue<number>;
    private maxHeap: MaxPriorityQueue<number>;

    constructor() {
        this.minHeap = new MinPriorityQueue();
        this.maxHeap = new MaxPriorityQueue();
    }

    addNum(num: number): void {
        this.maxHeap.enqueue(num);
        this.minHeap.enqueue(this.maxHeap.dequeue()!);

        if (this.minHeap.size() > this.maxHeap.size()) {
            this.maxHeap.enqueue(this.minHeap.dequeue()!);
        }
    }

    findMedian(): number {
        if (this.maxHeap.size() === this.minHeap.size()) {
            return (this.maxHeap.front()! + this.minHeap.front()!) / 2;
        }
        return this.maxHeap.front()!;
    }
}