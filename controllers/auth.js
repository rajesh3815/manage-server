const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return res.status(400).send({
      message: "All fields are requred",
      status: 0,
    });
  }
  const isExist = await user.findOne({ email });
  if (isExist) {
    return res.send({
      message: "user Already exist",
      status: 2,
    });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new user({
      name,
      password: encryptedPassword,
      email,
    });
    await newUser.save();
    res.send({
      message: "user Created Successfully",
      status: 1,
    });
  } catch (error) {
    res.status(400).res.send({
      message: "Errors",
      status: 0,
    });
    console.log("error from userRegistration:)", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const isUserExist = await user.findOne({ email });
  if (!isUserExist) {
    return res.status(500).send({
      message: "user doesnot exist!",
      status: 500,
    });
  }
  try {
    const decryptPassword = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!decryptPassword) {
      return res.status(500).send({
        message: "password error",
        status: 400,
      });
    } else {
      const token = jwt.sign(
        { userId: isUserExist._id },
        process.env.SECRET_KEY
      );
      return res.send({
        name: isUserExist.name,
        email: isUserExist.email,
        status: 200,
        message: "successfully loged-in",
        token,
        userId: isUserExist._id,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error in login",
      status: 300,
    });
    console.log("Error from userLogin:)", error);
  }
};

const updateUser = async (req, res) => {
  const { name, password, email } = req.body;
  const userId = req.userId;

  try {
    const userToUpdate = await user.findById(userId);
    if (!userToUpdate) {
      return res.status(404).send({
        message: "User not found",
        status: 0,
      });
    }

    // Update user details
    if (name?.trim() !== "") {
      userToUpdate.name = name;
    }
    if (password?.trim() !== "") {
      const encryptedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = encryptedPassword;
    }
    if (email?.trim() !== "") {
      userToUpdate.email = email;
    }
    await userToUpdate.save();

    res.send({
      message: "User updated successfully",
      status: 1,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error updating user",
      status: 0,
    });
    console.log("Error from updateUser:)", error);
  }
};

const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const userData = await user.findById(userId, "name email");
    if (!userData) {
      res.status(400).json({
        message: "failed user doesnot exist",
      });
    }
    res.send({
      message: "success",
      userData,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in getUser data",
      status: 0,
    });
    console.log("Error in getUser data:)", error);
  }
};
module.exports = { registerUser, loginUser, updateUser, getUser };
