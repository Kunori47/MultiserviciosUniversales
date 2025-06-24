from reactpy import component, html
from typing import Optional, Callable, Any
from .FieldLabel import FieldLabel
from .interfaces import FormFieldData

@component
def FormField(
    label: Optional[str] = None,
    labelFor: Optional[str] = None,
    help: Optional[str] = None,
    icon: Optional[Any] = None,
    isBorderless: bool = False,
    isTransparent: bool = False,
    hasTextareaHeight: bool = False,
    children: Optional[Callable[[FormFieldData], Any]] = None,
):
    className = " ".join([
        "px-3 py-2 max-w-full border-gray-700 rounded-sm w-full dark:placeholder-gray-400",
        "focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden",
        "h-24" if hasTextareaHeight else "h-12",
        "border-0" if isBorderless else "border",
        "bg-transparent" if isTransparent else "bg-white dark:bg-slate-800",
        "pl-10" if icon else "",
    ])
    fieldData = {"className": className}

    return html.div(
        {"class": "mb-6 last:mb-0"},
        (
            FieldLabel(htmlFor=labelFor, children=label)
            if label else None
        ),
        html.div(
            {"class": "relative"},
            children(fieldData) if children else None,
        ),
        html.div(
            {"class": "text-xs text-gray-500 dark:text-slate-400 mt-1"},
            help
        ) if help else None
    )