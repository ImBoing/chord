const mongoose = require('mongoose');

const cpSchema = mongoose.Schema({
  ticketOwner: String,
  channel: String,
  topic: String,
  dateCreated: String,
});

module.exports = mongoose.model('modMail', cpSchema);
