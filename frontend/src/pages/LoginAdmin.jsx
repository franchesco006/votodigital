import { useState } from "react";

const PRIMARY = "#5c1a3a";
const DARK = "#3d1027";
const GOLD = "#c9a84c";

const USUARIOS = [
  { username: "admin@voto.com", password: "admin123" },
];

export default function LoginAdmin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setError("");
    if (!form.username || !form.password) { setError("Completá todos los campos."); return; }
    const user = USUARIOS.find(u => u.username === form.username && u.password === form.password);
    if (!user) { setError("Credenciales incorrectas."); return; }
    localStorage.setItem("jwt_token", "mock_token_admin");
    window.location.href = "/admin/municipios";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DARK} 100%)`, fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 420, boxShadow: "0 32px 80px rgba(0,0,0,0.4)", overflow: "hidden" }}>

        <div style={{ background: PRIMARY, padding: "36px 32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🗳️</div>
          <div style={{ color: GOLD, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>Panel de Administración</div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>VotoDigital</h1>
        </div>

        <div style={{ padding: "36px 32px" }}>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 28, textAlign: "center" }}>
            Ingresá con tu cuenta de administrador electoral
          </p>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #f8b4b4", borderLeft: `4px solid ${PRIMARY}`, borderRadius: 4, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#c0392b" }}>
              ⚠️ {error}
            </div>
          )}

          <label style={{ display: "block", marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: "#666", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Usuario</span>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>👤</span>
              <input name="username" value={form.username} onChange={handleChange}
                placeholder="admin@voto.com"
                style={{ width: "100%", padding: "12px 12px 12px 36px", border: "1.5px solid #ddd", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = "#ddd"} />
            </div>
          </label>

          <label style={{ display: "block", marginBottom: 28 }}>
            <span style={{ fontSize: 12, color: "#666", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Contraseña</span>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔑</span>
              <input name="password" type={showPass ? "text" : "password"} value={form.password}
                onChange={handleChange} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 40px 12px 36px", border: "1.5px solid #ddd", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = "#ddd"} />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#aaa" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button onClick={handleSubmit}
            style={{ width: "100%", padding: "14px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "background .2s" }}
            onMouseOver={e => e.currentTarget.style.background = DARK}
            onMouseOut={e => e.currentTarget.style.background = PRIMARY}>
            Ingresar al Sistema
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="/" style={{ fontSize: 12, color: "#aaa", textDecoration: "none" }}>← Volver a la página principal</a>
          </div>
        </div>

        <div style={{ background: "#f9f7f3", borderTop: "1px solid #e8e2d8", padding: "14px 32px", textAlign: "center" }}>
          <span style={{ fontSize: 11, color: "#bbb", letterSpacing: 1.5, textTransform: "uppercase" }}>Acceso restringido — Solo personal autorizado</span>
        </div>
      </div>
    </div>
  );
}