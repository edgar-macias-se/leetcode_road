function checkSubarraySum(nums: number[], k: number): boolean {
    if (k === 0) {
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] === 0 && nums[i + 1] === 0) {
                return true;
            }
        }
        return false;
    }


    const map = new Map<number, number>();
    map.set(0, -1);

    let prefixSum = 0;

    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];
        const remainder = prefixSum % k;

        if (map.has(remainder)) {
            if (i - map.get(remainder)! >= 2) {
                return true;
            }
        } else {
            map.set(remainder, i);
        }
    }

    return false;
};