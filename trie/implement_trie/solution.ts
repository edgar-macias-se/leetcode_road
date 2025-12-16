class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    word: string | null;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.word = null;
    }

    isEmpty(): boolean {
        return this.word === null && this.children.size === 0;
    }
}

class Trie {
    public root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let current = this.root;

        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char)!;
        }

        current.isEndOfWord = true;
    }

    search(word: string): boolean {
        let current = this.root;

        for (const char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char)!;
        }

        return current.isEndOfWord;
    }

    startsWith(prefix: string): boolean {
        let current = this.root;

        for (const char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char)!;
        }

        return true;
    }
}