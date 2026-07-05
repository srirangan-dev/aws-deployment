# 🧭 PathFinder — Your Career & Education Advisor

![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20S3%20%7C%20CloudFront%20%7C%20IAM-orange?logo=amazon-aws)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-green?logo=nginx)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?logo=github-actions)
![SSL](https://img.shields.io/badge/SSL-Let's%20Encrypt-yellow?logo=letsencrypt)
![Live](https://img.shields.io/badge/Live-View%20Demo-brightgreen)

> A smart career and education advisor web application, fully deployed on AWS with a production-grade DevOps pipeline.

🌐 **Live Demo:** [https://d16o598lw6btin.cloudfront.net/](https://d16o598lw6btin.cloudfront.net/)

---

## 📌 Project Overview

PathFinder is an AI-powered career and education advisory platform that helps users discover the right career paths and educational routes based on their interests, skills, and goals. The application is deployed on a fully automated, cloud-native infrastructure using AWS services and modern DevOps practices.

---

## 🏗️ Architecture Overview

```
User Browser
     │
     ▼
┌─────────────────────┐
│   AWS CloudFront    │  ← CDN (Global Edge Locations, HTTPS)
│   (CDN + SSL/TLS)   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│      AWS S3         │  ← Static Assets (HTML, CSS, JS)
│  (Static Hosting)   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     AWS EC2         │  ← Application Server
│  (Ubuntu Instance)  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Docker Container   │  ← Containerized Application
│  + Docker Compose   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│       Nginx         │  ← Reverse Proxy + SSL Termination
│  + Let's Encrypt    │
└─────────────────────┘
```

---

## ☁️ AWS Services Used

| Service | Purpose |
|---|---|
| **EC2** | Hosts the application server (Ubuntu instance) |
| **S3** | Stores static assets and frontend build files |
| **CloudFront** | CDN for fast global content delivery with HTTPS |
| **IAM** | Manages roles and permissions securely (least privilege) |

---

## 🛠️ Tech Stack

### Cloud
- **AWS EC2** — Virtual machine to run the application
- **AWS S3** — Static file storage and hosting
- **AWS CloudFront** — Content Delivery Network (CDN)
- **AWS IAM** — Identity and Access Management (roles, policies)

### DevOps
- **Docker** — Application containerization
- **Docker Compose** — Multi-container orchestration
- **Nginx** — Reverse proxy and web server
- **SSL/HTTPS** — Secured with Let's Encrypt (Certbot)

### CI/CD
- **GitHub Actions** — Automated build and deployment pipeline

---

## ⚙️ How It Works — Full Flow

```
1. Developer pushes code to GitHub (main branch)
         │
         ▼
2. GitHub Actions CI/CD pipeline triggers automatically
         │
         ▼
3. GitHub Actions authenticates to AWS using IAM OIDC
         │
         ▼
4. Docker image is built and pushed
         │
         ▼
5. Application is deployed to AWS EC2 instance
         │
         ▼
6. Docker Compose starts the container
         │
         ▼
7. Nginx serves the app with SSL (HTTPS via Let's Encrypt)
         │
         ▼
8. CloudFront CDN caches and delivers content globally
         │
         ▼
9. User accesses the live site via CloudFront URL (HTTPS)
```

---

## 🚀 Deployment Setup

### Prerequisites
- AWS Account with EC2, S3, CloudFront, IAM configured
- Docker and Docker Compose installed on EC2
- Nginx installed and configured
- GitHub Actions secrets configured

### GitHub Actions Secrets Required

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `EC2_HOST` | EC2 instance public IP |
| `EC2_USERNAME` | EC2 SSH username (e.g., ubuntu) |
| `EC2_SSH_KEY` | Private SSH key for EC2 access |

### Run Locally with Docker

```bash
# Clone the repository
git clone https://github.com/srirangan-dev/aws-deployment.git
cd aws-deployment

# Build and run with Docker Compose
docker-compose up --build

# Access the app
open http://localhost:3000
```

---

## 📁 Project Structure

```
aws-deployment/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD pipeline
├── app/
│   ├── index.html            # Main application file
│   ├── style.css             # Styles
│   └── script.js             # JavaScript logic
├── nginx/
│   └── nginx.conf            # Nginx reverse proxy config
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image definition
└── README.md
```

---

## 🔐 IAM Security Setup

- Created a **dedicated IAM role** for EC2 with least-privilege permissions
- GitHub Actions uses **OIDC authentication** (no long-lived AWS credentials stored)
- S3 bucket has **private ACL** with CloudFront OAI access only
- Security groups configured to allow only **HTTP (80), HTTPS (443), SSH (22)**

---

## 🌍 CloudFront Configuration

- **Origin:** AWS S3 bucket (static assets)
- **SSL Certificate:** AWS Certificate Manager (ACM)
- **Cache Invalidation:** Triggered automatically on every deployment
- **Edge Locations:** Content served globally with low latency

---

## 👨‍💻 Author

**Srirangan**
- GitHub: [@srirangan-dev](https://github.com/srirangan-dev)
- LinkedIn: [Add your LinkedIn URL here]

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
