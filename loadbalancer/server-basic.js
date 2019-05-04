var http = require('http');
var sockjs = require('sockjs');

// Setup our SockJS server.
var clients = [];
var echo = sockjs.createServer();
echo.on('connection', function(conn) {
  // Add this client to the client list.
  clients.push(conn);

  // Listen for data coming from clients.
  conn.on('data', function(message) {
    // Broadcast the message to all connected clients.
    for (var i=0; i<clients.length; i++) {
      clients[i].write(message);
    }
  });

  // Remove the client from the list.
  conn.on('close', function() {
    clients.splice(clients.indexOf(conn), 1);
  });
});

// Begin listening.
var server = http.createServer();
echo.installHandlers(server, {prefix: '/sockjs'});
server.listen(80);
