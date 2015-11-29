/**
 * Script to sync all codes to deployment server
 *
 * How to run: node sync.js --dest=staging
 */
'use strict';

var assert = require('assert'),
  path = require('path'),
  fs = require('fs');
var Rsync = require('rsync'),
  nconf = require('nconf'),
  argv = require('optimist').argv;

var cmd,
  sshUser,
  sshIp,
  sshSourceFolder,
  destination,
  dest = argv.dest,
  configPath = path.join(__dirname, '/../config/', dest + '.json'),
  source = [__dirname, '/../../backend'].join('');

// check the server ip
assert(dest, 'server ip must not be empty');

// check is settings is existed
if (!fs.existsSync(configPath)) {
  process.exit(1);
}

// read the config
nconf.argv().env();
nconf.file(configPath);

sshUser = nconf.get('server:ip');
sshIp = nconf.get('server:ssh_user');
sshSourceFolder = nconf.get('server:ssh_source');
destination = [sshUser, '@', sshIp, ':', sshSourceFolder].join('');

// create the command
cmd = new Rsync()
  .flags('avz')
  .shell('ssh')
  .source(source)
  .destination(destination)
  .exclude('node_modules');

// execute copy command
cmd.execute(error => {
  if (!error) {
    console.log('synced completed to');
  }
});
