const LAClient = require('./structures/ChordClient.js');
const config = require('./config.json');

const client = new LAClient(config);
client.start();
