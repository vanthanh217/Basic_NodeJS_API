const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin
const getAllUser = async (req, res) => {
  try {
    const userList = await User.find().select("-password");
    res.json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 10),
      street: req.body.street,
      district: req.body.district,
      city: req.body.city,
      role: req.body.role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const secret = process.env.SECRET;
  if (!user) {
    res.status(400).json({ message: "User not found!" });
  }
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: "10d" }
    );

    res.status(200).json({ user: user.email, token });
  } else {
    res.status(400).json({ message: "Password is wrong!" });
  }
};

const register = async (req, res) => {
  try {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 10),
      street: req.body.street,
      district: req.body.district,
      city: req.body.city,
      role: req.body.role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUser,
  getById,
  createUser,
  login,
  register,
};
