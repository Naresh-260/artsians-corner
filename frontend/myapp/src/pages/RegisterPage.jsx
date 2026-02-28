import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "buyer"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      login(data);
      navigate("/");
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .auth-page {
          min-height: 100vh;
          display: flex;
          background: #faf8f5;
          font-family: 'DM Sans', sans-serif;
        }

        .auth-left {
          flex: 1;
          background: linear-gradient(160deg, #2d4a3e 0%, #1a2e26 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 40px;
          position: relative;
          overflow: hidden;
        }

        .auth-left::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          top: -100px; left: -100px;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          bottom: -80px; right: -80px;
        }

        .auth-brand {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .auth-brand span { color: #c8a96e; }

        .auth-tagline {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          text-align: center;
          max-width: 280px;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .role-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 40px;
          width: 100%;
          max-width: 260px;
          position: relative;
          z-index: 1;
        }

        .role-info-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .role-info-card .icon { font-size: 1.4rem; }
        .role-info-card .text { font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.5; }
        .role-info-card .text strong { color: #fff; display: block; margin-bottom: 2px; }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          overflow-y: auto;
        }

        .auth-form-box {
          width: 100%;
          max-width: 440px;
          padding: 12px 0;
        }

        .auth-form-box h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #1a2e26;
          margin-bottom: 6px;
        }

        .auth-form-box .subtitle {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 28px;
        }

        .field-group { margin-bottom: 18px; }

        .field-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 500;
          color: #444;
          margin-bottom: 7px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .field-wrap { position: relative; }

        .field-wrap input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e0dbd4;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          color: #222;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          outline: none;
        }

        .field-wrap input:focus {
          border-color: #2d4a3e;
          box-shadow: 0 0 0 3px rgba(45,74,62,0.08);
        }

        .field-wrap input.has-error { border-color: #e05252; }

        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          font-size: 1rem;
          padding: 0;
        }

        .field-error {
          color: #e05252;
          font-size: 0.8rem;
          margin-top: 5px;
        }

        .auth-error-box {
          background: #fff5f5;
          border: 1px solid #ffc9c9;
          border-radius: 10px;
          padding: 12px 16px;
          color: #c0392b;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }

        .role-selector {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .role-option {
          flex: 1;
          border: 1.5px solid #e0dbd4;
          border-radius: 10px;
          padding: 14px 12px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          background: #fff;
        }

        .role-option:hover { border-color: #2d4a3e; }

        .role-option.selected {
          border-color: #2d4a3e;
          background: #f0f5f2;
        }

        .role-option .role-icon { font-size: 1.5rem; margin-bottom: 4px; }
        .role-option .role-label { font-size: 0.82rem; font-weight: 500; color: #333; }
        .role-option .role-desc { font-size: 0.73rem; color: #888; margin-top: 2px; }

        .btn-auth {
          width: 100%;
          padding: 14px;
          background: #2d4a3e;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 8px;
        }

        .btn-auth:hover:not(:disabled) { background: #1a2e26; }
        .btn-auth:active:not(:disabled) { transform: scale(0.99); }
        .btn-auth:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9rem;
          color: #888;
        }

        .auth-footer a {
          color: #2d4a3e;
          font-weight: 500;
          text-decoration: none;
        }

        .auth-footer a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 32px 20px; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-brand">Artisan's <span>Corner</span></div>
          <p className="auth-tagline">Join a growing community of artisans and craft lovers.</p>
          <div className="role-cards">
            <div className="role-info-card">
              <span className="icon">🛍️</span>
              <div className="text">
                <strong>Buyers</strong>
                Discover and purchase unique handcrafted products
              </div>
            </div>
            <div className="role-info-card">
              <span className="icon">🎨</span>
              <div className="text">
                <strong>Vendors</strong>
                List your creations and reach thousands of customers
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-form-box">
            <h2>Create account</h2>
            <p className="subtitle">Join Artisan's Corner for free today</p>

            {errors.general && (
              <div className="auth-error-box">⚠️ {errors.general}</div>
            )}

            <form onSubmit={handleRegister}>
              <div className="field-group">
                <label>Full Name</label>
                <div className="field-wrap">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "has-error" : ""}
                  />
                </div>
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>

              <div className="field-group">
                <label>Email Address</label>
                <div className="field-wrap">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "has-error" : ""}
                  />
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="field-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "has-error" : ""}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="field-group">
                <label>Confirm Password</label>
                <div className="field-wrap">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "has-error" : ""}
                  />
                </div>
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>

              <div className="field-group">
                <label>I want to</label>
                <div className="role-selector">
                  <div
                    className={`role-option ${formData.role === "buyer" ? "selected" : ""}`}
                    onClick={() => setFormData(p => ({ ...p, role: "buyer" }))}
                  >
                    <div className="role-icon">🛍️</div>
                    <div className="role-label">Buy</div>
                    <div className="role-desc">Shop products</div>
                  </div>
                  <div
                    className={`role-option ${formData.role === "vendor" ? "selected" : ""}`}
                    onClick={() => setFormData(p => ({ ...p, role: "vendor" }))}
                  >
                    <div className="role-icon">🎨</div>
                    <div className="role-label">Sell</div>
                    <div className="role-desc">List products</div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}