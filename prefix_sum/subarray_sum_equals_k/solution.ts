function subarraySum(nums: number[], k: number): number {
    let map = new Map<number, number>();
    map.set(0, 1);

    let prefixSum = 0;
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];

        if (map.has(prefixSum - k)) {
            count += map.get(prefixSum - k)!;
        }

        map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
    }



    return count;
};