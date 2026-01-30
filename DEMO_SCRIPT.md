# 🎥 3-Minute Demo Script: ChemData Visualizer Screening Test

**Total Time:** ~3:00 minutes  
**Goal:** Showcase full-stack capabilities, cross-platform support, deployment, and architecture.

---

## ⏱️ 0:00 - 0:45 | Web Frontend & Dashboard

**(Action: Open Web Browser to Vercel URL or Localhost)**

**Speaker:**  
"Hi, I'm [Your Name]. This is **ChemData Visualizer**, a comprehensive platform for monitoring chemical equipment data. Let's start with the **Web Application**."

**(Action: Log in with user credentials)**  
"I'll log in to the secure dashboard. This is built with **React 19, Vite, and TailwindCSS** for a responsive, modern UI."

**(Action: Navigate Dashboard, Hover over Graphs)**  
"Here is the main dashboard. We have real-time interactive charts powered by **Chart.js**.

- We can see the **Equipment Distribution** (Donut Chart).
- analyze **Pressure vs. Flow Rate** correlations (Scatter Plot).
- and track **Temperature Trends** over time (Line Chart).  
  The interface is fully responsive and supports dark mode."

---

## ⏱️ 0:45 - 1:15 | Desktop Application (Cross-Platform)

**(Action: Switch to Desktop App Window)**

**Speaker:**  
"Now, for engineers in the field without reliable internet, we have the **Native Desktop Application** built with **Python and PyQt5**."

**(Action: Show Desktop App Dashboard)**  
"It shares the exact same backend API but provides a native experience. You can see the same data points being visualized here using **Matplotlib** for high-performance plotting."

**(Action: Click a few tabs/buttons)**  
"It supports local analytics and offers a robust, offline-capable interface that stays in sync with our central database."

---

## ⏱️ 1:15 - 1:45 | Reporting & Admin Panel

**(Action: Go back to Web App -> Click 'Download Report')**

**Speaker:**  
"Reporting is critical. I'll generate a PDF report for this dataset. This is generated server-side using **ReportLab**."

**(Action: Open the downloaded PDF)**  
"The PDF includes professional branding, statistical summaries, and embedded charts—ready for stakeholders."

**(Action: Switch to Django Admin Panel - /admin)**  
"All this data is managed securely. Here in the **Django Admin Panel**, you can see our 'Datasets' and 'Equipment Records'. This proves our data persistence is working correctly across all platforms."

---

## ⏱️ 1:45 - 2:20 | Docker & Deployment

**(Action: Open Terminal/VS Code showing `docker-compose.yml` and logs)**

**Speaker:**  
"Under the hood, the entire stack is **Containerized**.  
Here is my `docker-compose.yml` handling the **React Frontend**, **Django Backend**, and **Database** services."

**(Action: Show 'docker stats' or running logs)**  
"This ensures the application runs consistently in any environment—dev or prod—eliminating 'it works on my machine' issues."

**(Action: Switch Browser to Deployed Sites)**  
"For production:

- The **Frontend** is deployed on **Vercel** for global edge delivery.
- The **Backend** is hosted on **Render** (or your specific cloud provider)."

---

## ⏱️ 2:20 - 2:40 | Monitoring & Stability

**(Action: Show Uptime Robot Dashboard)**

**Speaker:**  
"To ensure reliability, I use **Uptime Robot** for active monitoring."

**(Action: Point to 'Up' status)**  
"This tracks our API health 24/7, pinging the endpoints to ensure the service is always available for users."

---

## ⏱️ 2:40 - 3:00 | Architecture & Codebase

**(Action: Show GitHub Repository Readme/Diagrams)**

**Speaker:**  
"Finally, here is the public **GitHub Repository**.  
I've documented the complete system architecture."

**(Action: Zoom in on Mermaid Diagrams in README)**  
"We have:

1.  **Dockerized Architecture**: Showing how containers interact via internal networks.
2.  **Standard Architecture**: Detailing the flow from React/Desktop -> Nginx/API -> Database.

Thank you for watching!"

---
