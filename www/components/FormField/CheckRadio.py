from reactpy import component, html
from typing import Any, Optional, Literal

@component
def FormCheckRadio(
    children: Any = None,
    type_: Literal["checkbox", "radio", "switch"] = "checkbox",
    label: Optional[str] = None,
    className: Optional[str] = "",
    isGrouped: bool = False,
):
    class_string = f"{type_} {className or ''} {'mr-6 mb-3 last:mr-0' if isGrouped else ''}"
    return html.label(
        {"class": class_string},
        children,
        html.span({"class": "check"}),
        html.span({"class": "pl-2"}, label) if label else None
    )