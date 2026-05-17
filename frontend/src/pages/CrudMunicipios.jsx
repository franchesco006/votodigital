import { useState, useEffect } from "react";

const PRIMARY = "#5c1a3a";
const DARK = "#3d1027";
const GOLD = "#c9a84c";
const GOB_GRAY = "#f5f5f5";
const GOB_BORDER = "#e0e0e0";

const emptyForm = { nombre: "", codigoPostal: "", poblacion: "", votosTotales: "" };

function ModalOverlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, padding: "32px 28px", width: "100%", maxWidth: 480, boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
        {children}
      </div>
    </div>
  );
}

export default function CrudMunicipios() {
  const [tab, setTab] = useState("municipios");
  const [municipios, setMunicipios] = useState(() => {
    const saved = localStorage.getItem("municipios");
    return saved ? JSON.parse(saved) : [];
  });
  const [votos, setVotos] = useState([]);
  const [search, setSearch] = useState("");
  const [searchVotos, setSearchVotos] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem("municipios");
    if (saved) {
      const data = JSON.parse(saved);
      return data.length > 0 ? Math.max(...data.map(m => m.id)) + 1 : 1;
    }
    return 1;
  });

  useEffect(() => {
    localStorage.setItem("municipios", JSON.stringify(municipios));
  }, [municipios]);

  useEffect(() => {
    const cargar = () => {
      const saved = localStorage.getItem("votos_emitidos");
      if (saved) setVotos(JSON.parse(saved));
    };
    cargar();
    const interval = setInterval(cargar, 1500);
    return () => clearInterval(interval);
  }, []);

  const filtered = municipios.filter(m =>
    m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    m.codigoPostal?.toString().includes(search)
  );

  const filteredVotos = votos.filter(v =>
    v.nombre?.toLowerCase().includes(searchVotos.toLowerCase()) ||
    v.apellido?.toLowerCase().includes(searchVotos.toLowerCase()) ||
    v.curp?.toLowerCase().includes(searchVotos.toLowerCase()) ||
    v.municipio?.toLowerCase().includes(searchVotos.toLowerCase()) ||
    v.partido?.toLowerCase().includes(searchVotos.toLowerCase())
  );

  const openCreate = () => { setForm(emptyForm); setFormError(""); setModal("create"); };
  const openEdit = m => { setSelected(m); setForm({ nombre: m.nombre, codigoPostal: m.codigoPostal, poblacion: m.poblacion, votosTotales: m.votosTotales }); setFormError(""); setModal("edit"); };
  const openDelete = m => { setSelected(m); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es requerido.";
    if (!form.codigoPostal.toString().trim()) return "El código postal es requerido.";
    if (!form.poblacion || isNaN(form.poblacion)) return "La población debe ser un número.";
    return "";
  };

  const handleCreate = () => {
    const err = validate(); if (err) { setFormError(err); return; }
    setMunicipios([...municipios, { id: nextId, nombre: form.nombre, codigoPostal: form.codigoPostal, poblacion: parseInt(form.poblacion), votosTotales: parseInt(form.votosTotales) || 0 }]);
    setNextId(nextId + 1);
    closeModal();
  };

  const handleEdit = () => {
    const err = validate(); if (err) { setFormError(err); return; }
    setMunicipios(municipios.map(m => m.id === selected.id ? { ...m, nombre: form.nombre, codigoPostal: form.codigoPostal, poblacion: parseInt(form.poblacion), votosTotales: parseInt(form.votosTotales) || 0 } : m));
    closeModal();
  };

  const handleDelete = () => {
    setMunicipios(municipios.filter(m => m.id !== selected.id));
    closeModal();
  };

  const eliminarVoto = (id) => {
    const nuevos = votos.filter(v => v.id !== id);
    setVotos(nuevos);
    localStorage.setItem("votos_emitidos", JSON.stringify(nuevos));
  };

  const limpiarVotos = () => {
    setVotos([]);
    localStorage.removeItem("votos_emitidos");
    setModal(null);
  };

  // Stats
  const totalVotos = votos.length;
  const partidoGanando = votos.length > 0 ? Object.entries(votos.reduce((acc, v) => { acc[v.partido] = (acc[v.partido] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0] : null;

  const inputStyle = { width: "100%", padding: "10px 12px", border: `1.5px solid ${GOB_BORDER}`, borderRadius: 6, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", outline: "none" };

  const coloresPartido = { PAN: "#003f8a", PRI: "#009f4d", PRD: "#e6b800", MORENA: "#8b0000", MC: "#f47920", PVEM: "#2e7d32" };

  return (
    <div style={{ minHeight: "100vh", background: GOB_GRAY, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* TOPBAR */}
      <div style={{ background: PRIMARY, color: "#fff", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🗳️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>VotoDigital</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>Panel de Administración</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, textDecoration: "none" }}>← Ver sitio</a>
          <button onClick={() => { localStorage.removeItem("jwt_token"); window.location.href = "/login"; }}
            style={{ background: GOLD, color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${GOB_BORDER}`, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        {[
          { icon: "🏛️", val: municipios.length, label: "Municipios" },
          { icon: "🗳️", val: totalVotos, label: "Votos emitidos" },
          { icon: "🏆", val: partidoGanando ? `${partidoGanando[0]} (${partidoGanando[1]})` : "—", label: "Va ganando" },
          { icon: "👥", val: municipios.reduce((a, m) => a + (parseInt(m.poblacion) || 0), 0).toLocaleString(), label: "Población total" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "20px 24px", textAlign: "center", borderRight: i < 3 ? `1px solid ${GOB_BORDER}` : "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${GOB_BORDER}`, padding: "0 28px", display: "flex", gap: 0 }}>
        {[
          { id: "municipios", label: "🏛️ Municipios" },
          { id: "votos", label: `🗳️ Votos emitidos (${totalVotos})` },
          { id: "estadisticas", label: "📊 Estadísticas" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", borderBottom: tab === t.id ? `3px solid ${PRIMARY}` : "3px solid transparent",
            color: tab === t.id ? PRIMARY : "#888", padding: "16px 20px", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 400, transition: "all .2s"
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* TAB: MUNICIPIOS */}
        {tab === "municipios" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: PRIMARY, margin: 0 }}>Gestión de Municipios</h1>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>Administra los municipios electorales del sistema</p>
              </div>
              <button onClick={openCreate} style={{ background: PRIMARY, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "background .2s" }}
                onMouseOver={e => e.currentTarget.style.background = DARK}
                onMouseOut={e => e.currentTarget.style.background = PRIMARY}>
                + Nuevo Municipio
              </button>
            </div>
            <input placeholder="Buscar por nombre o código postal..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, maxWidth: 360, marginBottom: 16 }} />
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${GOB_BORDER}`, overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: "#aaa" }}>No hay municipios. Crea el primero.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: GOB_GRAY, borderBottom: `2px solid ${GOB_BORDER}` }}>
                      {["#", "Nombre", "Cód. Postal", "Población", "Votos Totales", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, i) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${GOB_BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#aaa" }}>{i + 1}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: PRIMARY }}>{m.nombre}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{m.codigoPostal}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{parseInt(m.poblacion || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>
                          <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                            {parseInt(m.votosTotales || 0).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => openEdit(m)} style={{ background: "#f0eaf4", color: PRIMARY, border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>✏️ Editar</button>
                            <button onClick={() => openDelete(m)} style={{ background: "#fef0f0", color: "#c0392b", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>🗑️ Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>{filtered.length} municipio(s)</div>
          </>
        )}

        {/* TAB: VOTOS */}
        {tab === "votos" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: PRIMARY, margin: 0 }}>Votos Emitidos</h1>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>Registro de todos los votos del sistema</p>
              </div>
              {votos.length > 0 && (
                <button onClick={() => setModal("limpiar")} style={{ background: "#c0392b", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                  🗑️ Limpiar todos los votos
                </button>
              )}
            </div>
            <input placeholder="Buscar por nombre, CURP, municipio o partido..." value={searchVotos} onChange={e => setSearchVotos(e.target.value)}
              style={{ ...inputStyle, maxWidth: 440, marginBottom: 16 }} />
            <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${GOB_BORDER}`, overflow: "hidden" }}>
              {filteredVotos.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", color: "#aaa" }}>
                  {votos.length === 0 ? "Aún no se han emitido votos." : "No hay resultados para tu búsqueda."}
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: GOB_GRAY, borderBottom: `2px solid ${GOB_BORDER}` }}>
                      {["Folio", "Ciudadano", "CURP", "Municipio", "Partido", "Fecha", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVotos.map((v, i) => (
                      <tr key={v.id} style={{ borderBottom: `1px solid ${GOB_BORDER}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>{v.folio}</td>
                        <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{v.nombre} {v.apellido}</td>
                        <td style={{ padding: "11px 16px", fontSize: 11, color: "#888", fontFamily: "monospace" }}>{v.curp}</td>
                        <td style={{ padding: "11px 16px", fontSize: 13 }}>{v.municipio}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <span style={{ background: coloresPartido[v.partido] || PRIMARY, color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            {v.partido}
                          </span>
                        </td>
                        <td style={{ padding: "11px 16px", fontSize: 12, color: "#888" }}>{v.fecha}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <button onClick={() => eliminarVoto(v.id)} style={{ background: "#fef0f0", color: "#c0392b", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>{filteredVotos.length} voto(s) encontrado(s)</div>
          </>
        )}

        {/* TAB: ESTADÍSTICAS */}
        {tab === "estadisticas" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: PRIMARY, margin: "0 0 24px" }}>Estadísticas Electorales</h1>
            {votos.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#aaa", background: "#fff", borderRadius: 8 }}>
                Aún no hay votos para mostrar estadísticas.
              </div>
            ) : (
              <>
                {/* Por partido */}
                <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${GOB_BORDER}`, padding: "24px", marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, margin: "0 0 20px" }}>Votos por Partido</h3>
                  {Object.entries(votos.reduce((acc, v) => { acc[v.partido] = (acc[v.partido] || 0) + 1; return acc; }, {}))
                    .sort((a, b) => b[1] - a[1]).map(([partido, total], i) => {
                      const pct = Math.round((total / votos.length) * 100);
                      return (
                        <div key={partido} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                            <span style={{ fontWeight: 600 }}>
                              {i === 0 && <span style={{ color: GOLD }}>🏆 </span>}{partido}
                            </span>
                            <span style={{ color: "#888" }}>{total} votos · <strong style={{ color: PRIMARY }}>{pct}%</strong></span>
                          </div>
                          <div style={{ background: GOB_BORDER, borderRadius: 4, height: 10, overflow: "hidden" }}>
                            <div style={{ background: coloresPartido[partido] || PRIMARY, height: "100%", width: `${pct}%`, borderRadius: 4, transition: "width .8s" }} />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Por municipio */}
                <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${GOB_BORDER}`, padding: "24px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, margin: "0 0 20px" }}>Participación por Municipio</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                    {municipios.map((m, i) => {
                      const votosMun = votos.filter(v => v.municipio === m.nombre).length;
                      const pct = votos.length > 0 ? Math.round((votosMun / votos.length) * 100) : 0;
                      return (
                        <div key={m.id} style={{ border: `1px solid ${GOB_BORDER}`, borderTop: `3px solid ${PRIMARY}`, borderRadius: 6, padding: "14px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>{m.nombre}</div>
                          <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY }}>{votosMun}</div>
                          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>votos · {pct}% del total</div>
                          <div style={{ background: GOB_BORDER, borderRadius: 4, height: 6 }}>
                            <div style={{ background: PRIMARY, height: "100%", width: `${pct}%`, borderRadius: 4 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {(modal === "create" || modal === "edit") && (
        <ModalOverlay onClose={closeModal}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: PRIMARY, marginBottom: 24 }}>
            {modal === "create" ? "➕ Nuevo Municipio" : "✏️ Editar Municipio"}
          </h2>
          {formError && <div style={{ background: "#fff0f0", border: "1px solid #f8b4b4", borderLeft: `4px solid ${PRIMARY}`, borderRadius: 4, padding: "8px 14px", marginBottom: 18, fontSize: 13, color: "#c0392b" }}>⚠️ {formError}</div>}
          {[
            { name: "nombre", label: "Nombre del Municipio", placeholder: "Ej: Veracruz", type: "text" },
            { name: "codigoPostal", label: "Código Postal", placeholder: "Ej: 91700", type: "text" },
            { name: "poblacion", label: "Población", placeholder: "Ej: 850000", type: "number" },
            { name: "votosTotales", label: "Votos Totales", placeholder: "Ej: 420000", type: "number" },
          ].map(f => (
            <label key={f.name} style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{f.label}</span>
              <input type={f.type} value={form[f.name]} placeholder={f.placeholder}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = GOB_BORDER} />
            </label>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={modal === "create" ? handleCreate : handleEdit}
              style={{ flex: 1, background: PRIMARY, color: "#fff", border: "none", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {modal === "create" ? "Crear" : "Guardar"}
            </button>
            <button onClick={closeModal} style={{ flex: 1, background: GOB_GRAY, color: "#666", border: `1px solid ${GOB_BORDER}`, padding: "12px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* MODAL ELIMINAR MUNICIPIO */}
      {modal === "delete" && selected && (
        <ModalOverlay onClose={closeModal}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#c0392b", marginBottom: 12 }}>Eliminar Municipio</h2>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>¿Eliminar <strong>{selected.nombre}</strong>? Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleDelete} style={{ flex: 1, background: "#c0392b", color: "#fff", border: "none", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Sí, eliminar
              </button>
              <button onClick={closeModal} style={{ flex: 1, background: GOB_GRAY, color: "#666", border: `1px solid ${GOB_BORDER}`, padding: "12px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* MODAL LIMPIAR VOTOS */}
      {modal === "limpiar" && (
        <ModalOverlay onClose={closeModal}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#c0392b", marginBottom: 12 }}>Limpiar todos los votos</h2>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Esto eliminará los <strong>{votos.length} votos</strong> registrados. Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={limpiarVotos} style={{ flex: 1, background: "#c0392b", color: "#fff", border: "none", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Sí, limpiar todo
              </button>
              <button onClick={closeModal} style={{ flex: 1, background: GOB_GRAY, color: "#666", border: `1px solid ${GOB_BORDER}`, padding: "12px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}