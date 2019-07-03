import { Utils, Paging } from "@Utils";
import { Item, User } from "@Models";
import Strings from "@Strings";
import _ from "lodash";

const WHITELIST_REQUEST_ATTRIBUTES = ["title", "price", "description"];

const WHITELIST_RESPONSE_ATTRIBUTES = ["id", "title", "price", "description"];

const ITEM_SELECT_ATTRIBUTES = "-_createBy -_id -__v";

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
    const _id = req.params.id;
    const _createdBy = req.user._id;

    const item = await Item.findOne({ _id, _createdBy });

    // const query = {
    //   _createdBy: req.user._id
    // };
    // const items = await Item.find(query)
    //   .select(ITEM_SELECT_ATTRIBUTES)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(limit)
    //   .populate({ path: "_createdBy", select: WHITELIST_RESPONSE_ATTRIBUTES });

    console.log("item", item);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all item
 *
 * @type {import("@types").RequestHandler}
 */
const all = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return Utils.handleError(res)(Strings.USER_NOT_FOUND);
    }

    await user.populate({ path: "items", options: Paging.options(req), select: ITEM_SELECT_ATTRIBUTES });

    console.log("***8  2items", user.items);

    console.log("asdfasdfasdfasd", req.user);
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
