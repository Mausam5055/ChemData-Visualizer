STYLESHEET = """
QMainWindow {
    background-color: #f8fafc; /* Slate-50 */
}
QWidget {
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    color: #334155; /* Slate-700 */
}
QLineEdit {
    padding: 12px;
    border: 1px solid #cbd5e1; /* Slate-300 */
    border-radius: 8px;
    background-color: white;
    selection-background-color: #0d9488; /* Teal-600 */
    color: #1e293b;
}
QLineEdit:focus {
    border: 2px solid #0d9488;
}
QPushButton {
    background-color: #0d9488; /* Teal-600 */
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
}
QPushButton:hover {
    background-color: #0f766e; /* Teal-700 */
}
QPushButton:pressed {
    background-color: #115e59; /* Teal-800 */
}
QPushButton:disabled {
    background-color: #94a3b8;
}
QPushButton#secondary {
    background-color: white;
    color: #475569; /* Slate-600 */
    border: 1px solid #cbd5e1;
}
QPushButton#secondary:hover {
    background-color: #f1f5f9; /* Slate-100 */
    color: #0f172a; /* Slate-900 */
    border: 1px solid #94a3b8;
}
QListWidget {
    border: none;
    background-color: transparent;
    outline: none;
}
QListWidget::item {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 4px;
    color: #475569;
}
QListWidget::item:selected {
    background-color: #f0fdfa; /* Teal-50 */
    color: #0d9488; /* Teal-600 */
    border-left: 4px solid #0d9488;
}
QListWidget::item:hover:!selected {
    background-color: #f8fafc;
}
QTableWidget {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    gridline-color: #f1f5f9;
    selection-background-color: #f0fdfa;
    selection-color: #0f172a;
}
QHeaderView::section {
    background-color: #f8fafc;
    padding: 12px;
    border: none;
    border-bottom: 2px solid #e2e8f0;
    font-weight: bold;
    color: #64748b; /* Slate-500 */
    text-transform: uppercase;
    font-size: 12px;
}
QTabWidget::pane {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    top: -1px; 
}
QTabBar::tab {
    background: transparent;
    color: #64748b;
    padding: 12px 24px;
    margin-right: 8px;
    font-weight: 600;
    border-bottom: 3px solid transparent;
}
QTabBar::tab:hover {
    color: #0d9488;
}
QTabBar::tab:selected {
    color: #0d9488;
    border-bottom: 3px solid #0d9488;
}
QLabel#Heading {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a; /* Slate-900 */
}
QLabel#SubHeading {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 20px;
}
QFrame#Card {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
}
QComboBox {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 12px;
    background-color: white;
    color: #334155;
    font-weight: 600;
}
QComboBox:hover {
    border: 1px solid #94a3b8;
}
QComboBox::drop-down {
    subcontrol-origin: padding;
    subcontrol-position: top right;
    width: 20px;
    border-left-width: 1px;
    border-left-color: transparent; 
    border-top-right-radius: 3px; 
    border-bottom-right-radius: 3px;
}
QComboBox QAbstractItemView {
    border: 1px solid #cbd5e1;
    background-color: white;
    selection-background-color: #f1f5f9;
    selection-color: #0f172a;
    outline: none;
}
"""
