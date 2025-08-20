import User from "../models/user.model.js";

export const getProfile = (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ message: "success", user: req.user });
    }
    return res.status(401).json({ message: "user not authorized" });
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, age } = req.body;
    // Validate inputs (explicit check so age = 0 works if allowed)
    if (!name || age === undefined || age === null) {
      return res.status(400).json({ message: "Please provide name and age" });
    }

    // Find the logged-in user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.age = age;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
