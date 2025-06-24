from reactpy import component, html
from typing import Any, Optional, Union, List, Callable
from .Component.Body import CardBoxComponentBody
from .Component.Footer import CardBoxComponentFooter

# Main CardBox component
@component
def CardBox(
    children: Any = None,
    rounded: str = "rounded-2xl",
    flex: str = "flex-col",
    className: str = "",
    hasComponentLayout: bool = False,
    hasTable: bool = False,
    isHoverable: bool = False,
    isModal: bool = False,
    footer: Optional[Any] = None,
    onClick: Optional[Callable[[], None]] = None
):
    # Build class list
    component_class = [
        "bg-white flex",
        className,
        rounded,
        flex,
        "dark:bg-slate-900" if isModal else "dark:bg-slate-900/70"
    ]
    
    if isHoverable:
        component_class.append("hover:shadow-lg transition-shadow duration-500")
    
    # Prepare content
    if hasComponentLayout:
        content = children
    else:
        content = [
            CardBoxComponentBody(noPadding=hasTable, children=children),
            footer and CardBoxComponentFooter(children=footer)
        ]
        # Filter out None values (in case footer is None)
        content = [c for c in content if c is not None]
    
    return html.div(
        {
            "class": " ".join(component_class),
            "on_click": onClick
        },
        content
    )