
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  // Send a message when the connection is established
  ws.send(JSON.stringify({ type: 'connected', message: 'Connection established' }));

  ws.on('message', message => {
    const data = JSON.parse(message);

    // If the data type is location, send it to all connected clients
    if (data.type === 'location') {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'location', latitude: data.latitude, longitude: data.longitude }));
        }
      });
    }
  });
});

console.log('WebSocket server started on ws://localhost:8080');
