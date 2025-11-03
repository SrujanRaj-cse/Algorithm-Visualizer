const SavedRun = require('../models/SavedRun');
const User = require('../models/User');

async function saveInput(req, res) {
  try {
    const userId = req.userId;
    const { algorithm, input, steps, preferences } = req.body || {};
    if (!algorithm) return res.status(400).json({ message: 'algorithm is required' });
    if (!input) return res.status(400).json({ message: 'input is required' });
    const user = await User.findById(userId).lean();
    const doc = await SavedRun.create({ userId, userEmail: user?.email || '', algorithm, input, steps: Array.isArray(steps) ? steps : [], preferences: preferences || {} });
    // enforce max 5 per user+algorithm
    const excess = await SavedRun.find({ userId, algorithm }).sort({ createdAt: -1 }).skip(5).select('_id');
    if (excess.length) {
      await SavedRun.deleteMany({ _id: { $in: excess.map(d => d._id) } });
    }
    return res.status(200).json({ message: 'Custom input saved', id: doc._id });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function listInputs(req, res) {
  try {
    const userId = req.userId;
    const { algorithm, limit = 20 } = req.query;
    const q = { userId };
    if (algorithm) q.algorithm = algorithm;
    const docs = await SavedRun.find(q).sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 20, 100));
    return res.status(200).json({ items: docs });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = { saveInput, listInputs };


