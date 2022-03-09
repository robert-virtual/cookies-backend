const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");
const { auth } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/hide", async (req, res) => {
  const Post = await getCollection("posts");
  const posts = await Post.find().toArray();
  res.json(posts);
});

router.get("/", auth, async (req, res) => {
  const Post = await getCollection("posts");
  const posts = await Post.find({ user_id: req.userId }).toArray();
  console.log(posts);
  res.json(posts);
});
router.post("/", auth, async (req, res) => {
  const Post = await getCollection("posts");
  const post = await Post.insertOne({
    ...req.body,
    user: {
      $ref: "users",
      $id: ObjectId(req.userId),
    },
  });
  res.json({ post });
});

module.exports = router;
