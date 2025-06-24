from reactpy import component, html
from typing import Any, Optional, Union, List

@component
def CardBoxComponentFooter(
    className: Optional[str] = None,
    children: Any = None
):
    # Combine base class with optional additional classes
    footer_class = "p-6"
    if className:
        footer_class += f" {className}"
    
    return html.footer(
        {"class": footer_class},
        children
    )