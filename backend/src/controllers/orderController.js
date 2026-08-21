const Order = require("../models/Order");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Ingredient = require("../models/Ingredient");
const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    // Check stock for every ordered menu item
    for (const orderItem of items) {
      const menuItem = await MenuItem.findById(
        orderItem.menuItem
      ).populate("ingredients.ingredient");

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found.",
        });
      }

      // Check if menu item is manually unavailable
      if (!menuItem.available) {
        return res.status(400).json({
          message: `${menuItem.name} is currently unavailable.`,
        });
      }

      // Check all required ingredients
      for (const recipeItem of menuItem.ingredients) {
        const ingredient = recipeItem.ingredient;

        if (!ingredient) {
          return res.status(404).json({
            message: `An ingredient for ${menuItem.name} was not found.`,
          });
        }

        const quantityNeeded =
          recipeItem.quantity * orderItem.quantity;

        if (ingredient.quantity < quantityNeeded) {
          return res.status(400).json({
            message: `Not enough ${ingredient.name} in stock for ${menuItem.name}.`,
          });
        }
      }
    }

    // Deduct ingredients after all stock checks pass
    for (const orderItem of items) {
      const menuItem = await MenuItem.findById(
        orderItem.menuItem
      ).populate("ingredients.ingredient");

      for (const recipeItem of menuItem.ingredients) {
        const quantityNeeded =
          recipeItem.quantity * orderItem.quantity;

        // Deduct ingredient and get updated quantity
        const updatedIngredient =
          await Ingredient.findByIdAndUpdate(
            recipeItem.ingredient._id,
            {
              $inc: {
                quantity: -quantityNeeded,
              },
            },
            {
              new: true,
            }
          );

          const io = req.app.get("io");
          io.emit("inventoryUpdated", updatedIngredient);

        // Create low-stock notification
        if (
          updatedIngredient.quantity <=
          updatedIngredient.lowStockThreshold
        ) {
          const notification = await Notification.create({
            message: `Low stock alert: ${updatedIngredient.name} has only ${updatedIngredient.quantity} units remaining.`,
            type: "low-stock",
            ingredient: updatedIngredient._id,
          });

          io.emit("lowStockNotification", notification);
        }
      }
    }

    // Create the order
    const order = await Order.create({
      customer: req.user.userId,
      items,
    });

    // Get customer details
    const customer = await User.findById(
      req.user.userId
    );

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send order confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: "Cafe Order Confirmation",
      text: `Your order has been received successfully. Order ID: ${order._id}. Status: ${order.status}`,
    });

    res.status(201).json(order);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.userId,
    })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};