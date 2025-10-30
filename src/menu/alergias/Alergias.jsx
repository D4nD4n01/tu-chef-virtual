// src/menu/Alergias/Alergias.jsx
import React from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
// Importamos un icono para la alerta
import { ShieldExclamation } from 'react-bootstrap-icons';

function Alergias() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Gestión de Alergias e Intolerancias 🛡️</Card.Title>

          <Alert variant="danger" className="d-flex align-items-center">
            <ShieldExclamation size={24} className="me-3" />
            <div>
              <strong>¡Importante!</strong> Esta información es crucial para 
              filtrar tus recomendaciones y mantenerte seguro.
            </div>
          </Alert>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alergias (separadas por comas)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Ej: Maní, mariscos, gluten, lactosa..." 
              />
            </Form.Group>

            <Button variant="primary">Actualizar Alergias</Button>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Alergias;