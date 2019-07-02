import mongoose, { Schema, model } from "mongoose";
import crypto from "crypto";
import validator from "validator";
import Strings from "@Strings";

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true, required: true, index: true, unique: true },
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

UserSchema.path("email").validate(async function(email) {
  const count = await mongoose.model("User").countDocuments({ email, _id: { $ne: this._id } });
  return count == 0;
}, Strings.EMAIL_ALREADY_EXITS);

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
 * Methods
 */
UserSchema.methods = {
  /**
   * @param {any} email
   */
  isEmailExits(email) {
    return email == this.email;
  },

  /**
   * @param {string} password
   * @param {(err: Error,isAuthenticated?: boolean) => void} callback
   */
  authenticate(password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password)
        .then(encryptPassword => {
          resolve(encryptPassword === this.password);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  /**
   * @param {(error: Error, resetToken?: string) => void} callback(err,resetToken)
   */
  generateResetToken(callback) {
    crypto.randomBytes(16, (err, salt) => {
      if (err) {
        callback(err);
      }
      callback(null, salt.toString("hex"));
    });
  },
  /**
   * @returns {Promise<import("@types").IUserDocument>}
   */
  saveResetToken() {
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
  },
  /**
   * Generate a salt string
   * @return {Promise<string>}
   */
  generateSalt() {
    return new Promise((resolve, reject) => {
      const byteSize = 16;
      crypto.randomBytes(byteSize, (err, salt) => {
        if (err) {
          reject(err);
        }
        resolve(salt.toString("base64"));
      });
    });
  },
  /**
   * Encrypt a password
   * @param  {string} password un-encrypt password
   * @return {Promise<string>}
   */
  encryptPassword(password) {
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
  }
};

/**
 * Statics
 * @type {import("@types").IUserModel}
 */
UserSchema.statics = {};

/**
 * @type {import("@types").IUserModel}
 */
const User = model("User", UserSchema);

export default User;
