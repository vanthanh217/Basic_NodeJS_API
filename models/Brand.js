const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
});

brandSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

exports.Brand = mongoose.model("Brand", brandSchema, "brands");
