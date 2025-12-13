function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Saltar caracteres no alfanuméricos desde la izquierda
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }

        // Saltar caracteres no alfanuméricos desde la derecha
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }

        // Comparar caracteres válidos
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

// Helper function
function isAlphanumeric(char: string): boolean {
    const code = char.toLowerCase().charCodeAt(0);
    // '0'-'9': 48-57
    // 'a'-'z': 97-122
    return (code >= 48 && code <= 57) || (code >= 97 && code <= 122);
}