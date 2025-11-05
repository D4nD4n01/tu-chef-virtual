import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos los componentes de React-Bootstrap
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './AuthBackground.css';
import {URL,ROUTES} from '../Routes'

function Login() {
    const [strUser, setStrUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Para mostrar errores

    const navigate = useNavigate();

    // (Este hook para verificar sesión existente no cambia)
    useEffect(() => {
        const userId = localStorage.getItem('IdUser');
        if (userId) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Limpia errores previos

        if (!strUser || !password) {
            setError('Por favor, ingresa usuario y contraseña.');
            return;
        }

        try {
            const response = await fetch(URL + ROUTES.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ strUser, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('IdUser', data.user.id);
                navigate('/app');
            } else {
                setError(data.error || 'Credenciales inválidas.');
            }
        } catch (error) {
            console.error('Error de red al intentar iniciar sesión:', error);
            setError('No se pudo conectar con el servidor.');
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };


    return (
        <div className="auth-background">
            {/* Este contenedor es para que React-Bootstrap no choque con el z-index */}
            <Container className="auth-content">
                <Row className="justify-content-center"> {/* Centramos la Row */}
                    <Col md={8} lg={6} xl={5}> {/* Controlamos el ancho de la tarjeta */}

                        <Card style={{ width: '100%' }} className="shadow-sm"> {/* Quitamos el '25rem' */}
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <span style={{ fontSize: '3rem' }} role="img" aria-label="chef">👨‍🍳</span>
                                    <h2 className="mt-2">Tu Chef Virtual</h2>
                                    <p className="text-muted">Inicia sesión para ver tus recetas</p>
                                </div>

                                {/* Mostramos errores aquí */}
                                {error && <Alert variant="danger">{error}</Alert>}

                                {/* Formulario de Bootstrap */}
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tu nombre de usuario"
                                            value={strUser}
                                            onChange={(e) => setStrUser(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Tu contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>

                                    {/* Botón principal */}
                                    <Button variant="success" type="submit" className="w-100">
                                        Iniciar Sesión
                                    </Button>
                                </Form>

                                {/* Botón secundario para registrarse */}
                                <div className="text-center mt-3">
                                    ¿No tienes cuenta?
                                    <Button variant="link" onClick={goToRegister}>
                                        Regístrate
                                    </Button>
                                </div>

                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;