import { Utils } from "@Utils";
import { Item, User } from "@Models";
import Strings from "@Strings";
import _ from "lodash";

const WHITELIST_REQUEST_ATTRIBUTES = ["title", "price", "description"];

const WHITELIST_RESPONSE_ATTRIBUTES = ["id", "title", "price", "description"];

const ITEM_SELECT_ATTRIBUTES = "photos title price description -_id";
/**
 * Create a new item
 *
 * @type {import("@types").RequestHandler}
 */
const create = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return Utils.handleError(res)(Strings.USER_NOT_FOUND, 404);
    }

    const body = Utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);

    let newItem = {
      _createdBy: user._id
    };
    _.assign(newItem, body);

    let item = await Item.create(newItem);

    let response = Utils.sanitizeObject(item, WHITELIST_RESPONSE_ATTRIBUTES);
    response.id = item.id;

    Utils.handleSuccess(res)(Strings.CREATE_ITEM_SUCCESS, response);
  } catch (err) {
    next(err);
  }
};

/**
 * Edit item
 *
 * @type {import("@types").RequestHandler}
 */
const edit = async (req, res, next) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
    }

    const reqBody = Utils.sanitizeObject(req.body);
    const item = await Item.create(req);
    const response = Utils.sanitizeObject(item, WHITELIST_RESPONSE_ATTRIBUTES);
    Utils.handleSuccess(res)(Strings.CREATE_ITEM_SUCCESS, response);
  } catch (err) {
    next(err);
  }
};

/**
 * Destroy a item
 *
 * @type {import("@types").RequestHandler}
 */
const destroy = async (req, res, next) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
    }
    const reqBody = Utils.sanitizeObject(req.body);
    const item = await Item.create(req);
    const response = Utils.sanitizeObject(item, WHITELIST_RESPONSE_ATTRIBUTES);
    Utils.handleSuccess(res)(Strings.CREATE_ITEM_SUCCESS, response);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a item
 *
 * @type {import("@types").RequestHandler}
 */
const get = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const skip = Number(req.query.skip) || 0;
    const sort = req.query.sort || "-createdAt";

    const query = {
      _createdBy: req.user._id
    };
    const items = await Item.find(query)
      .select(ITEM_SELECT_ATTRIBUTES)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({ path: "_createdBy", select: WHITELIST_RESPONSE_ATTRIBUTES });

    console.log("items", items);
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  edit,
  destroy,
  get
};
