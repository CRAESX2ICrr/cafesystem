const Ingredient = require("../models/Ingredient");
const Notification = require("../models/Notification");

// Get all ingredients
const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .populate("supplier")
      .sort({ name: 1 });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add a new ingredient
const createIngredient = async (req, res) => {
  try {
    const {
      name,
      quantity,
      lowStockThreshold,
      supplier,
    } = req.body;

    const ingredient = await Ingredient.create({
      name,
      quantity,
      lowStockThreshold,
      supplier,
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update an ingredient
const updateIngredient = async (req, res) => {
  try {
    const {
      name,
      quantity,
      lowStockThreshold,
      supplier,
    } = req.body;

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity,
        lowStockThreshold,
        supplier,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("supplier");

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

const io = req.app.get("io");

// INGREDIENT IS LOW STOCK
if (ingredient.quantity <= ingredient.lowStockThreshold) {
  // Check if a low-stock notification already exists
  const existingNotification = await Notification.findOne({
    ingredient: ingredient._id,
    type: "low-stock",
  });

  // Only create and send a notification if one doesn't already exist
  if (!existingNotification) {
    const notification = await Notification.create({
      message: `Low stock alert: ${ingredient.name} has only ${ingredient.quantity} units remaining.`,
      type: "low-stock",
      ingredient: ingredient._id,
    });

    console.log("Created low-stock notification:", notification);

    // Send notification to staff instantly
    io.emit("lowStockNotification", notification);
  }
}

// INGREDIENT HAS BEEN RESTOCKED
if (ingredient.quantity > ingredient.lowStockThreshold) {
  const deletedNotifications = await Notification.deleteMany({
    ingredient: ingredient._id,
    type: "low-stock",
  });

  console.log("Deleted notifications:", deletedNotifications);

  // Tell staff to remove the notification instantly
  io.emit("lowStockResolved", {
    ingredientId: ingredient._id.toString(),
  });
}

// Send updated inventory to connected clients
io.emit("inventoryUpdated", ingredient);

// Send the updated inventory to connected clients
io.emit("inventoryUpdated", ingredient);

    res.json(ingredient);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete an ingredient
const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    res.json({
      message: "Ingredient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get low-stock ingredients
const getLowStockIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      $expr: {
        $lte: ["$quantity", "$lowStockThreshold"],
      },
    })
      .populate("supplier")
      .sort({ quantity: 1 });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getIngredients,
  getLowStockIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};