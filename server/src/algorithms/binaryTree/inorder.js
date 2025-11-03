function generateInorderSteps(root) {
  const steps = [];

  // Helper to serialize tree node (remove circular references)
  const serializeTree = (node) => {
    if (!node) return null;
    return {
      val: node.val,
      left: serializeTree(node.left),
      right: serializeTree(node.right)
    };
  };

  const recordStep = (action, currentNode, nextNode = null) => {
    steps.push({
      action,
      currentNode: currentNode ? { val: currentNode.val } : null,
      nextNode: nextNode ? { val: nextNode.val } : null,
      tree: serializeTree(root)
    });
  };

  const inorderTraversal = (node) => {
    if (!node) return;

    if (node.left) {
      recordStep('TRAVELLING_LEFT', node, node.left);
      inorderTraversal(node.left);
      recordStep('TRAVELLING_UP', node.left, node);
    }

    recordStep('REACH', node, node);

    if (node.right) {
      recordStep('TRAVELLING_RIGHT', node, node.right);
      inorderTraversal(node.right);
      recordStep('TRAVELLING_UP', node.right, node);
    }
  };

  recordStep('START', null);
  inorderTraversal(root);
  recordStep('COMPLETED', null);

  return steps;
}

module.exports = { generateInorderSteps };

