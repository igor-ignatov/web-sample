import mongoose from "mongoose";

import historySchema from "../schema/history";

const historyModel = mongoose.model("history", historySchema, "history");

export default historyModel;
