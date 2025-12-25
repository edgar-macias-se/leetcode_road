# Two Heaps Pattern - Complete Mastery

## 🏷️ Tags
`#TwoHeaps` `#MedianFinding` `#PriorityQueue` `#Heap` `#Hard` `#TypeScript`

# Find Median from Data Stream (LeetCode #295)

## 🧠 Key Concept
Two Heaps uses two heaps (max and min) to keep elements divided, allowing O(1) access to the median.

## 💻 Implementation
```typescript
class MedianFinder {
    private minHeap: MinPriorityQueue<number>;
    private maxHeap: MaxPriorityQueue<number>;
    
    constructor() {
        this.minHeap = new MinPriorityQueue();
        this.maxHeap = new MaxPriorityQueue();
    }

    addNum(num: number): void {
        this.maxHeap.enqueue(num);
        this.minHeap.enqueue(this.maxHeap.dequeue());
        
        if (this.minHeap.size() > this.maxHeap.size()) {
            this.maxHeap.enqueue(this.minHeap.dequeue());
        }
    }

    findMedian(): number {
        if (this.maxHeap.size() === this.minHeap.size()) {
            return (this.maxHeap.front() + this.minHeap.front()) / 2;
        }
        return this.maxHeap.front();
    }
}
```

## 🧪 Big O
- addNum: O(log n)
- findMedian: O(1)
- Space: O(n)
