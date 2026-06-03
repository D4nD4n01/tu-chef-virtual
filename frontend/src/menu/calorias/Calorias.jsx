// src/menu/MonitorCalorias/MonitorCalorias.jsx
import React from 'react';

function MonitorCalorias() {
  return (
    <div style={{ height: '90vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      
      {/* Contenedor principal que actúa como la "tarjeta" */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        border: '1px solid #dee2e6',
        backgroundColor: '#fff'
      }}>
        
        {/* Encabezado con etiquetas HTML normales */}
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Dashboard </h2>
        </div>

        {/* Contenedor del Iframe de Streamlit */}
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe 
            src="http://localhost:8501/?embed=true" 
            title="Dashboard de Preferencias"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              border: 'none' 
            }} 
          />
        </div>
        
      </div>
    </div>
  );
}

export default MonitorCalorias;