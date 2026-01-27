import sys
from PyQt5.QtWidgets import QApplication
from ui.auth import AuthWindow
from ui.styles import STYLESHEET

if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    app.setStyleSheet(STYLESHEET) 
    # Note: Stylesheet is applied to windows individually or can be global here.
    # AuthWindow applies it to itself.
    
    auth_window = AuthWindow(STYLESHEET)
    auth_window.show()
    sys.exit(app.exec_())
