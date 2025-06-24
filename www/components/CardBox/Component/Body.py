from reactpy import component, html
from typing import Any, Optional, Union, List

@component
def CardBoxComponentBody(
    noPadding: bool = False,
    className: Optional[str] = None,
    children: Any = None
):
    # CSS Class

    base_class = "flex-1"
    padding_class = "" if noPadding else "p-6"
    full_class = " ".join(filter(None, [base_class, padding_class, className]))

    return html.div(
        {"class": full_class},
        children
    )

