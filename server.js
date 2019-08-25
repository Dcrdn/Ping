const http = require('http');
const { driver } = require('./config/db/neo4j');
const app = require('./app');
const PORT = 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
