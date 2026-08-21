const Supplier = require("../models/Supplier");

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one supplier
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create supplier
const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
    } = req.body;

    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address,
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(
      req.params.id
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};