from reactpy import component, html
from typing import Any, Optional

@component
def Buttons(
    type_: str = "justify-start",
    mb: str = "-mb-3",
    noWrap: bool = False,
    className: Optional[str] = "",
    children: Any = None,
):
    classes = [
        "flex",
        "items-center",
        type_,
        className or "",
        mb,
        "flex-nowrap" if noWrap else "flex-wrap"
    ]
    class_string = " ".join(filter(None, classes))
    return html.div({"class": class_string}, children)