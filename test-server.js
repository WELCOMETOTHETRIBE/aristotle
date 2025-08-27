const http = require('http');

console.log('Starting test server...');
console.log('Port:', process.env.PORT || 8080);
console.log('Hostname:', process.env.HOSTNAME || '0.0.0.0');

const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World! Test server is working!');
});

const port = process.env.PORT || 8080;
const hostname = process.env.HOSTNAME || '0.0.0.0';

server.listen(port, hostname, () => {
  console.log(`Test server running on http://${hostname}:${port}`);
  console.log('Server is ready to accept connections');
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 