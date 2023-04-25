import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userDataValidate } from "./validations/auth.js";
import { validationResult } from "express-validator";

import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://vlados:Vlados1992@cluster0.lxhehw5.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok connect");
  })
  .catch(() => {
    console.log("DB error");
  });

const app = express();

app.use(express.json());

app.post("/auth/register", userDataValidate, async (req, resp) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return resp.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      hash,
    });

    const user = await doc.save();

    resp.json(user);
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось зареэструваатись",
    });
  }
});

app.listen(9832, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server start at port 9832");
});
