const mongoose = require('mongoose');

const savedRunSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  userEmail: { type: String, index: true },
  algorithm: { type: String, index: true, required: true },
  input: { type: mongoose.Schema.Types.Mixed, required: true },
  steps: { type: [mongoose.Schema.Types.Mixed], default: [] },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

savedRunSchema.index({ userId: 1, algorithm: 1, createdAt: -1 });

module.exports = mongoose.model('SavedRun', savedRunSchema);


