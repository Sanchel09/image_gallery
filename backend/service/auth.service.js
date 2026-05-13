import models from "../models/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" },
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  return { accessToken, refreshToken };
};

export const login = async ({ email, password }, userAgent, ipAddress) => {
  const user = await models.User.findOne({
    where: { email },
    attributes: ["id", "email", "password"],
  });
  if (!user) throw new Error("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid email or password");

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in session
  await models.Session.create({
    userId: user.id,
    accessToken,
    refreshToken,
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  });
  return { accessToken, refreshToken, userId: user.id };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const session = await models.Session.findOne({ where: { refreshToken } });
  if (!session) {
    throw new Error("Invalid refresh token");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await models.User.findByPk(payload.id);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(user);

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    await session.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};

export const logout = async (id) => {
  await models.Session.destroy({ where: { userId: id } });
};
