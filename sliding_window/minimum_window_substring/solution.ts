function minWindow(s: string, t: string): string {
    const tMap = new Map<string, number>();
    for (const char of t) {
        tMap.set(char, (tMap.get(char) || 0) + 1);
    }

    const window = new Map<string, number>();
    let left = 0;
    let formed = 0;
    const required = tMap.size;
    let minLength = Infinity;
    let minStart = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window.set(char, (window.get(char) || 0) + 1);

        if (tMap.has(char) && window.get(char) === tMap.get(char)) {
            formed++;
        }

        while (formed === required) {
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }

            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar)! - 1);


            if (tMap.has(leftChar) && window.get(leftChar)! < tMap.get(leftChar)!) {
                formed--;
            }

            left++;
        }
    }

    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}