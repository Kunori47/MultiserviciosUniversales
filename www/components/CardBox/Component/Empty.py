from reactpy import component, html

@component
def CardBoxComponentEmpty():
    return html.div(
        {"class": "text-center py-24 text-gray-500 dark:text-slate-400"},
        html.p("Nothing's here…")
    )