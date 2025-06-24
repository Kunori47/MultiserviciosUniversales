# constants.py
container_max_w = "xl:max-w-6xl xl:mx-auto"
app_title = "Multiservicios Universal"

def get_page_title(current_page_title: str) -> str:
    return f"{current_page_title} — {app_title}"