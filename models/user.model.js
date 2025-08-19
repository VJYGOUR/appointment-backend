import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return (
          this.mobileNumber === undefined ||
          this.mobileNumber === null ||
          this.mobileNumber === ""
        );
      },
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return (
          this.email === undefined || this.email === null || this.email === ""
        );
      },
      validate: {
        validator: function (v) {
          return /^\+[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: "Please provide a valid mobile number with country code",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    mobileVerificationOTP: String,
    mobileVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

//PREHOOK FOR PASSWORD HAHING BEFORE STORING IN DB
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
userSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
