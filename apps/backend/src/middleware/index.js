const cors = require('cors');
const bodyParser = require('body-parser');

const setupMiddleware = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
};

const errorHandler = (app) => {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;

    res.status(statusCode).json({ 
      message: err.message || 'Internal Server Error' 
    });
  });
};

module.exports = { setupMiddleware, errorHandler };
