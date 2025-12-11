
class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}


function diameterOfBinaryTree(root: TreeNode | null): number {
    if (root === null) {
        return 0;
    }
    //inicializamos un stack para realizar un DFS
    let stack: TreeNode[] = [root];
    let mp = new Map<TreeNode | null, Array<number>>();
    mp.set(null, [0, 0]);
    while (stack.length > 0) {
        let node: TreeNode | null = stack[stack.length - 1];

        if (node.left && !mp.has(node.left)) {
            stack.push(node.left);
        } else if (node.right && !mp.has(node.right)) {
            stack.push(node.right);
        } else {
            node = stack.pop()!;

            let [leftHeight, leftDiameter] = mp.get(node!.left)!;
            let [rightHeight, rightDiameter] = mp.get(node!.right)!;

            let height = 1 + Math.max(leftHeight, rightHeight);
            let diameter = Math.max(
                leftHeight + rightHeight,
                Math.max(leftDiameter, rightDiameter),
            );

            mp.set(node, [height, diameter]);
        }
    }

    return mp.get(root)![1];
};