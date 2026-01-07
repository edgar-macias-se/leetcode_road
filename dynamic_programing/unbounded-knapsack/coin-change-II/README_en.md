# Coin Change II (LeetCode #518)

## 🏷️ Tags

`#UnboundedKnapsack` `#DynamicProgramming` `#Medium` `#TypeScript` `#Counting` `#Combinations`

---

## 🧠 Main Concept

Given an array of coins and an amount, return the **number of different combinations** to form that amount.

You can use **each coin infinitely many times**.

**Difference from Coin Change:**
- Coin Change: **Minimize** the number of coins.
- Coin Change II: **Count** the combinations.

---

## 🔑 CRITICAL: Combinations vs Permutations

This is **THE MOST IMPORTANT DIFFERENCE** in this problem.

### Combinations (What we want) ✅

```
amount = 3, coins = [1, 2]

Combinations:
1. {1, 1, 1}    → 1+1+1 = 3
2. {1, 2}       → 1+2 = 3

Total: 2 combinations

ORDER DOES NOT MATTER:
  {1, 2} = {2, 1}  → Counts as ONE combination
```

### Permutations (What we DO NOT want) ❌

```
amount = 3, coins = [1, 2]

Permutations:
1. {1, 1, 1}    → 1+1+1 = 3
2. {1, 2}       → 1+2 = 3
3. {2, 1}       → 2+1 = 3

Total: 3 permutations

ORDER MATTERS:
  {1, 2} ≠ {2, 1}  → Counts as TWO permutations
```

---

## ⚡ The Key: Loop Order

### ❌ INCORRECT ORDER (Counts Permutations)

```typescript
// INCORRECT - Counts permutations
for (let amount = 1; amount <= target; amount++) {
    for (const coin of coins) {
        dp[amount] += dp[amount - coin];
    }
}
```

**Why does it count permutations?**

```
amount = 3, coins = [1, 2]

Processing amount=3:
  
  coin=1:
    dp[3] += dp[2]
    dp[2] has the combination {2}
    Now {2} + {1} = {2, 1} ✓
  
  coin=2:
    dp[3] += dp[1]
    dp[1] has the combination {1}
    Now {1} + {2} = {1, 2} ✓

Result: Counts {1, 2} and {2, 1} as different ❌
```

---

### ✅ CORRECT ORDER (Counts Combinations)

```typescript
// CORRECT - Counts combinations
for (const coin of coins) {
    for (let amount = coin; amount <= target; amount++) {
        dp[amount] += dp[amount - coin];
    }
}
```

**Why does it count only combinations?**

```
amount = 3, coins = [1, 2]

Processing coin=1:
  amount=1: dp[1] += dp[0] = 1  → {1}
  amount=2: dp[2] += dp[1] = 1  → {1,1}
  amount=3: dp[3] += dp[2] = 1  → {1,1,1}

Processing coin=2:
  amount=2: dp[2] += dp[0] = 1+1 = 2  → {2} and {1,1}
  amount=3: dp[3] += dp[1] = 1+1 = 2  → {1,2} and {1,1,1}

We only create {1, 2} ONCE ✓
We never create {2, 1} because:
  - When processing coin 2,
  - We only add 2 to combinations that ALREADY only have 1s.
  - We never add 1 to combinations that have 2.
```

---

## 🎨 Loop Order Visualization

### Why It Works

```
Loop by COINS first:

We process coins IN ORDER: [1, 2, 5]

Coin 1:
  Creates all combinations with ONLY 1s
  {1}, {1,1}, {1,1,1}, ...

Coin 2:
  Adds 2 to existing combinations
  {2}, {1,2}, {1,1,2}, {2,2}, ...
  
  BUT never creates {2,1} because:
    - We already processed all combinations with 1.
    - Now we only ADD 2s.
    - We maintain order: 1s first, then 2s.

Coin 5:
  Adds 5 to existing combinations
  {5}, {1,5}, {2,5}, {1,1,5}, ...
  
  Order maintained: 1s → 2s → 5s
```

---

## 🗺️ DP Strategy

### State

```
dp[amount] = Number of combinations to make amount

We don't need index i because we process
coins sequentially.
```

### Recurrence

```
For each coin (in order):
  For each amount >= coin:
    
    dp[amount] += dp[amount - coin]
    
    Meaning:
      "Ways to make amount
       = Ways I already had
       + Ways to make (amount - coin) 
         by adding this coin"
```

### Base Case

```
dp[0] = 1

Why?
  There is 1 way to make 0: use no coins {}
  
dp[1..amount] = 0 (initially)
```

---

## 💻 Implementation

```typescript
function change(amount: number, coins: number[]): number {
    // 1. Create DP array
    const dp: number[] = Array(amount + 1).fill(0);
    
    // 2. Base case: 1 way to make 0
    dp[0] = 1;
    
    // 3. CRITICAL: Loop by COINS first
    for (const coin of coins) {
        // 4. For each amount >= coin
        for (let i = coin; i <= amount; i++) {
            // 5. Add ways
            dp[i] += dp[i - coin];
        }
    }
    
    // 6. Final answer
    return dp[amount];
}
```

---

## 📊 Full Step-by-Step Trace

```typescript
Input: coins = [1, 2, 5], amount = 5

 ═══════════════════════════════════════
INITIALIZATION
 ═══════════════════════════════════════

dp = [1, 0, 0, 0, 0, 0]
      0  1  2  3  4  5

dp[0] = 1 ✓ (1 way to make 0: {})

 ═══════════════════════════════════════
PROCESS COIN coin=1
 ═══════════════════════════════════════

i=1: dp[1] += dp[0] = 1  → {1}
i=2: dp[2] += dp[1] = 1  → {1,1}
i=3: dp[3] += dp[2] = 1  → {1,1,1}
i=4: dp[4] += dp[3] = 1  → {1,1,1,1}
i=5: dp[5] += dp[4] = 1  → {1,1,1,1,1}

State after coin=1:
dp = [1, 1, 1, 1, 1, 1]

 ═══════════════════════════════════════
PROCESS COIN coin=2
 ═══════════════════════════════════════

i=2: dp[2] += dp[0] = 1 + 1 = 2  → {1,1}, {2}
i=3: dp[3] += dp[1] = 1 + 1 = 2  → {1,1,1}, {1,2}
i=4: dp[4] += dp[2] = 1 + 2 = 3  → {1,1,1,1}, {1,1,2}, {2,2}
i=5: dp[5] += dp[3] = 1 + 2 = 3  → {1,1,1,1,1}, {1,1,1,2}, {1,2,2}

State after coin=2:
dp = [1, 1, 2, 2, 3, 3]

 ═══════════════════════════════════════
PROCESS COIN coin=5
 ═══════════════════════════════════════

i=5: dp[5] += dp[0] = 3 + 1 = 4  → {1,1,1,1,1}, {1,1,1,2}, {1,2,2}, {5}

FINAL State:
dp = [1, 1, 2, 2, 3, 4]
                      ↑
               ANSWER = 4
```

---

## 📊 Loop Order Comparison

### Example: coins = [1, 2], amount = 3

**INCORRECT Order (permutations):**

```typescript
for (let amount = 1; amount <= 3; amount++) {
    for (const coin of [1, 2]) { ... }
}

Result:
  amount=1: dp[1] = 1  → {1}
  amount=2: dp[2] = 2  → {1,1}, {2}
  amount=3: 
    coin=1: dp[3] += dp[2] = 2  → {1,1,1}, {2,1}
    coin=2: dp[3] += dp[1] = 2+1 = 3  → + {1,2}
  
  dp[3] = 3 ❌ {1,1,1}, {2,1}, {1,2}
```

**CORRECT Order (combinations):**

```typescript
for (const coin of [1, 2]) {
    for (let amount = coin; amount <= 3; amount++) { ... }
}

Result:
  coin=1: dp[1,2,3] = 1
  coin=2:
    dp[2] += dp[0] = 1+1 = 2  → {2}, {1,1}
    dp[3] += dp[1] = 1+1 = 2  → {1,2}, {1,1,1}
  
  dp[3] = 2 ✓ {1,1,1}, {1,2}
```

---

## ⚠️ Common Pitfalls

### 1. Incorrect Loop Order (Most Critical)

```typescript
// ❌ INCORRECT - Counts permutations
for (let amount = 1; amount <= target; amount++)

// ✅ CORRECT - Counts combinations
for (const coin of coins)
```

### 2. Initializing dp[0] with 0

```typescript
// ❌ INCORRECT
dp[0] = 0;

// ✅ CORRECT (1 way to make 0: do nothing)
dp[0] = 1;
```

### 3. Using OR Operator instead of Sum

```typescript
// ❌ INCORRECT - For boolean problems
dp[i] = dp[i] || dp[i - coin];

// ✅ CORRECT - For counting problems
dp[i] += dp[i - coin];
```

---

## 🧪 Big O Analysis

### Time Complexity: O(C × amount)
Where C is the number of coins. Each coin is processed for up to `amount` times.

### Space Complexity: O(amount)
We use a 1D array of size `amount + 1`.

---

## 🔗 Related Problems

- Coin Change (LC #322) - Minimization.
- Combination Sum IV (LC #377) - Counts permutations.
- Perfect Squares (LC #279) - Minimization with squares.

---

## 📝 Implementation Notes

1. **CRITICAL:** Loop by coins FIRST.
2. **Base case:** `dp[0] = 1`.
3. **Optimization:** Start at `coin` in the internal loop.
4. **Operator:** Use `+=` (sum), not `=` or `||`.
5. **Return:** `dp[amount]` directly.
6. **Combinations ≠ Permutations** - Loop order controls this.
