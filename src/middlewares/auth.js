const { request, response } = require("express");
const { verifyAccessToken } = require("../helper/tokens");

exports.auth = (req = request, res = response, next) => {
  try {
    const payload = verifyAccessToken(req.cookies.ait);
    if (!payload) {
      throw new Error("Token invalido");
    }
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
