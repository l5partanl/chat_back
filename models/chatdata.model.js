const { model, Schema } = require("mongoose");
const chatDataSchema = new Schema(
  {
    socketId: String,
    username: String,
    message: String,
    type: String,
  },
  {
    timestamp: true,
    versionKey: false,
  }
);
const ChatData = model("chatdata", chatDataSchema);
module.exports = ChatData;
