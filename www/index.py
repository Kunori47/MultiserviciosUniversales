from reactpy import component, html
from .routes.login.Login import LoginPage

@component
def App():
    return html._(
        html.link(
            {
                "href": "https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css",
                "rel": "stylesheet",
            }
        ),
        LoginPage()
        
    )