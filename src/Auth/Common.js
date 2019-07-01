import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";

/**
 * Returns a jwt token signed by the app secret
 * ExpiresIn: seconds or string (https://github.com/rauchg/ms.js)
 */
export function signToken(id, expiresIn = "100 days") {
  return jwt.sign({ _id: id }, process.env.SESSION_SECRET, { expiresIn });
}

export function validateJwt() {
  return expressJwt({ secret: process.env.SESSION_SECRET });
}
