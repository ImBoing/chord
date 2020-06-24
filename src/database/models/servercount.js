const mongoose = require("mongoose");

const cpSchema = mongoose.Schema({
  total: Number,
  guild: String,
});

module.exports = mongoose.model("serverTotals", cpSchema);
