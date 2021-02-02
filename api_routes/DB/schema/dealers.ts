import mongoose, { Schema } from "mongoose";

const dealerSchema: Schema = new mongoose.Schema({
  dlr_id: String,
  name: String
});

export default dealerSchema;
