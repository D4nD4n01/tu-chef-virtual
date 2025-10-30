// src/menu/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Offcanvas, Nav } from 'react-bootstrap';
// Importamos los iconos
import { 
  List as MenuIcon, HouseFill, Robot, BookmarkStar, GraphUp, BoxArrowRight, QuestionCircleFill 
} from 'react-bootstrap-icons';

// --- ¡IMPORTANTE! ---
// Importamos TODOS los componentes que el menú puede cargar
import Inicio from './inicio/Inicio';
import AsistenteIA from './asistente/Asistente';
import MiRecetario from './recetario/Recetario';
import MonitorCalorias from './calorias/Calorias';


function MainLayout() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  // --- NUEVO ESTADO ---
  // Este estado controla qué componente mostrar.
  // Usamos 'inicio' (tu strArchive) como valor por defecto.
  const [activeComponent, setActiveComponent] = useState('inicio');

  // 1. Carga el menú desde el servidor (esto no cambia)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Asumiendo que tu servidor está en 3111 y la tabla es 'menu'
        const response = await fetch('http://localhost:3111/getMenu'); 
        if (!response.ok) throw new Error('No se pudo cargar el menú');
        
        const data = await response.json();
        console.log(data)
        setMenuItems(data.filter(item => item.booleanVisible));
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // 2. Funciones de Offcanvas y Logout (Logout no cambia)
  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);
  const handleLogout = () => {
    localStorage.removeItem('IdUser');
    alert('Has cerrado sesión.');
    navigate('/');
  };

  // 3. Mapeo de Nombres (DB) a Iconos (React) (no cambia)
  const getMenuIcon = (strName) => {
    switch (strName) {
      case 'Inicio': return <HouseFill className="me-2" />;
      case 'Asistente IA': return <Robot className="me-2" />;
      case 'Mi Recetario': return <BookmarkStar className="me-2" />;
      case 'Monitor de Calorías': return <GraphUp className="me-2" />;
      default: return <QuestionCircleFill className="me-2" />;
    }
  };

  // 4. --- NUEVA FUNCIÓN ---
  // Esta función renderiza el componente basado en el estado 'activeComponent'
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'inicio':
        return <Inicio />;
      case 'asistente':
        return <AsistenteIA />;
      case 'recetario':
        return <MiRecetario />;
      case 'calorias':
        return <MonitorCalorias />;
      default:
        return <Inicio />;
    }
  };

  return (
    <>
      <Navbar bg="success" variant="dark" expand={false} sticky="top">
        <Container fluid>
          <Button variant="outline-light" onClick={handleShowMenu}>
            <MenuIcon size={24} />
          </Button>
          <Navbar.Brand href="#home" className="mx-auto">
            👨‍🍳 Tu Chef Virtual
          </Navbar.Brand>
          <Button variant="outline-light" onClick={handleLogout}>
            <BoxArrowRight size={24} />
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={showMenu} onHide={handleCloseMenu}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú Principal</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            
            {menuItems.map((item) => {
              const icon = getMenuIcon(item.strName);

              return (

                <Nav.Link 
                  key={item.intIdRow}
                  onClick={() => {
                    setActiveComponent(item.strArchive); 
                    handleCloseMenu(); 
                  }}
                  className="d-flex align-items-center fs-5 my-1"
                  style={{ cursor: 'pointer' }} // Para que parezca clickeable
                >
                  {icon}
                  {item.strName}
                </Nav.Link>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>


      <main>
        {renderActiveComponent()}
      </main>
    </>
  );
}

export default MainLayout;