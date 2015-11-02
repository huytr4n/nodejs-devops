/**
 * Serve config of the app
 */
var nconf = require('nconf'),
    fs = require('fs'),
    path = require('path'),
    SETTINGS = process.env.SETTINGS,
    configPath = path.join(__dirname, SETTINGS + '.json');

// check is settings is existed
if (!fs.existsSync(configPath))
  configPath = path.join(__dirname, 'default.json');

nconf.argv().env()
nconf.file(configPath);

console.log('Start with this configuration:', nconf.stores.file.file);

/**
 * Expose.
 */
module.exports = nconf;