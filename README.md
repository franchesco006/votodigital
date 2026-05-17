# 🗳️ VotoDigital — Sistema Nacional de Votación Electrónica

> Sistema web de control de votación electrónica para elecciones municipales 2030.  
> Desarrollado como proyecto de examen — 8° Semestre, Ingeniería en Sistemas.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Symfony](https://img.shields.io/badge/Symfony-7-000000?logo=symfony)
![MariaDB](https://img.shields.io/badge/MariaDB-10.4-003545?logo=mariadb)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## 📸 Vistas del sistema

| Página principal | Panel Admin | Votación |
|---|---|---|
| Página pública con info electoral | CRUD de municipios y votos | Formulario con CURP e INE |

---

## 🧩 Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | CSS-in-JS (inline styles) |
| Routing | React Router DOM |
| Backend | Symfony 7 (PHP 8.2) |
| Base de datos | MariaDB / MySQL |
| Autenticación | JWT (LexikJWTAuthenticationBundle) |
| ORM | Doctrine |

---

## 📁 Estructura del proyecto
votodigital/
├── frontend/                  # Aplicación React
│   └── src/
│       └── pages/
│           ├── VotoFrontal.jsx    # Página principal pública
│           ├── LoginAdmin.jsx     # Login de administrador
│           └── CrudMunicipios.jsx # Panel admin (CRUD + votos)
├── backend/                   # API Symfony
│   └── src/
│       ├── Controller/
│       │   └── MunicipioController.php
│       └── Entity/
│           ├── Municipio.php
│           └── User.php
└── database.sql               # Script de base de datos

---

## ⚙️ Instalación y uso

### Requisitos previos
- Node.js v18+
- PHP 8.2+
- Composer
- XAMPP (Apache + MySQL/MariaDB)

### 1. Clonar el repositorio
```bash
git clone https://github.com/franchesco006/votodigital.git
cd votodigital
```

### 2. Base de datos
1. Abre **phpMyAdmin** en `http://localhost/phpmyadmin`
2. Importa el archivo `database.sql`
3. Se creará la base de datos `votodigital` con datos de prueba

### 3. Backend (Symfony)
```bash
cd backend
composer install --ignore-platform-req=ext-sodium
php -S localhost:8000 -t public
```

### 4. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 5. Acceder al sistema
| URL | Descripción |
|-----|-------------|
| `http://localhost:5173/` | Página principal pública |
| `http://localhost:5173/login` | Login de administrador |
| `http://localhost:5173/admin/municipios` | Panel de administración |

---

## 🔐 Credenciales de administrador

| Campo | Valor |
|-------|-------|
| **Usuario** | `admin@voto.com` |
| **Contraseña** | `admin123` |

---

## 🗳️ Funcionalidades

### Página pública
- ✅ Hero con información del sistema electoral
- ✅ Estadísticas en tiempo real (municipios, votos, población)
- ✅ Consulta de mesa por número de documento
- ✅ Cards de partidos con candidatos y propuestas
- ✅ **Formulario de votación** con CURP, INE y domicilio
- ✅ Resultados electorales en tiempo real por partido y municipio
- ✅ Prevención de voto duplicado

### Panel de administración
- ✅ Login seguro con JWT
- ✅ CRUD completo de municipios
- ✅ Visualización de todos los votos emitidos
- ✅ Estadísticas por partido y por municipio
- ✅ Eliminación individual o total de votos
- ✅ Búsqueda y filtrado en tiempo real
- ✅ Datos sincronizados con la página pública via localStorage

---

## 🗄️ Esquema de base de datos

```sql
-- Municipios electorales
municipio (id, nombre, codigo_postal, poblacion, votos_totales)

-- Usuarios administradores
user (id, email, roles, password)
```

---

## 📌 Notas técnicas

- Los votos se almacenan en `localStorage` del navegador para demostración
- El backend Symfony provee la API REST para municipios
- La autenticación usa JWT con LexikJWTAuthenticationBundle
- CORS configurado para desarrollo local (`localhost:5173` ↔ `localhost:8000`)

---

## 👨‍💻 Autor

**Franchesco** — Instituto Tecnológico Superior de Cosamaloapan (ITSCO)  
8° Semestre — Ingeniería en Sistemas Computacionales  
Materia: Frameworks de Desarrollo Web

---

> *"El voto secreto es tu derecho más sagrado"* 🇲🇽