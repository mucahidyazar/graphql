import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters!");
  }

  return bcrypt.hash(password, 10);
};

export default hashPassword;
