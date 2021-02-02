import mongoose, { Schema } from "mongoose";

const usersSchema: Schema = new mongoose.Schema({
  id: String,
  name: String,
  login: String,
  pass: String,
  email: String,
  phone: String,
  role: String,
  dlr_id: String,
  last_seen: Number
});

export default usersSchema;
