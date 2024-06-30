const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    assignto: {
      type: String,
    },
    createdDt: {
      type: String,
    },
    tasks: {
      type: [taskSchema],
      required: true,
    },
    todoStatus: {
      type: String,
      default: "todo",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: { createdAt: "", updatedAt: "" } }
);

const todo = new mongoose.model("todo", todoSchema);

module.exports = todo;
