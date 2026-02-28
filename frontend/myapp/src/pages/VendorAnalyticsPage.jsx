import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getVendorAnalytics } from "../services/analyticsService";
import ChartComponent from "../components/ChartComponent";
import { formatCurrency, formatDate } from "../utils/helpers";

const STATUS_COLOR = {
  processing: "#f59e0b",
  shipped: "#3b82f6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const STATUS_BG = {
  processing: "#fef3c7",
  shipped: "#dbeafe",
  delivered: "#d1fae5",
  cancelled: "#fee2e2",
};

export default function VendorAnalyticsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await getVendorAnalytics();
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
        setError("");
      } else {
        setError("Failed to load analytics data");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error loading analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "vendor") { navigate("/"); return; }
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [user, navigate, fetchData]);

  // ── Chart configs ────────────────────────────────────────────────
  const monthlyChartData = {
    labels: data?.monthlySales?.map(item =>
      new Date(item._id.year, item._id.month - 1)
        .toLocaleString("default", { month: "short", year: "2-digit" })
    ) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: data?.monthlySales?.map(i => i.revenue) || [],
        backgroundColor: "rgba(45,74,62,0.15)",
        borderColor: "#2d4a3e",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2d4a3e",
        pointRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: data?.monthlySales?.map(i => i.orders) || [],
        backgroundColor: "rgba(200,169,110,0.15)",
        borderColor: "#c8a96e",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#c8a96e",
        pointRadius: 4,
        yAxisID: "y1",
      }
    ]
  };

  const monthlyChartOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.dataset.label === "Revenue (₹)"
            ? ` ₹${ctx.raw?.toFixed(2)}`
            : ` ${ctx.raw} orders`
        }
      }
    },
    scales: {
      y: { beginAtZero: true, position: "left", ticks: { callback: v => `₹${v}` } },
      y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false } }
    }
  };

  const topProductsChartData = {
    labels: data?.topSellingProducts?.map(i => i.productName || "Unknown") || [],
    datasets: [{
      label: "Units Sold",
      data: data?.topSellingProducts?.map(i => i.totalQuantity) || [],
      backgroundColor: ["#2d4a3e","#c8a96e","#4a7c6f","#e8c98a","#1a2e26"],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const topProductsOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } }
    }
  };

  const statusChartData = {
    labels: data?.ordersByStatus?.map(s => s._id.charAt(0).toUpperCase() + s._id.slice(1)) || [],
    datasets: [{
      data: data?.ordersByStatus?.map(s => s.count) || [],
      backgroundColor: data?.ordersByStatus?.map(s => STATUS_COLOR[s._id] || "#94a3b8") || [],
      borderWidth: 0,
    }]
  };

  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={{ color: "#888", marginTop: 16 }}>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-primary" onClick={() => fetchData()}>Retry</button>
      </div>
    );
  }

  const { totalSales, monthlySales, topSellingProducts, recentOrders, pendingOrders, ordersByStatus } = data || {};

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalSales?.totalRevenue || 0),
      icon: "💰",
      color: "#2d4a3e",
      bg: "#e8f0ec",
      sub: "From delivered orders"
    },
    {
      label: "Total Orders",
      value: totalSales?.totalOrders || 0,
      icon: "📦",
      color: "#1d4ed8",
      bg: "#dbeafe",
      sub: "Delivered orders"
    },
    {
      label: "Units Sold",
      value: totalSales?.totalQuantitySold || 0,
      icon: "🏷️",
      color: "#7c3aed",
      bg: "#ede9fe",
      sub: "Total quantity"
    },
    {
      label: "Pending",
      value: pendingOrders || 0,
      icon: "⏳",
      color: "#b45309",
      bg: "#fef3c7",
      sub: "Need attention"
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .analytics-page { font-family: 'DM Sans', sans-serif; background: #f7f5f2; min-height: 100vh; }
        .stat-card { background: #fff; border-radius: 14px; padding: 24px; border: 1px solid #ede8e2; transition: box-shadow 0.2s; }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .chart-card { background: #fff; border-radius: 14px; padding: 24px; border: 1px solid #ede8e2; margin-bottom: 24px; }
        .chart-card h5 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #1a2e26; margin-bottom: 16px; }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #888; font-weight: 600; padding: 10px 14px; border-bottom: 2px solid #f0ebe4; }
        .orders-table td { padding: 12px 14px; border-bottom: 1px solid #f5f0ea; font-size: 0.88rem; color: #333; vertical-align: middle; }
        .orders-table tr:last-child td { border-bottom: none; }
        .orders-table tr:hover td { background: #faf8f5; }
        .status-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
        .refresh-btn { background: none; border: 1px solid #ddd; border-radius: 8px; padding: 6px 14px; font-size: 0.82rem; color: #666; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .refresh-btn:hover { background: #f5f5f5; color: #333; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .page-header { font-family: 'Playfair Display', serif; font-size: 1.9rem; color: #1a2e26; margin-bottom: 4px; }
      `}</style>

      <div className="analytics-page">
        <div className="container py-4">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <div>
              <h2 className="page-header">Analytics Dashboard</h2>
              <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="refresh-btn" onClick={() => fetchData(true)} disabled={refreshing}>
                <span className={refreshing ? "spin" : ""}>🔄</span>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/dashboard")}>
                ← Dashboard
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="row g-3 mb-4">
            {statCards.map((card, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="stat-card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                      {card.icon}
                    </div>
                  </div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 700, color: card.color, lineHeight: 1.1, marginBottom: 4 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#444", marginBottom: 2 }}>{card.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#999" }}>{card.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="row g-3 mb-3">
            {/* Monthly trends */}
            <div className="col-lg-8">
              <div className="chart-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ marginBottom: 0 }}>Revenue & Orders Trend</h5>
                  <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Last 6 months</span>
                </div>
                {monthlySales?.length > 0 ? (
                  <ChartComponent type="line" data={monthlyChartData} options={monthlyChartOptions} />
                ) : (
                  <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 36 }}>📈</span>
                    <span style={{ fontSize: "0.88rem" }}>No sales data yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order status breakdown */}
            <div className="col-lg-4">
              <div className="chart-card" style={{ height: "100%" }}>
                <h5>Orders by Status</h5>
                {ordersByStatus?.length > 0 ? (
                  <ChartComponent type="pie" data={statusChartData} options={statusChartOptions} />
                ) : (
                  <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 36 }}>📊</span>
                    <span style={{ fontSize: "0.88rem" }}>No order data yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top products chart */}
          <div className="row g-3 mb-3">
            <div className="col-lg-6">
              <div className="chart-card">
                <h5>Top Selling Products</h5>
                {topSellingProducts?.length > 0 ? (
                  <ChartComponent type="bar" data={topProductsChartData} options={topProductsOptions} />
                ) : (
                  <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 36 }}>🏆</span>
                    <span style={{ fontSize: "0.88rem" }}>No product sales yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top products list */}
            <div className="col-lg-6">
              <div className="chart-card" style={{ height: "100%" }}>
                <h5>Product Performance</h5>
                {topSellingProducts?.length > 0 ? (
                  <div>
                    {topSellingProducts.map((p, i) => (
                      <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: ["#2d4a3e","#c8a96e","#4a7c6f","#e8c98a","#1a2e26"][i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.productName || "Unknown product"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#888" }}>
                            {p.totalQuantity} units · {formatCurrency(p.totalRevenue)}
                          </div>
                        </div>
                        <div style={{ width: 80, height: 6, background: "#f0ebe4", borderRadius: 3, flexShrink: 0 }}>
                          <div style={{ height: "100%", borderRadius: 3, background: ["#2d4a3e","#c8a96e","#4a7c6f","#e8c98a","#1a2e26"][i], width: `${Math.min(100, (p.totalQuantity / (topSellingProducts[0]?.totalQuantity || 1)) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#bbb", textAlign: "center", paddingTop: 40, fontSize: "0.88rem" }}>No sales data yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent orders table */}
          <div className="chart-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ marginBottom: 0 }}>Recent Orders</h5>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/dashboard?tab=orders")}>
                View All →
              </button>
            </div>
            {recentOrders?.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#888" }}>
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {order.product?.image && (
                              <img src={order.product.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                            )}
                            <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {order.product?.title || "—"}
                            </span>
                          </div>
                        </td>
                        <td>{order.buyer?.name || "—"}</td>
                        <td>{order.quantity}</td>
                        <td style={{ fontWeight: 600, color: "#2d4a3e" }}>{formatCurrency(order.totalPrice)}</td>
                        <td>
                          <span className="status-pill" style={{ background: STATUS_BG[order.status] || "#f1f5f9", color: STATUS_COLOR[order.status] || "#64748b" }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ color: "#888" }}>{formatDate(order.createdAt, "short")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                <p style={{ fontSize: "0.88rem" }}>No orders yet</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

const styles = {
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f5f2"
  },
  spinner: {
    width: 40, height: 40,
    border: "3px solid #e0dbd4",
    borderTop: "3px solid #2d4a3e",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  }
};