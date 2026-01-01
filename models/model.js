const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Number,
    default: null,
  },
  maxViews: {
    type: Number,
    default: null,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Paste", PasteSchema);
