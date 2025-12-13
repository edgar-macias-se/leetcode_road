# Problem 3: Trapping Rain Water (LeetCode #42) 🔥

## 🧠 Key Concept

**Two Pointers with dynamic maximums:** Instead of pre-calculating left/right maximum arrays (O(n) space), we maintain `maxLeft` and `maxRight` variables that update dynamically. The key insight: we only need to know which side is the **limiting** factor to calculate water at each position.

## 🗺️ The Strategy

**Water formula at position `i`:**
```
water[i] = min(maxLeft, maxRight) - height[i]
```

**Critical insight:** We don't need to know the exact `maxLeft` and `maxRight` from both sides.

1. **If `height[left] < height[right]`:**
   - The limiting side is `left` (because its maximum will be smaller)
   - `min(maxLeft, maxRight) = maxLeft` (guaranteed)
   - Calculate water at `left` using only `maxLeft`
   - `left++`

2. **If `height[right] <= height[left]`:**
   - The limiting side is `right`
   - `min(maxLeft, maxRight) = maxRight` (guaranteed)
   - Calculate water at `right` using only `maxRight`
   - `right--`

**Algorithm:**
```
1. left = 0, right = n-1
2. maxLeft = 0, maxRight = 0
3. water = 0

4. While left < right:
   
   If height[left] < height[right]:
      maxLeft = max(maxLeft, height[left])
      water += maxLeft - height[left]
      left++
   
   Else:
      maxRight = max(maxRight, height[right])
      water += maxRight - height[right]
      right--

5. Return water
```

**Visual Diagram:**
```
height = [3, 0, 2, 0, 4]

█       █
█   █   █
█ ~ █ ~ █
█~~~█~~~█

Water at index 1: 3 units (maxLeft=3, height=0 → 3-0=3)
Water at index 2: 1 unit  (maxLeft=3, height=2 → 3-2=1)
Water at index 3: 3 units (maxLeft=3, height=0 → 3-0=3)

Total: 3 + 1 + 3 = 7
```

**Step-by-step Trace:**
```
height = [3, 0, 2, 0, 4]
          L           R
maxLeft=0, maxRight=0, water=0

Step 1: height[L]=3 < height[R]=4
        maxLeft = max(0, 3) = 3
        water += 3 - 3 = 0
        L++ → L=1

Step 2: height[L]=0 < height[R]=4
        maxLeft = max(3, 0) = 3 (no change)
        water += 3 - 0 = 3
        L++ → L=2

Step 3: height[L]=2 < height[R]=4
        maxLeft = max(3, 2) = 3
        water += 3 - 2 = 1
        L++ → L=3

Step 4: height[L]=0 < height[R]=4
        maxLeft = max(3, 0) = 3
        water += 3 - 0 = 3
        L++ → L=4

Step 5: L == R → STOP
        water = 7 ✅
```

## 💻 Implementation

### Elegant Version (recommended)
```typescript
function trap(height: number[]): number {
    if (!height || height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;
    let maxLeft = height[left];
    let maxRight = height[right];
    let water = 0;

    while (left < right) {
        if (maxLeft < maxRight) {
            left++;
            maxLeft = Math.max(height[left], maxLeft);
            water += maxLeft - height[left];
        } else {
            right--;
            maxRight = Math.max(height[right], maxRight);
            water += maxRight - height[right];
        }
    }
    
    return water;
}
```

**Why does `Math.max` + always adding work?**
- If `height[left]` is a new peak: `maxLeft` updates, `water += 0` (no water added)
- If `height[left]` is underwater: `maxLeft` doesn't change, `water += difference` (water is added)

### Verbose Version (conceptually clearer)
```typescript
function trap(height: number[]): number {
    if (!height || height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left]; // Update maximum
            } else {
                water += maxLeft - height[left]; // Add water
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right]; // Update maximum
            } else {
                water += maxRight - height[right]; // Add water
            }
            right--;
        }
    }
    
    return water;
}
```

## ⚠️ Common Errors

### 1. **Using auxiliary max arrays (O(n) space)**
```typescript
// ❌ INEFFICIENT - O(n) space
const leftMax = new Array(n);
const rightMax = new Array(n);
// Pre-calculate maximums...

// ✅ EFFICIENT - O(1) space
// Use maxLeft and maxRight variables that update dynamically
```

### 2. **Confusing when to use maxLeft vs maxRight**
```typescript
// ❌ INCORRECT
if (height[left] < height[right]) {
    water += maxRight - height[left]; // Use the wrong max
}

// ✅ CORRECT
if (height[left] < height[right]) {
    water += maxLeft - height[left]; // Use maxLeft because left is limiting
}
```

**Rule:** If processing `left`, use `maxLeft`. If processing `right`, use `maxRight`.

### 3. **Forgetting to move the pointer**
```typescript
// ❌ INFINITE LOOP
if (height[left] < height[right]) {
    maxLeft = Math.max(height[left], maxLeft);
    water += maxLeft - height[left];
    // left++; ← MISSING THIS
}

// ✅ CORRECT - Always move the pointer
```

### 4. **Trying to calculate water on both sides simultaneously**
```typescript
// ❌ INCORRECT - You cannot calculate both at once
water += (maxLeft - height[left]) + (maxRight - height[right]);

// ✅ CORRECT - Only calculate on the limiting side
```

## 🧪 Big O Analysis

- **Time:** O(n) - Single pass with two converging pointers
- **Space:** O(1) - Only scalar variables (left, right, maxLeft, maxRight, water)

**Comparison with other approaches:**

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n²) | O(1) | Search max left/right for each i |
| Auxiliary Arrays | O(n) | O(n) | Pre-calculate leftMax[], rightMax[] |
| **Two Pointers** | **O(n)** | **O(1)** | **Optimal** ✅ |
| Stack | O(n) | O(n) | Another valid approach but uses more space |
