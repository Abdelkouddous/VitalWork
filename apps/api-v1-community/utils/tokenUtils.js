import jwt from "jsonwebtoken";

// Local storage token
export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

// HTTP-only cookie token
export const createHttpOnlyJWT = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE) || 30;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return token;
};

// Verify token function
export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
