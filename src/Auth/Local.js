import passport from "passport";
import { Router } from "express";
import { Strategy } from "passport-local";
import { signToken } from "./Common";
import { Utils } from "@Utils";

const router = Router();

/**
 * @param {import("@Types").IUserModel} User
 */
function setUser(User) {
  const options = { usernameField: "email", passwordField: "password" };
  passport.use(
    new Strategy(options, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: "This email is not registered." });
        }
        const isAuthenticated = await user.authenticate(password);
        if (!isAuthenticated) {
          return done(null, false, { message: "This password is not correct." });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );
  router.post("/login", _authenticate);
  router.delete("/logout", _logout);
}

function _authenticate(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    const error = err || info;
    if (error) {
      return Utils.handleError(res, error.message);
    }

    if (!user) {
      return Utils.handleError(res, "Something went wrong, please try again.", 404);
    }

    const token = signToken(user._id);
    Utils.handleSuccess(res, "Login successfully", { token });
  })(req, res, next);
}

function _logout(req, res, next) {
  console.log("req.user", req.user);
  req.logout();
  Utils.handleSuccess(res, "Logout successfully");
}

export default {
  router,
  setUser
};
