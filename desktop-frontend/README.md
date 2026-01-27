# 🖥️ Desktop Application

![PyQt5](https://img.shields.io/badge/PyQt-5-41CD52?logo=qt&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-3.5-11557c?logo=python&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)

The **Desktop Frontend** is a native Windows application providing powerful local data analysis capabilities. It mirrors the web platform's functionality but leverages native UI performance and system integration using **PyQt5**.

---

## 🎨 Native UI & Animations

- **Modern Design**: Custom "Fusion" theme with a dark/clean stylesheet (`styles.py`).
- **Split-Screen Auth**: A beautiful login window with a dedicated signup form, matching the web design.
- **Animated Charts**: Overview bars animate smoothly upon loading, providing a premium feel.
- **Dashboard Grid**: A responsive grid layout for key metrics (KPIs) and visualizations.

---

## 📂 Project Structure

The monolithic `main.py` has been refactored into a modular architecture for better maintainability.

```bash
desktop-frontend/
├── 📂 ui/                  # UI Components
│   ├── 📜 auth.py          # Login & Signup Window Logic
│   ├── 📜 dashboard.py     # Main Application Interface
│   └── 📜 styles.py        # Centralized CSS/QSS Stylesheet
├── 📜 config.py            # Configuration Constants (API URL)
├── 📜 main.py              # Application Entry Point
└── 📜 README.md            # Documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.10+
- Backend Server running at `http://127.0.0.1:8000/`

### Steps

1.  **Activate API Virtual Environment**
    (The desktop app typically shares the Python environment with the backend for convenience, or create a new one).

    ```bash
    cd ../backend
    venv\Scripts\activate
    ```

2.  **Install Dependencies**

    ```bash
    pip install pyqt5 matplotlib requests
    ```

3.  **Run Application**
    ```bash
    python ../desktop-frontend/main.py
    ```

---

## 🧩 Key Components

### `ui/auth.py`

Handles user onboarding.

- **Login Mode**: Standard Username/Password auth.
- **Signup Mode**: Extended form to create new accounts via the API.
- **Visual Split**: Left-side form, Right-side marketing visuals.

### `ui/dashboard.py`

The core workspace.

- **Tabbed Interface**:
  1.  **Overview**: KPI Grid + Pie Chart.
  2.  **Raw Data**: Full table view of the dataset.
  3.  **Analytics**: Animated Bar Charts.
- **Matplotlib Integration**: Embeds Matplotlib figures directly into PyQt widgets (`FigureCanvasQTAgg`).
- **Timer Animations**: Uses `QTimer` to create smooth frame-by-frame graph animations.

### `config.py`

Central place for settings.

```python
API_URL = "http://127.0.0.1:8000/api/"
```

_Modify this URL to point to your production server if deploying._

---

## 📦 Building for Distribution

To package this application as a standalone `.exe` you can use **PyInstaller**:

```bash
pip install pyinstaller
pyinstaller --noconsole --onefile main.py
```

_(Note: You may need to manually include the `ui/` folder or adjust the spec file)._
