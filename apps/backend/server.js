const express = require("express");
const { setupMiddleware,errorHandler} = require("./src/middleware");
const apiRoutes = require("./src/routes");
const config = require("./src/config");

require("./src/config/db");

const app = express();

setupMiddleware(app);

app.use("/api", apiRoutes);

errorHandler(app);

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
