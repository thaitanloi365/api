import { Router } from "express";
import { validateJwt, signToken } from "./Common";
import { Utils } from "@Utils";
import local from "./Local";
import compose from "composable-middleware";
import Strings from "@Strings";

const router = Router();

router.use("/", local.router);

/**
 * @type {import("@types").IUserModel}
 */
let User;

function setUser(user) {
  User = user;
  local.setUser(user);
}

/**
 * Middleware attaches the user object to the request if authenticated
 * If shouldError is false, a 401 will not be returned, but req.user will be undefined
 */
function isAuthenticated(shouldError = true) {
  return compose()
    .use(function(req, res, next) {
      // Validate jwt
      // allow access_token to be passed through query parameter as well
      if (req.headers && req.headers.hasOwnProperty("access_token")) {
        req.headers.authorization = "Bearer " + req.headers.access_token;
      }

      if (req.query && req.query.hasOwnProperty("access_token")) {
        req.headers.authorization = "Bearer " + req.query.access_token;
      }

      validateJwt()(req, res, next);
    })
    .use(function(err, req, res, next) {
      if (!shouldError) {
        return next();
      }

      // Catch UnauthorizedError for better response
      if (err.name === "UnauthorizedError") {
        return Utils.handleError(res)(err.message, 401);
      }
    })
    .use(function(req, res, next) {
      if (!shouldError && !req.user) {
        return next();
      }

      // Attach user to request
      User.findById(req.user._id)
        .then(user => {
          if (!user) {
            return Utils.handleError(res)(Strings.USER_NOT_FOUND, 401);
          }
          req.user = user;
          next();
          return null;
        })
        .catch(err => next(err));
    });
}

/**
 * Check weather if can authenticate or not
 */
function canAuthenticate() {
  return this.isAuthenticated(false);
}

export default {
  setUser,
  canAuthenticate,
  isAuthenticated,
  router,
  signToken
};
