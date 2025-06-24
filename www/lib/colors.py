from typing import Literal, TypedDict, Union, Dict, List
from ..interfaces.types import ColorButtonKey


# Gradient backgrounds
gradient_bg_base = "bg-gradient-to-tr"
gradient_bg_purple_pink = f"{gradient_bg_base} from-purple-400 via-pink-500 to-red-500"
gradient_bg_dark = f"{gradient_bg_base} from-slate-700 via-slate-900 to-slate-800"
gradient_bg_pink_red = f"{gradient_bg_base} from-pink-400 via-red-500 to-yellow-500"

# Color dictionaries
colors_bg_light = {
    "white": "bg-white text-black",
    "light": "bg-white text-black dark:bg-slate-900/70 dark:text-white",
    "contrast": "bg-gray-800 text-white dark:bg-white dark:text-black",
    "success": "bg-emerald-500 border-emerald-500 text-white",
    "danger": "bg-red-500 border-red-500 text-white",
    "warning": "bg-yellow-500 border-yellow-500 text-white",
    "info": "bg-blue-500 border-blue-500 text-white",
}

colors_text = {
    "white": "text-black dark:text-slate-100",
    "light": "text-gray-700 dark:text-slate-400",
    "contrast": "dark:text-white",
    "success": "text-emerald-500",
    "danger": "text-red-500",
    "warning": "text-yellow-500",
    "info": "text-blue-500",
}

colors_outline = {
    "white": f"{colors_text['white']} border-gray-100",
    "light": f"{colors_text['light']} border-gray-100",
    "contrast": f"{colors_text['contrast']} border-gray-900 dark:border-slate-100",
    "success": f"{colors_text['success']} border-emerald-500",
    "danger": f"{colors_text['danger']} border-red-500",
    "warning": f"{colors_text['warning']} border-yellow-500",
    "info": f"{colors_text['info']} border-blue-500",
}

# Color configuration for buttons
class ButtonColors(TypedDict):
    ring: Dict[str, str]
    active: Dict[str, str]
    bg: Dict[str, str]
    bgHover: Dict[str, str]
    borders: Dict[str, str]
    text: Dict[str, str]
    outlineHover: Dict[str, str]

button_colors: ButtonColors = {
    "ring": {
        "white": "ring-gray-200 dark:ring-gray-500",
        "whiteDark": "ring-gray-200 dark:ring-gray-500",
        "lightDark": "ring-gray-200 dark:ring-gray-500",
        "contrast": "ring-gray-300 dark:ring-gray-400",
        "success": "ring-emerald-300 dark:ring-emerald-700",
        "danger": "ring-red-300 dark:ring-red-700",
        "warning": "ring-yellow-300 dark:ring-yellow-700",
        "info": "ring-blue-300 dark:ring-blue-700",
    },
    "active": {
        "white": "bg-gray-100",
        "whiteDark": "bg-gray-100 dark:bg-slate-800",
        "lightDark": "bg-gray-200 dark:bg-slate-700",
        "contrast": "bg-gray-700 dark:bg-slate-100",
        "success": "bg-emerald-700 dark:bg-emerald-600",
        "danger": "bg-red-700 dark:bg-red-600",
        "warning": "bg-yellow-700 dark:bg-yellow-600",
        "info": "bg-blue-700 dark:bg-blue-600",
    },
    "bg": {
        "white": "bg-white text-black",
        "whiteDark": "bg-white text-black dark:bg-slate-900 dark:text-white",
        "lightDark": "bg-gray-100 text-black dark:bg-slate-800 dark:text-white",
        "contrast": "bg-gray-800 text-white dark:bg-white dark:text-black",
        "success": "bg-emerald-600 dark:bg-emerald-500 text-white",
        "danger": "bg-red-600 dark:bg-red-500 text-white",
        "warning": "bg-yellow-600 dark:bg-yellow-500 text-white",
        "info": "bg-blue-600 dark:bg-blue-500 text-white",
    },
    "bgHover": {
        "white": "hover:bg-gray-100",
        "whiteDark": "hover:bg-gray-100 dark:hover:bg-slate-800",
        "lightDark": "hover:bg-gray-200 dark:hover:bg-slate-700",
        "contrast": "hover:bg-gray-700 dark:hover:bg-slate-100",
        "success": "hover:bg-emerald-700 hover:border-emerald-700 dark:hover:bg-emerald-600 dark:hover:border-emerald-600",
        "danger": "hover:bg-red-700 hover:border-red-700 dark:hover:bg-red-600 dark:hover:border-red-600",
        "warning": "hover:bg-yellow-700 hover:border-yellow-700 dark:hover:bg-yellow-600 dark:hover:border-yellow-600",
        "info": "hover:bg-blue-700 hover:border-blue-700 dark:hover:bg-blue-600 dark:hover:border-blue-600",
    },
    "borders": {
        "white": "border-white",
        "whiteDark": "border-white dark:border-slate-900",
        "lightDark": "border-gray-100 dark:border-slate-800",
        "contrast": "border-gray-800 dark:border-white",
        "success": "border-emerald-600 dark:border-emerald-500",
        "danger": "border-red-600 dark:border-red-500",
        "warning": "border-yellow-600 dark:border-yellow-500",
        "info": "border-blue-600 dark:border-blue-500",
    },
    "text": {
        "contrast": "dark:text-slate-100",
        "success": "text-emerald-600 dark:text-emerald-500",
        "danger": "text-red-600 dark:text-red-500",
        "warning": "text-yellow-600 dark:text-yellow-500",
        "info": "text-blue-600 dark:text-blue-500",
    },
    "outlineHover": {
        "contrast": "hover:bg-gray-800 hover:text-gray-100 dark:hover:bg-slate-100 dark:hover:text-black",
        "success": "hover:bg-emerald-600 hover:text-white dark:hover:text-white dark:hover:border-emerald-600",
        "danger": "hover:bg-red-600 hover:text-white dark:hover:text-white dark:hover:border-red-600",
        "warning": "hover:bg-yellow-600 hover:text-white dark:hover:text-white dark:hover:border-yellow-600",
        "info": "hover:bg-blue-600 hover:text-white dark:hover:text-white dark:hover:border-blue-600",
    },
}

def get_button_color(
    color: ColorButtonKey,
    is_outlined: bool,
    has_hover: bool,
    is_active: bool = False
) -> str:
    if color == "void":
        return ""

    is_outlined_processed = is_outlined and color not in ["white", "whiteDark", "lightDark"]
    
    base_classes = [
        button_colors["borders"][color],
        button_colors["ring"][color]
    ]

    if is_active:
        base_classes.append(button_colors["active"][color])
    else:
        base_classes.append(
            button_colors["text"][color] if is_outlined_processed 
            else button_colors["bg"][color]
        )

    if has_hover:
        base_classes.append(
            button_colors["outlineHover"][color] if is_outlined_processed
            else button_colors["bgHover"][color]
        )

    return " ".join(base_classes)