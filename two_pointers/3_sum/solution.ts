function threeSum(nums: number[]): number[][] {

    nums = nums.sort((a, b) => a - b);

    let result = [];

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0)
            break;

        if (i > 0 && nums[i] === nums[i - 1])
            continue;

        let left = i + 1;
        let right = nums.length - 1;
        const target = 0 - nums[i];

        while (left < right) {
            let tmpResult = nums[left] + nums[right];

            if (tmpResult === target) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;

                while (left < right && nums[left] === nums[left - 1]) left++;

                while (left < right && nums[right] === nums[right + 1]) right--;
            } else if (tmpResult < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
};