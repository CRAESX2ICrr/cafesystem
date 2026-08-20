const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE STAFF
const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "staff",
    });

    res.status(201).json({
      message: "Staff account created",
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL STAFF
const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");

    res.json(staff);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE STAFF
const updateStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      req.body,
      { new: true }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DISABLE STAFF
const disableStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      { active: false },
      { new: true }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.json({
      message: "Staff account disabled",
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const enableStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      { active: true },
      { new: true }
    ).select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.json({
      message: "Staff account enabled",
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndDelete({
      _id: req.params.id,
      role: "staff",
    });

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    res.json({
      message: "Staff account deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createStaff,
  getStaff,
  updateStaff,
  disableStaff,
  enableStaff,
  deleteStaff,
};
