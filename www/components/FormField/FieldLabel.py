from reactpy import component, html
from typing import Optional, Any

@component
def FieldLabel(
    htmlFor: Optional[str] = None,
    children: Any = None,
    className: Optional[str] = ""
):
    label_class = "block mb-2 font-semibold"
    if htmlFor:
        label_class += " cursor-pointer"
    if className:
        label_class += f" {className}"

    return html.label(
        {"htmlFor": htmlFor, "class": label_class},
        html.span({"class": "line-clamp-1"}, children)
    )