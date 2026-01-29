<div align="center">

# 🧪 ChemData Visualizer 📊

### **Professional Chemical Equipment Data Monitoring & Analysis Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github)](https://github.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PyQt5](https://img.shields.io/badge/PyQt-5-41CD52?style=for-the-badge&logo=qt&logoColor=white)](https://riverbankcomputing.com/software/pyqt/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Real-time monitoring and analysis of chemical equipment data across web and desktop platforms**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-endpoints)

</div>

---

## 📋 Overview

**ChemData Visualizer** is a comprehensive, enterprise-grade full-stack application designed for real-time monitoring, analysis, and visualization of chemical equipment data. The platform provides:

- 🌐 **Modern Web Dashboard** - React-based responsive web application with real-time analytics
- 🖥️ **Native Desktop Application** - PyQt5-powered desktop app for local analysis and monitoring
- 🔌 **RESTful API Backend** - Django REST Framework with robust data processing
- 📊 **Advanced Analytics** - Statistical analysis, trend visualization, and correlation studies
- 📑 **Professional Reporting** - Automated PDF report generation with charts and branding
- 🔐 **Secure Authentication** - JWT tokens and Google OAuth2 integration
- 🐳 **Docker Support** - Containerized deployment for production environments

The platform enables chemical engineers and operators to monitor equipment performance, analyze trends, detect anomalies, and generate comprehensive reports with just a few clicks.

---

## 📸 Application Preview

<div align="center">

### 🌐 Web Application Screenshots

|                                      |                                      |
| ------------------------------------ | ------------------------------------ |
| ![1](Preview-Images/Web-app/1.png)   | ![2](Preview-Images/Web-app/2.png)   |
| ![3](Preview-Images/Web-app/3.png)   | ![4](Preview-Images/Web-app/4.png)   |
| ![5](Preview-Images/Web-app/5.png)   | ![6](Preview-Images/Web-app/6.png)   |
| ![7](Preview-Images/Web-app/7.png)   | ![8](Preview-Images/Web-app/8.png)   |
| ![9](Preview-Images/Web-app/9.png)   | ![10](Preview-Images/Web-app/10.png) |
| ![11](Preview-Images/Web-app/11.png) | ![12](Preview-Images/Web-app/12.png) |

---

### 🖥️ Desktop Application

|                                        |                                        |
| -------------------------------------- | -------------------------------------- |
| ![1](Preview-Images/Dekstop-app/1.png) | ![2](Preview-Images/Dekstop-app/2.png) |

---

### 📄 PDF Report Generation

|                                |                                |
| ------------------------------ | ------------------------------ |
| ![1](Preview-Images/PDF/1.png) | ![2](Preview-Images/PDF/2.png) |

</div>

---

## 🏗️ System Architecture

### 🎯 High-Level Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[🌐 Web Application<br/>React + Vite + TailwindCSS]
        DESKTOP[🖥️ Desktop Application<br/>PyQt5 + Matplotlib]
    end

    subgraph "API Gateway"
        NGINX[⚡ Nginx / Load Balancer]
    end

    subgraph "Application Layer"
        DJANGO[🔧 Django 5.0<br/>REST Framework]
        AUTH[🔐 Authentication Service<br/>JWT + OAuth2]
        ANALYTICS[📊 Analytics Engine<br/>Pandas + NumPy]
        PDF[📄 PDF Generator<br/>ReportLab]
    end

    subgraph "Data Layer"
        DB[(💾 Database<br/>SQLite/PostgreSQL)]
        MEDIA[📁 Media Storage<br/>CSV Files + PDFs]
        CACHE[⚡ Cache Layer<br/>Optional Redis]
    end

    WEB -->|HTTPS/JSON| NGINX
    DESKTOP -->|HTTPS/JSON| NGINX
    NGINX -->|Proxy| DJANGO

    DJANGO --> AUTH
    DJANGO --> ANALYTICS
    DJANGO --> PDF

    DJANGO -->|ORM Queries| DB
    DJANGO -->|File I/O| MEDIA
    ANALYTICS -->|Read/Write| DB
    PDF -->|Generate| MEDIA

    style WEB fill:#2196F3,stroke:#1565C0,stroke-width:3px,color:#fff
    style DESKTOP fill:#4CAF50,stroke:#2E7D32,stroke-width:3px,color:#fff
    style DJANGO fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#fff
    style AUTH fill:#9C27B0,stroke:#6A1B9A,stroke-width:3px,color:#fff
    style DB fill:#607D8B,stroke:#37474F,stroke-width:3px,color:#fff
    style ANALYTICS fill:#F44336,stroke:#C62828,stroke-width:3px,color:#fff
```

### 🔄 Data Processing Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Client as Web/Desktop Client
    participant API as Django REST API
    participant Parser as Pandas Parser
    participant DB as Database
    participant PDF as ReportLab Engine

    User->>Client: Upload CSV File
    Client->>API: POST /api/upload/
    API->>MEDIA: Save CSV to Media Storage
    API->>Parser: Parse CSV with Pandas
    Parser->>Parser: Validate & Transform Data
    Parser->>DB: Bulk Create EquipmentRecords
    DB-->>API: Insert Success
    API-->>Client: 201 Created (Dataset ID)
    Client-->>User: Upload Confirmation

    User->>Client: Request Analytics
    Client->>API: GET /api/datasets/{id}/stats/
    API->>DB: Aggregate Queries<br/>(AVG, COUNT, GROUP BY)
    DB-->>API: Statistical Results
    API-->>Client: JSON Response
    Client->>Client: Render Charts & KPIs
    Client-->>User: Display Dashboard

    User->>Client: Request PDF Report
    Client->>API: GET /api/datasets/{id}/pdf/
    API->>DB: Fetch Dataset Records
    DB-->>API: Raw Data
    API->>PDF: Generate Report<br/>(Charts, Tables, Branding)
    PDF->>MEDIA: Save PDF File
    PDF-->>API: File Path
    API-->>Client: Download PDF
    Client-->>User: Save Report
```

### 🐳 Docker Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Network: chemdata-network"
        subgraph "Frontend Container"
            REACT[React App<br/>Port 5173]
        end

        subgraph "Backend Container"
            GUNICORN[Gunicorn WSGI<br/>Port 8000]
            DJANGO_APP[Django Application]
        end

        subgraph "Data Volumes"
            DB_VOL[Database Volume<br/>db.sqlite3]
            MEDIA_VOL[Media Volume<br/>uploads/]
        end
    end

    EXTERNAL[External Access] -->|Port 5173| REACT
    EXTERNAL -->|Port 8000| GUNICORN

    REACT -->|API Calls| GUNICORN
    GUNICORN --> DJANGO_APP
    DJANGO_APP --> DB_VOL
    DJANGO_APP --> MEDIA_VOL

    style REACT fill:#61DAFB,stroke:#1565C0,stroke-width:2px,color:#000
    style GUNICORN fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style DB_VOL fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff
```

---

## ✨ Key Features

### 🔐 Authentication & Security

| Feature                      | Web App | Desktop App |
| ---------------------------- | ------- | ----------- |
| **JWT Token Authentication** | ✅      | ✅          |
| **Google OAuth2**            | ✅      | ❌          |
| **Session Management**       | ✅      | ✅          |
| **Secure Password Hashing**  | ✅      | ✅          |

### 📊 Data Visualization

#### Web Application Features

- **Interactive Charts** - Chart.js powered visualizations
  - 📊 Bar Charts - Average metrics by equipment type
  - 📈 Line Charts - Trend analysis over time
  - 🍩 Donut Charts - Equipment distribution
  - 📉 Scatter Plots - Correlation analysis
- **Real-time KPI Cards** - Total records, averages, equipment counts
- **Responsive Grid Layout** - Mobile-friendly design
- **Skeleton Loading States** - Smooth UX during data fetch
- **Dark/Light Theme** - User preference support

#### Desktop Application Features

- **Native Matplotlib Charts** - High-quality static and interactive plots
- **Metric Switchers** - Dynamic dropdown selectors for different parameters
- **Correlation Explorer** - Customizable X/Y axis scatter plots
- **Export Capabilities** - Save charts as PNG/SVG
- **Tabbed Interface** - Analytics Dashboard + Data Logs
- **Branded Theme** - Consistent teal (#0d9488) and slate colors

### 📂 Dataset Management

| Feature              | Description                               |
| -------------------- | ----------------------------------------- |
| **CSV Upload**       | Drag-and-drop file upload with validation |
| **Auto-Parsing**     | Pandas-powered CSV parsing and validation |
| **User Isolation**   | Personal vs. Global dataset history       |
| **Bulk Operations**  | Efficient batch data insertion            |
| **File Storage**     | Secure media file management              |
| **History Tracking** | Upload timestamps and metadata            |

### 📑 Professional Reporting

- **PDF Generation** - Professional reports with ReportLab
- **Custom Branding** - Company logo and styling
- **Data Tables** - Formatted equipment records
- **Statistical Charts** - Embedded visualizations
- **Header Analysis** - CSV structure documentation
- **One-Click Export** - Instant report download

### 🎨 User Experience

- **Unified Design System** - Consistent teal and slate theme across platforms
- **Responsive Layouts** - Works on desktop, tablet, and mobile
- **Loading Indicators** - Smooth transitions and feedback
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful guidance when no data present
- **Interactive Filters** - Dynamic data exploration

---

## 🛠️ Technology Stack

### Backend Technologies

| Technology                | Version | Purpose                         |
| ------------------------- | ------- | ------------------------------- |
| **Python**                | 3.10+   | Programming language            |
| **Django**                | 5.0     | Web framework                   |
| **Django REST Framework** | 3.14+   | RESTful API toolkit             |
| **Pandas**                | Latest  | Data manipulation and analysis  |
| **ReportLab**             | Latest  | PDF generation                  |
| **Matplotlib**            | 3.5+    | Chart generation (backend)      |
| **django-cors-headers**   | Latest  | CORS support                    |
| **django-allauth**        | Latest  | Social authentication           |
| **dj-rest-auth**          | Latest  | REST authentication             |
| **PyJWT**                 | Latest  | JSON Web Tokens                 |
| **python-dotenv**         | Latest  | Environment variable management |
| **Gunicorn**              | Latest  | WSGI HTTP Server (production)   |

### Frontend Technologies

#### Web Application

| Technology              | Version | Purpose                     |
| ----------------------- | ------- | --------------------------- |
| **React**               | 19.2.0  | UI library                  |
| **Vite**                | 7.2.4   | Build tool and dev server   |
| **TailwindCSS**         | 3.4.17  | Utility-first CSS framework |
| **Chart.js**            | 4.5.1   | Data visualization          |
| **react-chartjs-2**     | 5.3.1   | React wrapper for Chart.js  |
| **Axios**               | 1.13.3  | HTTP client                 |
| **@react-oauth/google** | 0.13.4  | Google OAuth integration    |

#### Desktop Application

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| **PyQt5**      | 5.x     | Desktop GUI framework |
| **Matplotlib** | 3.5+    | Plotting library      |
| **Requests**   | Latest  | HTTP client           |
| **Pandas**     | Latest  | Data processing       |

### DevOps & Tools

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| **Docker**         | Containerization              |
| **docker-compose** | Multi-container orchestration |
| **Git**            | Version control               |
| **ESLint**         | JavaScript linting            |

---

## 📁 Project Structure

```
ChemData-Visualizer/
├── 📂 backend/                          # Django REST API Server
│   ├── 📂 api/                          # API Application
│   │   ├── 📂 migrations/               # Database migrations
│   │   ├── 📜 __init__.py
│   │   ├── 📜 admin.py                  # Django admin config
│   │   ├── 📜 models.py                 # Data models (Dataset, EquipmentRecord)
│   │   ├── 📜 serializers.py            # DRF serializers
│   │   ├── 📜 urls.py                   # API URL routing
│   │   └── 📜 views.py                  # API views and business logic
│   ├── 📂 core/                         # Project Settings
│   │   ├── 📜 __init__.py
│   │   ├── 📜 asgi.py                   # ASGI config
│   │   ├── 📜 settings.py               # Django settings
│   │   ├── 📜 urls.py                   # Root URL config
│   │   └── 📜 wsgi.py                   # WSGI config
│   ├── 📂 media/                        # User uploads (CSV, PDF)
│   ├── 📂 venv/                         # Virtual environment
│   ├── 📜 .env                          # Environment variables
│   ├── 📜 .env.example                  # Environment template
│   ├── 📜 db.sqlite3                    # SQLite database
│   ├── 📜 Dockerfile                    # Docker image definition
│   ├── 📜 manage.py                     # Django CLI
│   ├── 📜 requirements.txt              # Python dependencies
│   ├── 📜 create_user.py                # Admin user creation script
│   ├── 📜 reset_pass.py                 # Password reset utility
│   └── 📜 README.md                     # Backend documentation
│
├── 📂 web-frontend/                     # React Web Application
│   ├── 📂 src/                          # Source code
│   │   ├── 📂 assets/                   # Images, icons
│   │   ├── 📂 components/               # React components
│   │   ├── 📂 pages/                    # Page components
│   │   ├── 📂 services/                 # API service layer
│   │   ├── 📂 utils/                    # Utility functions
│   │   ├── 📜 App.jsx                   # Root component
│   │   ├── 📜 main.jsx                  # Entry point
│   │   └── 📜 index.css                 # Global styles
│   ├── 📂 public/                       # Static assets
│   ├── 📜 .dockerignore                 # Docker ignore rules
│   ├── 📜 Dockerfile                    # Docker image definition
│   ├── 📜 package.json                  # npm dependencies
│   ├── 📜 vite.config.js                # Vite configuration
│   ├── 📜 tailwind.config.js            # Tailwind configuration
│   ├── 📜 postcss.config.js             # PostCSS configuration
│   └── 📜 eslint.config.mjs             # ESLint rules
│
├── 📂 desktop-frontend/                 # PyQt5 Desktop Application
│   ├── 📂 ui/                           # UI modules
│   │   ├── 📜 __init__.py
│   │   ├── 📜 auth.py                   # Login/Signup windows
│   │   ├── 📜 dashboard.py              # Main dashboard UI
│   │   └── 📜 styles.py                 # QSS stylesheets
│   ├── 📂 assets/                       # Desktop assets
│   ├── 📜 config.py                     # Configuration
│   ├── 📜 main.py                       # Application entry point
│   ├── 📜 requirements.txt              # Python dependencies
│   └── 📜 README.md                     # Desktop app documentation
│
├── 📂 docs/                             # Additional documentation
├── 📜 docker-compose.yml                # Docker Compose config
├── 📜 .gitignore                        # Git ignore rules
├── 📜 .env                              # Root environment variables
├── 📜 .env.example                      # Environment template
├── 📜 sample_equipment_data.csv         # Sample dataset
├── 📜 large_equipment_data.csv          # Large test dataset
├── 📜 DEPLOYMENT_GUIDE.md               # Deployment instructions
└── 📜 README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

| Tool               | Version           | Download                                        |
| ------------------ | ----------------- | ----------------------------------------------- |
| **Python**         | 3.10 or higher    | [python.org](https://www.python.org/downloads/) |
| **Node.js**        | 18.x or higher    | [nodejs.org](https://nodejs.org/)               |
| **npm**            | 9.x or higher     | Included with Node.js                           |
| **Git**            | Latest            | [git-scm.com](https://git-scm.com/)             |
| **Docker Desktop** | Latest (Optional) | [docker.com](https://www.docker.com/)           |

---

### Option 1: 🐳 Quick Start with Docker (Recommended)

The fastest way to get the entire stack running.

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd ChemData-Visualizer
   ```

2. **Start All Services**

   ```bash
   docker-compose up --build
   ```

3. **Access the Applications**
   - **Web App**: [http://localhost:5173](http://localhost:5173)
   - **API**: [http://localhost:8000](http://localhost:8000)
   - **API Admin**: [http://localhost:8000/admin](http://localhost:8000/admin)

4. **Create Superuser** (Optional - for Django Admin)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

> [!TIP]
> To stop all services: `docker-compose down`
>
> To rebuild after changes: `docker-compose up --build`

---

### Option 2: 🔧 Manual Development Setup

For individual component development and debugging.

#### Terminal 1: Backend Server

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**Backend will run on:** `http://127.0.0.1:8000`

---

#### Terminal 2: Web Frontend

```bash
# Navigate to web frontend
cd web-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Web app will run on:** `http://localhost:5173`

---

#### Terminal 3: Desktop Application

```bash
# Navigate to desktop frontend
cd desktop-frontend

# Install dependencies
pip install -r requirements.txt

# Run application
python main.py
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend/` directory:

| Variable               | Description                      | Example                                     | Required |
| ---------------------- | -------------------------------- | ------------------------------------------- | -------- |
| `SECRET_KEY`           | Django secret key                | `your-secret-key-here`                      | ✅       |
| `DEBUG`                | Debug mode                       | `True` (dev), `False` (prod)                | ✅       |
| `ALLOWED_HOSTS`        | Allowed host domains             | `localhost,127.0.0.1`                       | ✅       |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID           | `your-client-id.apps.googleusercontent.com` | ❌       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret              | `your-client-secret`                        | ❌       |
| `DATABASE_URL`         | PostgreSQL connection (optional) | `postgresql://user:pass@localhost/dbname`   | ❌       |

**Example `.env` file:**

```env
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> [!CAUTION]
> Never commit your `.env` file to version control. Always use `.env.example` as a template.

#### Desktop Application (config.py)

Modify `desktop-frontend/config.py` to point to your API:

```python
API_URL = "http://127.0.0.1:8000/api/"
```

For production, update to your deployed API URL:

```python
API_URL = "https://api.yourcompany.com/api/"
```

---

## 📡 API Endpoints

### Base URL

```
http://127.0.0.1:8000/api/
```

### Authentication Endpoints

| Method | Endpoint                  | Description                  | Authentication |
| ------ | ------------------------- | ---------------------------- | -------------- |
| `POST` | `/api/auth/registration/` | Register new user account    | Public         |
| `POST` | `/api/api-token-auth/`    | Login and get JWT token      | Public         |
| `POST` | `/accounts/google/login/` | Google OAuth2 authentication | Public         |
| `POST` | `/api/auth/logout/`       | Logout and invalidate token  | Required       |

**Registration Example:**

```json
POST /api/auth/registration/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Login Example:**

```json
POST /api/api-token-auth/
{
  "username": "john_doe",
  "password": "securepassword123"
}

Response:
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

---

### Dataset Management Endpoints

| Method   | Endpoint                | Description               | Authentication |
| -------- | ----------------------- | ------------------------- | -------------- |
| `GET`    | `/api/datasets/`        | List user's datasets      | Required       |
| `POST`   | `/api/upload/`          | Upload new CSV dataset    | Required       |
| `GET`    | `/api/datasets/{id}/`   | Get dataset details       | Required       |
| `DELETE` | `/api/datasets/{id}/`   | Delete dataset            | Required       |
| `GET`    | `/api/datasets/global/` | List all datasets (admin) | Required       |

**Upload Dataset Example:**

```bash
curl -X POST http://127.0.0.1:8000/api/upload/ \
  -H "Authorization: Token your-auth-token" \
  -F "file=@sample_equipment_data.csv" \
  -F "name=Equipment_Test_Jan2024"
```

**Response:**

```json
{
  "id": 1,
  "name": "Equipment_Test_Jan2024",
  "file": "/media/uploads/Equipment_Test_Jan2024.csv",
  "uploaded_at": "2024-01-20T10:30:00Z",
  "record_count": 150
}
```

---

### Analytics & Statistics Endpoints

| Method | Endpoint                    | Description               | Authentication |
| ------ | --------------------------- | ------------------------- | -------------- |
| `GET`  | `/api/datasets/{id}/stats/` | Get statistical analysis  | Required       |
| `GET`  | `/api/datasets/{id}/data/`  | Get raw equipment records | Required       |
| `GET`  | `/api/datasets/{id}/pdf/`   | Download PDF report       | Required       |

**Statistics Example:**

```json
GET /api/datasets/1/stats/

Response:
{
  "total_records": 150,
  "average_flowrate": 45.6,
  "average_pressure": 120.4,
  "average_temperature": 75.2,
  "equipment_distribution": {
    "Pump": 50,
    "Valve": 30,
    "Tank": 40,
    "Reactor": 30
  },
  "equipment_stats": [
    {
      "equipment_type": "Pump",
      "avg_flowrate": 52.3,
      "avg_pressure": 135.7,
      "avg_temperature": 72.1
    }
  ]
}
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Dataset : owns
    Dataset ||--o{ EquipmentRecord : contains

    User {
        int id PK
        string username UK
        string email UK
        string password_hash
        datetime date_joined
        boolean is_active
        boolean is_staff
    }

    Dataset {
        int id PK
        int user_id FK
        string name
        string file_path
        datetime uploaded_at
        int record_count
    }

    EquipmentRecord {
        int id PK
        int dataset_id FK
        string equipment_name
        string equipment_type
        float flowrate
        float pressure
        float temperature
        datetime timestamp
    }
```

### Model Descriptions

#### User Model

Extended Django authentication model.

| Field         | Type        | Description            |
| ------------- | ----------- | ---------------------- |
| `id`          | Integer     | Primary key            |
| `username`    | String(150) | Unique username        |
| `email`       | Email       | User email address     |
| `password`    | String      | Hashed password        |
| `is_active`   | Boolean     | Account status         |
| `date_joined` | DateTime    | Registration timestamp |

#### Dataset Model

Represents uploaded CSV files.

| Field         | Type        | Description        |
| ------------- | ----------- | ------------------ |
| `id`          | Integer     | Primary key        |
| `user`        | ForeignKey  | Owner (User model) |
| `name`        | String(255) | Dataset name       |
| `file`        | FileField   | Path to CSV file   |
| `uploaded_at` | DateTime    | Upload timestamp   |

#### EquipmentRecord Model

Individual equipment measurements.

| Field            | Type        | Description                    |
| ---------------- | ----------- | ------------------------------ |
| `id`             | Integer     | Primary key                    |
| `dataset`        | ForeignKey  | Parent dataset                 |
| `equipment_name` | String(100) | Equipment identifier           |
| `equipment_type` | String(50)  | Type (Pump/Valve/Tank/Reactor) |
| `flowrate`       | Float       | Flow rate measurement          |
| `pressure`       | Float       | Pressure measurement           |
| `temperature`    | Float       | Temperature measurement        |
| `timestamp`      | DateTime    | Measurement time               |

---

## 🎨 UI/UX Design

### Color Palette

| Color             | Hex       | Usage                              |
| ----------------- | --------- | ---------------------------------- |
| **Primary Teal**  | `#0d9488` | Buttons, accents, highlights       |
| **Slate 900**     | `#0f172a` | Headers, dark backgrounds          |
| **Slate 800**     | `#1e293b` | Secondary backgrounds              |
| **Slate 700**     | `#334155` | Borders, dividers                  |
| **White**         | `#ffffff` | Text on dark, card backgrounds     |
| **Success Green** | `#10b981` | Success messages, positive metrics |
| **Warning Amber** | `#f59e0b` | Warnings, alerts                   |
| **Error Red**     | `#ef4444` | Errors, critical alerts            |

### Design System

- **Typography**: System fonts (San Francisco, Segoe UI, Roboto)
- **Spacing**: 4px grid system (4, 8, 12, 16, 24, 32, 48, 64px)
- **Border Radius**: Consistent 8px for cards, 4px for buttons
- **Shadows**: Subtle elevation for depth (box-shadow)
- **Transitions**: 150-300ms ease-in-out for smooth interactions

---

## 📊 Sample Data

The project includes sample CSV files for testing:

### sample_equipment_data.csv

Small dataset with basic equipment records.

### large_equipment_data.csv

Larger dataset (1000+ records) for performance testing.

### CSV Format

```csv
Equipment Name,Equipment Type,Flowrate (m³/h),Pressure (bar),Temperature (°C)
Pump_001,Pump,45.6,120.4,75.2
Valve_002,Valve,0.0,85.3,68.9
Tank_003,Tank,0.0,10.2,25.4
```

---

## 🔧 Development

### Backend Development

```bash
cd backend

# Run tests
python manage.py test api

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic
```

### Frontend Development

```bash
cd web-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Desktop Development

```bash
cd desktop-frontend

# Install dependencies
pip install -r requirements.txt

# Run application
python main.py

# Build executable (PyInstaller)
pip install pyinstaller
pyinstaller --noconsole --onefile main.py
```

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (caution: deletes data)
docker-compose down -v
```

### Production Configuration

Update `docker-compose.yml` for production:

```yaml
services:
  backend:
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - ALLOWED_HOSTS=yourdomain.com
```

---

## 📝 API Documentation

For detailed API documentation, see:

- [Backend README](./backend/README.md) - Complete API reference
- [Postman Collection](./docs/ChemData_API.postman_collection.json) - Import into Postman

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test api -v 2
```

### Frontend Tests (if configured)

```bash
cd web-frontend
npm test
```

---

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions including:

- Production server setup
- PostgreSQL database configuration
- Nginx reverse proxy
- SSL/TLS certificates
- Environment variable management
- Continuous deployment

---

## 🐛 Troubleshooting

### Common Issues

| Issue                         | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| **Port 8000 already in use**  | Change backend port or kill existing process              |
| **CORS errors**               | Verify `CORS_ALLOWED_ORIGINS` in backend settings         |
| **Docker build fails**        | Clear Docker cache: `docker system prune`                 |
| **Upload fails**              | Check `MEDIA_ROOT` permissions in backend                 |
| **Desktop app won't connect** | Verify `API_URL` in `config.py` points to running backend |
| **Database locked**           | Close other connections to SQLite                         |

### Debug Mode

Enable verbose logging:

**Backend:**

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {'handlers': ['console'], 'level': 'DEBUG'},
}
```

**Frontend:**

```javascript
// Enable React DevTools
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Python**: Follow PEP 8, use Black formatter
- **JavaScript**: Follow Airbnb style guide, use ESLint
- **Commits**: Use conventional commits format

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mausam Kar**

- Portfolio: [mausam04.vercel.app](https://mausam04.vercel.app)
- GitHub: [@Mausam5055](https://github.com/Mausam5055)

Built with ❤️ using Django, React, and PyQt5

---

## 🙏 Acknowledgments

- Django and DRF communities
- React and Vite teams
- PyQt5 and Riverbank Computing
- Chart.js contributors
- All open-source library maintainers

---

<div align="center">

**[⬆ Back to Top](#-chemdata-visualizer-)**

_Made with passion for chemical engineering and data science_

</div>
