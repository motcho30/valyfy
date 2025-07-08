import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Loader2 } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: 'transparent',
    primaryColor: '#f4f4f5',
    primaryTextColor: '#18181b',
    primaryBorderColor: '#e4e4e7',
    lineColor: '#a1a1aa',
    secondaryColor: '#e4e4e7',
    tertiaryColor: '#f4f4f5'
  }
});

const Diagram = ({ chart }) => {
  const mermaidRef = useRef(null);
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chart) {
      setLoading(true);
      setError(null);
      
      const uniqueId = `mermaid-graph-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(uniqueId, chart)
        .then(result => {
          setSvg(result.svg);
          if (mermaidRef.current && result.bindFunctions) {
            result.bindFunctions(mermaidRef.current);
          }
        })
        .catch(err => {
          console.error('Mermaid rendering error:', err);
          setError(err.message || 'An error occurred while rendering the diagram.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [chart]);

  const handleDownload = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-flow-diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group relative p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-auto min-h-[450px] flex items-center justify-center w-full">
      {loading && (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating Diagram...</span>
        </div>
      )}
      {error && <pre className="text-red-500 p-4 text-xs whitespace-pre-wrap">{error}</pre>}
      {!loading && !error && (
        <div 
          ref={mermaidRef} 
          className="w-full h-full flex items-center justify-center" 
          dangerouslySetInnerHTML={{ __html: svg }} 
        />
      )}
      {svg && !loading && !error && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleDownload}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-slate-100 transition-all"
            title="Download as SVG"
          >
            <Download className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Diagram; 