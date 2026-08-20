const Order = require("../models/Order");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    const order = await Order.create({
      customer: req.user.userId,
      items,
    });

    // Get customer details
    const customer = await User.findById(req.user.userId);

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

const io = req.app.get("io");
io.emit("newOrder", order);


    res.status(201).json(order);
  } catch (error) {
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

const io = req.app.get("io");
io.emit("orderStatusUpdated", order);
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