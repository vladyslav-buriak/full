import express from "express";
import mongoose from "mongoose";
import {
  loginValidate,
  postCreateValidation,
  userDataValidate,
} from "./validations/validation.js";
import { protect, validateMiddleware } from "./middelware/index.js";
import { authControllers, postController } from "./controllers/index.js";
import multer from "multer";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://Diana:Diana123@cluster0.gtihdk7.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok connect");
  })
  .catch(() => {
    console.log("DB error");
  });

const app = express();

//UPLOAD IMAGES

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(multer({ storage: storageConfig }).single("image"));


app.post("/upload", protect, function (req, res, next) {
  let filedata = req.file;
  if (!filedata) res.send("Ошибка при загрузке файла");
  else res.json({ url: `/uploads/${req.file.originalname}` });
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


//register
app.post(
  "/auth/register",
  userDataValidate,
  validateMiddleware,
  authControllers.register
);

//login

app.post(
  "/auth/login",
  loginValidate,
  validateMiddleware,
  authControllers.login
);

//get profile
app.get("/auth/me", protect, authControllers.getMe);

//POSTS

app.post(
  "/posts",
  protect,
  postCreateValidation,
  validateMiddleware,
  postController.createPost
);

app.get("/posts", postController.getPosts);
app.get("/posts/:id", postController.getOnePost);
app.delete("/posts/:id", protect, postController.deletePost);
app.patch(
  "/posts/:id",
  protect,
  postCreateValidation,

  postController.updatePost
);
app.get("/tags", postController.getLastTags);


app.listen(9832, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server start at port 9832");
});
