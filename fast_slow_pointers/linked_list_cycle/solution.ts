/**
 * Definition for singly-linked list.
 */
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

function hasCycle(head: ListNode | null): boolean {
    if (head === null) {
        return false;
    }

    let turtle: ListNode | null = head;
    let hare: ListNode | null = head;

    while (hare !== null && hare.next !== null) {
        turtle = turtle.next!;
        hare = hare.next!.next || null;

        if (turtle === hare) {
            return true;
        }
    }

    return false;
}