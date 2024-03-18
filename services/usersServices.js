import bcrypt from "bcrypt";
import { User } from "../models/users.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import * as Path from "node:path";
import fs from "fs";

const saltRounds = 10;

async function registerUser({ password, email, subscription }) {
  const user = await User.findOne({ email });
  if (user) {
    return null;
  }
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    password: hashPassword,
    email,
    subscription,
    avatarURL,
  });
  console.log(newUser);
  return {
    user: { email: newUser.email, subscription: newUser.subscription },
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }
  const payload = { id: user._id, email, password };
  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  };
}

async function logoutUser({ id }) {
  const user = await User.findByIdAndUpdate(id, { token: null });
  if (!user) {
    return null;
  }
}

async function getCurrentUser(bearerToken) {
  const [bearer, token] = bearerToken.split(" ", 2);

  const user = await User.findOne({ token });
  console.log("user", user);
  if (token !== user.token) {
    return null;
  }
  return { email: user.email, subscription: user.subscription };
}

async function updateSubscription({ id }, { subscription }) {
  const newUser = {
    subscription,
  };
  const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });
  if (updatedUser === null) {
    return null;
  } else {
    return updatedUser;
  }
}

async function updateAvatar({ id }, { path }) {
  const avatar = await Jimp.read(path);
  await avatar.resize(250, 250);
  const avatarFilename = Date.now() + Path.extname(path);
  await avatar.writeAsync(`public/avatars/${avatarFilename}`);
  fs.unlink(path, function (err) {
    if (err) return console.log(err);
    console.log("file deleted successfully");
  });
  const normalizedAvatar = `/avatars/${avatarFilename}`;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      avatarURL: normalizedAvatar,
    },
    { new: true }
  );
  return updatedUser ? { avatarURL: updatedUser.avatarURL } : null;
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};