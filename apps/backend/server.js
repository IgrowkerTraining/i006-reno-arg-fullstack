const express = require("express");
const { setupMiddleware,errorHandler} = require("./src/middleware");
const apiRoutes = require("./src/routes");
const config = require("./src/config");

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger')

require("./src/config/db");

const app = express();

setupMiddleware(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);

errorHandler(app);

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
});
