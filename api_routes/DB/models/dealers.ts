import mongoose from "mongoose";

import dealersSchema from "../schema/dealers";

const dealersModel = mongoose.model("dealers", dealersSchema, "dealers");

export default dealersModel;
