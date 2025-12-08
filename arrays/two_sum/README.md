# Suma de Dos

Dado un array de enteros `nums` y un entero `target` (objetivo), devuelve los índices `i` y `j` tales que `nums[i] + nums[j] == target` y `i != j`.

Puedes asumir que cada entrada tiene exactamente un par de índices `i` y `j` que satisfacen la condición.

Devuelve la respuesta con el índice menor primero.

### Ejemplo 1:

>Entrada: 
>nums = [3,4,5,6], target = 7
>
>Salida: [0,1]

Explicación: `nums[0] + nums[1] == 7`, por lo que devolvemos `[0, 1]`.

### Ejemplo 2:

>Entrada: nums = [4,5,6], target = 10
>
>Salida: [0,2]

### Ejemplo 3:

>Entrada: nums = [5,5], target = 10
>
>Salida: [0,1]

### Restricciones:

- `2 <= nums.length <= 1000`
- `-10,000,000 <= nums[i] <= 10,000,000`
- `-10,000,000 <= target <= 10,000,000`

<details>
    <summary>Pista 1</summary>
    Una solución de fuerza bruta sería verificar cada par de números en el array. Esto sería una solución O(n^2). ¿Se te ocurre una forma mejor? ¿Tal vez en términos de una ecuación matemática?
</details>

<details>
    <summary>Pista 2</summary>
    Dado que necesitamos encontrar los índices i y j tales que i != j y nums[i] + nums[j] == target. ¿Puedes reorganizar la ecuación e intentar fijar algún índice para iterar?
</details>

<details>
    <summary>Pista 3</summary>
    Podemos iterar a través de `nums` con el índice `i`. Sea `difference = target - nums[i]` y verifiquemos si `difference` existe en el mapa hash mientras iteramos por el array; si no, almacenamos el elemento actual en el mapa hash con su índice y continuamos. Usamos un mapa hash para búsquedas de O(1).
</details>

<details>
    <summary>Mi Aprox</summary>

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