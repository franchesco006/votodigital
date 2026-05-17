import { BrowserRouter, Routes, Route } from "react-router-dom";
import VotoFrontal from "./pages/VotoFrontal";
import LoginAdmin from "./pages/LoginAdmin";
import CrudMunicipios from "./pages/CrudMunicipios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotoFrontal />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/admin/municipios" element={<CrudMunicipios />} />
      </Routes>
    </BrowserRouter>
  );
}