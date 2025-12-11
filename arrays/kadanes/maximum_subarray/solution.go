package main

// maxSubArray implementa el Algoritmo de Kadane.
// Time: O(n) | Space: O(1)
func maxSubArray(nums []int) int {
	// Caso borde: validación de entrada vacía si fuera necesario.
	if len(nums) == 0 {
		return 0
	}

	// Inicialización:
	// En Go, usamos el primer elemento en lugar de -Infinity para simplificar tipos.
	maxSum := nums[0]
	currSum := 0

	for _, n := range nums {
		// Paso 1: Decisión Greedy (Reiniciar si tenemos carga negativa)
		if currSum < 0 {
			currSum = 0
		}

		// Paso 2: Acumular
		currSum += n

		// Paso 3: Actualizar Máximo
		if currSum > maxSum {
			maxSum = currSum
		}
	}

	return maxSum
}
