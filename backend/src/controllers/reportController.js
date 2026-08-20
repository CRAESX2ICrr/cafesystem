const Order = require("../models/Order");

const getSalesReport = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItem");

    let totalSales = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.menuItem) {
          totalSales += item.menuItem.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const inProgressOrders = orders.filter(
      (order) => order.status === "In-Progress"
    ).length;

    const readyOrders = orders.filter(
      (order) => order.status === "Ready"
    ).length;

    res.json({
      totalOrders: orders.length,
      totalItemsSold,
      totalSales,
      ordersByStatus: {
        Pending: pendingOrders,
        "In-Progress": inProgressOrders,
        Ready: readyOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADMIN - Export sales report as CSV
const exportSalesReportCSV = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItem");

    let totalSales = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.menuItem) {
          totalSales += item.menuItem.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const inProgressOrders = orders.filter(
      (order) => order.status === "In-Progress"
    ).length;

    const readyOrders = orders.filter(
      (order) => order.status === "Ready"
    ).length;

    const csv = [
      "Metric,Value",
      `Total Orders,${orders.length}`,
      `Total Items Sold,${totalItemsSold}`,
      `Total Sales,${totalSales}`,
      `Pending Orders,${pendingOrders}`,
      `In-Progress Orders,${inProgressOrders}`,
      `Ready Orders,${readyOrders}`,
    ].join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("sales-report.csv");

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSalesReport,
  exportSalesReportCSV,
};