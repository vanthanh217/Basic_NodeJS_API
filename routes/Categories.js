const express = require("express");
const { Category } = require("../models/Category");
const { default: slugify } = require("slugify");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const category = new Category({ name, parentId });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const slug = slugify(name, { lower: true });
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, parentId },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found!" });
    }
    res.json({ message: "Category deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
