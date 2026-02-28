import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
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
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          top: -100px;
          left: -100px;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          bottom: -80px;
          right: -80px;
        }

        .auth-brand {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .auth-brand span {
          color: #c8a96e;
        }

        .auth-tagline {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          text-align: center;
          max-width: 280px;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .auth-decorations {
          display: flex;
          gap: 24px;
          margin-top: 48px;
          position: relative;
          z-index: 1;
        }

        .auth-dec-item {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          width: 100px;
        }

        .auth-dec-item .icon { font-size: 1.6rem; margin-bottom: 6px; }
        .auth-dec-item .label { font-size: 0.72rem; color: rgba(255,255,255,0.5); }

        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .auth-form-box {
          width: 100%;
          max-width: 420px;
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
          margin-bottom: 32px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 500;
          color: #444;
          margin-bottom: 7px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .field-wrap {
          position: relative;
        }

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

        .field-wrap input.error {
          border-color: #e05252;
        }

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

        .error-msg {
          color: #e05252;
          font-size: 0.82rem;
          margin-top: 6px;
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
          margin-top: 24px;
          font-size: 0.9rem;
          color: #888;
        }

        .auth-footer a {
          color: #2d4a3e;
          font-weight: 500;
          text-decoration: none;
        }

        .auth-footer a:hover { text-decoration: underline; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: #ccc;
          font-size: 0.8rem;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e3dd;
        }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 32px 20px; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-brand">Artisan's <span>Corner</span></div>
          <p className="auth-tagline">
            Discover handcrafted goods from passionate independent artisans across India.
          </p>
          <div className="auth-decorations">
            <div className="auth-dec-item">
              <div className="icon">🎨</div>
              <div className="label">Handcrafted</div>
            </div>
            <div className="auth-dec-item">
              <div className="icon">🛍️</div>
              <div className="label">Shop Local</div>
            </div>
            <div className="auth-dec-item">
              <div className="icon">⭐</div>
              <div className="label">Trusted</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-form-box">
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your account to continue</p>

            {error && <div className="auth-error-box">⚠️ {error}</div>}

            <form onSubmit={handleLogin}>
              <div className="field-group">
                <label>Email Address</label>
                <div className="field-wrap">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="field-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">Create one free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}