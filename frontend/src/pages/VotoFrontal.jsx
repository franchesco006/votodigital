import { useState, useEffect, useRef } from "react";

const PRIMARY = "#5c1a3a";
const DARK = "#3d1027";
const LIGHT_RED = "#f5eef2";
const GOB_GRAY = "#f5f5f5";
const GOB_BORDER = "#e0e0e0";
const GOLD = "#c9a84c";

const partidosBase = [
  { siglas: "PAN", nombre: "Partido Acción Nacional", sede: "Av. Constitución 120", color: "#003f8a", descripcion: "Partido de centro-derecha fundado en 1939. Promueve la democracia cristiana, el libre mercado y el respeto a los derechos humanos.", candidato: "Roberto Sánchez Garza", cargo: "Candidato a Presidente Municipal", propuesta: "Seguridad, empleo y modernización de servicios públicos." },
  { siglas: "PRI", nombre: "Partido Revolucionario Institucional", sede: "Calle Juárez 45", color: "#009f4d", descripcion: "Partido histórico fundado en 1929. Ideología nacionalista revolucionaria con enfoque en desarrollo social e infraestructura.", candidato: "María Elena Torres Vidal", cargo: "Candidata a Presidente Municipal", propuesta: "Desarrollo económico, obras públicas y bienestar social." },
  { siglas: "PRD", nombre: "Partido de la Revolución Democrática", sede: "Blvd. Independencia 88", color: "#e6b800", descripcion: "Partido de centro-izquierda fundado en 1989. Defiende la justicia social, los derechos laborales y la equidad de género.", candidato: "Carlos Mendoza Reyes", cargo: "Candidato a Presidente Municipal", propuesta: "Educación gratuita, salud pública y equidad social." },
  { siglas: "MORENA", nombre: "Movimiento Regeneración Nacional", sede: "Av. Reforma 200", color: "#8b0000", descripcion: "Partido de izquierda fundado en 2014. Impulsado por la Cuarta Transformación, promueve la austeridad y los programas sociales.", candidato: "Ana Lucía Ramírez Flores", cargo: "Candidata a Presidente Municipal", propuesta: "Apoyo a sectores vulnerables, combate a la corrupción." },
  { siglas: "MC", nombre: "Movimiento Ciudadano", sede: "Calle Hidalgo 33", color: "#f47920", descripcion: "Partido de centro fundado en 1999. Promueve la participación ciudadana, la innovación en gobierno y la transparencia.", candidato: "Jorge Ibarra Castellanos", cargo: "Candidato a Presidente Municipal", propuesta: "Gobierno abierto, tecnología e innovación municipal." },
  { siglas: "PVEM", nombre: "Partido Verde Ecologista", sede: "Av. Insurgentes 77", color: "#2e7d32", descripcion: "Partido ecologista fundado en 1986. Enfocado en la sustentabilidad ambiental, el reciclaje y la protección de ecosistemas.", candidato: "Valeria Cruz Domínguez", cargo: "Candidata a Presidente Municipal", propuesta: "Medio ambiente, áreas verdes y residuos sólidos." },
];

const mesas = {
  "12345678": { nombre: "GARCÍA LÓPEZ, Juan Manuel", mesa: "0342", colegio: "EEM Nro 3", direccion: "Av. Libertad 1240, Veracruz", municipio: "Veracruz", horario: "08:00 – 18:00 hs" },
  "87654321": { nombre: "MARTÍNEZ RUIZ, Ana Sofía", mesa: "0115", colegio: "Escuela Primaria Benito Juárez", direccion: "Calle Hidalgo 88, Xalapa", municipio: "Xalapa", horario: "08:00 – 18:00 hs" },
  "11223344": { nombre: "LÓPEZ TORRES, Carlos Eduardo", mesa: "0521", colegio: "Secundaria Técnica No. 12", direccion: "Blvd. Independencia 300, Córdoba", municipio: "Córdoba", horario: "08:00 – 18:00 hs" },
};

const colores = ["#9b1219", "#003f8a", "#009f4d", "#f47920", "#2e7d32", "#f5c400", "#7b1fa2", "#00838f"];

function useCountUp(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      s += step;
      if (s >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(s));
    }, 16);
    return () => clearInterval(timer);
  }, [start, target]);
  return val;
}

const inputStyle = (focus, setFocus, i) => ({
  width: "100%", padding: "11px 14px", border: `1.5px solid ${focus === i ? PRIMARY : GOB_BORDER}`,
  borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s"
});

export default function VotoFrontal() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [dniQuery, setDniQuery] = useState("");
  const [dniResult, setDniResult] = useState(null);
  const [dniError, setDniError] = useState("");
  const [searching, setSearching] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [votos, setVotos] = useState([]);
  const [focusField, setFocusField] = useState(null);

  // Formulario de votación
  const [votoForm, setVotoForm] = useState({ nombre: "", apellido: "", curp: "", ine: "", domicilio: "", municipio: "", partido: "" });
  const [votoStep, setVotoStep] = useState(1); // 1=datos, 2=elegir partido, 3=confirmado
  const [votoError, setVotoError] = useState("");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  const statsRef = useRef(null);

  useEffect(() => {
    const cargar = () => {
      const saved = localStorage.getItem("municipios");
      if (saved) setMunicipios(JSON.parse(saved));
      const savedVotos = localStorage.getItem("votos_emitidos");
      if (savedVotos) setVotos(JSON.parse(savedVotos));
    };
    cargar();
    const interval = setInterval(cargar, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPoblacion = municipios.reduce((a, m) => a + (parseInt(m.poblacion) || 0), 0);
  const totalVotos = votos.length;

  const c1 = useCountUp(municipios.length, 1000, statsVisible);
  const c2 = useCountUp(partidosBase.length, 800, statsVisible);
  const c3 = useCountUp(totalPoblacion, 2000, statsVisible);
  const c4 = useCountUp(totalVotos, 1800, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDniSearch = () => {
    setDniError(""); setDniResult(null);
    if (!dniQuery.trim()) { setDniError("Ingresá tu número de documento."); return; }
    setSearching(true);
    setTimeout(() => {
      const result = mesas[dniQuery.replace(/\D/g, "")];
      if (result) setDniResult(result);
      else setDniError("No se encontró ningún votante. Prueba con: 12345678, 87654321 o 11223344");
      setSearching(false);
    }, 1000);
  };

  // Validar CURP básico
  const validarCURP = (curp) => /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp.toUpperCase());

  const handleVotoStep1 = () => {
    setVotoError("");
    const { nombre, apellido, curp, ine, domicilio, municipio } = votoForm;
    if (!nombre.trim() || !apellido.trim() || !curp.trim() || !ine.trim() || !domicilio.trim() || !municipio.trim()) {
      setVotoError("Todos los campos son obligatorios."); return;
    }
    if (curp.length !== 18) { setVotoError("La CURP debe tener exactamente 18 caracteres."); return; }
    if (ine.length < 10) { setVotoError("El número de INE debe tener al menos 10 caracteres."); return; }
    // Verificar si ya votó
    const yaVoto = votos.find(v => v.ine === ine.toUpperCase() || v.curp === curp.toUpperCase());
    if (yaVoto) { setVotoError("Este ciudadano ya emitió su voto en esta elección."); return; }
    setVotoStep(2);
  };

  const handleEmitirVoto = () => {
    if (!partidoSeleccionado) { setVotoError("Debes seleccionar un partido."); return; }
    const nuevoVoto = {
      id: Date.now(),
      nombre: votoForm.nombre.toUpperCase(),
      apellido: votoForm.apellido.toUpperCase(),
      curp: votoForm.curp.toUpperCase(),
      ine: votoForm.ine.toUpperCase(),
      domicilio: votoForm.domicilio,
      municipio: votoForm.municipio,
      partido: partidoSeleccionado.siglas,
      partidoNombre: partidoSeleccionado.nombre,
      fecha: new Date().toLocaleString("es-MX"),
      folio: "VOT-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    };
    const nuevosVotos = [...votos, nuevoVoto];
    setVotos(nuevosVotos);
    localStorage.setItem("votos_emitidos", JSON.stringify(nuevosVotos));
    setVotoStep(3);
  };

  const resetVoto = () => {
    setVotoForm({ nombre: "", apellido: "", curp: "", ine: "", domicilio: "", municipio: "" , partido: "" });
    setPartidoSeleccionado(null);
    setVotoStep(1);
    setVotoError("");
  };

  // Conteo de votos por partido
  const conteoPartidos = partidosBase.map(p => ({
    ...p,
    total: votos.filter(v => v.partido === p.siglas).length,
  })).sort((a, b) => b.total - a.total);

  const navLinks = [
    { id: "inicio", label: "Inicio" },
    { id: "partidos", label: "Partidos" },
    { id: "votar", label: "Votar" },
    { id: "resultados", label: "Resultados" },
    { id: "mi-mesa", label: "Mi Mesa" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Inter', system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: PRIMARY, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => scrollTo("inicio")}>
          <span style={{ fontSize: 28 }}>🗳️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>VotoDigital</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase" }}>Sistema Nacional de Votación</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{
              background: activeSection === l.id ? "rgba(255,255,255,0.2)" : "none",
              border: activeSection === l.id ? "1px solid rgba(255,255,255,0.6)" : "1px solid transparent",
              color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer",
              fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", transition: "all .2s"
            }}>
              {l.label}
            </button>
          ))}
          <a href="/login" style={{ background: GOLD, color: "#fff", padding: "8px 18px", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 12, marginLeft: 8 }}>
            Admin
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="inicio" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DARK} 100%)`, color: "#fff", padding: "120px 2rem 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[300, 500, 700].map(s => (
          <div key={s} style={{ position: "absolute", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", width: s, height: s, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 20px", marginBottom: 28 }}>
            <span style={{ color: "#fff", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Elecciones Municipales 2030</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 700, lineHeight: 1.15, maxWidth: 720, margin: "0 auto 20px", letterSpacing: -1 }}>
            El <span style={{ color: GOLD, fontStyle: "italic" }}>voto secreto</span> es tu derecho más sagrado
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8, fontSize: 16 }}>
            Sistema electrónico de control de votación para elecciones municipales. Transparente, seguro y confiable.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("votar")} style={{ background: GOLD, color: "#fff", border: "none", padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 8, transition: "transform .2s" }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
              Emitir mi Voto →
            </button>
            <button onClick={() => scrollTo("mi-mesa")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", padding: "14px 32px", fontSize: 14, cursor: "pointer", borderRadius: 8 }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              Consultar Mi Mesa
            </button>
            <button onClick={() => scrollTo("resultados")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", padding: "14px 32px", fontSize: 14, cursor: "pointer", borderRadius: 8 }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              Ver Resultados
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} style={{ background: "#fff", borderBottom: `1px solid ${GOB_BORDER}`, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {[
          { icon: "🏛️", val: c1.toLocaleString(), label: "Municipios" },
          { icon: "🎖️", val: c2.toLocaleString(), label: "Partidos Registrados" },
          { icon: "👥", val: c3.toLocaleString(), label: "Población Total" },
          { icon: "🗳️", val: c4.toLocaleString(), label: "Votos Emitidos" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "32px 24px", textAlign: "center", borderRight: i < 3 ? `1px solid ${GOB_BORDER}` : "none" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: PRIMARY, letterSpacing: -1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* PARTIDOS */}
      <section id="partidos" style={{ padding: "80px 2rem", background: GOB_GRAY }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Elecciones 2030</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>Partidos Políticos</h2>
            <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>Partidos registrados para las elecciones municipales</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {partidosBase.map((p, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${GOB_BORDER}`, borderTop: `4px solid ${p.color}`, overflow: "hidden", transition: "transform .2s, box-shadow .2s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ background: p.color, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: "#fff", flexShrink: 0, textAlign: "center" }}>
                    {p.siglas}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>📍 {p.sede}</div>
                  </div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 16px" }}>{p.descripcion}</p>
                  <div style={{ background: "#f9f6f0", borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${p.color}` }}>
                    <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Candidato/a</div>
                    <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14, marginBottom: 2 }}>👤 {p.candidato}</div>
                    <div style={{ fontSize: 12, color: "#777", marginBottom: 8 }}>{p.cargo}</div>
                    <div style={{ fontSize: 12, color: "#555" }}>📌 <em>{p.propuesta}</em></div>
                  </div>
                  <button onClick={() => scrollTo("votar")} style={{ marginTop: 12, width: "100%", background: p.color, color: "#fff", border: "none", padding: "10px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: 0.9, transition: "opacity .2s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = "1"}
                    onMouseOut={e => e.currentTarget.style.opacity = "0.9"}>
                    Votar por este partido →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOTAR */}
      <section id="votar" style={{ padding: "80px 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Elecciones 2030</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>Emitir mi Voto</h2>
            <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>Completa tus datos y elige tu partido. El voto es secreto y único.</p>
          </div>

          {/* STEPS */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, gap: 0 }}>
            {["Datos personales", "Elegir partido", "Confirmación"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: votoStep > i + 1 ? "#2e7d32" : votoStep === i + 1 ? PRIMARY : GOB_BORDER, color: votoStep >= i + 1 ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, transition: "all .3s" }}>
                    {votoStep > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: votoStep === i + 1 ? PRIMARY : "#aaa", fontWeight: votoStep === i + 1 ? 700 : 400, whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < 2 && <div style={{ width: 60, height: 2, background: votoStep > i + 1 ? "#2e7d32" : GOB_BORDER, margin: "0 8px", marginBottom: 20, transition: "all .3s" }} />}
              </div>
            ))}
          </div>

          {/* STEP 1: DATOS */}
          {votoStep === 1 && (
            <div style={{ background: "#fff", border: `1px solid ${GOB_BORDER}`, borderTop: `4px solid ${PRIMARY}`, borderRadius: 8, padding: "32px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: PRIMARY, marginBottom: 24, margin: "0 0 24px" }}>📋 Datos del Votante</h3>
              {votoError && (
                <div style={{ background: "#fff0f0", border: `1px solid #ffcdd2`, borderLeft: `4px solid ${PRIMARY}`, borderRadius: 4, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#c62828" }}>
                  ⚠️ {votoError}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[
                  { key: "nombre", label: "Nombre(s)", placeholder: "Ej: Juan Manuel" },
                  { key: "apellido", label: "Apellidos", placeholder: "Ej: García López" },
                ].map((f, i) => (
                  <label key={f.key} style={{ display: "block" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{f.label} *</span>
                    <input value={votoForm[f.key]} onChange={e => setVotoForm({ ...votoForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${focusField === f.key ? PRIMARY : GOB_BORDER}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                      onFocus={() => setFocusField(f.key)} onBlur={() => setFocusField(null)} />
                  </label>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>CURP *</span>
                  <input value={votoForm.curp} onChange={e => setVotoForm({ ...votoForm, curp: e.target.value.toUpperCase() })}
                    placeholder="Ej: GALJ850312HVZRPN01" maxLength={18}
                    style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${focusField === "curp" ? PRIMARY : GOB_BORDER}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", letterSpacing: 1 }}
                    onFocus={() => setFocusField("curp")} onBlur={() => setFocusField(null)} />
                  <span style={{ fontSize: 11, color: votoForm.curp.length === 18 ? "#2e7d32" : "#aaa" }}>{votoForm.curp.length}/18 caracteres</span>
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Clave de Elector (INE) *</span>
                  <input value={votoForm.ine} onChange={e => setVotoForm({ ...votoForm, ine: e.target.value.toUpperCase() })}
                    placeholder="Ej: GALOJU850312MN1234"
                    style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${focusField === "ine" ? PRIMARY : GOB_BORDER}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", letterSpacing: 1 }}
                    onFocus={() => setFocusField("ine")} onBlur={() => setFocusField(null)} />
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Domicilio *</span>
                  <input value={votoForm.domicilio} onChange={e => setVotoForm({ ...votoForm, domicilio: e.target.value })}
                    placeholder="Ej: Av. Juárez 123, Col. Centro"
                    style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${focusField === "dom" ? PRIMARY : GOB_BORDER}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    onFocus={() => setFocusField("dom")} onBlur={() => setFocusField(null)} />
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Municipio *</span>
                  <select value={votoForm.municipio} onChange={e => setVotoForm({ ...votoForm, municipio: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${focusField === "mun" ? PRIMARY : GOB_BORDER}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}
                    onFocus={() => setFocusField("mun")} onBlur={() => setFocusField(null)}>
                    <option value="">Selecciona un municipio</option>
                    {municipios.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
                  </select>
                </label>
              </div>
              <div style={{ background: LIGHT_RED, borderRadius: 6, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#666" }}>
                🔒 Tus datos son confidenciales. El voto es secreto conforme al principio constitucional.
              </div>
              <button onClick={handleVotoStep1} style={{ width: "100%", background: PRIMARY, color: "#fff", border: "none", padding: "14px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background .2s" }}
                onMouseOver={e => e.currentTarget.style.background = DARK}
                onMouseOut={e => e.currentTarget.style.background = PRIMARY}>
                Continuar → Elegir Partido
              </button>
            </div>
          )}

          {/* STEP 2: ELEGIR PARTIDO */}
          {votoStep === 2 && (
            <div style={{ background: "#fff", border: `1px solid ${GOB_BORDER}`, borderTop: `4px solid ${PRIMARY}`, borderRadius: 8, padding: "32px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: PRIMARY, marginBottom: 8, margin: "0 0 8px" }}>🗳️ Elige tu Partido</h3>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Selecciona el partido de tu preferencia. Esta acción es irreversible.</p>
              {votoError && (
                <div style={{ background: "#fff0f0", border: `1px solid #ffcdd2`, borderLeft: `4px solid ${PRIMARY}`, borderRadius: 4, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#c62828" }}>
                  ⚠️ {votoError}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {partidosBase.map((p, i) => (
                  <div key={i} onClick={() => setPartidoSeleccionado(p)} style={{
                    border: `2px solid ${partidoSeleccionado?.siglas === p.siglas ? p.color : GOB_BORDER}`,
                    borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                    background: partidoSeleccionado?.siglas === p.siglas ? `${p.color}12` : "#fff",
                    display: "flex", alignItems: "center", gap: 14, transition: "all .2s"
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${p.color}`, background: partidoSeleccionado?.siglas === p.siglas ? p.color : "transparent", flexShrink: 0, transition: "all .2s" }} />
                    <div style={{ background: p.color, color: "#fff", borderRadius: 6, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, flexShrink: 0, textAlign: "center" }}>{p.siglas}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>{p.nombre}</div>
                      <div style={{ fontSize: 12, color: "#777" }}>👤 {p.candidato}</div>
                    </div>
                    {partidoSeleccionado?.siglas === p.siglas && <span style={{ color: p.color, fontWeight: 700, fontSize: 18 }}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setVotoStep(1); setVotoError(""); setPartidoSeleccionado(null); }} style={{ flex: 1, background: GOB_GRAY, color: "#555", border: `1px solid ${GOB_BORDER}`, padding: "12px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>
                  ← Regresar
                </button>
                <button onClick={handleEmitirVoto} style={{ flex: 2, background: partidoSeleccionado ? PRIMARY : "#ccc", color: "#fff", border: "none", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: partidoSeleccionado ? "pointer" : "not-allowed", transition: "background .2s" }}
                  onMouseOver={e => { if (partidoSeleccionado) e.currentTarget.style.background = DARK; }}
                  onMouseOut={e => { if (partidoSeleccionado) e.currentTarget.style.background = PRIMARY; }}>
                  ✅ Confirmar y Emitir Voto
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMADO */}
          {votoStep === 3 && (
            <div style={{ background: "#fff", border: `2px solid #2e7d32`, borderRadius: 8, padding: "40px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#2e7d32", marginBottom: 8 }}>¡Voto emitido con éxito!</h3>
              <p style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>Tu participación ha sido registrada. Gracias por ejercer tu derecho.</p>
              <div style={{ background: GOB_GRAY, borderRadius: 8, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
                <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Comprobante de votación</div>
                {[
                  ["Folio", votos[votos.length - 1]?.folio],
                  ["Ciudadano", `${votoForm.nombre} ${votoForm.apellido}`],
                  ["Municipio", votoForm.municipio],
                  ["Partido", votos[votos.length - 1]?.partidoNombre],
                  ["Fecha y hora", votos[votos.length - 1]?.fecha],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 14, borderBottom: `1px solid ${GOB_BORDER}`, paddingBottom: 8 }}>
                    <span style={{ color: "#999", minWidth: 100, fontSize: 13 }}>{k}:</span>
                    <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: LIGHT_RED, borderRadius: 6, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: PRIMARY }}>
                🔒 Tu voto es secreto. El comprobante no revela tu elección.
              </div>
              <button onClick={resetVoto} style={{ background: PRIMARY, color: "#fff", border: "none", padding: "12px 32px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </section>

      {/* RESULTADOS */}
      <section id="resultados" style={{ padding: "80px 2rem", background: GOB_GRAY }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Conteo Oficial</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>Resultados en Tiempo Real</h2>
            <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>Votos emitidos a través del sistema · Total: <strong>{votos.length}</strong></p>
          </div>

          {votos.length === 0 ? (
            <div style={{ textAlign: "center", color: "#aaa", padding: 60, background: "#fff", borderRadius: 12, fontSize: 15 }}>
              Aún no se han emitido votos.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {conteoPartidos.map((p, i) => {
                const pct = votos.length > 0 ? Math.round((p.total / votos.length) * 100) : 0;
                return (
                  <div key={p.siglas} style={{ background: "#fff", borderRadius: 10, padding: "18px 24px", border: `1px solid ${GOB_BORDER}`, borderLeft: `4px solid ${p.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ background: p.color, color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{i + 1}</span>
                        <div>
                          <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 15 }}>{p.siglas}</span>
                          <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>{p.nombre}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontWeight: 800, color: p.color, fontSize: 18 }}>{pct}%</span>
                        <span style={{ color: "#aaa", fontSize: 12, marginLeft: 8 }}>{p.total} voto{p.total !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div style={{ background: GOB_BORDER, borderRadius: 6, height: 8, overflow: "hidden" }}>
                      <div style={{ background: p.color, height: "100%", width: `${pct}%`, borderRadius: 6, transition: "width .8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Por municipio */}
          {municipios.length > 0 && votos.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 20 }}>📊 Votos por Municipio</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                {municipios.map((m, i) => {
                  const votosMun = votos.filter(v => v.municipio === m.nombre).length;
                  return (
                    <div key={m.id} style={{ background: "#fff", borderRadius: 8, padding: "16px", border: `1px solid ${GOB_BORDER}`, borderTop: `3px solid ${colores[i % colores.length]}` }}>
                      <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14, marginBottom: 4 }}>{m.nombre}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: colores[i % colores.length] }}>{votosMun}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>votos registrados</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MI MESA */}
      <section id="mi-mesa" style={{ background: LIGHT_RED, padding: "80px 2rem" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: PRIMARY, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Padrón Electoral</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, letterSpacing: -0.5 }}>¿Dónde me toca votar?</h2>
          <p style={{ color: "#777", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            Ingresá tu número de documento para encontrar tu mesa.<br />
            <span style={{ fontSize: 13, color: "#aaa" }}>Prueba con: 12345678, 87654321 o 11223344</span>
          </p>
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <input value={dniQuery} onChange={e => setDniQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleDniSearch()}
              placeholder="Ej: 12345678"
              style={{ flex: 1, padding: "18px 22px", border: "none", fontSize: 16, outline: "none", fontFamily: "inherit", background: "#fff" }} />
            <button onClick={handleDniSearch} style={{ background: PRIMARY, color: "#fff", border: "none", padding: "18px 32px", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "background .2s" }}
              onMouseOver={e => e.currentTarget.style.background = DARK}
              onMouseOut={e => e.currentTarget.style.background = PRIMARY}>
              {searching ? "⏳" : "Buscar"}
            </button>
          </div>
          {dniError && (
            <div style={{ marginTop: 16, background: "#fff", border: `1px solid #ffcdd2`, borderLeft: `4px solid ${PRIMARY}`, borderRadius: 4, padding: "12px 16px", fontSize: 14, color: "#c62828", textAlign: "left" }}>
              ⚠️ {dniError}
            </div>
          )}
          {dniResult && (
            <div style={{ marginTop: 24, background: "#fff", borderRadius: 12, padding: "28px 24px", textAlign: "left", borderTop: `4px solid ${PRIMARY}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
              <div style={{ color: "#2e7d32", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>✓ Votante Habilitado</div>
              {[["👤 Votante", dniResult.nombre], ["📋 Mesa N°", dniResult.mesa], ["🏫 Colegio", dniResult.colegio], ["📍 Dirección", dniResult.direccion], ["🏙️ Municipio", dniResult.municipio], ["🕐 Horario", dniResult.horario]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 14, borderBottom: `1px solid ${GOB_BORDER}`, paddingBottom: 10 }}>
                  <span style={{ color: "#999", minWidth: 130, fontSize: 13 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a1a", color: "#aaa", padding: "40px 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 26, marginBottom: 10 }}>🗳️</div>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6 }}>VotoDigital — Sistema Nacional de Votación Electrónica</div>
        <div style={{ fontSize: 12 }}>© 2030 — Dirección Nacional Electoral · Todos los derechos reservados</div>
      </footer>
    </div>
  );
}