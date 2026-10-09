# pdfto markdown

pdfto markdown es una aplicación web full-stack que te permite extraer texto y estructura de documentos PDF con alta precisión y convertirlos instantáneamente a formato Markdown (.md).

## 🚀 Características

- **Conversión de PDF a Markdown:** Transforma tus documentos PDF en texto plano estructurado con formato Markdown.
- **Selección de Páginas:** Elige páginas o rangos de páginas específicos para extraer (ej: `1-3, 5, 7-9`).
- **Limpieza y Corrección Automática:** El backend incluye filtros especializados para eliminar basura del PDF y corregir errores comunes de OCR.
- **Interfaz de Usuario Moderna:** Frontend atractivo con modo oscuro (Dark Mode), soporte Drag & Drop (Arrastrar y Soltar) y previsualización de Markdown en tiempo real.
- **Descarga Inmediata:** Una vez convertido, puedes descargar el archivo `.md` generado directamente a tu computadora.
- **Dockerizado:** Listo para ser desplegado fácilmente utilizando Docker y Docker Compose.

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Renderizado de Markdown:** [React Markdown](https://github.com/remarkjs/react-markdown)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Procesamiento de PDF:** [PyMuPDF4LLM](https://github.com/pymupdf/pymupdf4llm) y [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/)

---

## ⚙️ Instalación y Uso

La forma más sencilla de levantar el proyecto es utilizando **Docker** y **Docker Compose**.

### Prerrequisitos
- Tener instalado [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).

### Ejecutar con Docker

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone <url-del-repositorio>
   cd pdfto_markdown
   ```

2. Construye y levanta los contenedores usando Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

3. Accede a la aplicación:
   - **Frontend (Interfaz Gráfica):** [http://localhost:8098](http://localhost:8098)
   - **Backend (API):** [http://localhost:8000](http://localhost:8000)
   - **Documentación de la API (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)

Para detener los contenedores, ejecuta:
```bash
docker-compose down
```

---

## 📡 API Reference

El backend expone una API REST con los siguientes endpoints principales:

- `GET /api/health`: Retorna el estado de salud de la API.
- `POST /api/convert`: Endpoint principal que recibe un archivo PDF (y opcionalmente las páginas) y retorna el texto extraído en formato Markdown.

### Ejemplo de uso del endpoint de conversión:
```bash
curl -X 'POST' \
  'http://localhost:8000/api/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@documento.pdf' \
  -F 'pages=1-5'
```

---
## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
