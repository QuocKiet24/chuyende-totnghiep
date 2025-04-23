import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../helpers/email.js";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const checkUserName = await User.findOne({ userName });
    if (checkUserName) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this name",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    await sendVerificationEmail(email, userName, verificationToken);

    const payload = {
      user: {
        id: newUser._id,
        role: newUser.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          success: true,
          message: "Registration successful. Please verify your email.",
          token,
          user: {
            ...newUser._doc,
            password: undefined,
          },
        });
      }
    );
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // After verification, create a JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          message: "Email verified successfully",
          user: {
            ...user._doc,
            password: undefined,
          },
          token, // Send the new token after verification
        });
      }
    );
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// send otp
export const sendOTP = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = tokenExpiresAt;

    await user.save();
    await sendVerificationEmail(user.email, user.name, verificationToken);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Nếu user chưa xác minh thì gửi lại mã xác thực
    if (user.isVerified === false) {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = tokenExpiresAt;
      await user.save();

      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return res.status(500).json({
          success: false,
          message: "Could not send verification email",
        });
      }

      // ✅ Generate token ngay cả khi chưa verify
      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "40h",
      });

      return res.status(200).json({
        success: true,
        message: "Verification code sent to your email",
        user: {
          ...user._doc,
          password: undefined,
        },
        token,
        requiresVerification: true,
      });
    }

    // ✅ Nếu đã xác minh thì cho đăng nhập và tạo JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    user.lastLogin = new Date();
    await user.save();

    // Create and return the JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: {
            ...user._doc,
            password: undefined,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//get user
export const checkAuth = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// updateUser info

//  login status

// forgot password

// reset password

// change password
