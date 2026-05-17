-- =============================================
-- VotoDigital - Sistema Nacional de Votación
-- Script de Base de Datos - MariaDB/MySQL
-- Elecciones Municipales 2030
-- =============================================

CREATE DATABASE IF NOT EXISTS votodigital
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE votodigital;

-- ── Tabla: municipio ─────────────────────────
CREATE TABLE IF NOT EXISTS municipio (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  codigo_postal VARCHAR(10)  NOT NULL,
  poblacion     INT          NOT NULL DEFAULT 0,
  votos_totales INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Tabla: user (administradores) ────────────
CREATE TABLE IF NOT EXISTS user (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  email    VARCHAR(180) NOT NULL UNIQUE,
  roles    LONGTEXT     NOT NULL,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Datos de prueba: municipios ───────────────
INSERT INTO municipio (nombre, codigo_postal, poblacion, votos_totales) VALUES
  ('Cosamaloapan', '95400', 45000,  22000),
  ('Veracruz',     '91700', 850000, 420000),
  ('Xalapa',       '91000', 480000, 230000);

-- ── Usuario admin ─────────────────────────────
-- Contraseña: admin123
INSERT INTO user (email, roles, password) VALUES (
  'admin@voto.com',
  '["ROLE_ADMIN"]',
  '$2y$13$bBg8VpUKai/aeUOTFLcxcuVBvQFsPSbro1OJFBYUeVd4wyqMOhSFK'
);