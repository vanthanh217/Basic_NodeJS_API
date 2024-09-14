const express = require("express");
const User = require("../models/User");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getById);
router.post("/create", UserController.createUser);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
