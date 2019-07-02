import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    title: { type: String, required: true },
    photos: Array,
    _createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { autoIndex: true }
);

/**
 * Statics
 * @type {import("@types").IItemModel}
 */
ItemSchema.statics = {};

/**
 * @type {import("@types").IItemModel}
 */
const Item = mongoose.model("Item", ItemSchema);

export default Item;
