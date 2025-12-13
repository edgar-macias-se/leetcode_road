function trap(height: number[]): number {
    if (!height || height.length === 0) {
        return 0;
    }

    let l = 0; let r = height.length - 1;
    let maxLeft = height[l]; let maxRight = height[r];
    let res = 0;

    while (l < r) {
        if (maxLeft < maxRight) {
            l++;
            maxLeft = Math.max(height[l], maxLeft)
            res += maxLeft - height[l]
        } else {
            r--;
            maxRight = Math.max(height[r], maxRight);
            res += maxRight - height[r]
        }
    }
    return res;
};