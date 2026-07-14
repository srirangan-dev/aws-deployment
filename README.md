🧭 PathFinder — Your Career & Education Advisor
AWS React Node.js Docker CI/CD Live

An AI-powered career and education advisor web application, fully deployed on AWS with a production-grade DevOps pipeline.

🌐 Live Demo: https://d16o598lw6btin.cloudfront.net/

📌 Project Overview
PathFinder helps students figure out which stream, degree, or career path to pursue after Class 10/12 — offering free, personalized guidance in the student's own language, no registration required. It is a full-stack application with a React (Vite) frontend and Node.js backend, deployed on AWS using Docker, GitHub Actions CI/CD, S3, CloudFront, and EC2.

✨ Features

- 🧠 **Free Career Quiz** — a no-signup quiz that recommends career paths based on the student's interests and answers
- 🗺️ **Career Map** — visual exploration of career paths and where they lead (e.g. B.Sc → IIT/NIT, B.A. → UPSC, B.Com → CA)
- 🏫 **Colleges** — browse and discover relevant colleges by stream
- 📅 **Timeline** — likely tracks key academic/application deadlines and milestones
- 📚 **Learn** — educational content/resources section
- 🌍 **10+ Regional Languages** — accessible to students across different linguistic backgrounds
- 📴 **Works Offline** — usable without a constant internet connection
- 🔓 **No Registration Needed** — students can take the quiz and explore without signing up first
- 🔐 **Login / Sign Up** — optional account creation for saving progress/personalization
- 🤖 **AI chatbot** (floating widget, bottom-right) — powered by Groq AI for career guidance and doubt-solving
- 🎨 Dark-themed, modern UI with bold typography and stream-specific cards (Science / Arts / Commerce)

🏗️ Architecture Overview
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

☁️ AWS Services Used

| Service | Purpose |
|---|---|
| EC2 | Hosts the Node.js backend server (Ubuntu instance) |
| S3 | Stores React frontend Vite production build files |
| CloudFront | CDN for fast global delivery of frontend with HTTPS |
| IAM | Manages GitHub Actions credentials securely (least privilege) |

🛠️ Tech Stack

**Frontend**
- React + Vite — fast modern frontend framework
- Deployed to: AWS S3 → served via CloudFront CDN

**Backend**
- Node.js — backend API server (Port 5000)
- MongoDB — database
- Groq AI — AI-powered career advice API
- JWT — authentication
- Nodemailer — email service
- Deployed to: AWS EC2 via Docker Compose

**Cloud**
- AWS EC2 — virtual machine for backend
- AWS S3 — static frontend hosting
- AWS CloudFront — CDN with HTTPS
- AWS IAM — access management

**DevOps**
- Docker — backend containerization
- Docker Compose — container orchestration
- GitHub Actions — CI/CD pipeline (2 jobs: frontend + backend)

⚙️ CI/CD Pipeline — How It Works

Every push to the `main` branch triggers two parallel jobs in GitHub Actions:

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

🔐 GitHub Actions Secrets Required

| Secret Name | Description |
|---|---|
| AWS_ACCESS_KEY_ID | AWS IAM access key for S3 + CloudFront access |
| AWS_SECRET_ACCESS_KEY | AWS IAM secret key |
| EC2_HOST | EC2 instance public IP address |
| EC2_SSH_KEY | Private SSH key to connect to EC2 |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT authentication |
| GROQ_KEY | Groq AI API key |
| EMAIL_USER | Email address for Nodemailer |
| EMAIL_PASS | Email password for Nodemailer |
| CLOUDFRONT_URL | CloudFront distribution URL |

🚀 Run Locally

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

📁 Project Structure

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

🌍 CloudFront Configuration
- Origin: AWS S3 bucket (`pathfinder-frontend-2026`)
- Distribution ID: `E3TLCI4XOP06AT`
- HTTPS: Enabled via CloudFront SSL
- Cache Invalidation: `/*` invalidated automatically on every frontend deploy

👨‍💻 Author

**Srirangan**
- GitHub: [@srirangan-dev](https://github.com/srirangan-dev)
- LinkedIn: [Add your LinkedIn URL here]

📄 License
This project is open source and available under the MIT License.
