import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    photos: Array,
    _createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { autoIndex: true, timestamps: true }
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
