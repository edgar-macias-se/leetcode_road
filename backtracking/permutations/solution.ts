function permute(nums: number[]): number[][] {
    let used: boolean[] = new Array(nums.length).fill(false);
    let res: number[][] = [];
    let curr: number[] = [];

    function helper() {
        if (curr.length === nums.length) {
            res.push([...curr]);
            return;
        }

        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;

            curr.push(nums[i]);
            used[i] = true;
            helper();
            curr.pop();
            used[i] = false;
        }
    }

    helper();
    return res;
}