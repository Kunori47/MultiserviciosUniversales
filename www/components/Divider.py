from reactpy import component, html
from typing import Optional

@component
def Divider(navBar: bool = False):
    class_addon = (
        "hidden lg:block lg:my-0.5 dark:border-slate-700"
        if navBar
        else "my-6 -mx-6 dark:border-slate-800"
    )
    class_string = f"{class_addon} border-t border-gray-100"
    return html.hr({"class": class_string})