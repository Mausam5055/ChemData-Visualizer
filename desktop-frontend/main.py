import sys
import os
from PyQt5.QtWidgets import QApplication
from PyQt5.QtGui import QIcon
from ui.auth import AuthWindow
from ui.styles import STYLESHEET

if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    
    # Set application icon
    icon_path = os.path.join(os.path.dirname(__file__), 'assets', 'app_icon.png')
    if os.path.exists(icon_path):
        app.setWindowIcon(QIcon(icon_path))
    
    app.setStyleSheet(STYLESHEET) 
    # Note: Stylesheet is applied to windows individually or can be global here.
    # AuthWindow applies it to itself.
    
    auth_window = AuthWindow(STYLESHEET)
    auth_window.show()
    sys.exit(app.exec_())
