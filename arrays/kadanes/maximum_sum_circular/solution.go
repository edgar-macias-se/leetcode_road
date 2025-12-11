package main

// maxSubarraySumCircular resuelve el problema en O(N)
func maxSubarraySumCircular(nums []int) int {
	if len(nums) == 0 {
		return 0
	}

	totalSum := 0
	maxSum := nums[0]
	curMax := 0
	minSum := nums[0]
	curMin := 0

	for _, num := range nums {
		// Lógica Kadane Max
		if curMax+num > num {
			curMax += num
		} else {
			curMax = num
		}
		if curMax > maxSum {
			maxSum = curMax
		}

		// Lógica Kadane Min
		if curMin+num < num {
			curMin += num
		} else {
			curMin = num
		}
		if curMin < minSum {
			minSum = curMin
		}

		totalSum += num
	}

	// Caso: Todos negativos
	if maxSum <= 0 {
		return maxSum
	}

	// Retornar el mejor entre Normal y Circular
	circularMax := totalSum - minSum
	if maxSum > circularMax {
		return maxSum
	}
	return circularMax
}
