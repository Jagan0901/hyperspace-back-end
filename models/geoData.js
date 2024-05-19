
const mongoose = require("mongoose");
const geoDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filePath: { type: String, required: true },
});
module.exports = mongoose.model("GeoData", geoDataSchema);
