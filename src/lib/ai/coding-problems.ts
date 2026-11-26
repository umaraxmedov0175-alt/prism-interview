export interface CodingTestCase {
  input: string;
  expected: string;
  fnCall: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium';
  prompt: string;
  starterCode: string;
  visibleTests: CodingTestCase[];
  hint: string;
}

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    prompt:
      'Given an array of integers `nums` and an integer `target`, return the indices `[i, j]` (with `i !== j`) of the two numbers such that they add up to `target`. You may assume each input has exactly one valid solution.',
    starterCode: `function twoSum(nums, target) {
  // Return [i, j] such that nums[i] + nums[j] === target
  
}
`,
    visibleTests: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        expected: '[0,1]',
        fnCall: 'JSON.stringify(twoSum([2, 7, 11, 15], 9))',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        expected: '[1,2]',
        fnCall: 'JSON.stringify(twoSum([3, 2, 4], 6))',
      },
      {
        input: 'nums = [3, 3], target = 6',
        expected: '[0,1]',
        fnCall: 'JSON.stringify(twoSum([3, 3], 6))',
      },
    ],
    hint: 'Store each visited number and its index in a Map. For the current value `x`, check if `target - x` is already in the Map for an O(n) single-pass solution.',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    prompt:
      'Given a string `s` containing only `(`, `)`, `{`, `}`, `[` and `]`, return `true` if the brackets are properly closed in the correct order, and `false` otherwise.',
    starterCode: `function isValid(s) {
  // Return true if all brackets are balanced and properly nested
  
}
`,
    visibleTests: [
      {
        input: 's = "()"',
        expected: 'true',
        fnCall: 'String(isValid("()"))',
      },
      {
        input: 's = "()[]{}"',
        expected: 'true',
        fnCall: 'String(isValid("()[]{}"))',
      },
      {
        input: 's = "(]"',
        expected: 'false',
        fnCall: 'String(isValid("(]"))',
      },
      {
        input: 's = "([)]"',
        expected: 'false',
        fnCall: 'String(isValid("([)]"))',
      },
    ],
    hint: 'Use an array as a stack. Push expected closing brackets when you see an opening bracket, and verify `stack.pop() === char` whenever you encounter a closing bracket.',
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    prompt:
      'Design a data structure `LRUCache(capacity)` that supports `get(key)` (returning the value or `-1` if missing) and `put(key, value)` in O(1) average time. When capacity is exceeded, evict the least recently used key.',
    starterCode: `class LRUCache {
  constructor(capacity) {
    // Initialize capacity and storage
  }

  get(key) {
    // Return value if present (and mark recently used), else -1
  }

  put(key, value) {
    // Insert or update key; evict least recently used if over capacity
  }
}
`,
    visibleTests: [
      {
        input: 'cap=2; put(1,1), put(2,2), get(1), put(3,3), get(2)',
        expected: '[1,-1]',
        fnCall:
          '(() => { const c = new LRUCache(2); c.put(1, 1); c.put(2, 2); const a = c.get(1); c.put(3, 3); const b = c.get(2); return JSON.stringify([a, b]); })()',
      },
      {
        input: 'cap=1; put(1,10), put(2,20), get(1), get(2)',
        expected: '[-1,20]',
        fnCall:
          '(() => { const c = new LRUCache(1); c.put(1, 10); c.put(2, 20); return JSON.stringify([c.get(1), c.get(2)]); })()',
      },
      {
        input: 'cap=2; put(1,1), put(2,2), put(1,10), put(3,3), get(1), get(2)',
        expected: '[10,-1]',
        fnCall:
          '(() => { const c = new LRUCache(2); c.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3); return JSON.stringify([c.get(1), c.get(2)]); })()',
      },
    ],
    hint: 'JavaScript `Map` maintains insertion order. On `get` or `put` of an existing key, delete and re-set it so it moves to the end. Evict the oldest entry with `this.map.keys().next().value`.',
  },
];
