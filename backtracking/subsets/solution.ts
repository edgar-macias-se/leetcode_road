function subsets(nums: number[]): number[][] {
    const result: number[][] = [];
    const current: number[] = [];

    function helper(index: number): void {
        if (index >= nums.length) {
            result.push([...current]);
            return;
        }

        // Incluir
        current.push(nums[index]);
        helper(index + 1);
        current.pop();

        // No incluir
        helper(index + 1);
    }

    helper(0);
    return result;
}