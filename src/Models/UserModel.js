import mongoose, { Schema, model } from "mongoose";
import crypto from "crypto";
import validator from "validator";
import Strings from "@Strings";

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String, lowercase: true, trim: true, required: true, index: true, unique: true },
    phone: { type: String, lowercase: true, trim: true, required: true, index: true, unique: true },
    password: { type: String, required: true },
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    devices: Array
  },
  { timestamps: true, autoIndex: true }
);

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
  }
});
/**
 * Mock
 */
UserSchema.pre("save", function(next) {
  if (!this || !this.isModified("password")) {
    next();
    return;
  }
  this.generateSalt()
    .then(salt => {
      this.salt = salt;
      return this.encryptPassword(this.password);
    })
    .then(encryptedPassword => {
      this.password = encryptedPassword;
      next();
    })
    .catch(error => next(error));
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
 * Check email exits
 * @param {string} email
 */
UserSchema.methods.isEmailExits = function(email) {
  return email == this.email;
};

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
 * @param {(error: Error, resetToken?: string) => void} callback(err,resetToken)
 */
UserSchema.methods.generateResetToken = function(callback) {
  crypto.randomBytes(16, (err, salt) => {
    if (err) {
      callback(err);
    }
    callback(null, salt.toString("hex"));
  });
};

/**
 * @returns {Promise<import("@Types").IUserDocument>}
 */
UserSchema.methods.saveResetToken = function() {
  return new Promise((resolve, reject) => {
    this.generateResetToken((err, resetToken) => {
      if (err) {
        reject(err);
      }
      this.resetPasswordToken = resetToken;
      this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      resolve(this.save());
    });
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
