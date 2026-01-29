<div align="center">

# 🔙 Backend API Server

### Django REST Framework with Advanced Analytics

[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.14+-a30f2d?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Latest-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![ReportLab](https://img.shields.io/badge/ReportLab-PDF-00A4E4?style=for-the-badge)](https://www.reportlab.com/)

[Overview](#-overview) • [Installation](#-installation) • [API Endpoints](#-api-endpoints) • [Configuration](#-configuration)

</div>

---

## 📋 Overview

The **ChemData Visualizer Backend** is the central intelligence hub of the platform, built with **Django 5.0** and **Django REST Framework**. It provides robust API endpoints for authentication, data processing, statistical analysis, and professional report generation.

### Core Capabilities

- 🔐 **Multi-Auth Support** - Token-based authentication + Google OAuth2
- 📊 **Data Processing** - Pandas-powered CSV parsing and validation
- 📈 **Statistical Analysis** - Advanced aggregation and trend calculations
- 📑 **PDF Generation** - Professional reports with charts and branding
- 🗄️ **Database Management** - SQLite (dev) / PostgreSQL (production)
- 🔒 **Security** - Environment-based configuration and CORS handling

---

## 🏗️ Architecture

### Request Flow

```mermaid
graph LR
    CLIENT[Client Request] -->|HTTP| URLS[URL Routing<br/>urls.py]
    URLS --> VIEWS[API Views<br/>views.py]
    VIEWS --> SERIALIZER[Serializers<br/>serializers.py]
    SERIALIZER <-->|Validate/Transform| MODELS[Data Models<br/>models.py]
    MODELS <-->|ORM Queries| DB[(Database)]

    VIEWS --> PANDAS[Pandas Engine]
    PANDAS -->|Parse CSV| MODELS

    VIEWS --> REPORTLAB[ReportLab<br/>PDF Generator]
    REPORTLAB -->|Generate| MEDIA[Media Storage]

    style CLIENT fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style VIEWS fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style DB fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff
    style REPORTLAB fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
```

### Component Layers

```mermaid
graph TB
    subgraph "Presentation Layer"
        API[REST API Endpoints]
        SERIALIZERS[DRF Serializers]
    end

    subgraph "Business Logic Layer"
        VIEWS[API Views]
        AUTH_SERVICE[Auth Service]
        DATA_PROCESSOR[Data Processor]
        PDF_SERVICE[PDF Service]
    end

    subgraph "Data Access Layer"
        ORM[Django ORM]
        MODELS[Data Models]
    end

    subgraph "External Libraries"
        PANDAS[Pandas]
        REPORTLAB[ReportLab]
        ALLAUTH[Django Allauth]
    end

    API --> SERIALIZERS
    SERIALIZERS --> VIEWS
    VIEWS --> AUTH_SERVICE
    VIEWS --> DATA_PROCESSOR
    VIEWS --> PDF_SERVICE

    AUTH_SERVICE --> ALLAUTH
    DATA_PROCESSOR --> PANDAS
    PDF_SERVICE --> REPORTLAB

    VIEWS --> ORM
    ORM --> MODELS

    style API fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style VIEWS fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
```

---

## 🛠️ Technology Stack

| Technology                | Version | Purpose                         |
| ------------------------- | ------- | ------------------------------- |
| **Django**                | 5.0+    | Web framework                   |
| **Django REST Framework** | 3.14+   | REST API toolkit                |
| **Pandas**                | Latest  | Data manipulation & CSV parsing |
| **ReportLab**             | Latest  | PDF generation                  |
| **Matplotlib**            | Latest  | Chart generation for PDFs       |
| **django-cors-headers**   | Latest  | Cross-Origin Resource Sharing   |
| **django-allauth**        | Latest  | Social authentication           |
| **dj-rest-auth**          | Latest  | REST auth endpoints             |
| **PyJWT**                 | Latest  | JSON Web Tokens                 |
| **python-dotenv**         | Latest  | Environment management          |
| **cryptography**          | Latest  | Security utilities              |
| **requests-oauthlib**     | Latest  | OAuth client                    |

---

## ⚡ Installation & Setup

### Prerequisites

| Requirement | Version        | Download                                        |
| ----------- | -------------- | ----------------------------------------------- |
| Python      | 3.10 or higher | [python.org](https://www.python.org/downloads/) |
| pip         | Latest         | Included with Python                            |
| PostgreSQL  | 14+ (Optional) | [postgresql.org](https://www.postgresql.org/)   |

### Quick Start

```bash
# Navigate to backend directory
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
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**Server will run on:** `http://127.0.0.1:8000`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

| Variable               | Description            | Example                          | Required |
| ---------------------- | ---------------------- | -------------------------------- | -------- |
| `SECRET_KEY`           | Django security key    | `django-insecure-xyz...`         | ✅ Yes   |
| `DEBUG`                | Debug mode             | `True` (dev), `False` (prod)     | ✅ Yes   |
| `ALLOWED_HOSTS`        | Allowed domains        | `localhost,127.0.0.1`            | ✅ Yes   |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID | `xxx.apps.googleusercontent.com` | ❌ No    |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret    | `GOCSPX-xxx`                     | ❌ No    |
| `DATABASE_URL`         | PostgreSQL URL         | `postgresql://user:pass@host/db` | ❌ No    |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs          | `http://localhost:5173`          | ❌ No    |

**Example `.env` file:**

```env
# Django Core
SECRET_KEY=django-insecure-change-me-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret

# Database (Optional - defaults to SQLite)
# DATABASE_URL=postgresql://username:password@localhost:5432/chemdata

# CORS (Optional - defaults to http://localhost:5173)
# CORS_ALLOWED_ORIGINS=http://localhost:5173,https://yourapp.vercel.app
```

> [!CAUTION]
> Never commit your `.env` file to version control. Always use `.env.example` as a template.

### Database Configuration

**SQLite (Default - Development):**

```python
# Automatically configured - no changes needed
# Database file: db.sqlite3
```

**PostgreSQL (Production):**

```env
DATABASE_URL=postgresql://username:password@localhost:5432/chemdata_visualizer
```

Then update `settings.py`:

```python
import dj_database_url
DATABASES = {'default': dj_database_url.config(default='sqlite:///db.sqlite3')}
```

---

## 📡 API Endpoints

### Base URL

```
http://127.0.0.1:8000
```

### 🔐 Authentication Endpoints

| Method | Endpoint                  | Description               | Request Body                    | Response            |
| ------ | ------------------------- | ------------------------- | ------------------------------- | ------------------- |
| `POST` | `/api/auth/registration/` | Register new user         | `username`, `email`, `password` | User object + token |
| `POST` | `/api/api-token-auth/`    | Login and get JWT token   | `username`, `password`          | `{"token": "xxx"}`  |
| `POST` | `/accounts/google/login/` | Google OAuth2 login       | OAuth credentials               | User + token        |
| `POST` | `/api/auth/logout/`       | Logout (invalidate token) | -                               | Success message     |

**Registration Example:**

```bash
curl -X POST http://127.0.0.1:8000/api/auth/registration/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

---

### 📊 Dataset Management Endpoints

| Method   | Endpoint                | Description                        | Auth Required | Query Params              |
| -------- | ----------------------- | ---------------------------------- | ------------- | ------------------------- |
| `GET`    | `/api/datasets/`        | List user's datasets               | ✅ Yes        | -                         |
| `POST`   | `/api/upload/`          | Upload new CSV dataset             | ✅ Yes        | `file`, `name` (optional) |
| `GET`    | `/api/datasets/{id}/`   | Get dataset details                | ✅ Yes        | -                         |
| `DELETE` | `/api/datasets/{id}/`   | Delete dataset                     | ✅ Yes        | -                         |
| `GET`    | `/api/datasets/global/` | List all datasets (global history) | ✅ Yes        | -                         |

**Upload Dataset Example:**

```bash
curl -X POST http://127.0.0.1:8000/api/upload/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -F "file=@sample_equipment_data.csv" \
  -F "name=January_2024_Data"
```

**Upload Response:**

```json
{
  "id": 1,
  "name": "January_2024_Data",
  "file": "/media/uploads/January_2024_Data.csv",
  "uploaded_at": "2024-01-20T10:30:00Z",
  "record_count": 150,
  "user": 1
}
```

---

### 📈 Analysis & Statistics Endpoints

| Method | Endpoint                    | Description               | Auth Required | Response Format        |
| ------ | --------------------------- | ------------------------- | ------------- | ---------------------- |
| `GET`  | `/api/datasets/{id}/stats/` | Get statistical analysis  | ✅ Yes        | JSON with aggregations |
| `GET`  | `/api/datasets/{id}/data/`  | Get raw equipment records | ✅ Yes        | Array of records       |
| `GET`  | `/api/datasets/{id}/pdf/`   | Download PDF report       | ✅ Yes        | Binary PDF file        |

**Statistics Response Example:**

```json
GET /api/datasets/1/stats/

{
  "total_records": 150,
  "average_flowrate": 45.67,
  "average_pressure": 120.43,
  "average_temperature": 75.21,
  "equipment_distribution": {
    "Pump": 50,
    "Valve": 30,
    "Tank": 40,
    "Reactor": 30
  },
  "equipment_stats": [
    {
      "equipment_type": "Pump",
      "count": 50,
      "avg_flowrate": 52.34,
      "avg_pressure": 135.67,
      "avg_temperature": 72.11
    },
    {
      "equipment_type": "Valve",
      "count": 30,
      "avg_flowrate": 38.21,
      "avg_pressure": 98.54,
      "avg_temperature": 68.90
    }
  ]
}
```

---

## 🗄️ Database Models

### Entity Relationship

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
    }

    Dataset {
        int id PK
        int user_id FK
        string name
        string file_path
        datetime uploaded_at
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

### Model Details

#### User Model (Django Auth)

Extended from Django's built-in User model.

| Field         | Type        | Constraints        | Description            |
| ------------- | ----------- | ------------------ | ---------------------- |
| `id`          | Integer     | PK, Auto-increment | Primary key            |
| `username`    | String(150) | Unique, Required   | User login name        |
| `email`       | Email       | Unique, Required   | Email address          |
| `password`    | String(128) | Required           | Hashed password        |
| `is_active`   | Boolean     | Default: True      | Account status         |
| `is_staff`    | Boolean     | Default: False     | Admin access           |
| `date_joined` | DateTime    | Auto               | Registration timestamp |

#### Dataset Model

Represents uploaded CSV files.

| Field         | Type        | Constraints        | Description      |
| ------------- | ----------- | ------------------ | ---------------- |
| `id`          | Integer     | PK, Auto-increment | Primary key      |
| `user`        | ForeignKey  | Required           | Owner (User.id)  |
| `name`        | String(255) | Optional           | Dataset name     |
| `file`        | FileField   | Required           | Path to CSV file |
| `uploaded_at` | DateTime    | Auto               | Upload timestamp |

**Methods:**

- `record_count()` - Returns total equipment records
- `get_statistics()` - Calculates averages and distributions

#### EquipmentRecord Model

Individual equipment measurements from CSV.

| Field            | Type        | Constraints                | Description                    |
| ---------------- | ----------- | -------------------------- | ------------------------------ |
| `id`             | Integer     | PK, Auto-increment         | Primary key                    |
| `dataset`        | ForeignKey  | Required, OnDelete=CASCADE | Parent dataset                 |
| `equipment_name` | String(100) | Required                   | Equipment identifier           |
| `equipment_type` | String(50)  | Required                   | Type (Pump/Valve/Tank/Reactor) |
| `flowrate`       | Float       | Nullable                   | Flow rate (m³/h)               |
| `pressure`       | Float       | Nullable                   | Pressure (bar)                 |
| `temperature`    | Float       | Nullable                   | Temperature (°C)               |
| `timestamp`      | DateTime    | Auto                       | Measurement time               |

---

## 📂 Project Structure

```
backend/
├── api/                          # Main API Application
│   ├── migrations/               # Database migrations
│   ├── __init__.py
│   ├── admin.py                  # Django admin configuration
│   ├── models.py                 # Data models
│   ├── serializers.py            # DRF serializers
│   ├── urls.py                   # API URL routing
│   ├── views.py                  # API views and logic
│   └── tests.py                  # Unit tests
│
├── core/                         # Project Configuration
│   ├── __init__.py
│   ├── asgi.py                   # ASGI config
│   ├── settings.py               # Django settings
│   ├── urls.py                   # Root URL config
│   └── wsgi.py                   # WSGI config
│
├── media/                        # Uploaded files
│   ├── uploads/                  # CSV files
│   └── reports/                  # Generated PDFs
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── db.sqlite3                    # SQLite database
├── manage.py                     # Django CLI
├── requirements.txt              # Python dependencies
│
├── Dockerfile                    # Docker image definition
├── create_user.py                # User creation script
├── reset_pass.py                 # Password reset utility
└── README.md                     # This file
```

---

## 💻 Development

### Django Management Commands

```bash
# Run development server
python manage.py runserver

# Run on specific port
python manage.py runserver 8080

# Create database migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic

# Run tests
python manage.py test api

# Run tests with verbosity
python manage.py test api -v 2
```

### Accessing Django Admin

1. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

2. Navigate to: `http://127.0.0.1:8000/admin`

3. Login with superuser credentials

**Admin Features:**

- Manage users and permissions
- View and edit datasets
- Browse equipment records
- Monitor authentication tokens

---

## 🧪 Testing

### Run All Tests

```bash
python manage.py test api
```

### Run Specific Test Class

```bash
python manage.py test api.tests.DatasetTestCase
```

### Coverage Report

```bash
pip install coverage
coverage run --source='.' manage.py test api
coverage report
```

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY` (50+ characters)
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Use HTTPS in production
- [ ] Set up PostgreSQL instead of SQLite
- [ ] Configure CORS properly (`CORS_ALLOWED_ORIGINS`)
- [ ] Use environment variables for all secrets
- [ ] Enable Django security middleware
- [ ] Set up regular database backups
- [ ] Configure proper logging and monitoring

### Secure SECRET_KEY Generation

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t chemdata-backend .
```

### Run Container

```bash
docker run -p 8000:8000 \
  -e SECRET_KEY=your-secret-key \
  -e DEBUG=False \
  chemdata-backend
```

### Using Docker Compose

```bash
docker-compose up backend
```

---

## 🐛 Troubleshooting

| Issue                   | Solution                                            |
| ----------------------- | --------------------------------------------------- |
| **Port 8000 in use**    | Change port: `python manage.py runserver 8080`      |
| **Database locked**     | Close other SQLite connections                      |
| **Migration conflicts** | Reset migrations: `python manage.py migrate --fake` |
| **CORS errors**         | Update `CORS_ALLOWED_ORIGINS` in settings           |
| **Upload fails**        | Check `MEDIA_ROOT` permissions                      |
| **Import errors**       | Ensure virtual environment is activated             |

### Enable Debug Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {'level': 'DEBUG', 'handlers': ['console']},
}
```

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [ReportLab User Guide](https://www.reportlab.com/docs/reportlab-userguide.pdf)
- [Root README](../README.md) - Project overview

---

## 👨‍💻 Author

**Mausam Kar**

- Portfolio: [mausam04.vercel.app](https://mausam04.vercel.app)

---

<div align="center">

**[⬆ Back to Top](#-backend-api-server)**

Built with Django 5.0 and Django REST Framework

</div>
