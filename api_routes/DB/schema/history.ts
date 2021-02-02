import mongoose, { Schema } from "mongoose";

const historySchema: Schema = new mongoose.Schema({
  user: Object,
  request: Object,
  number: String,
  data: Object,
  date: Number
});

export default historySchema;
