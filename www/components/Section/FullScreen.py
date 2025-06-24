from reactpy import component, html
from typing import Any, Optional
from ...interfaces.types import BgKey
from ...lib.colors import gradient_bg_dark, gradient_bg_pink_red, gradient_bg_purple_pink

@component
def SectionFullScreen(
    bg: str = "purplePink",
    children: Any = None,
    darkMode: Optional[bool] = False  # Puedes pasar esto como prop si tienes un estado global
):
    component_class = "flex min-h-screen items-center justify-center "

    if darkMode:
        component_class += gradient_bg_dark
    elif bg == "purplePink":
        component_class += gradient_bg_purple_pink
    elif bg == "pinkRed":
        component_class += gradient_bg_pink_red

    return html.div({"class": component_class}, children)