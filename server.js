const http = require('http');
const app = require('./app');
const config = require('./config/config');
const port = process.env.PORT || config.PORT;

const server =  http.createServer(app)
server.listen(port);