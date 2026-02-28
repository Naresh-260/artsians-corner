import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { AuthContext } from "../context/AuthContext";
import { formatCurrency, formatDate } from "../utils/helpers";

const STATUS_COLORS = {
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const STATUS_ICONS = {
  processing: "⏳",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

function MyOrdersPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "buyer") { navigate("/"); return; }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await getMyOrders(user.token);
        // API returns array directly or nested in .orders
        setOrders(data.orders || data || []);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Orders</h2>
        <span className="text-muted">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: 48 }}>📦</div>
          <h5 className="mt-3">No orders yet</h5>
          <p className="text-muted">You haven't placed any orders.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">

                  {/* Product image */}
                  <div className="col-auto">
                    {order.product?.image ? (
                      <img
                        src={order.product.image}
                        alt={order.product?.title}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                        onError={e => { e.target.src = "/placeholder-image.jpg"; }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded"
                        style={{ width: 80, height: 80 }}
                      >
                        <span style={{ fontSize: 28 }}>📦</span>
                      </div>
                    )}
                  </div>

                  {/* Order details */}
                  <div className="col">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <h5 className="mb-1 fw-bold">
                          {order.product?.title || "Product unavailable"}
                        </h5>
                        <p className="text-muted mb-1 small">
                          Order ID: <span className="font-monospace">{order._id}</span>
                        </p>
                        <p className="text-muted mb-1 small">
                          Placed on: {formatDate(order.createdAt, "long")}
                        </p>
                        {order.product?.vendor?.name && (
                          <p className="text-muted mb-1 small">
                            Sold by: {order.product.vendor.name}
                          </p>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="text-end">
                        <span className={`badge bg-${STATUS_COLORS[order.status] || "secondary"} fs-6 px-3 py-2`}>
                          {STATUS_ICONS[order.status]} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity + Price row */}
                    <div className="d-flex gap-4 mt-2 flex-wrap">
                      <div>
                        <small className="text-muted">Quantity</small>
                        <div className="fw-bold">{order.quantity}</div>
                      </div>
                      <div>
                        <small className="text-muted">Total Paid</small>
                        <div className="fw-bold text-primary">{formatCurrency(order.totalPrice)}</div>
                      </div>
                      {order.paymentId && (
                        <div>
                          <small className="text-muted">Payment ID</small>
                          <div className="font-monospace small">{order.paymentId}</div>
                        </div>
                      )}
                    </div>

                    {/* Delivery status message */}
                    <div className={`alert alert-${STATUS_COLORS[order.status] || "secondary"} py-2 px-3 mt-3 mb-0 small`}>
                      {order.status === "processing" && "⏳ Your order is being processed and will be shipped soon."}
                      {order.status === "shipped" && "🚚 Your order is on the way! Expected delivery in 3–5 business days."}
                      {order.status === "delivered" && "✅ Your order has been delivered. Enjoy your purchase!"}
                      {order.status === "cancelled" && "❌ This order was cancelled."}
                    </div>

                    {/* Action buttons */}
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      {order.product?._id && (
                        <Link
                          to={`/product/${order.product._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Product
                        </Link>
                      )}
                      {order.status === "delivered" && order.product?._id && (
                        <Link
                          to={`/product/${order.product._id}#reviews`}
                          className="btn btn-outline-success btn-sm"
                        >
                          ✍️ Write a Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;