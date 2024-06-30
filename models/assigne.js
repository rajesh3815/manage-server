const mongoose = require("mongoose");

const assignSchema = new mongoose.Schema(
  {
    people: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
    },
  },
  { timestamps: { createdAt: "", updatedAt: "" } }
);

const assign = new mongoose.model("assign", assignSchema);

module.exports = assign;
