const { sign, verify } = require("jsonwebtoken");

exports.genAccessToken = (user) => {
  return sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
};
exports.genRefreshToken = (user) => {
  return sign({ user }, process.env.REFRESH_TOKEN_SECRET);
};

exports.verifyRefreshToken = (jit) => {
  return verify(jit, process.env.REFRESH_TOKEN_SECRET);
};
exports.verifyAccessToken = (ait) => {
  return verify(ait, process.env.ACCESS_TOKEN_SECRET);
};
