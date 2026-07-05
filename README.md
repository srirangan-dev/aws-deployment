# 🧭 PathFinder — Your Career & Education Advisor

![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20S3%20%7C%20CloudFront%20%7C%20IAM-orange?logo=amazon-aws)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?logo=github-actions)
![Live](https://img.shields.io/badge/Live-View%20Demo-brightgreen)

> An AI-powered career and education advisor web application, fully deployed on AWS with a production-grade DevOps pipeline.

🌐 **Live Demo:** [https://d16o598lw6btin.cloudfront.net/](https://d16o598lw6btin.cloudfront.net/)

---

## 📌 Project Overview

PathFinder is an AI-powered career and education advisory platform that helps users discover the right career paths and educational routes based on their interests, skills, and goals. It is a full-stack application with a React frontend and Node.js backend, deployed on AWS using Docker, GitHub Actions CI/CD, S3, CloudFront, and EC2.

---

## 🏗️ Architecture Overview

```
User Browser
     │
     ▼
┌──────────────────────────┐
│      AWS CloudFront      │  ← CDN (HTTPS, Global Edge Locations)
│   Distribution: E3TLCI4  │     Cache Invalidated on Every Deploy
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│        AWS S3            │  ← React Frontend (Vite Production Build)
│  pathfinder-frontend-    │     Static files: HTML, CSS, JS
│        2026              │
└──────────────────────────┘

         +  (API calls from frontend → EC2 backend)

┌──────────────────────────┐
│       AWS EC2            │  ← Node.js Backend Server
│   (Ubuntu Instance)      │     Port: 5000
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│     Docker Compose       │  ← Containerized Backend
│   (Node.js + MongoDB)    │     Auto-restarts on deploy
└──────────────────────────┘
```

---

## ☁️ AWS Services Used

| Service | Purpose |
|---|---|
| **EC2** | Hosts the Node.js backend server (Ubuntu instance) |
| **S3** | Stores React frontend Vite production build files |
| **CloudFront** | CDN for fast global delivery of frontend with HTTPS |
| **IAM** | Manages GitHub Actions credentials securely (least privilege) |

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite** — Fast modern frontend framework
- **Deployed to:** AWS S3 → served via CloudFront CDN

### Backend
- **Node.js** — Backend API server (Port 5000)
- **MongoDB** — Database
- **GROQ AI** — AI-powered career advice API
- **JWT** — Authentication
- **Nodemailer** — Email service
- **Deployed to:** AWS EC2 via Docker Compose

### Cloud
- **AWS EC2** — Virtual machine for backend
- **AWS S3** — Static frontend hosting
- **AWS CloudFront** — CDN with HTTPS
- **AWS IAM** — Access management

### DevOps
- **Docker** — Backend containerization
- **Docker Compose** — Container orchestration
- **GitHub Actions** — CI/CD pipeline (2 jobs: frontend + backend)

---

## ⚙️ CI/CD Pipeline — How It Works

Every push to `main` branch triggers **two parallel jobs** in GitHub Actions:

```
Push to main branch
        │
        ├──────────────────────┬──────────────────────────┐
        ▼                      ▼
┌───────────────┐     ┌─────────────────────┐
│ deploy-       │     │  deploy-backend      │
│ frontend      │     │                      │
│               │     │                      │
│ 1. Checkout   │     │ 1. Checkout code     │
│ 2. Setup      │     │ 2. SSH into EC2      │
│    Node 18    │     │ 3. git pull          │
│ 3. npm install│     │ 4. Write .env file   │
│ 4. npm run    │     │ 5. docker compose    │
│    build      │     │    down              │
│    (Vite)     │     │ 6. docker compose    │
│ 5. AWS sync   │     │    up -d --build     │
│    → S3       │     │ 7. docker ps         │
│ 6. CloudFront │     └─────────────────────┘
│    cache      │
│    invalidate │
└───────────────┘
```

---

## 🔐 GitHub Actions Secrets Required

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key for S3 + CloudFront access |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `EC2_HOST` | EC2 instance public IP address |
| `EC2_SSH_KEY` | Private SSH key to connect to EC2 |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `GROQ_KEY` | GROQ AI API key |
| `EMAIL_USER` | Email address for Nodemailer |
| `EMAIL_PASS` | Email password for Nodemailer |
| `CLOUDFRONT_URL` | CloudFront distribution URL |

---

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/srirangan-dev/aws-deployment.git
cd aws-deployment/school

# Install frontend dependencies
npm install

# Run frontend (Vite dev server)
npm run dev

# Run backend
cd server
npm install
node index.js
```

---

## 📁 Project Structure

```
aws-deployment/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD (2 jobs)
├── school/
│   ├── src/                  # React frontend source
│   ├── dist/                 # Vite production build (uploaded to S3)
│   ├── vite.config.js
│   ├── package.json
│   └── server/               # Node.js backend
│       ├── index.js
│       ├── .env              # Environment variables (auto-generated by CI/CD)
│       ├── docker-compose.yml
│       └── Dockerfile
└── README.md
```

---

## 🌍 CloudFront Configuration

- **Origin:** AWS S3 bucket (`pathfinder-frontend-2026`)
- **Distribution ID:** `E3TLCI4XOP06AT`
- **HTTPS:** Enabled via CloudFront SSL
- **Cache Invalidation:** `/*` invalidated automatically on every frontend deploy

---

## 👨‍💻 Author

**Srirangan**
- GitHub: [@srirangan-dev](https://github.com/srirangan-dev)
- LinkedIn: [Add your LinkedIn URL here]

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
