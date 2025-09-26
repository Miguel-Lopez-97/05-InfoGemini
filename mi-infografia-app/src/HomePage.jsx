// src/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [htmlContent, setHtmlContent] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (htmlContent.trim() === '') {
      alert('Por favor, pega el código HTML de Canva.');
      return;
    }
    // Usamos el 'state' de la navegación para pasar el HTML
    // Es mejor que un parámetro en la URL para código largo.
    navigate('/infografia', { state: { html: htmlContent } });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Generador de Infografías</h1>
      <p>Pega aquí el código HTML puro generado por Canva.</p>
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        placeholder="<div...></div>"
        style={{ width: '100%', height: '300px', marginBottom: '10px' }}
      />
      <button onClick={handleGenerate} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Visualizar Infografía
      </button>
    </div>
  );
}

export default HomePage;