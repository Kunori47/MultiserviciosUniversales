from reactpy import component, html, use_state
from www.components.FormField.FormField import FormField
from www.components.Divider import Divider
from www.components.Buttons import Buttons
from www.components.Button import Button

@component
def LoginForm():
    # Estado del formulario
    login, set_login = use_state("")

    def handle_submit(event):
        event.prevent_default()
        # Aquí podrías hacer la lógica de autenticación o redirección
        print("Form values", {"login": login})
        # Simula redirección (en ReactPy puro, deberías usar un router si tienes uno)
        # window.location.href = "/dashboard"

    return html.form(
        {"on_submit": handle_submit},
        FormField(
            label="Login",
            help="Coloca tu Cedula de Identidad",
            children=lambda fieldData: html.input({
                "name": "login",
                "class": fieldData["className"],
                "value": login,
                "placeholder": "Ejemplo: 12345678",
            })
        ),
        Divider(),
        Buttons(
            children=[
                Button(type_="submit", label="Login", color="info", isGrouped=True),
            ]
        )
    )