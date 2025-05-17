const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  xId: String,
  email: { type: String, unique: true },
  name: String,
  xUsername: String,
  xProfilePhoto: String,
  useProfilePhoto: { type: Boolean, default: true },
  roles: { type: [String], default: ['user'] },
  subscriptionStatus: { type: String, enum: ['free', 'premium'], default: 'free' },
  articlesGeneratedThisMonth: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
