from reactpy import component, html
from typing import Optional, Any
from ..lib.colors import get_button_color
from ..interfaces.types import ColorButtonKey

@component
def Button(
    label: Optional[str] = None,
    icon: Optional[Any] = None,  # Puedes pasar un componente o SVG aquí
    iconSize: Optional[str] = None,
    href: Optional[str] = None,
    target: Optional[str] = None,
    type_: Optional[str] = "button",
    color: str = ColorButtonKey,
    className: str = "",
    asAnchor: bool = False,
    small: bool = False,
    outline: bool = False,
    active: bool = False,
    disabled: bool = False,
    roundedFull: bool = False,
    isGrouped: bool = False,
    onClick: Optional[Any] = None,
    **props
):
    component_class = [
        "inline-flex",
        "justify-center",
        "items-center",
        "whitespace-nowrap",
        "focus:outline-hidden",
        "transition-colors",
        "focus:ring-3",
        "duration-150",
        "border",
        "cursor-not-allowed" if disabled else "cursor-pointer",
        "rounded-full" if roundedFull else "rounded-sm",
        get_button_color(color, outline, not disabled, active),
        className,
    ]

    if isGrouped:
        component_class += ["mr-3", "last:mr-0", "mb-3"]

    if not label and icon:
        component_class.append("p-1")
    elif small:
        component_class += ["text-sm", "px-3 py-1" if roundedFull else "p-1"]
    else:
        component_class += ["py-2", "px-6" if roundedFull else "px-3"]

    if disabled:
        component_class.append("opacity-50" if outline else "opacity-70")

    component_class_string = " ".join(component_class)

    # Icon puede ser un componente o un SVG, aquí solo lo pasamos directamente
    children = []
    if icon:
        children.append(icon)
    if label:
        children.append(
            html.span({"class": "px-1" if small and icon else "px-2"}, label)
        )

    if href and not disabled:
        return html.a(
            {
                "href": href,
                "target": target,
                "class": component_class_string,
                **props,
            },
            *children
        )

    return html.button(
        {
            "class": component_class_string,
            "type": type_,
            "target": target,
            "disabled": disabled,
            "on_click": onClick,
            **props,
        },
        *children
    )