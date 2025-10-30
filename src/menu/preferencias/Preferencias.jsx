// src/menu/Preferencias/Preferencias.jsx
import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

function Preferencias() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Mis Preferencias Culinarias ⚙️</Card.Title>
          <Card.Text>
            Ayuda al Asistente IA a conocerte mejor. 
            Dinos qué te gusta, qué no te gusta y cuáles son tus objetivos.
          </Card.Text>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>¿Qué tipos de cocina te gustan?</Form.Label>
              <Form.Control type="text" placeholder="Ej: Mexicana, Italiana, Vegana..." />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Ingredientes que NO te gustan</Form.Label>
              <Form.Control type="text" placeholder="Ej: Brócoli, cebolla, cilantro..." />
            </Form.Group>

            <Button variant="success">Guardar Preferencias</Button>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Preferencias;