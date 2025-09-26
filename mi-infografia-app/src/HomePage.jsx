import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [htmlContent, setHtmlContent] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (htmlContent.trim() === '') {
      alert('Por favor, pega el código HTML en el área de texto.');
      return;
    }
    navigate('/infografia', { state: { html: htmlContent } });
  };

  const handleClear = () => {
    setHtmlContent('');
  };

  return (
    // Contenedor principal para centrar todo en la página
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      
      {/* Tarjeta principal con sombra y bordes redondeados */}
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-lg transform transition-all hover:shadow-2xl">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Visualizador de HTML</h1>
          <p className="text-gray-500 text-lg">Convierte tu código HTML en un diseño descargable.</p>
        </div>

        {/* Instrucciones */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h2 className="font-bold text-blue-800 mb-1">Instrucciones:</h2>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Copia el código HTML completo que deseas visualizar.</li>
            <li>Pégalo en el cuadro de texto de abajo.</li>
            <li>Haz clic en "Visualizar" para ver el resultado.</li>
          </ol>
        </div>

        {/* Área de texto con estilos mejorados */}
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="Pega tu código HTML aquí..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
        />
        
        {/* Contenedor de botones alineados a la derecha */}
        <div className="mt-6 flex justify-end items-center gap-4">
          <button 
            onClick={handleClear}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300 transform hover:scale-105"
          >
            Limpiar
          </button>
          <button 
            onClick={handleGenerate}
            className="px-8 py-2 font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Visualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;