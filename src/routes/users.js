const { hash, verify } = require("argon2");
const { getCollection } = require("../config/db");
const {
  genAccessToken,
  genRefreshToken,
  verifyRefreshToken,
} = require("../helper/tokens");
const { auth } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const User = await getCollection("users");
    const users = await User.find().toArray();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/me", auth, async (req, res) => {
  const { useId } = req;
  try {
    const User = await getCollection("users");
    const me = await User.findOne({
      useId,
    });
    res.json(me);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/refresh_token", async (req, res) => {
  const { jit } = req.cookies;
  const { userId } = req;

  try {
    const payload = verifyRefreshToken(jit);
    if (!payload) {
      res.json({ msg: "token invalido", cookies: req.cookies });
    }
    const User = await getCollection("users");
    const user = await User.findOne({ $where: { _id: user } });

    res.cookie("ait", genAccessToken({ username: payload.username }), {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    res.json({ cookies: req.cookies });
  } catch (error) {
    res.json({ error: error.message, cookies: req.cookies });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await getCollection("users");
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("Credenciales Incorrectas");
    }

    const valid = await verify(user.password, password);
    if (!valid) {
      throw new Error("Credenciales Incorrectas");
    }
    let rtoken = genRefreshToken({ useId: user._id });
    res.cookie("jit", rtoken, {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    res.cookie("ait", genAccessToken({ useId: user._id }), {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    res.json({ msg: "cookie establecido" });
  } catch (error) {
    console.log(error.message, email, password);
    res.status(500).json({ error: error.message });
  }
});

// registro
router.post("/", async (req, res) => {
  try {
    const User = await getCollection("users");
    let { password } = req.body;
    password = await hash(password);
    let user = await User.insertOne({
      ...req.body,
      password,
    });
    let rtoken = genRefreshToken({ userId: user.insertedId });
    await User.updateOne(
      {
        $where: {
          _id: user.insertedId,
        },
      },
      {
        $set: {
          refreshToken: rtoken,
        },
      }
    );

    res.cookie("jit", rtoken, {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });
    res.cookie("ait", genAccessToken({ userId: user.insertedId }), {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message, body: req.body });
  }
});

module.exports = router;
