const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });
let documentContent = []; // Initialize the document content as an array

wss.on('connection', (ws) => {
  // Send the current document to the new client
  ws.send(JSON.stringify({ type: 'UPDATE_DOCUMENT', data: documentContent }));

  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);

    if (type === 'UPDATE_DOCUMENT') {
      documentContent = data; // Update the document content on the server
      // Broadcast the updated document to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'UPDATE_DOCUMENT', data: documentContent }));
        }
      });
    }
  });

  ws.on('close', () => {
    // Handle disconnection if necessary
  });
});

console.log('WebSocket server is running on ws://localhost:4000');
