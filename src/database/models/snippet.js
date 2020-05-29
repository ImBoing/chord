const mongoose = require("mongoose");

const cpSchema = mongoose.Schema({
  snippetName: String,
  snippetContent: String,
});

module.exports = mongoose.model("snippets", cpSchema);
