import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

function InfographicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const htmlToRender = location.state?.html;

  const infographicRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const processedHtml = useMemo(() => {
    if (!htmlToRender) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlToRender, 'text/html');

    // Solución para el CORS de las imágenes (sin cambios)
    const proxyUrl = 'https://corsproxy.io/?';
    doc.querySelectorAll('img').forEach(img => {
      const originalSrc = img.getAttribute('src');
      if (originalSrc && originalSrc.startsWith('http')) {
        img.src = `${proxyUrl}${encodeURIComponent(originalSrc)}`;
      }
    });
    
    // ===================================================================
    // ✅ INICIO DE LA NUEVA MEJORA: LIMPIEZA DE HTML
    // ===================================================================
    // Obtenemos el contenido del body y usamos una expresión regular para
    // buscar y eliminar globalmente (/g) todos los `&nbsp;`.
    const bodyContentWithSpaces = doc.body.innerHTML;
    const bodyContent = bodyContentWithSpaces.replace(/&nbsp;/g, '');
    // ===================================================================
    // ✅ FIN DE LA NUEVA MEJORA
    // ===================================================================

    // El resto de la lógica para extraer estilos y head a partir de aquí no cambia.
    let styles = '';
    doc.querySelectorAll('style').forEach(styleTag => { styles += styleTag.textContent; });
    
    const headElements = [];
    doc.head.childNodes.forEach(node => {
      if ((node.tagName === 'LINK' && node.hasAttribute('href')) || (node.tagName === 'SCRIPT' && node.hasAttribute('src'))) {
        const attributes = {};
        for (const attr of node.attributes) { attributes[attr.name] = attr.value; }
        headElements.push({ tagName: node.tagName.toLowerCase(), attributes });
      }
    });

    // Devolvemos el bodyContent ya limpio.
    return { bodyContent, styles, headElements };
  }, [htmlToRender]);

  // El resto del componente (lógica de descarga y renderizado) no necesita cambios.
  const handleDownload = (format) => {
    if (!window.html2canvas || !window.jspdf) {
      alert("Error: Las librerías de descarga no se pudieron cargar. Revisa la consola para más detalles.");
      return;
    }
    if (!infographicRef.current) return;
    
    setIsDownloading(true);

    setTimeout(async () => {
      try {
        const canvas = await window.html2canvas(infographicRef.current, {
          useCORS: true,
          scale: 2,
        });

        if (format === 'png') {
          const link = document.createElement('a');
          link.download = 'visualizacion.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        } else if (format === 'pdf') {
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('visualizacion.pdf');
        }
      } catch (error) {
        console.error("Error durante la generación del archivo:", error);
        alert("Ocurrió un error al generar el archivo. El contenido HTML podría tener elementos que no se pueden procesar.");
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  if (!processedHtml) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">No se encontró código HTML para visualizar.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Volver al Inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <title>Visualizador de Infografía</title>
      {processedHtml.headElements.map((el, index) => {
        const Tag = el.tagName;
        return <Tag key={index} {...el.attributes} />;
      })}
      <style>{processedHtml.styles}</style>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md flex items-center justify-center sm:justify-between gap-4 flex-wrap">
        <div className="flex gap-4">
          <button
            onClick={() => handleDownload('png')}
            disabled={isDownloading}
            className="px-5 py-2.5 font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isDownloading ? 'Descargando...' : 'Descargar PNG'}
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className="px-5 py-2.5 font-bold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isDownloading ? 'Descargando...' : 'Descargar PDF'}
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          disabled={isDownloading}
          className="px-5 py-2.5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-300"
        >
          Volver
        </button>
      </div>

      <div ref={infographicRef} className="bg-white p-4 sm:p-6 rounded-xl shadow-inner">
        {parse(processedHtml.bodyContent)}
      </div>
    </div>
  );
}

export default InfographicPage;