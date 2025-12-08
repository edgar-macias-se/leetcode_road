function twoSum(nums: number[], target: number) {
    const indices: Map<number, number> = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        indices.set(nums[i], i);
    }

    for (let i: number = 0; i < nums.length; i++) {
        let diff = target - nums[i];
        if (indices.get(diff) !== undefined && indices.get(diff) !== i) {
            return [i, indices.get(diff)];
        }
    }

    return [];
}

function twoSumOptimized(nums: number[], target: number): number[] {
    const indices: { [key: number]: number } = {};

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const diff = target - num;

        if (indices[diff] !== undefined) {
            return [indices[diff], i];
        }
        indices[num] = i;
    }

    return [];
}