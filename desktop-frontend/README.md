# 🖥️ Desktop Application

![PyQt5](https://img.shields.io/badge/PyQt-5-41CD52?logo=qt&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-3.5-11557c?logo=python&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)

The **Desktop Frontend** is a native Windows application providing powerful local data analysis capabilities. It mirrors the web platform's functionality but leverages native UI performance and system integration using **PyQt5**.

---

## 🎨 Native UI & Visual Parity

- **Unified Design**: Matches the Web Frontend's **Teal (#0d9488) & Slate** theme for a consistent brand experience.
- **Interactive Dashboards**:
  - **Metric Switchers**: Dropdowns to toggle Bar Charts between Flowrate, Pressure, and Temperature.
  - **Correlation Analysis**: Scatter plots with customizable X and Y axes.
- **Advanced Plotting**: Uses `Matplotlib` + `Pandas` for robust data handling and rendering.
- **Responsive Layout**: Utilizing `QStackedWidget` and scrollable areas to handle complex dashboards on any screen size.

---

## 🧠 Application Logic Flow

```mermaid
graph LR
    subgraph "Main Window"
        Sidebar[Sidebar List] -- Clicked --> Loader[load_dataset()]
        Loader -- Switch Page --> Stack{QStackedWidget}

        Stack -->|Page 0| Empty[Empty State]
        Stack -->|Page 1| Dashboard[Analysis View]
    end

    subgraph "Data Processing"
        Loader -- Request --> API[Django API]
        API -- JSON --> Parser[Pandas DataFrame]
        Parser -- Render --> Matplotlib[Figures & Canvas]
        Parser -- Populate --> Table[QTableWidget]
    end

    Dashboard --> Controls{Dropdowns}
    Controls -- Signal --> UpdateChart[update_scatter/bar()]
    UpdateChart -- Redraw --> Matplotlib
```

---

## 📂 Project Structure

The monolithic `main.py` has been refactored into a modular architecture for better maintainability.

```bash
desktop-frontend/
├── 📂 ui/                  # UI Components
│   ├── 📜 auth.py          # Login & Signup Window Logic
│   ├── 📜 dashboard.py     # Main Analysis Dashboard (Tabs, Charts, Tables)
│   └── 📜 styles.py        # Centralized QSS Stylesheet (Teal Theme)
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
    pip install pyqt5 matplotlib requests pandas
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
- **Visual Split**: Left-side form, Right-side marketing visuals (Teal accents).

### `ui/dashboard.py`

The core workspace, refactored for web-parity.

- **Tabbed Interface**:
  1.  **Analysis Dashboard**:
      - **KPI Cards**: Total Records, Avg Flow/Press/Temp.
      - **Charts**:
        - **Bar Chart**: Avg Metric by Equipment (Interactive Dropdown).
        - **Donut Chart**: Equipment Type Distribution.
        - **Trend Chart**: Live Process Trends (Flow & Pressure).
        - **Scatter Chart**: Correlation Explorer (X vs Y Dropdowns).
  2.  **Data Logs**:
      - Detailed table with styled badges and conditional formatting (Red text for High Temp).
- **Navigation**: Uses `QStackedWidget` to switch seamlessly between Empty State and Data View.

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
