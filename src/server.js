const https = require("https");
const http = require("http");
const fs = require("fs");
const config = require("../config");
// const io = require("socket.io");
// const { loadChatUsers } = require("./src/models/chatUsers/chatUsers.modal");

require("dotenv").config();

const app = require("./app");

const { mongoService } = require("./services");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// const socketSever = io(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// const sockets = require("./socket");

async function startServer() {
  // await loadChatUsers();
  await mongoService.mongoConnect();
  // sockets.listen(socketSever);

  // server.listen(config.PORT, config.HOST, () => {
  //   console.log(`SERVER LISTENING ON http://${config.HOST}:${config.PORT}`);
  // });
  server.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}`);
  });
}

startServer();
