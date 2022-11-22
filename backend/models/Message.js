import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
    {
        id: { type: String},
        sender: { type: String, required: true },
        receiver: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date },
        isFirst: { type: Boolean },
    },
    { collection: "Messages" }
);

export default model("Message", MessageSchema)