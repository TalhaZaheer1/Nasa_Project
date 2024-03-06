const http = require("http");

const app = require("./app");
const { connectToMongo } = require("./services/mongo")
const { isPlanetAvailable } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);


const startServer = async () => {
  try {
    await connectToMongo()
    await isPlanetAvailable;
    await loadLaunchData()
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
  