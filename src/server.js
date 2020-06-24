const LAClient = require('./Structures/LAClient.js');
const config = require('./config.json');

const client = new LAClient(config);
client.start();
