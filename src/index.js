const app = require("./app");
const serverConfig = require("./config/serverConfig");

app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
  // console.log(`MongoDB URI: ${serverConfig.MONGO_URI}`);
});
