import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, "thisisasecret", {
    expiresIn: "1 day",
  });
};

export default generateToken;
