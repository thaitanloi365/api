import _ from "lodash";

/**
 *
 * @param {import("@Types").Response} res
 * @param {string} message
 * @param {number} status
 */
const handleError = (res, message = "Failed", status = 422) => {
  res.status(status).json({ message, code: status, data: null });
};

/**
 *
 * @param {import("@Types").Response} res
 * @param {string} [message]
 * @param {object | Array} [data]
 * @param {number} [status]
 */
const handleSuccess = (res, message = "Success", data = null, status) => {
  const code = status ? status : data ? 201 : 200;
  res.status(code).json({ message, code, data });
};

const sanitizeObject = (object, whitelistAttributes = []) => {
  let sanitizedObject = object;
  if (sanitizedObject) {
    if (Object.prototype.toString.call(object) !== "[object Array]") {
      if (typeof object.toObject === "function") {
        sanitizedObject = object.toObject();
      }

      _.forOwn(sanitizedObject, (value, key) => {
        if (!_.includes(whitelistAttributes, key)) {
          delete sanitizedObject[key];
        }
      });
    }
  }

  return sanitizedObject;
};

export default {
  handleError,
  handleSuccess,
  sanitizeObject
};
