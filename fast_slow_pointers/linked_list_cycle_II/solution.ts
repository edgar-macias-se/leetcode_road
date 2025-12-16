function detectCycle(head: ListNode | null): ListNode | null {
    let slow = head;
    let hare = head;
    let ptr1 = head;
    let ptr2 = head;

    // Fase 1: Detectar ciclo
    while (hare !== null && hare.next !== null) {
        slow = slow!.next;
        hare = hare.next.next;

        if (slow === hare) {
            ptr2 = slow;

            // Fase 2: Encontrar inicio del ciclo
            while (ptr1 !== ptr2) {
                ptr1 = ptr1!.next;
                ptr2 = ptr2!.next;
            }

            return ptr1;
        }
    }

    return null;
}