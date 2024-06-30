const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken");
const {
  addTodo,
  getAlltodo,
  getAnalytics,
  getTaskById,
  getFilterData,
  editTask,
  deletTask,
  updateTask,
  editCheck,
} = require("../controllers/todo");
const todoRouter = express.Router();

todoRouter.post("/addtodo", verifyToken, addTodo);
todoRouter.get("/getAlltodo", verifyToken, getAlltodo);
todoRouter.get("/getAnalytics", verifyToken, getAnalytics);
todoRouter.get("/gettaskById/:id", getTaskById);
todoRouter.get("/getFilterDatas", verifyToken, getFilterData);
todoRouter.patch("/updateTask/:id", verifyToken, editTask);
todoRouter.delete("/deletTask/:id", verifyToken, deletTask);
todoRouter.patch("/editTask/:id", verifyToken, updateTask);
todoRouter.patch("/editCheck/:id", verifyToken, editCheck);
module.exports = todoRouter;
