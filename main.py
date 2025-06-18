import json
from fastapi import FastAPI
from reactpy import component, html
from reactpy.backend.fastapi import configure
from routes import items

with open("tags_metadata.json") as f:
    tags_metadata = json.load(f)

app = FastAPI(
    title="Mulltiservicios Universal API", 
    description="API for Mulltiservicios Universal",
    version="0.0.1",
    openapi_tags=tags_metadata
)

app.include_router(items.router)
