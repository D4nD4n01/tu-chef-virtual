// src/menu/Inicio/Inicio.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

function Inicio() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>¡Bienvenido a Tu Chef Virtual!</Card.Title>
          <Card.Text>
            Este es tu panel principal. Selecciona una opción del menú lateral
            para comenzar a explorar tus recomendaciones y monitorear tus metas.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default Inicio;