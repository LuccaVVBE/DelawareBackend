const config = require('config');
const { getLogger } = require('./core/logging/logger');

const startServer = () => {
  const port = config.get('port');

  // logger configs
  const NODE_ENV = config.get('env');
  const LOG_LEVEL = config.get('log.level');
  const LOG_DISABLED = config.get('log.disabled');
  
  // logs printout
  console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);
  
  const app = require("./index.js");
  
  const logger = getLogger();

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}!`);
  });
}

startServer();

module.exports = {
  startServer
}