var http = require('https');
var fs = require('fs');
var proxy = require('http-proxy');

http.globalAgent.maxSockets = 10240;

// Define the servers to load balance.
var servers = [
  {host: 'SERVER1-IP', port: 80},
  {host: 'SERVER2-IP', port: 80},
  {host: 'SERVER3-IP', port: 80}
];

// load the SSL cert
var ca = [
  fs.readFileSync('./certs/PositiveSSLCA2.crt'),
  fs.readFileSync('./certs/AddTrustExternalCARoot.crt')
];
var opts = {
  ca: ca,
  key: fs.readFileSync('./certs/example_wild.key'),
  cert: fs.readFileSync('./certs/STAR_example_com.crt')
};

// Create a proxy object for each target.
var proxies = servers.map(function (target) {
  return new proxy.createProxyServer({
    target: target,
    ws: true,
    xfwd: true,
    ssl: opts
  });
});

/**
 * Select a random server to proxy to.
 * @return {Number}     Index of the proxy to use.
 */
var selectServer = function(req, res) {
  return Math.floor(Math.random() * proxies.length);
};

// Select the next server and send the http request.
var serverCallback = function(req, res) {
  var proxyIndex = selectServer();
  var proxy = proxies[proxyIndex];
  proxy.web(req, res);

  proxy.on('error', function(err) {
    startFailoverTimer(proxyIndex);
  });
};
var server = http.createServer(opts, serverCallback);

// Get the next server and send the upgrade request.
server.on('upgrade', function(req, socket, head) {
  var proxyIndex = selectServer();
  var proxy = proxies[proxyIndex];
  proxy.ws(req, socket, head);

  proxy.on('error', function(err, req, socket) {
    socket.end();
    startFailoverTimer(proxyIndex);
  });
});

server.listen(443);
