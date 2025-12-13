class NumArray {
    private prefix: number[];
    constructor(nums: number[]) {
        let totalSum = 0;
        this.prefix = new Array<number>(nums.length + 1);
        this.prefix[0] = 0;

        for (let i = 0; i < nums.length; i++) {
            totalSum += nums[i];
            this.prefix[i + 1] = totalSum
        }
    }

    sumRange(left: number, right: number): number {
        return this.prefix[right + 1] - this.prefix[left];
    }
}

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(left,right)
 */