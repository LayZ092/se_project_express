import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const UserModel = this;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) return null;

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return null;

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
