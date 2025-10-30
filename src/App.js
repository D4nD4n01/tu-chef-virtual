// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Vistas de Autenticación
import Login from './login/Login';
import Register from './login/Register';
import ProtectedRoute from './login/ProtectedRoute';

// --- SOLO IMPORTAMOS EL LAYOUT PRINCIPAL ---
import MainLayout from './menu/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta Protegida (Tu aplicación principal) */}
        <Route element={<ProtectedRoute />}>
          {/*
            CUALQUIER ruta que empiece con /app cargará MainLayout.
            MainLayout se encargará del resto.
          */}
          <Route path="/app" element={<MainLayout />} />
        </Route>

        {/* Redirección: Si ya estás logueado y vas a /app, 
          te dejamos entrar. Si no, ProtectedRoute te echa.
          Si vas a cualquier otra ruta, te mandamos al login.
        */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;