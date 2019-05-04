// Create our connection to the server.
var sock = new SockJS('LOAD-BALANCER-IP/sockjs');

// Listen for incoming messages and log them.
sock.onmessage(function(e){
  console.log('Message:', e.data);
});
