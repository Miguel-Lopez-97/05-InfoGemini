import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function InfographicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const htmlToRender = location.state?.html;

  const infographicRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 🧠 PROCESADOR INTELIGENTE DE HTML
  // Este bloque usa `useMemo` para ejecutarse solo cuando el HTML de entrada cambia.
  const processedHtml = useMemo(() => {
    if (!htmlToRender) return null;

    // 1. Usamos DOMParser para convertir el string en un documento DOM en memoria.
    // Esto es seguro y mucho más robusto que usar expresiones regulares.
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlToRender, 'text/html');

    // 2. Extraemos las tres partes clave que necesitamos:
    
    // a) El contenido visual que va dentro del <body>
    const bodyContent = doc.body.innerHTML;
    
    // b) Todos los estilos CSS que se encuentren en etiquetas <style>
    let styles = '';
    doc.querySelectorAll('style').forEach(styleTag => {
      styles += styleTag.textContent;
    });

    // c) Los recursos externos como fuentes de Google o CDNs (ej. Tailwind)
    const headElements = [];
    doc.head.childNodes.forEach(node => {
      // Solo nos interesan <link> con 'href' y <script> con 'src'
      if ((node.tagName === 'LINK' && node.hasAttribute('href')) || (node.tagName === 'SCRIPT' && node.hasAttribute('src'))) {
        const attributes = {};
        for (const attr of node.attributes) {
          attributes[attr.name] = attr.value;
        }
        headElements.push({
          tagName: node.tagName.toLowerCase(),
          attributes,
        });
      }
    });

    return { bodyContent, styles, headElements };
  }, [htmlToRender]);


  // --- LÓGICA DE DESCARGA ---
  // Estas funciones ya están correctamente integradas.

  const handleDownloadPNG = () => {
    if (!infographicRef.current) return;
    setIsDownloading(true);
    setTimeout(() => {
      html2canvas(infographicRef.current, { useCORS: true, scale: 2 })
        .then(canvas => {
          const link = document.createElement('a');
          link.download = 'infografia.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        })
        .finally(() => setIsDownloading(false));
    }, 100);
  };
  
  const handleDownloadPDF = () => {
    if (!infographicRef.current) return;
    setIsDownloading(true);
    setTimeout(() => {
      html2canvas(infographicRef.current, { useCORS: true, scale: 2 })
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('infografia.pdf');
        })
        .finally(() => setIsDownloading(false));
    }, 100);
  };


  // --- RENDERIZADO DEL COMPONENTE ---

  if (!processedHtml) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>No se encontró código HTML. Por favor, vuelve al inicio.</p>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* 3. RECONSTRUIMOS EL HEAD USANDO LA FUNCIÓN NATIVA DE REACT 19 */}
      {/* React moverá estas etiquetas al <head> del documento automáticamente. */}
      <title>Visualizador de Infografía</title>
      {processedHtml.headElements.map((el, index) => {
        const Tag = el.tagName;
        return <Tag key={index} {...el.attributes} />;
      })}
      
      {/* 4. INYECTAMOS LOS ESTILOS CSS EXTRAÍDOS */}
      <style>{processedHtml.styles}</style>

      {/* Contenedor de botones que se oculta durante la descarga */}
      {!isDownloading && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPNG}>Descargar como PNG</button>
          <button onClick={handleDownloadPDF}>Descargar como PDF</button>
          <button onClick={() => navigate('/')} style={{ marginLeft: 'auto' }}>Volver</button>
        </div>
      )}

      {/* 5. RENDERIZAMOS EL CONTENIDO VISUAL DENTRO DEL CONTENEDOR DE CAPTURA */}
      <div ref={infographicRef}>
        {parse(processedHtml.bodyContent)}
      </div>
    </div>
  );
}

export default InfographicPage;
