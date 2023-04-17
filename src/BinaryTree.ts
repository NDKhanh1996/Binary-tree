import {Tree} from "../interface/Tree";
import {TreeNode} from "./TreeNode";

export class BinaryTree<E> implements Tree<E> {
    root: TreeNode<E> | null;
    totalNode: number;

    constructor() {
        this.root = null;
        this.totalNode = 0;
    }

    public getSize(): number {
        return this.totalNode;
    }

    prettyPrint(node: TreeNode<E> | null = this.root, prefix: string = '', isLeft: boolean = true) {
        if (node) {
            console.log(prefix + (isLeft ? '├──' : '└──') + node.data);
            this.prettyPrint(node.left, prefix + (isLeft ? '│   ' : '    '), true);
            this.prettyPrint(node.right, prefix + (isLeft ? '│   ' : '    '), false);
        }
    }

    inorder(node: TreeNode<E> | null): void {
        if (node) {
            console.log(node.data)
            if (node.left) {
                this.inorder(node.left)
            }
            if (node.right) {
                this.inorder(node.right)
            }
        }
    }

    insert(data: E): TreeNode<E> {
        let node = new TreeNode<E>(data);
        if (!this.root) {
            this.root = node;
        } else {
            let currentNode = this.root;
            while (currentNode && currentNode.data) {
                if (data < currentNode.data) {
                    if (!currentNode.left) {
                        currentNode.left = node;
                        break;
                    }
                    currentNode = currentNode.left;
                } else if (data > currentNode.data) {
                    if (!currentNode.right) {
                        currentNode.right = node;
                        break;
                    }
                    currentNode = currentNode.right;
                }
            }
        }
        this.totalNode++;
        return node;
    }

    findFamily(data: E): { parent: TreeNode<E> | null, current: TreeNode<E> } | undefined {
        let currentNode: TreeNode<E> | null = this.root;
        let parent: TreeNode<E> | null = null;
        while (currentNode && currentNode.data) {
            if (data !== currentNode.data) {
                parent = currentNode;
                if (data < currentNode.data) {
                    currentNode = currentNode.left;
                } else {
                    currentNode = currentNode.right;
                }
            } else {
                return {parent: parent, current: currentNode};
            }
        }
    }

    findCurrentNode(data: E): TreeNode<E> | undefined {
        let family = this.findFamily(data)
        if (family) {
            return family.current;
        }
    }

    findParentNode(data: E): TreeNode<E> | null | undefined {
        let family = this.findFamily(data)
        if (family) {
            return family.parent;
        }
    }

    deleteNode(data: E) {
        let currentNode = this.findCurrentNode(data);
        let parentNode = this.findParentNode(data);
        if (currentNode && parentNode) {
            if (!currentNode.left && !currentNode.right) {
                if (parentNode.right === currentNode) {
                    parentNode.right = null;
                } else {
                    parentNode.left = null;
                }
            } else if (!currentNode.left && currentNode.right || currentNode.left && !currentNode.right) {
                if (currentNode === parentNode.left) {
                    if (currentNode.left) {
                        parentNode.left = currentNode.left;
                    } else {
                        parentNode.left = currentNode.right;
                    }
                } else {
                    if (currentNode.left) {
                        parentNode.right = currentNode.left;
                    } else {
                        parentNode.right = currentNode.right;
                    }
                }
            } else if (currentNode.left && currentNode.right) {
                let rightMostInLeft = currentNode.left;
                let parentRightMostInLeft = rightMostInLeft;
                while (rightMostInLeft.right) {
                    parentRightMostInLeft = rightMostInLeft;
                    rightMostInLeft = rightMostInLeft.right;
                }
                parentRightMostInLeft.right = rightMostInLeft.left;
                if (parentNode.left === currentNode) {
                    parentNode.left = rightMostInLeft;
                } else {
                    parentNode.right = rightMostInLeft;
                }
                rightMostInLeft.left = currentNode.left;
                rightMostInLeft.right = currentNode.right;
            }
        } else if (currentNode === this.root) {
            if (!currentNode.left && !currentNode.right) {
                this.root = null;
            } else if (!currentNode.left && currentNode.right || currentNode.left && !currentNode.right) {
                this.root = currentNode.left || currentNode.right;
            } else if (currentNode.left && currentNode.right) {
                let rightMostInLeft = currentNode.left;
                let parentRightMostInLeft = rightMostInLeft;
                while (rightMostInLeft.right) {
                    parentRightMostInLeft = rightMostInLeft;
                    rightMostInLeft = rightMostInLeft.right;
                }
                parentRightMostInLeft.right = rightMostInLeft.left;
                this.root = rightMostInLeft;
                rightMostInLeft.left = currentNode.left;
                rightMostInLeft.right = currentNode.right;
            }
        }
        this.totalNode--
    }
}