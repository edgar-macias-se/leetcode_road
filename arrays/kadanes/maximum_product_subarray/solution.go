package main

// maxProduct calcula el producto máximo de un subarray contiguo.
// Time: O(n) | Space: O(1)
func maxProduct(nums []int) int {
	if len(nums) == 0 {
		return 0
	}

	maxProd := nums[0]
	currMax := 1
	currMin := 1

	for _, n := range nums {
		// En Go, necesitamos lógica manual para max/min de 3 valores o helpers
		// Paso 1: Guardar estado previo
		tempMax := currMax * n
		tempMin := currMin * n

		// Paso 2: Calcular nuevos extremos
		// Opción A: Empezar de nuevo (n)
		// Opción B: Extender max (tempMax)
		// Opción C: Invertir min (tempMin)

		currMax = max(n, max(tempMax, tempMin))
		currMin = min(n, min(tempMax, tempMin))

		// Paso 3: Actualizar global
		if currMax > maxProd {
			maxProd = currMax
		}
	}

	return maxProd
}

// Helpers simples para Go (pre-Go 1.21 sin librería 'cmp' o 'slices')
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
