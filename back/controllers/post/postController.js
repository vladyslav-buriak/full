import PostModel from "../../models/Post.js";

//CREATE POST
export const createPost = async (req, resp) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userID,
    });

    const post = await doc.save();
    resp.json(post);
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось створити статтю!",
    });
  }
};

//GET LAST TAGS

export const getLastTags = async (req, resp) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map(t => t.tags).flat().slice(0,5)

    resp.json(tags);

  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось створити статтю!",
    });
  }
};
//GET ALL POSTS
export const getPosts = async (req, resp) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    resp.json(posts);
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось створити статтю!",
    });
  }
};

//GET ONE POST
export const getOnePost = async (req, resp) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewCount: 1,
        },
      },
      {
        returnDocument: "after",
      }
    ).then((doc) => {
      if (!doc) {
        return resp.status(404).json({
          message: "Стаття не знайдена",
        });
      }
      resp.json(doc);
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось створити статтю3!",
    });
  }
};

//DELETE POST
export const deletePost = async (req, resp) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc) => {
      if (!doc) {
        return resp.status(404).json({
          message: "Стаття не знайдена",
        });
      }
      resp.json({ message: "стаття видалена" });
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      message: "не вдалось видалити статтю!",
    });
  }
};

//UPDATE POST
export const updatePost = async (req, resp) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );
    resp.json({
      message: true,
    });
  } catch (err) {
    resp.status(500).json({
      message: "не вдалось обновити статтю!",
    });
  }
};
