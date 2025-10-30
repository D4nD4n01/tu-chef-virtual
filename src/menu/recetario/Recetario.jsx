// src/menu/MiRecetario/MiRecetario.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

function MiRecetario() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Mi Recetario 📚</Card.Title>
          <Card.Text>
            Todas las recomendaciones y recetas que marques como favoritas
            aparecerán aquí para que puedas consultarlas cuando quieras.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default MiRecetario;