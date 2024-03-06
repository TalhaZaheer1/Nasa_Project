const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://nasa-api:kaCxgc7RkVQ1eqOV@nasa-cluster.8oivd2t.mongodb.net/?retryWrites=true&w=majority"

mongoose.connection.once("open",() => {
    console.log("Database Connected")
})
  mongoose.connection.on("error",(err) => {
    console.error(err)
})

async function connectToMongo(){
    await mongoose.connect(MONGO_URL)
}

async function disconnectToMongo(){
    await mongoose.disconnect()
}

module.exports = {
    connectToMongo,
    disconnectToMongo
}
  