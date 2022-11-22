import { model, Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    login: { type: String, required: true },
    hashedPassword: { type: String },
    accountType: { type: String, required: true },
    avatarURL: { type: String },
    friends: { type: [String] },
    pendingFriends: { type: [String]},
    isOnline: { type: Boolean, required: false},
    memberSince: { type: Date }
  },
  { collection: "Accounts" }
);

const Accounts = model("Accounts", AccountSchema)

export default Accounts;
