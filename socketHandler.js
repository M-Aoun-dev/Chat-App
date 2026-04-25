const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketHandler = (io) => {
  // JWT verify on connect
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`${socket.user.username} connected`);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user_joined", {
        message: `${socket.user.username} joined the room`,
      });
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", {
        message: `${socket.user.username} left the room`,
      });
    });

    socket.on("send_message", async ({ roomId, content }) => {
      try {
        const message = await Message.create({
          room: roomId,
          sender: socket.user._id,
          content,
        });
        const populated = await message.populate("sender", "username");
        io.to(roomId).emit("receive_message", {
          _id: populated._id,
          content: populated.content,
          sender: populated.sender,
          createdAt: populated.createdAt,
          room: roomId,
        });
      } catch {
        socket.emit("error", { message: "Message send failed" });
      }
    });

    socket.on("typing", ({ roomId }) => {
      socket.to(roomId).emit("user_typing", { username: socket.user.username });
    });

    socket.on("stop_typing", ({ roomId }) => {
      socket.to(roomId).emit("user_stop_typing");
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user.username} disconnected`);
    });
  });
};

module.exports = socketHandler;