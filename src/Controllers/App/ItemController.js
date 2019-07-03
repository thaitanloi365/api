import { Utils, Paging } from "@Utils";
import { Item, User } from "@Models";
import Strings from "@Strings";
import _ from "lodash";

const WHITELIST_REQUEST_ATTRIBUTES = ["title", "price", "description"];

const ITEM_SELECT_ATTRIBUTES = "-__v -_createdBy";

/**
 * Create a new item
 *
 * @type {import("@Types").RequestHandler}
 */
const create = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return Utils.handleError(res, Strings.USER_NOT_FOUND, 404);
    }

    const body = Utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);

    const newItem = { _createdBy: user._id };
    _.assign(newItem, body);

    const item = await Item.create(newItem);

    Utils.handleSuccess(res, Strings.CREATE_ITEM_SUCCESS, item.toJSON());
  } catch (err) {
    next(err);
  }
};

/**
 * Edit item
 *
 * @type {import("@Types").RequestHandler}
 */
const edit = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const _createdBy = req.user._id;

    const item = await Item.findOne({ _id, _createdBy });
    if (!item) {
      return Utils.handleError(res, Strings.ITEM_NOT_FOUND, 404);
    }

    const body = Utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);

    _.assign(item, body);

    await item.save();
    item.toJSON();

    Utils.handleSuccess(res, Strings.EDIT_ITEM_SUCCESS, { item });
  } catch (err) {
    next(err);
  }
};

/**
 * Destroy a item
 *
 * @type {import("@Types").RequestHandler}
 */
const destroy = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const _createdBy = req.user._id;

    const item = await Item.findByIdAndDelete({ _id, _createdBy });
    if (!item) {
      return Utils.handleError(res, Strings.ITEM_NOT_FOUND, 404);
    }
    Utils.handleSuccess(res, Strings.DELETE_ITEM_SUCCESS);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a item
 *
 * @type {import("@Types").RequestHandler}
 */
const get = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const _createdBy = req.user._id;

    const item = await Item.findOne({ _id, _createdBy });

    if (!item) {
      return Utils.handleError(res, Strings.ITEM_NOT_FOUND, 404);
    }
    Utils.handleSuccess(res, "Success", { item });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all item
 *
 * @type {import("@Types").RequestHandler}
 */
const all = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return Utils.handleError(res, Strings.USER_NOT_FOUND, 404);
    }
    const _createdBy = req.user._id;

    const options = Paging.options(req, [], ITEM_SELECT_ATTRIBUTES);

    const items = await Item.find({ _createdBy }).setOptions(options);
    Utils.handleSuccess(res, "Success", { items });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  edit,
  destroy,
  get,
  all
};
