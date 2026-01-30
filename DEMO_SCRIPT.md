# 🎥 3-Minute Demo Script: Hybrid Chemical Equipment Visualizer

**Total Time:** ~3:00 minutes  
**Goal:** Demonstrate a fully functional **Hybrid Application** (Web + Desktop) built with Django, React, and PyQt5, specifically for the Intern Screening Task.

---

## ⏱️ 0:00 - 0:30 | Introduction & Hybrid Architecture

**(Action: Show GitHub Repo README Diagram)**

**Speaker:**  
"Hi, I'm [Your Name]. This is my submission for the **Chemical Equipment Parameter Visualizer**.  
I've engineered a robust **Hybrid Application** architecture where a single **Django REST Framework** backend powers two distinct frontends:

1.  A **React.js** Web Application for browser access.
2.  A **PyQt5** Desktop Application for native execution.  
    Both consume the same API to visualize equipment data like Flowrate, Pressure, and Temperature."

---

## ⏱️ 0:30 - 1:15 | Web Application (React + Chart.js)

**(Action: Open Web Browser - Login Page)**

**Speaker:**  
"Starting with the **Web Frontend**. I've implemented secure **JWT Authentication**. Let me log in."

**(Action: Dashboard - Upload 'sample_equipment_data.csv')**  
"The core feature is the **CSV Upload** mechanism. I'll upload the required `sample_equipment_data.csv`.  
The backend uses **Pandas** to parse this file and generate a **Data Summary API** response."

**(Action: Show Charts & History)**  
"Here, **Chart.js** renders the analytics:

- **Equipment Distribution** (Donut Chart).
- **Correlation Analysis** (Scatter Plots).  
  Crucially, the system implements **History Management**, persisted in SQLite, allowing users to revisit their last 5 uploaded datasets instantly."

---

## ⏱️ 1:15 - 1:45 | Desktop Application (PyQt5 + Matplotlib)

**(Action: Switch to Desktop App)**

**Speaker:**  
"Seamlessly switching to the **Desktop Frontend**. This is built with **PyQt5**."

**(Action: Login & View same data)**  
"I'll log in with the same credentials. Notice that the data I just uploaded on the web is immediately available here.  
Instead of browser charting, we use **Matplotlib** for high-performance, native plotting of the same statistical summaries. This demonstrates true cross-platform data synchronization."

---

## ⏱️ 1:45 - 2:15 | Reporting & Admin Control

**(Action: Web App -> Download PDF)**

**Speaker:**  
"For reporting, I've integrated a **PDF Generation** feature.  
This automates the creation of a professional report containing statistical summaries and equipment lists, ready for stakeholders."

**(Action: Django Admin Panel - /admin)**  
"On the backend, the **Django Admin Panel** provides granular control.  
I can manage **Registered Users** and inspect the raw **Equipment Records** stored in the database, ensuring data integrity across the system."

---

## ⏱️ 2:15 - 2:40 | Docker & Deployment

**(Action: Show VS Code - docker-compose.yml)**

**Speaker:**  
"To ensure reproducibility, the entire stack is **Dockerized**.  
My `docker-compose` configuration orchestrates the Django backend, React frontend, and volume persistence."

**(Action: Show Active Deployment)**  
"For production, I've deployed the web version live:

- **Frontend** on Vercel.
- **Backend** on Render.  
  I also use **Uptime Robot** to monitor API health, currently showing 100% uptime."

---

## ⏱️ 2:40 - 3:00 | Conclusion

**(Action: Briefly scroll GitHub Repo Code)**

**Speaker:**  
"The full source code is available on **GitHub**, complete with a detailed `README.md` covering setup, API endpoints, and architecture diagrams.  
Thank you for your time and consideration!"

---
