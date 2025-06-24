import json
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import items

with open("tags_metadata.json") as f:
    tags_metadata = json.load(f)

app = FastAPI(
    title="Multiservicios Universal API", 
    description="API for Multiservicios Universal",
    version="0.5",
    openapi_tags=tags_metadata
)


app.include_router(items.router)
