const mongoose = require('mongoose');

const cpSchema = mongoose.Schema({
  snippetName: String,
  snippetContent: String,
  guild: String,
});

module.exports = mongoose.model('snippets', cpSchema);
