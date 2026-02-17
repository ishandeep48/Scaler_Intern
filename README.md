# BrainBolt - Adaptive Quiz Platform

An advanced, AI-driven adaptive quiz application built for the Scaler Full Stack Developer Interview.

## 🚀 Quick Start (Recommended)

The entire application (App, Database, Cache) is containerized. You can run it with a **single command**.

### Prerequisites
- Docker & Docker Compose installed.

### Run Command
Open your terminal in the project root and run:

```bash
sudo docker compose up --build
```

Seed the database using
```bash
npx tsx src/seed.ts
```

Access the application at: **[http://localhost:3000](http://localhost:3000)**

---

## ⚡ Setup & Seeding

The application is configured to **automatically seed** the database on the first run. 
- The `seeder` service in Docker Compose waits for MongoDB to be ready.
- It then executes the population script to inject the initial 150+ questions.
- The main `app` service waits for the seeder to finish before becoming active.

If you ever need to reset/re-seed manually:
```bash
docker compose down -v  # Deletes volumes/data
docker compose up --build
```

---

## 🛠 Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: MongoDB (Questions, Users, Logs)
- **Caching & Leaderboard**: Redis (Real-time Score & Streak tracking)
- **Infrastructure**: Docker, Docker Compose

## ✨ Key Features

1. **Adaptive Difficulty Engine**: The complexity of questions scales (1-10) based on your performance momentum.
2. **Real-Time Leaderboard**: Built on **Redis Sorted Sets**, tracking both **Total Score** and **Current Streak** instantly.
3. **Optimistic UI Updates**: Leveraging `SWR` mutations for instant feedback on answers.
4. **Inactivity Decay**: If a user is inactive for >5 minutes, their streak resets and score decays (simulated "pressure").
5. **Idempotency**: Prevents duplicate answer submissions using a unique key/log check.

## 📂 Project Structure

- `src/app/api`: robust API endpoints for Quiz logic, Auth, and Leaderboard.
- `src/lib/redis.ts`: Redis connection and leaderboard logic (Pipeline implementation).
- `src/lib/gameLogic.ts`: The core "Stabilizer" algorithm for difficulty adjustment.
- `scripts/seed.ts`: Database population script.

## Video
Here is the video link as it was too big to upload here
https://youtu.be/YIF-lMTumbY
---
**Author**: Ishan Deep
