function findDuplicate(nums: number[]): number {
    let slow = 0;
    let fast = 0;

    // Fase 1: Detectar ciclo (usar do-while)
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);

    // Fase 2: Encontrar inicio del ciclo (el duplicado)
    let ptr1 = 0;
    let ptr2 = slow;

    while (ptr1 !== ptr2) {
        ptr1 = nums[ptr1];
        ptr2 = nums[ptr2];
    }

    return ptr1;
}