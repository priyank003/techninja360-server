const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ukdbfw3.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready !");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  try {
    return await mongoose.connect(MONGO_URL);
  } catch (err) {
    console.log(`Could not connect to mongo ${err}`);
  }
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
