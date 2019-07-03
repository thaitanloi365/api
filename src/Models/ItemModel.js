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

ItemSchema.set("toJSON", {
  virtuals: true,
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret._createdBy;
    delete ret.__v;
  }
});
/**
 * Statics
 * @type {import("@Types").IItemModel}
 */
ItemSchema.statics = {};

/**
 * @type {import("@Types").IItemModel}
 */
const Item = mongoose.model("Item", ItemSchema);

export default Item;
