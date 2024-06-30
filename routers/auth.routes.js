const express = require("express");
const {
  loginUser,
  registerUser,
  updateUser,
  getUser,
} = require("../controllers/auth");
const { verifyToken } = require("../middleware/VerifyToken");
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.patch("/updateUser", verifyToken, updateUser);
userRouter.get("/getUser", verifyToken, getUser);
module.exports = userRouter;
