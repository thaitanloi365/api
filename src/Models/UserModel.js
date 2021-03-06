import mongoose, { Schema, model } from "mongoose";
import crypto from "crypto";
import validator from "validator";
import Strings from "@Strings";
import AWS from "@AWS";

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    displayName: { type: String },
    email: { type: String, lowercase: true, trim: true, required: true, index: true, unique: true },
    phone: { type: String, lowercase: true, trim: true, required: true, index: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    avatar: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: Date,
    devices: Array,
    roles: Array
  },
  { timestamps: true, autoIndex: true }
);

/**
 * Transform response to client
 */
UserSchema.set("toJSON", {
  virtuals: true,
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.salt;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.devices;
    delete ret.__v;
    delete ret._id;
    delete ret.roles;
  }
});

/**
 * Validators
 */
UserSchema.path("email").validate(function(email) {
  return validator.isEmail(email);
}, Strings.EMAIL_INVALID);

UserSchema.path("phone").validate(function(phone) {
  return validator.isMobilePhone(phone, "vi-VN");
}, Strings.PHONE_INVALID);

UserSchema.path("email").validate(async function(email) {
  const count = await mongoose.model("User").countDocuments({ email, _id: { $ne: this._id } });
  return count == 0;
}, Strings.EMAIL_ALREADY_EXITS);

UserSchema.path("phone").validate(async function(phone) {
  const count = await mongoose.model("User").countDocuments({ phone, _id: { $ne: this._id } });
  return count == 0;
}, Strings.PHONE_ALREADY_EXITS);

/**
 * Mock
 */

// @ts-ignore
UserSchema.pre("save", function(next) {
  if (!this || !this.isModified("password")) {
    next();
    return;
  }
  /** @type {import("@Types").IUser} */
  const user = this;

  user
    .generateSalt()
    .then(salt => {
      user.salt = salt;
      return user.encryptPassword(user.password);
    })
    .then(encryptedPassword => {
      user.password = encryptedPassword;
      next();
    })
    .catch(error => next(error));
});

// @ts-ignore
UserSchema.pre("save", function(next) {
  /** @type {import("@Types").IUser} */
  const user = this;

  // Remove empty strings
  user.roles = user.roles.filter(n => !!n);

  // Set default role(s) here
  if (!user.roles.length) {
    user.roles = ["user"];
  }

  next();
});

// @ts-ignore
UserSchema.pre("save", function(next) {
  /** @type {import("@Types").IUser} */
  const user = this;

  if (user.userName) {
    user.displayName = user.userName;
  } else if (user.firstName && user.lastName) {
    user.displayName = `${user.firstName} ${user.lastName}.`;
  }

  next();
});

/**
 * Virtual
 */
UserSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "_createdBy"
});

/**
 * Methods
 */

/**
 * Authenticate user
 * @param {string} password
 * @return {Promise<boolean>}
 */
UserSchema.methods.authenticate = function(password) {
  return new Promise((resolve, reject) => {
    this.encryptPassword(password)
      .then(encryptPassword => {
        resolve(encryptPassword === this.password);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Generate reset token for reset password
 * @return {Promise<string>}
 */
UserSchema.methods.generateResetToken = function() {
  return new Promise((resolve, reject) => {
    const byteSize = 16;
    crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        reject(err);
      }
      resolve(salt.toString("base64"));
    });
  });
};

/**
 * @returns {Promise<import("@Types").IUserDocument>}
 */
UserSchema.methods.saveResetToken = function() {
  return new Promise((resolve, reject) => {
    this.generateResetToken()
      .then(resetToken => {
        this.resetPasswordToken = resetToken;
        this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        resolve(this.save());
      })
      .catch(err => reject(err));
  });
};

/**
 * Generate a salt string
 * @return {Promise<string>}
 */
UserSchema.methods.generateSalt = function() {
  return new Promise((resolve, reject) => {
    const byteSize = 16;
    crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        reject(err);
      }
      resolve(salt.toString("base64"));
    });
  });
};
/**
 * Encrypt a password
 * @param  {string} password un-encrypt password
 * @return {Promise<string>}
 */
UserSchema.methods.encryptPassword = function(password) {
  return new Promise((resolve, reject) => {
    const salt = this.salt;
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const saltBase64 = Buffer.from(salt, "base64");
    const digest = "sha512";

    crypto.pbkdf2(password, saltBase64, defaultIterations, defaultKeyLength, digest, (err, key) => {
      if (err) {
        reject(err);
      }
      resolve(key.toString("base64"));
    });
  });
};

/**
 * Statics
 * @type {import("@Types").IUserModel}
 */
UserSchema.statics = {};

/**
 * @type {import("@Types").IUserModel}
 */
const User = model("User", UserSchema);

export default User;
