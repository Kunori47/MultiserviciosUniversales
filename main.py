import json
from fastapi import FastAPI, Request
from reactpy.backend.fastapi import configure
from routes import items
from www.index import App

with open("tags_metadata.json") as f:
    tags_metadata = json.load(f)

app = FastAPI(
    title="Multiservicios Universal API", 
    description="API for Multiservicios Universal",
    version="0.5",
    openapi_tags=tags_metadata
)

configure(app, App)
app.include_router(items.router)
