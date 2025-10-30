import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap'; // Importar componentes

function Home() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('IdUser');

  const handleLogout = () => {
    localStorage.removeItem('IdUser');
    alert('Has cerrado sesión.');
    navigate('/');
  };

  return (
    // Usamos clases de Bootstrap para centrar
    <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
      <h1>¡Bienvenido al Portal!</h1>
      <p>Has iniciado sesión correctamente.</p>
      <p>Tu ID de Usuario es: <strong>{userId || 'No encontrado'}</strong></p>
      
      {/* Aquí construirás el resto de tu app */}
      
      {/* Botón de Logout con variante "danger" (rojo) */}
      <Button variant="danger" onClick={handleLogout} className="mt-3">
        Cerrar Sesión
      </Button>
    </Container>
  );
}

export default Home;