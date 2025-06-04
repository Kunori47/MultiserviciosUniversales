from fastapi import FastAPI
from reactpy import component, html
from reactpy.backend.fastapi import configure

app = FastAPI()

@component
def hello_world():
    return html.div("Mamalo abstracto")


configure(app, hello_world)
