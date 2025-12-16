function findWords(board: string[][], words: string[]): string[] {
    const rows = board.length;
    const cols = board[0].length;
    const result: string[] = [];

    const trie = new Trie();
    for (const word of words) {
        trie.insert(word);
    }

    const dr = [0, 1, 0, -1];  // → ↓ ← ↑
    const dc = [1, 0, -1, 0];

    function dfs(r: number, c: number, node: TrieNode): void {
        const char = board[r][c];

        if (!node.children.has(char)) return;

        const childNode = node.children.get(char)!;

        if (childNode.word !== null) {
            result.push(childNode.word);
            childNode.word = null;
        }

        board[r][c] = '#';

        for (let i = 0; i < 4; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                board[nr][nc] !== '#') {
                dfs(nr, nc, childNode);
            }
        }

        board[r][c] = char;

        if (childNode.isEmpty()) {
            node.children.delete(char);
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, trie.root);
        }
    }

    return result;
}