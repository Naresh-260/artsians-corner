import Order from "../models/order.js";
import Product from "../models/product.js";

const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const vendorProducts = await Product.find({ vendor: vendorId }).select("_id title");
    const productIds = vendorProducts.map(p => p._id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalSales: { totalRevenue: 0, totalOrders: 0, totalQuantitySold: 0 },
          monthlySales: [],
          topSellingProducts: [],
          pendingOrders: 0,
          recentOrders: [],
          ordersByStatus: []
        }
      });
    }

    // Total stats — all non-cancelled orders
    const totalSales = await Order.aggregate([
      { $match: { product: { $in: productIds }, status: { $nin: ["cancelled"] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
          totalQuantitySold: { $sum: "$quantity" }
        }
      }
    ]);

    // Monthly sales — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          product: { $in: productIds },
          status: { $nin: ["cancelled"] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
          quantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Top selling products
    const topSellingProducts = await Order.aggregate([
      { $match: { product: { $in: productIds }, status: { $nin: ["cancelled"] } } },
      {
        $group: {
          _id: "$product",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          productName: { $arrayElemAt: ["$productInfo.title", 0] },
          productImage: { $arrayElemAt: ["$productInfo.image", 0] }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Pending orders count
    const pendingOrders = await Order.countDocuments({
      product: { $in: productIds },
      status: { $in: ["processing", "shipped"] }
    });

    // Recent orders
    const recentOrders = await Order.find({ product: { $in: productIds } })
      .populate("buyer", "name email")
      .populate("product", "title image")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: {
        totalSales: totalSales[0] || { totalRevenue: 0, totalOrders: 0, totalQuantitySold: 0 },
        monthlySales,
        topSellingProducts,
        ordersByStatus,
        pendingOrders,
        recentOrders
      }
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving analytics",
      error: error.message
    });
  }
};

export { getVendorAnalytics };