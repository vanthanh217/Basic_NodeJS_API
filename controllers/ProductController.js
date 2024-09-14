const { Product } = require("../models/Product");
const { Category } = require("../models/Category");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const PRODUCT_SELECT = "name image description detail";

// Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      description,
      detail,
      categoryId,
      countInStock,
      status,
    } = req.body;

    const file = req.file;
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (!name || !file || !description || !categoryId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      image: `${basePath}${fileName}`,
      description,
      detail,
      categoryId,
      countInStock,
      status,
      createdAt: new Date(),
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

const uploadGalleryImage = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const removeProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (product.image) {
      const imageFilename = product.image.split("/").pop();
      const imageFullPath = path.join(
        __dirname,
        "../public/uploads/",
        imageFilename
      );
      console.log("Deleting main image: ", imageFullPath);

      try {
        if (fs.existsSync(imageFullPath)) {
          fs.unlinkSync(imageFullPath); // Xóa ảnh chính
          console.log("Main image deleted successfully: ", imageFullPath);
        } else {
          console.log("Main image not found: ", imageFullPath);
        }
      } catch (err) {
        console.error("Error deleting main image: ", err);
      }
    }

    const images = product.images;
    console.log(images);
    if (images && images.length > 0) {
      images.forEach((imagePath) => {
        const filename = imagePath.split("/").pop();
        const fullPath = path.join(__dirname, "../public/uploads/", filename);

        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("File deleted successfully: ", fullPath);
          } else {
            console.log("File not found: ", fullPath);
          }
        } catch (err) {
          console.error("Error deleting file: ", err);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Client
const getAllProductByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    console.log(slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    const productList = await Product.find({ categoryId: category._id }).select(
      PRODUCT_SELECT
    );
    res.json(productList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  uploadGalleryImage,
  removeProduct,
  getAllProductByCategorySlug,
};
