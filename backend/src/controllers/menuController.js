const MenuItem = require("../models/MenuItem");

// GET ALL MENU ITEMS
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate("ingredients.ingredient");

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      image,
      available,
      ingredients,
    } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      image,
      available,
      ingredients,
    });

    const populatedMenuItem = await menuItem.populate(
      "ingredients.ingredient"
    );

    res.status(201).json(populatedMenuItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("ingredients.ingredient");

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(
      req.params.id
    );

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json({
      message: "Menu item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};