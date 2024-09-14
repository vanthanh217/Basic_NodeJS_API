const express = require("express");
const { Product } = require("../models/Product");
const ProductController = require("../controllers/ProductController");
const uploadOptions = require("../middlewares/upload");

const router = express.Router();

router.get("/", async (req, res) => {
  const productList = await Product.find().select(
    "name description detail image"
  );

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.post(
  "/create",
  uploadOptions.single("image"),
  ProductController.createProduct
);

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found!" });
    }
    res.json({ message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 7),
  ProductController.uploadGalleryImage
);

router.delete("/delete/:id", ProductController.removeProduct);

// Client
router.get("/category/:slug", ProductController.getAllProductByCategorySlug);

module.exports = router;
