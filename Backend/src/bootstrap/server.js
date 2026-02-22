import "./logger.util.js";
import http from 'http';
import app from '../app.js';
import config from '../config/index.js';
import { connectDatabase } from './database.js';


const server = http.createServer(app);

const startServer = async () => {
  await connectDatabase();

  server.listen(config.port, () => {
    console.success("Server running on port " + config.port);
  });
};

startServer();