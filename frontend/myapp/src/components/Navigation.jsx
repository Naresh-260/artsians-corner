import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CartIcon from "./CartIcon";

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .nav-root {
          background: #1a2e26;
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .nav-brand span { color: #c8a96e; }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .nav-link.active { color: #c8a96e; background: rgba(200,169,110,0.1); }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 6px 14px 6px 8px;
        }
        .nav-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #c8a96e;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: #1a2e26;
          flex-shrink: 0;
        }
        .nav-user-name {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          max-width: 100px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .nav-role-badge {
          font-size: 0.65rem;
          background: rgba(200,169,110,0.2);
          color: #c8a96e;
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .btn-nav-logout {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75);
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-nav-logout:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .btn-nav-login {
          background: #c8a96e;
          border: none;
          color: #1a2e26;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-nav-login:hover { background: #b8965a; color: #1a2e26; }
        .btn-nav-register {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.88rem;
          padding: 7px 14px;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .btn-nav-register:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .nav-hamburger {
          display: none;
          background: none; border: none; cursor: pointer; padding: 6px;
          flex-direction: column; gap: 5px;
        }
        .nav-hamburger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.8); border-radius: 2px;
        }
        .mobile-menu {
          display: none;
          background: #1e3530;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px 24px 20px;
          flex-direction: column; gap: 4px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 0.95rem; font-weight: 500;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.15s;
        }
        .mobile-link:hover, .mobile-link.active { color: #c8a96e; }
        .mobile-user-info {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 0 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 4px;
        }
        .mobile-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #c8a96e;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; color: #1a2e26;
        }
        .mobile-name { color: #fff; font-weight: 500; font-size: 0.95rem; }
        .mobile-role { color: rgba(255,255,255,0.5); font-size: 0.78rem; text-transform: capitalize; }
        .btn-mobile-logout {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75);
          border-radius: 8px; padding: 10px;
          font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
          cursor: pointer; margin-top: 8px; width: 100%;
          transition: all 0.15s;
        }
        .btn-mobile-logout:hover { background: rgba(255,255,255,0.14); color: #fff; }
        @media (max-width: 768px) {
          .nav-links, .nav-right { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">Artisan's <span>Corner</span></Link>

          <ul className="nav-links">
            <li><Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Shop</Link></li>
            {user?.role === "buyer" && (
              <>
                <li><Link to="/my-orders" className={`nav-link ${isActive("/my-orders") ? "active" : ""}`}>My Orders</Link></li>
                <li><Link to="/cart" className={`nav-link ${isActive("/cart") ? "active" : ""}`}>Cart</Link></li>
              </>
            )}
            {user?.role === "vendor" && (
              <>
                <li><Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link></li>
                <li><Link to="/vendor-analytics" className={`nav-link ${isActive("/vendor-analytics") ? "active" : ""}`}>Analytics</Link></li>
              </>
            )}
          </ul>

          <div className="nav-right">
            {user?.role === "buyer" && <CartIcon />}
            {user ? (
              <>
                <div className="nav-user-chip">
                  <div className="nav-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <span className="nav-user-name">{user.name}</span>
                  <span className="nav-role-badge">{user.role}</span>
                </div>
                <button className="btn-nav-logout" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-nav-register">Register</Link>
                <Link to="/login" className="btn-nav-login">Sign In</Link>
              </>
            )}
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {user && (
            <div className="mobile-user-info">
              <div className="mobile-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <div className="mobile-name">{user.name}</div>
                <div className="mobile-role">{user.role}</div>
              </div>
            </div>
          )}
          <Link to="/" className={`mobile-link ${isActive("/") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>🏠 Shop</Link>
          {user?.role === "buyer" && (
            <>
              <Link to="/my-orders" className={`mobile-link ${isActive("/my-orders") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
              <Link to="/cart" className={`mobile-link ${isActive("/cart") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>🛒 Cart</Link>
            </>
          )}
          {user?.role === "vendor" && (
            <>
              <Link to="/dashboard" className={`mobile-link ${isActive("/dashboard") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>🏪 Dashboard</Link>
              <Link to="/vendor-analytics" className={`mobile-link ${isActive("/vendor-analytics") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>📊 Analytics</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
          {user && <button className="btn-mobile-logout" onClick={handleLogout}>Sign Out</button>}
        </div>
      </nav>
    </>
  );
}