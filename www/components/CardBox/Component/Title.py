from reactpy import component, html
from typing import Optional, Union, List

@component
def CardBoxComponentTitle(
    title: str,
    children: Optional[Union[html.Element, List[html.Element]]] = None
):
    return html.div(
        {"class": "flex items-center justify-between mb-3"},
        html.h1({"class": "text-2xl"}, title),
        children
    )