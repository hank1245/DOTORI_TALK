const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();
require("dotenv").config();
const socket = require("socket.io");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connection Success");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "public", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log("connection success")
);

const io = socket(server, {
  cors: {
    origin: ["https://dotoritalk-client.vercel.app/"],
    credentials: true,
  },
});

//onlineUsers는 Map 객체이다. map1.set('a',1)으로 값을 set할 수 있고 map1.get을 통해 가져올 수 있다.
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  //eventEmitter socket은 EventEmitter class 확장. on으로 event listening emit으로 호출.
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.message);
    }
  });
});
