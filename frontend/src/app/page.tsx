"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Settings, ArrowRight, Download, CheckCircle2, Loader2, File } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Por favor, sube un archivo PDF válido.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (pages.trim()) {
      formData.append("pages", pages.trim());
    }

    try {
      // Usamos NEXT_PUBLIC_BACKEND_URL si está definido, si no localhost:8000
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error en la conversión");
      }

      const data = await response.json();
      setResult(data.markdown);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace('.pdf', '') || 'document') + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="max-w-6xl mx-auto p-6 relative z-10 min-h-screen flex flex-col items-center justify-center py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 border border-white/10 shadow-xl backdrop-blur-md">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            PDF a Markdown
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Extrae el texto y estructura de tus documentos PDF con alta precisión. Selecciona páginas específicas y conviértelas al instante.
          </p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div 
              className={`relative group overflow-hidden transition-all duration-300 rounded-3xl p-8 border-2 border-dashed flex flex-col items-center justify-center min-h-[300px] cursor-pointer
                ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 backdrop-blur-sm'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden" 
              />
              
              {file ? (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <File className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white truncate max-w-[250px]">{file.name}</h3>
                    <p className="text-sm text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                    PDF Listo
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sube tu archivo PDF</h3>
                    <p className="text-sm text-white/40 mt-1">Arrastra tu archivo aquí o haz clic para buscar</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-white/60" />
                <h3 className="text-lg font-medium text-white">Opciones</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Páginas a extraer (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 1-3, 5, 7-9 (Deja vacío para todas)"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button 
                onClick={handleConvert}
                disabled={!file || loading}
                className={`w-full mt-6 group relative overflow-hidden rounded-xl px-4 py-4 font-semibold flex items-center justify-center space-x-2 transition-all
                  ${!file || loading ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-95'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Convirtiendo documento...</span>
                  </>
                ) : (
                  <>
                    <span>Generar Markdown</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="h-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-1 flex flex-col relative overflow-hidden min-h-[500px] max-h-[800px]">
            {result ? (
              <div className="flex flex-col h-full bg-black/40 rounded-[22px] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                  <div className="flex items-center space-x-2 text-indigo-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Conversión Exitosa</span>
                  </div>
                  <button 
                    onClick={downloadMarkdown}
                    className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar .md</span>
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden prose prose-invert prose-p:text-white/80 prose-headings:text-white max-w-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <FileText className="w-16 h-16 mb-4 stroke-[1]" />
                <p className="text-lg">El resultado en Markdown se previsualizará aquí</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
