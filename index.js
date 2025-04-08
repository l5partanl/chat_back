const http = require("node:http");
const socketIO = require("socket.io");
const ChatData = require("./models/chatdata.model");
const { getChatGptResponse } = require("./gpt");

//config .env
require("dotenv").config();

// Config db
require("./config/db.config");

const server = http.createServer((req, res) => {
  res.end("Keonda gato!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Config Socket.io
const io = socketIO(server, {
  cors: { origin: "*" },
});

io.on("connection", async (socket) => {
  console.log("Socket connected:", socket.id);
  //Emisión a todos menos al que se conecta
  socket.broadcast.emit("chat_message_server", {
    username: "INFO",
    message: "New user connected",
    type: "info",
  });

  io.emit("clients_count", io.engine.clientsCount); // Emitir el número de clientes conectados

  //Recupero los ultimos 5 mensajes
  const messages = await ChatData.find().sort("-createdAt").limit(5);
  // Envio los mensajes al cliente que se conecta
  socket.emit("chat_init", messages);

  socket.on("chat_message", async (data) => {
    if (data.message.startsWith("/gpt")) {
      const pregunta = data.message.substring(5); // Eliminar "/gpt" del mensaje
      const gptResponse = await getChatGptResponse(pregunta);
      io.emit("chat_message_server", {
        username: "GPT",
        message: gptResponse,
      });
    } else {
      // Guardar el mensaje, que llega del front, en la base de datos
      await ChatData.create(data);
      io.emit("chat_message_server", data);
    }
  });

  socket.on("disconnect", () => {
    // Se deconecta un usuario
    console.log("Socket disconnected:", socket.id);
    io.emit("chat_message_server", {
      username: "INFO",
      message: "User disconnected",
      type: "info",
    });
    // Emitir el número de clientes conectados
    io.emit("clients_count", io.engine.clientsCount);
  });
});
