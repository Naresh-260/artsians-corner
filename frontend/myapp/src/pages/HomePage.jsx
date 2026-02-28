// =================================================================
// Home Page - Product listing with search, filter and cart actions
// =================================================================

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import { formatCurrency } from "../utils/helpers";

function HomePage() {
  const { user } = useContext(AuthContext);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [addingId, setAddingId] = useState(null);
  const [cartMessage, setCartMessage] = useState({ id: null, msg: "", type: "" });

  // ── Fetch all products ─────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getAllProducts();
        setProducts(data || []);
        setFiltered(data || []);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Search + Sort ──────────────────────────────────────────────
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.vendor?.name?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "newest":     result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: break;
    }

    setFiltered(result);
  }, [search, sortBy, products]);

  // ── Add to cart ────────────────────────────────────────────────
  const handleAddToCart = async (productId) => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "buyer") {
      setCartMessage({ id: productId, msg: "Only buyers can add to cart", type: "danger" });
      setTimeout(() => setCartMessage({ id: null, msg: "", type: "" }), 3000);
      return;
    }

    try {
      setAddingId(productId);
      await addItem(productId, 1);
      setCartMessage({ id: productId, msg: "Added to cart!", type: "success" });
      setTimeout(() => setCartMessage({ id: null, msg: "", type: "" }), 2500);
    } catch (err) {
      setCartMessage({
        id: productId,
        msg: err?.response?.data?.message || "Failed to add to cart",
        type: "danger"
      });
      setTimeout(() => setCartMessage({ id: null, msg: "", type: "" }), 3000);
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (productId) => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "buyer") return;
    try {
      setAddingId(productId);
      await addItem(productId, 1);
      navigate("/checkout");
    } catch (err) {
      setCartMessage({
        id: productId,
        msg: err?.response?.data?.message || "Failed",
        type: "danger"
      });
      setTimeout(() => setCartMessage({ id: null, msg: "", type: "" }), 3000);
    } finally {
      setAddingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="container mt-4 mb-5">

      {/* Hero / welcome */}
      {/* ── Hero Section ── */}
<div style={{ position: "relative", overflow: "hidden", borderRadius: 20, marginBottom: 36 }}>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap');
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatDot {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-12px); }
    }
    .hero-badge { animation: fadeUp 0.5s ease both; }
    .hero-title { animation: fadeUp 0.6s ease 0.1s both; }
    .hero-sub   { animation: fadeUp 0.6s ease 0.2s both; }
    .hero-btns  { animation: fadeUp 0.6s ease 0.3s both; }
    .hero-stats { animation: fadeUp 0.6s ease 0.4s both; }
    .hero-dot-1 { animation: floatDot 3.5s ease-in-out infinite; }
    .hero-dot-2 { animation: floatDot 4.5s ease-in-out 1s infinite; }
    .hero-dot-3 { animation: floatDot 3s ease-in-out 0.5s infinite; }
  `}</style>

  {/* Background */}
  <div style={{
    background: "linear-gradient(135deg, #1a2e26 0%, #2d4a3e 50%, #3d6b58 100%)",
    padding: "56px 40px 48px",
    position: "relative",
  }}>
    {/* Decorative floating circles */}
    <div className="hero-dot-1" style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:"rgba(200,169,110,0.08)", top:-40, right:80, pointerEvents:"none" }} />
    <div className="hero-dot-2" style={{ position:"absolute", width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)", bottom:-20, right:240, pointerEvents:"none" }} />
    <div className="hero-dot-3" style={{ position:"absolute", width:60, height:60, borderRadius:"50%", background:"rgba(200,169,110,0.12)", top:30, right:300, pointerEvents:"none" }} />

    {/* Badge */}
    <div className="hero-badge" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,169,110,0.15)", border:"1px solid rgba(200,169,110,0.3)", borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#c8a96e", display:"inline-block" }} />
      <span style={{ color:"#c8a96e", fontSize:"0.78rem", fontFamily:"'DM Sans', sans-serif", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>
        India's Handcraft Marketplace
      </span>
    </div>

    {/* Title */}
    <h1 className="hero-title" style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(2rem, 5vw, 3.2rem)",
      color: "#fff",
      lineHeight: 1.15,
      marginBottom: 16,
      maxWidth: 560,
    }}>
      Where Every Product<br />
      <em style={{ color:"#c8a96e", fontStyle:"italic" }}>Tells a Story</em>
    </h1>

    {/* Subtitle */}
    <p className="hero-sub" style={{
      fontFamily: "'DM Sans', sans-serif",
      color: "rgba(255,255,255,0.65)",
      fontSize: "1rem",
      maxWidth: 480,
      lineHeight: 1.7,
      marginBottom: 28,
    }}>
      Discover authentic handcrafted goods from passionate artisans across India — pottery, textiles, jewellery, woodwork and more.
    </p>

    {/* Buttons */}
    <div className="hero-btns" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
      {!user && (
        <>
          <button
            onClick={() => navigate("/register")}
            style={{ padding:"12px 28px", background:"#c8a96e", border:"none", borderRadius:10, color:"#1a2e26", fontWeight:700, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"background 0.2s" }}
            onMouseOver={e => e.target.style.background="#b8965a"}
            onMouseOut={e => e.target.style.background="#c8a96e"}
          >
            Start Shopping
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding:"12px 28px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, color:"#fff", fontWeight:600, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
          >
            Become a Vendor
          </button>
        </>
      )}
      {user?.role === "vendor" && (
        <>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding:"12px 28px", background:"#c8a96e", border:"none", borderRadius:10, color:"#1a2e26", fontWeight:700, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
          >
            🏪 My Dashboard
          </button>
          <button
            onClick={() => navigate("/vendor-analytics")}
            style={{ padding:"12px 28px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, color:"#fff", fontWeight:600, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
          >
            📊 Analytics
          </button>
        </>
      )}
      {user?.role === "buyer" && (
        <button
          onClick={() => navigate("/my-orders")}
          style={{ padding:"12px 28px", background:"#c8a96e", border:"none", borderRadius:10, color:"#1a2e26", fontWeight:700, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
        >
          📦 My Orders
        </button>
      )}
    </div>

    {/* Stats strip */}
    <div className="hero-stats" style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
      {[
        { value: `${products.length}+`, label: "Products" },
        { value: "12+", label: "Artisans" },
        { value: "100%", label: "Handmade" },
        { value: "🇮🇳", label: "Made in India" },
      ].map((s, i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"#c8a96e", fontWeight:700 }}>{s.value}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Search + Sort bar */}
      <div className="row g-2 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search products, vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-muted small mb-3">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          {search && ` for "${search}"`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: 48 }}>🔍</div>
          <h5 className="mt-3">No products found</h5>
          <p className="text-muted">
            {search ? `No results for "${search}". Try a different search.` : "No products available yet."}
          </p>
          {search && (
            <button className="btn btn-outline-secondary" onClick={() => setSearch("")}>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="row g-4">
          {filtered.map(product => (
            <div key={product._id} className="col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm">

                {/* Product image */}
                <div
                  style={{ height: 200, overflow: "hidden", cursor: "pointer" }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover", transition: "transform 0.2s" }}
                      onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                      onMouseOut={e => e.target.style.transform = "scale(1)"}
                      onError={e => { e.target.src = "/placeholder-image.jpg"; }}
                    />
                  ) : (
                    <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                      <span className="text-muted">No Image</span>
                    </div>
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  {/* Title */}
                  <h6
                    className="fw-bold mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.title}
                  </h6>

                  {/* Vendor */}
                  {product.vendor?.name && (
                    <small className="text-muted mb-1">by {product.vendor.name}</small>
                  )}

                  {/* Rating */}
                  {product.averageRating > 0 && (
                    <div className="d-flex align-items-center mb-1">
                      <StarRating rating={product.averageRating} readOnly size="sm" />
                      <small className="text-muted ms-1">({product.reviewCount || 0})</small>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-muted small mb-2" style={{ flexGrow: 1 }}>
                    {product.description?.substring(0, 70)}{product.description?.length > 70 ? "..." : ""}
                  </p>

                  {/* Price + stock */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary fs-6">{formatCurrency(product.price)}</span>
                    <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-secondary"}`}>
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  </div>

                  {/* Cart message */}
                  {cartMessage.id === product._id && (
                    <div className={`alert alert-${cartMessage.type} py-1 px-2 small mb-2`}>
                      {cartMessage.msg}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="d-flex flex-column gap-2 mt-auto">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View Details
                    </button>

                    {user?.role === "buyer" && product.stock > 0 && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm flex-grow-1"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={addingId === product._id}
                        >
                          {addingId === product._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : "🛒 Add to Cart"}
                        </button>
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          onClick={() => handleBuyNow(product._id)}
                          disabled={addingId === product._id}
                        >
                          Buy Now
                        </button>
                      </div>
                    )}

                    {!user && product.stock > 0 && (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate("/login")}
                      >
                        Login to Buy
                      </button>
                    )}

                    {product.stock === 0 && (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Out of Stock
                      </button>
                    )}
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

export default HomePage;