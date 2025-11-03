function generatePostorderSteps(root) {
  const steps = [];

  const serializeTree = (node) => {
    if (!node) return null;
    return { val: node.val, left: serializeTree(node.left), right: serializeTree(node.right) };
  };

  const recordStep = (action, currentNode, nextNode = null) => {
    steps.push({ action, currentNode: currentNode ? { val: currentNode.val } : null, nextNode: nextNode ? { val: nextNode.val } : null, tree: serializeTree(root) });
  };

  const postorder = (node) => {
    if (!node) return;
    if (node.left) {
      recordStep('TRAVELLING_LEFT', node, node.left);
      postorder(node.left);
      recordStep('TRAVELLING_UP', node.left, node);
    }
    if (node.right) {
      recordStep('TRAVELLING_RIGHT', node, node.right);
      postorder(node.right);
      recordStep('TRAVELLING_UP', node.right, node);
    }
    recordStep('REACH', node, node);
  };

  recordStep('START', null);
  postorder(root);
  recordStep('COMPLETED', null);
  return steps;
}

module.exports = { generatePostorderSteps };


