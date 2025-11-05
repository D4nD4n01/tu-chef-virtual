// src/menu/Preferencias/Preferencias.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
// --- Importa los iconos que usaremos ---
import { 
    HeartFill, 
    HeartbreakFill, 
    ChatQuoteFill, 
    Save, 
    ExclamationCircleFill, 
    CheckCircleFill, 
    HourglassSplit 
} from 'react-bootstrap-icons';

// --- TUS LISTAS DE "BOTONES AMIGABLES" ---

// --- CAMBIO AQUÍ ---
// Se eliminaron comidas preparadas (Pizza, Sushi, Tacos, Curry, Asado)
// Se enfocó solo en ingredientes o tipos de comida base.
const PREDEFINED_LIKES = [
    'Pollo', 'Res', 'Pescado', 'Cerdo', 'Vegetariano', 'Vegano', 'Pasta', 'Arroz', 
    'Ensaladas', 'Sopas', 'Mariscos', 'Frutas', 'Verduras', 'Legumbres'
];
// (Tu lista de DISLIKES ya estaba enfocada en ingredientes, así que se queda igual)
const PREDEFINED_DISLIKES = [
    'Cebolla', 'Cilantro', 'Brócoli', 'Coliflor', 'Champiñones', 'Picante', 'Lácteos', 
    'Huevo', 'Gluten', 'Maní', 'Mariscos', 'Soja', 'Trigo'
];
// ------------------------------------------------------------


function Preferencias() {
    // (El resto del componente es idéntico al anterior)
    const [likes, setLikes] = useState(new Set());
    const [dislikes, setDislikes] = useState(new Set());
    const [customNotes, setCustomNotes] = useState('');
    
    const [status, setStatus] = useState({ 
        loading: true, 
        error: '', 
        success: '' 
    });

    // 1. Cargar datos existentes...
    useEffect(() => {
        const loadData = async () => {
            const userId = localStorage.getItem('IdUser');
            if (!userId) {
                setStatus({ loading: false, error: 'No se pudo encontrar el ID de usuario.', success: '' });
                return;
            }

            try {
                const response = await fetch(`http://localhost:3111/getPreferences?userId=${userId}`);
                if (!response.ok) throw new Error('Error al cargar datos.');

                const data = await response.json();
                
                setLikes(new Set(data.structured_likes || []));
                setDislikes(new Set(data.structured_dislikes || []));
                setCustomNotes(data.custom_notes || '');
                
                setStatus({ loading: false, error: '', success: '' });

            } catch (err) {
                console.error("Error loading preferences:", err);
                setStatus({ loading: false, error: 'Error de red al cargar preferencias.', success: '' });
            }
        };

        loadData();
    }, []); 

    // 2. Función para manejar el clic...
    const handleToggle = (item, type) => {
        const stateSet = (type === 'likes') ? likes : dislikes;
        const setState = (type === 'likes') ? setLikes : setDislikes;
        
        const newSet = new Set(stateSet);
        if (newSet.has(item)) {
            newSet.delete(item);
        } else {
            newSet.add(item);
        }
        setState(newSet);
    };

    // 3. Función para guardar...
    const handleSave = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        const userId = localStorage.getItem('IdUser');
        
        const dataToSave = {
            structured_likes: [...likes],
            structured_dislikes: [...dislikes],
            custom_notes: customNotes
        };

        try {
            const response = await fetch('http://localhost:3111/savePreferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    preferences: dataToSave
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo guardar.');
            }
            
            setStatus({ loading: false, error: '', success: '¡Perfil culinario guardado con éxito!' });

        } catch (err) {
            console.error("Error saving preferences:", err);
            setStatus({ loading: false, error: err.message || 'Error de red al guardar.', success: '' });
        }
    };

    // (El resto del JSX es idéntico)
    if (status.loading && !status.error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status" variant="success">
                    <span className="visually-hidden">Cargando preferencias...</span>
                </Spinner>
                <h4 className="ms-3">Cargando tus preferencias...</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="d-flex align-items-center mb-4">
                        Mi Perfil Culinario
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                        Selecciona tus gustos y disgustos. Esto ayudará al Asistente IA 
                        a darte las mejores recomendaciones y a aprender sobre ti.
                    </Card.Text>

                    <Form onSubmit={handleSave}>
                        <Row>
                            {/* COLUMNA IZQUIERDA: GUSTOS */}
                            <Col md={6} className="mb-4">
                                <Form.Group>
                                    <Form.Label as="h5" className="d-flex align-items-center">
                                        Me Gusta
                                    </Form.Label>
                                    <div className="p-3 bg-light border rounded" style={{ minHeight: '150px' }}>
                                        {/* Esta lista ahora está limpia */}
                                        {PREDEFINED_LIKES.map(item => (
                                            <Button
                                                key={`like-${item}`}
                                                variant={likes.has(item) ? 'success' : 'outline-secondary'}
                                                onClick={() => handleToggle(item, 'likes')}
                                                className="m-1 rounded-pill"
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                    <Form.Text className="text-muted">
                                        Haz clic para seleccionar o deseleccionar.
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            {/* COLUMNA DERECHA: DISGUSTOS */}
                            <Col md={6} className="mb-4">
                                <Form.Group>
                                    <Form.Label as="h5" className="d-flex align-items-center">
                                        No Me Gusta 
                                    </Form.Label>
                                    <div className="p-3 bg-light border rounded" style={{ minHeight: '150px' }}>
                                        {PREDEFINED_DISLIKES.map(item => (
                                            <Button
                                                key={`dislike-${item}`}
                                                variant={dislikes.has(item) ? 'danger' : 'outline-secondary'}
                                                onClick={() => handleToggle(item, 'dislikes')}
                                                className="m-1 rounded-pill"
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                    <Form.Text className="text-muted">
                                        Haz clic para seleccionar o deseleccionar.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        {/* CAJA DE TEXTO PARA NOTAS ADICIONALES */}
                        <Form.Group className="mb-4">
                            <Form.Label as="h5" className="d-flex align-items-center">
                                <ChatQuoteFill className="me-2 text-info" />
                                Notas Adicionales (Opcional)
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Ej: Me gusta la comida muy especiada, sin picante, prefiero cocinar al vapor, soy intolerante a la lactosa (pero sin ser alergia grave), me gusta experimentar con nuevas cocinas..."
                                value={customNotes}
                                onChange={(e) => setCustomNotes(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                Aquí puedes añadir cualquier detalle extra. El Asistente IA 
                                lo tendrá en cuenta y podrá actualizarlo con lo que aprenda.
                            </Form.Text>
                        </Form.Group>
                        
                        <hr className="my-4" />

                        {/* Botón de Guardar y Alertas */}
                        <div className="d-flex align-items-center justify-content-end"> 
                            {status.loading && <Spinner animation="border" size="sm" variant="primary" className="me-2" />}
                            {status.error && 
                                <Alert variant="danger" className="ms-auto mb-0 p-2 d-flex align-items-center">
                                    <ExclamationCircleFill className="me-2" /> {status.error}
                                </Alert>
                            }
                            {status.success && 
                                <Alert variant="success" className="ms-auto mb-0 p-2 d-flex align-items-center">
                                    <CheckCircleFill className="me-2" /> {status.success}
                                </Alert>
                            }
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={status.loading} 
                                className="ms-3"
                            >
                                <Save className="me-2" /> {status.loading ? 'Guardando...' : 'Guardar Perfil Culinario'}
                            </Button>
                        </div>
                    </Form>

                </Card.Body>
            </Card>
        </Container>
    );
}

export default Preferencias;