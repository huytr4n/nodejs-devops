// Start server before test
var DashboardServer = require('../server/');
var config = require('../config');

var dashboardServer = new DashboardServer({
  configs: config
});

// start server
dashboardServer.start(function () {
  console.log('server is ready for testing');
});
