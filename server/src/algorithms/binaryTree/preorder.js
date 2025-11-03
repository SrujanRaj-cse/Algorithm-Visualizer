function generatePreorderSteps(root) {
  const steps = [];

  const serializeTree = (node) => {
    if (!node) return null;
    return { val: node.val, left: serializeTree(node.left), right: serializeTree(node.right) };
  };

  const recordStep = (action, currentNode, nextNode = null) => {
    steps.push({ action, currentNode: currentNode ? { val: currentNode.val } : null, nextNode: nextNode ? { val: nextNode.val } : null, tree: serializeTree(root) });
  };

  const preorder = (node) => {
    if (!node) return;
    recordStep('REACH', node, node);
    if (node.left) {
      recordStep('TRAVELLING_LEFT', node, node.left);
      preorder(node.left);
      recordStep('TRAVELLING_UP', node.left, node);
    }
    if (node.right) {
      recordStep('TRAVELLING_RIGHT', node, node.right);
      preorder(node.right);
      recordStep('TRAVELLING_UP', node.right, node);
    }
  };

  recordStep('START', null);
  preorder(root);
  recordStep('COMPLETED', null);
  return steps;
}

module.exports = { generatePreorderSteps };


