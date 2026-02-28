// =================================================================
// Seller Dashboard Page - Manage products and orders
// =================================================================

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorOrders, updateOrderStatus } from "../services/orderService";
import { getMyProducts, createProduct, deleteProduct, updateProduct } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import { formatCurrency, formatDate } from "../utils/helpers";

const STATUS_COLORS = {
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const emptyForm = { title: "", description: "", price: "", stock: "" };

function SellerDashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [orderMessage, setOrderMessage] = useState("");

  // ── Auth guard ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "vendor") { navigate("/"); return; }
  }, [user, navigate]);

  // ── Fetch data ─────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const { data } = await getMyProducts(user.token);
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await getVendorOrders(user.token);
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "vendor" && user?.token) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  // ── Product form handlers ──────────────────────────────────────
  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview(null);
    setEditId(null);
    setFormError("");
  };

  const handleSubmitProduct = async () => {
    const { title, description, price, stock } = form;

    if (!title || !price || !stock) {
      setFormError("Title, price and stock are required.");
      return;
    }
    if (!editId && !image) {
      setFormError("Product image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      if (editId) {
        await updateProduct(editId, formData, user.token);
        setFormSuccess("Product updated successfully!");
      } else {
        await createProduct(formData, user.token);
        setFormSuccess("Product added successfully!");
      }
      resetForm();
      fetchProducts();
      setTimeout(() => setFormSuccess(""), 4000);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
    });
    setImage(null);
    setPreview(null);
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id, user.token);
      fetchProducts();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Delete failed.");
    }
  };

  // ── Order status handler ───────────────────────────────────────
  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, nextStatus, user.token);
      fetchOrders();
      setOrderMessage(`Order marked as ${nextStatus}!`);
      setTimeout(() => setOrderMessage(""), 3000);
    } catch (err) {
      setOrderMessage(err?.response?.data?.message || "Failed to update order status.");
      setTimeout(() => setOrderMessage(""), 3000);
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="container mt-4 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Vendor Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}</p>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/vendor-analytics")}
        >
          📊 View Analytics
        </button>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-center p-3">
            <div className="fs-3 fw-bold text-primary">{products.length}</div>
            <div className="text-muted small">Products</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center p-3">
            <div className="fs-3 fw-bold text-warning">
              {orders.filter(o => o.status === "processing").length}
            </div>
            <div className="text-muted small">Pending Orders</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center p-3">
            <div className="fs-3 fw-bold text-info">
              {orders.filter(o => o.status === "shipped").length}
            </div>
            <div className="text-muted small">Shipped</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-center p-3">
            <div className="fs-3 fw-bold text-success">
              {orders.filter(o => o.status === "delivered").length}
            </div>
            <div className="text-muted small">Delivered</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {/* Custom tab switcher - no Bootstrap nav-tabs */}
<div style={{
  display: "flex",
  gap: 8,
  marginBottom: 24,
  background: "#f0ebe4",
  padding: 4,
  borderRadius: 12,
  width: "fit-content"
}}>
  <button
    onClick={() => setActiveTab("products")}
    style={{
      padding: "10px 24px",
      borderRadius: 9,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      transition: "all 0.15s",
      background: activeTab === "products" ? "#2d4a3e" : "transparent",
      color: activeTab === "products" ? "#fff" : "#666",
      boxShadow: activeTab === "products" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    }}
  >
    🛍️ Products ({products.length})
  </button>

  <button
    onClick={() => setActiveTab("orders")}
    style={{
      padding: "10px 24px",
      borderRadius: 9,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      transition: "all 0.15s",
      background: activeTab === "orders" ? "#2d4a3e" : "transparent",
      color: activeTab === "orders" ? "#fff" : "#666",
      boxShadow: activeTab === "orders" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    📦 Orders ({orders.length})
    {orders.filter(o => o.status === "processing").length > 0 && (
      <span style={{
        background: "#ef4444",
        color: "#fff",
        borderRadius: 10,
        padding: "1px 7px",
        fontSize: "0.72rem",
        fontWeight: 700,
      }}>
        {orders.filter(o => o.status === "processing").length}
      </span>
    )}
  </button>
</div>

      {/* ── PRODUCTS TAB ── */}
      {activeTab === "products" && (
        <div>
          {/* Add / Edit form */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h5>
            </div>
            <div className="card-body">
              {formError && <div className="alert alert-danger py-2">{formError}</div>}
              {formSuccess && <div className="alert alert-success py-2">{formSuccess}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-control"
                    name="title"
                    placeholder="Product title"
                    value={form.title}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    className="form-control"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Stock *</label>
                  <input
                    className="form-control"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows={2}
                    placeholder="Describe your product..."
                    value={form.description}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Product Image {!editId && "*"}
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {editId && !preview && (
                    <small className="text-muted">Leave empty to keep current image.</small>
                  )}
                </div>
                {preview && (
                  <div className="col-md-6 d-flex align-items-end">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ height: 80, width: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitProduct}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" />{editId ? "Updating..." : "Adding..."}</>
                  ) : (
                    editId ? "Update Product" : "Add Product"
                  )}
                </button>
                {editId && (
                  <button className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products list */}
          <h5 className="mb-3">My Products</h5>
          {productsLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: 40 }}>📦</div>
              <p className="mt-2">No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="row g-3">
              {products.map(p => (
                <div key={p._id} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="card-img-top"
                        style={{ height: 180, objectFit: "cover" }}
                        onError={e => { e.target.src = "/placeholder-image.jpg"; }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="fw-bold">{p.title}</h6>
                      <p className="text-muted small mb-1">{p.description?.substring(0, 60)}{p.description?.length > 60 ? "..." : ""}</p>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-primary fw-bold">{formatCurrency(p.price)}</span>
                        <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-warning btn-sm flex-grow-1"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() => handleDelete(p._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === "orders" && (
        <div>
          {orderMessage && (
            <div className={`alert ${orderMessage.includes("Failed") ? "alert-danger" : "alert-success"} py-2 mb-3`}>
              {orderMessage}
            </div>
          )}

          {ordersLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: 40 }}>📋</div>
              <p className="mt-2">No orders yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map(order => (
                <div key={order._id} className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Product image */}
                      <div className="col-auto">
                        {order.product?.image ? (
                          <img
                            src={order.product.image}
                            alt={order.product?.title}
                            style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }}
                            onError={e => { e.target.src = "/placeholder-image.jpg"; }}
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 70, height: 70 }}>
                            <span style={{ fontSize: 24 }}>📦</span>
                          </div>
                        )}
                      </div>

                      {/* Order info */}
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <div>
                            <h6 className="fw-bold mb-1">{order.product?.title}</h6>
                            <p className="text-muted small mb-1">
                              Buyer: <strong>{order.buyer?.name || "Unknown"}</strong>
                            </p>
                            <p className="text-muted small mb-1">
                              Ordered: {formatDate(order.createdAt, "long")}
                            </p>
                            <p className="text-muted small mb-0">
                              Qty: {order.quantity} &nbsp;·&nbsp;
                              Total: <strong className="text-primary">{formatCurrency(order.totalPrice)}</strong>
                            </p>
                          </div>
                          <span className={`badge bg-${STATUS_COLORS[order.status] || "secondary"} fs-6 px-3 py-2`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 d-flex gap-2 flex-wrap">
                          {order.status === "processing" && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleStatusUpdate(order._id, "shipped")}
                              disabled={updatingOrder === order._id}
                            >
                              {updatingOrder === order._id
                                ? <span className="spinner-border spinner-border-sm" />
                                : "🚚 Mark as Shipped"
                              }
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleStatusUpdate(order._id, "delivered")}
                              disabled={updatingOrder === order._id}
                            >
                              {updatingOrder === order._id
                                ? <span className="spinner-border spinner-border-sm" />
                                : "✅ Mark as Delivered"
                              }
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <span className="text-success small fw-bold">✅ Order completed</span>
                          )}
                          {order.status === "cancelled" && (
                            <span className="text-danger small fw-bold">❌ Order cancelled</span>
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
      )}
    </div>
  );
}

export default SellerDashboardPage;