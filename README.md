# db-project

## Descripción
Este proyecto utiliza **FastAPI** como backend y **React** como frontend para crear una aplicación interactiva.

## Requisitos
Antes de comenzar, asegúrate de tener instalados los siguientes programas:
- **Python 3.9 o superior**
- **pip** (administrador de paquetes de Python)
- **Node.js** y **npm** (solo si usas Next.js/React como frontend)

## Instalación

### Backend (FastAPI + ReactPy)
1. Clona este repositorio:
   ```bash
   git clone https://github.com/Kunori47/db-project.git
   cd db-project
   ```
2. Activa un entorno virtual (opcional pero recomendado):
    En Windows:
    ```bash
    venv\Scripts\activate
    ```
    En Linux:
    ```bash
    source venv/bin/activate
    ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend (Next.js/React) - Opcional
1. Ve a la carpeta del frontend (por ejemplo, `www` o `frontend`):
   ```bash
   cd www
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La app estará disponible en [http://localhost:3000](http://localhost:3000)

## Ejecución

### Backend (FastAPI)
1. Inicia el servidor FastAPI:
   ```bash
   uvicorn main:app --reload
   ```

2. Accede a la aplicación en tu navegador:
   - **Documentación interactiva**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend (Next.js/React)
- Si usas Next.js/React, accede a [http://localhost:3000](http://localhost:3000)
- Para producción, puedes exportar el build estático y servirlo con FastAPI usando `StaticFiles`.

## Licencia
Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT)