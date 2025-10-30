// src/menu/AsistenteIA/AsistenteIA.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

function AsistenteIA() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Asistente IA 🤖</Card.Title>
          <Card.Text>
            Aquí podrás interactuar con nuestra inteligencia artificial. 
            Escribe tus preferencias, alergias o ingredientes y te daremos 
            la recomendación perfecta.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default AsistenteIA;