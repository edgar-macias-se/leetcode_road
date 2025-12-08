# Two Sum

Given an array of integers `nums` and an integer `target`, return the indices `i` and `j` such that `nums[i] + nums[j] == target` and `i != j`.

You may assume that every input has exactly one pair of indices `i` and `j` that satisfy the condition.

Return the answer with the smaller index first.

### Example 1:

>Input: 
>nums = [3,4,5,6], target = 7
>
>Output: [0,1]

Explanation: `nums[0] + nums[1] == 7`, so we return `[0, 1]`.

### Example 2:

>Input: nums = [4,5,6], target = 10
>
>Output: [0,2]

### Example 3:

>Input: nums = [5,5], target = 10
>
>Output: [0,1]

### Constraints:

- `2 <= nums.length <= 1000`
- `-10,000,000 <= nums[i] <= 10,000,000`
- `-10,000,000 <= target <= 10,000,000`

<details>
    <summary>Hint 1</summary>
    A brute force solution would be to check every pair of numbers in the array. This would be an O(n^2) solution. Can you think of a better way? Maybe in terms of mathematical equation?
</details>

<details>
    <summary>Hint 2</summary>
    Given, We need to find indices i and j such that i != j and nums[i] + nums[j] == target. Can you rearrange the equation and try to fix any index to iterate on?
</details>

<details>
    <summary>Hint 3</summary>
    we can iterate through nums with index i. Let difference = target - nums[i] and check if difference exists in the hash map as we iterate through the array, else store the current element in the hashmap with its index and continue. We use a hashmap for O(1) lookups.
</details>

<details>
    <summary>My Aprox</summary>

``` typescript
    function twoSum(nums: number[], target: number): number[] {
    let count = 0;
    let gap = count + 1;

    while(count <= nums.length -1){
        
        if((nums[count] + nums[gap]) === target && count != gap){
             return [count, gap];
        }

        if(gap < nums.length -1){
            gap++;
        } else {
            count++; gap=count+1;
        }
            
    }

    return [];
    };
```
</details>