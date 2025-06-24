from reactpy import component
from www.components.CardBox.CardBox import CardBox
from www.components.Section.FullScreen import SectionFullScreen
from .components.LoginForm import LoginForm

@component
def LoginPage():
    return SectionFullScreen(
        bg="purplePink",
        children=CardBox(
            className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl",
            children=LoginForm()
        )
    )