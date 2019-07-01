import { Utils, Mailer } from "@Utils";
import { User } from "@Models";
import Auth from "@Auth";
import _ from "lodash";
import Strings from "@Strings";

const WHITELIST_REQUEST_ATTRIBUTES = ["firstName", "lastName", "password", "email"];

const WHITELIST_RESPONSE_ATTRIBUTES = ["firstName", "lastName", "email"];

/**
 * Create a new authenticate user
 *
 * @type {import("@types").RequestHandler}
 */
const create = async (req, res, next) => {
  try {
    const newUser = Utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
    let user = await User.create(newUser);
    user = user.toObject();
    user["token"] = Auth.signToken(user._id);
    const response = Utils.sanitizeObject(user, WHITELIST_RESPONSE_ATTRIBUTES);

    Utils.handleSuccess(res)(Strings.CREATE_ACCOUNT_SUCCESS, response);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user's profile
 *
 * @type {import("@types").RequestHandler}
 */
const update = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }

    const updateUser = Utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
    Object.assign(user, updateUser);
    await user.save();

    const response = Utils.sanitizeObject(user, WHITELIST_RESPONSE_ATTRIBUTES);

    Utils.handleSuccess(res)(Strings.UPDATE_ACCOUNT_SUCCESS, response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's profile
 *
 * @type {import("@types").RequestHandler}
 */
const get = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }
    user = user.toObject();
    const response = Utils.sanitizeObject(user, WHITELIST_RESPONSE_ATTRIBUTES);

    Utils.handleSuccess(res)(Strings.SUCCESS, response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a authenticate user permanently
 *
 * @type {import("@types").RequestHandler}
 */
const destroy = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }
    user.remove();
    Utils.handleSuccess(res)(Strings.DELETE_ACCOUNT_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * Change current user's password
 *
 * @type {import("@types").RequestHandler}
 */
const changePassword = async (req, res, next) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!oldPassword) {
      Utils.handleError(res)(Strings.OLD_PASSWORD_REQUIRED, 422);
      return;
    }

    if (!newPassword) {
      Utils.handleError(res)(Strings.NEW_PASSWORD_REQUIRED, 422);
      return;
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }

    const isAuthenticated = user.authenticate(oldPassword);
    if (!isAuthenticated) {
      Utils.handleError(res)(Strings.PASSWORD_INCORRECT);
      return;
    }

    user.password = newPassword;
    await user.save();

    Utils.handleSuccess(res)(Strings.CHANGE_PASSWORD_SUCCESS);
  } catch (err) {
    next(err);
  }
};

/**
 * Creates and sends a password reset token and URL to a user
 *
 * @type {import("@types").RequestHandler}
 */
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) {
      Utils.handleError(res)(Strings.EMAIL_REQUIRED);
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      Utils.handleError(res)(Strings.EMAIL_CAN_NOT_FOUND, 404);
      return;
    }

    await user.saveResetToken();

    const mailOptions = {
      to: "thaitanloi365@gmail.com",
      from: process.env.FROM_EMAIL,
      subject: "Password Reset",
      html: "../views/mail/forgotPassword.html"
    };

    const baseUrl = process.env.BASE_URL + "/api/user";
    const data = { baseUrl, user };
    const mailer = new Mailer(mailOptions);

    await mailer.sendMail(data);

    Utils.handleSuccess(res)(Strings.PASSWORD_RESET_SENT);
  } catch (err) {
    next(err);
  }
};

/**
 * Confirms if the password reset token is valid or not
 *
 * @type {import("@types").RequestHandler}
 */
const resetToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND);
      return;
    }

    Utils.handleSuccess(res)(Strings.PASSWORD_RESET_INVALID);
  } catch (err) {
    Utils.handleOtherError(next)(err);
  }
};

/**
 * Resets a password for a user
 *
 * @type {import("@types").RequestHandler}
 */
const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const password = req.body.password;

    if (!password) {
      Utils.handleError(res)(Strings.PASSWORD_REQUIRED);
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const mailer = new Mailer({
      to: "thaitanloi365@gmail.com",
      from: process.env.FROM_EMAIL,
      subject: "Password Reset",
      text: "Hello,\n\nThis is a confirmation your password has been reset.\n"
    });
    await mailer.sendMail();

    Utils.handleSuccess(res)(Strings.UPDATE_PASSWORD_SUCCESS);
  } catch (err) {
    next(err);
  }
};

/**
 * Add a device for push notification
 * @type {import("@types").RequestHandler}
 */
const addDevice = async (req, res, next) => {
  try {
    if (!req.body.device) {
      Utils.handleError(res)(Strings.DEVICE_REQUIRED);
      return;
    }
    if (!req.body.device.token) {
      Utils.handleError(res)(Strings.DEVICE_TOKEN_REQUIRED);
      return;
    }

    if (!req.body.device.platform) {
      Utils.handleError(res)(Strings.DEVICE_PLATFORM_REQUIRED);
      return;
    }

    if (!req.body.device.uuid) {
      Utils.handleError(res)(Strings.DEVICE_UUID_TOKEN_REQUIRED);
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
    }
    const index = user.devices.findIndex(device => device.uuid === req.body.uuid);

    if (index === -1) {
      user.devices.push(req.body.device);
    } else {
      user.devices.splice(index, 1, req.body.device);
    }

    await user.save();

    Utils.handleSuccess(res)(Strings.DEVICE_ADD_SUCCESS, user);
  } catch (err) {
    next(err);
  }
};

/**
 * Add a device for push notification
 * @type {import("@types").RequestHandler}
 */
const deleteDevice = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
      return;
    }

    user.devices = [];
    await user.save();
    Utils.handleSuccess(res)(Strings.DEVICE_DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  update,
  get,
  destroy,
  changePassword,
  forgotPassword,
  resetToken,
  resetPassword,
  addDevice,
  deleteDevice
};
