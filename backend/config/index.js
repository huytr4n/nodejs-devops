/**
 * Serve config of the app
 */
var nconf = require('nconf');
var fs = require('fs');
var path = require('path');
var SETTINGS = process.env.SETTINGS;
var configPath = path.join(__dirname, SETTINGS + '.json');

// check is settings is existed
if (!fs.existsSync(configPath)) {
  configPath = path.join(__dirname, 'default.json');
}

nconf.argv().env();
nconf.file(configPath);

console.log('Start with this configuration:', nconf.stores.file.file);

/**
 * Expose.
 */
module.exports = nconf;
