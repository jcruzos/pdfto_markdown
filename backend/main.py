from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pymupdf4llm
import pymupdf
import tempfile
import os
import shutil

import re

app = FastAPI(title="PDF to Markdown API")

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_markdown_text(text: str) -> str:
    """Aplica filtros de limpieza para corregir errores de OCR y basura del PDF."""
    if not text:
        return text
        
    # 1. Eliminar etiquetas de texto de imágenes insertadas por pymupdf
    text = re.sub(r'<!-- Start of picture text -->.*?<!-- End of picture text -->', '', text, flags=re.DOTALL)
    
    # 2. Corregir caracteres mal extraídos muy comunes en OCR en español
    replacements = {
        'ǧ': 'ú',
        'ǭ': 'á',
        'Ǹ': 'é',
        'Je ': 'de ',
        '  ': ' ' # Reducir dobles espacios
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
        
    # 3. Eliminar saltos de línea excesivos
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

@app.post("/api/convert")
async def convert_pdf_to_md(
    file: UploadFile = File(...),
    pages: str = Form(None)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="El archivo debe ser un documento PDF")
    
    tmp_path = ""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        page_list = None
        if pages:
            # Parse ranges like "1-3, 5, 7-9"
            page_list = []
            try:
                parts = [p.strip() for p in pages.split(',') if p.strip()]
                for part in parts:
                    if '-' in part:
                        start, end = map(int, part.split('-'))
                        page_list.extend(range(start - 1, end))
                    else:
                        page_list.append(int(part) - 1)
            except ValueError:
                raise HTTPException(status_code=400, detail="Formato de páginas inválido. Usa por ejemplo '1-3, 5'")
        
        md_text = pymupdf4llm.to_markdown(tmp_path, pages=page_list)
        md_text = clean_markdown_text(md_text)
        return {"markdown": md_text, "filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en conversión: {str(e)}")
        
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
