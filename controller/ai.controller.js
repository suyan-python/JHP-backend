import Order from "../models/Order.js";

// Utility to group by week/month/day
const getWeekLabel = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = Math.ceil(d.getDate() / 7);
  const month = d.getMonth() + 1;
  return `${year}-${month}-W${week}`;
};

const getMonthLabel = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const getAnalytics = async (req, res) => {
  try {
    // Fetch all paid orders
    const orders = await Order.find({ status: "paid" });

    if (!orders.length) return res.json({ message: "No sales data yet." });

    // --- Weekly & Monthly Sales ---
    const weeklyMap = {};
    const monthlyMap = {};
    const categoryMap = {};
    const productMap = {};

    orders.forEach((order) => {
      const week = getWeekLabel(order.createdAt);
      const month = getMonthLabel(order.createdAt);

      // Weekly sales
      weeklyMap[week] = (weeklyMap[week] || 0) + order.total;
      // Monthly sales
      monthlyMap[month] = (monthlyMap[month] || 0) + order.total;

      // Category & Product revenue
      order.items.forEach((item) => {
        const revenue = item.price * item.quantity;

        const category = item.name || "Uncategorizeddd";

        categoryMap[category] = (categoryMap[category] || 0) + revenue;
        productMap[item.name] = (productMap[item.name] || 0) + revenue;
      });
    });

    // Format data for charts
    const salesDataWeekly = Object.keys(weeklyMap).map((week) => ({
      name: week,
      sales: weeklyMap[week],
    }));
    const salesDataMonthly = Object.keys(monthlyMap).map((month) => ({
      name: month,
      sales: monthlyMap[month],
    }));
    const categoryData = Object.entries(categoryMap).map(([cat, value]) => ({
      name: cat,
      value,
    }));

    // Growth calculation (last vs current month)
    const months = Object.keys(monthlyMap).sort();
    const lastMonthSales =
      months.length > 1 ? monthlyMap[months[months.length - 2]] : 0;
    const thisMonthSales = monthlyMap[months[months.length - 1]];
    const growth =
      lastMonthSales > 0
        ? (((thisMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(
            1,
          )
        : 0;

    // Top and lowest categories/products
    const topCategory = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b,
    );
    const lowestCategory = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] < categoryMap[b] ? a : b,
    );
    const bestProduct = Object.keys(productMap).reduce((a, b) =>
      productMap[a] > productMap[b] ? a : b,
    );

    res.json({
      salesDataWeekly,
      salesDataMonthly,
      categoryData,
      topCategory,
      lowestCategory,
      bestProduct,
      growth,
      totalSales: thisMonthSales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics calculation failed" });
  }
};
