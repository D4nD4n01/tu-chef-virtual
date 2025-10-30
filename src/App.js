import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login'; // Importamos el componente de Login
import Register from './login/Register'; // Importamos el componente de Register
import Home from './home/Home'; // Una página de inicio simple (la crearemos)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: / (será tu página de login) */}
        <Route path="/" element={<Login />} />

        {/* Ruta para registrarse */}
        <Route path="/register" element={<Register />} />

        {/* Ruta para el "portal" después de iniciar sesión */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;