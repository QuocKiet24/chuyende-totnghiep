import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// register
const register = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    //validation
    if (!userName || !email || !password) {
      // 400 Bad Request
      res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    // check password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
        success: false,
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
// login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
// logout

// updateUser info

//  login status

// verify email

// verify user

// forgot password

// reset password

// change password
