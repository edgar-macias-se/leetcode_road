# Problem 1: Valid Palindrome (LeetCode #125)

## 🧠 Key Concept

This problem introduces the **Converging Two Pointers** pattern: two indices moving from opposite ends toward the center. Validation is done **in-place** without creating auxiliary structures, achieving O(1) space.

## 🗺️ The Strategy

1. **Setup:** Two pointers `left` (start) and `right` (end)
2. **Iteration:** While `left < right`:
   - Skip non-alphanumeric characters from `left` (spaces, punctuation)
   - Skip non-alphanumeric characters from `right`
   - Compare `s[left]` with `s[right]` (case-insensitive)
   - If different → return `false`
   - Advance both pointers: `left++`, `right--`
3. **Result:** If loop completes → return `true`

**Key Insight:** Do not create a new clean string (O(n) space). Validate in-place by skipping invalid characters (O(1) space).

**Diagram:**
```
s = "A man, a plan, a canal: Panama"

     A   m a n ,   a   p l a n ,   a   c a n a l :   P a n a m a
     ^                                                           ^
     L                                                           R

If s[L].toLowerCase() === s[R].toLowerCase():
    L++, R-- (converge to center)
    
If s[L] is not alphanumeric:
    L++ (skip)
```

## 💻 Implementation

```typescript
function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric characters from left
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        
        // Skip non-alphanumeric characters from right
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        
        // Compare valid characters
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
    // '0'-'9': 48-57, 'a'-'z': 97-122
    return (code >= 48 && code <= 57) || (code >= 97 && code <= 122);
}
```

## ⚠️ Common Errors

### 1. **Creating new string with regex (O(n) space)**
```typescript
// ❌ INCORRECT - O(n) space
const cleaned = s.replace(/[^a-z0-9]/gi, '').toLowerCase();
// Then compare with two pointers

// ✅ CORRECT - O(1) space
// Skip invalid characters in-place
```

### 2. **Forgetting `left < right` in inner while loops**
```typescript
// ❌ INCORRECT - Can cause out-of-bounds
while (!isAlphanumeric(s[left])) left++;

// ✅ CORRECT
while (left < right && !isAlphanumeric(s[left])) left++;
```

**Critical Edge Case:**
```typescript
s = "   " (spaces only)

Without protection:
left advances indefinitely → left > right → out-of-bounds

With protection:
left < right becomes false → STOP ✅
```

## 🧪 Big O Analysis

- **Time:** O(n) - Each character visited max once per pointer
- **Space:** O(1) - Only scalar variables (left, right)
