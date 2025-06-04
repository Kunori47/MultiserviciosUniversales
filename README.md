# db-project

## Descripción
Este proyecto utiliza **FastAPI** como backend y **ReactPy** como frontend para crear una aplicación interactiva.

## Requisitos
Antes de comenzar, asegúrate de tener instalados los siguientes programas:
- **Python 3.9 o superior**
- **pip** (administrador de paquetes de Python)

## Instalación
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

## Ejecución
1. Inicia el servidor FastAPI:
   ```bash
   uvicorn main:app --reload
   ```

2. Accede a la aplicación en tu navegador:
   - **Frontend ReactPy**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **Documentación interactiva**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Licencia
Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).

