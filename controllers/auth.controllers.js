import validator from "validator";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendVerifyEmail.js";
import generateToken from "../utils/generateToken.js";
export const registerWithEmail = async (req, res) => {
  //1)
  try {
    const { email, password } = req.body;
    // check email or password provided or not
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    //validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }
    //check if user already registered
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "user already registered" });
    }
    const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const newUser = await User.create({
      email,
      password,
    });
    console.log(newUser);
    await sendVerificationEmail(email, emailVerificationToken);
    //respond
    res.status(201).json({
      status: "success",
      message: "Verification email sent. Please check your inbox.",
      userId: newUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const registerWithMobile = (req, res) => {};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    //find user by email and token
    const user = await User.findOne({
      email: decoded.email,
    });
    console.log(user);
    //check if user exists

    if (!user) {
      return res.status(400).json({ message: "Inva" });
    }
    user.emailVerified = true; // mark verified as true
    user.emailVerificationToken = undefined; //remove token
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "error in token" });
  }
};
export const login = async (req, res) => {
  try {
    // extract form data
    const { email, password } = req.body;
    // check if email or password entered
    if (!email || !password) {
      return res.status(400).json({ message: "enter the required field" });
    }
    // check user exist in db
    const userRegistered = await User.findOne({ email: email }).select(
      "+password"
    );
    if (!userRegistered) {
      return res.status(400).json({ message: "user is not registred" });
    }
    const isMatch = await userRegistered.checkPassword(password);
    console.log(isMatch);

    // Check if password matches
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optional: check if email is verified (if you have an emailVerified field)
    if (!userRegistered.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }
    // generate JWT
    const token = generateToken(userRegistered._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      ...(process.env.NODE_ENV === "production" && { domain: ".onrender.com" }),

      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Successful login
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: userRegistered._id,
        name: userRegistered.name,
        email: userRegistered.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
