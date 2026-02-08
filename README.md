# Valentine's Aim Trainer

A 3D browser game built with React and Three.js. Click targets on a beach scene, explore day/night cycles, and unlock surprises along the way.

**[Play it live →](https://valentines-aim-trainer.vercel.app)** *(replace with your Vercel URL after deployment)*

---

## Tech Stack

- **React 19** + **Vite 7** — UI and build tooling
- **React Three Fiber** + **Three.js** — 3D rendering
- **@react-three/drei** — helpers (PointerLockControls, Html, etc.)
- **@react-three/postprocessing** — bloom and visual effects
- **Web Audio API** — procedural sounds (shots, fireworks, crab interactions)
- **YouTube IFrame API** — background music
- **Vercel** — deployment and serverless API

---

## Features

- **Pointer-lock aiming** — Click to lock mouse and shoot heart targets
- **Day/night cycle** — Adjust time of day; sky, lighting, and fog update
- **Constellation puzzle** — Connect stars at night to reveal a heart
- **Fireworks** — Trigger at night with satisfying procedural audio
- **Crabs** — Wander the beach; interact to hear them
- **Plant garden** — Click the floor to grow flowers
- **Progression** — Score milestones unlock photo messages
- **Replay** — Start over from the valentine prompt

---

## Run Locally

**Prerequisites:** Node.js, npm

```bash
# Install and run frontend
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For the memories API (optional), run the backend in another terminal:

```bash
cd server
pip install uvicorn fastapi
python main.py
```

---

## Project Structure

```
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Game.jsx      # Main 3D scene
│   │   ├── Constellation.jsx
│   │   ├── Fireworks.jsx
│   │   ├── Crab.jsx
│   │   └── ...
│   └── public/images/    # Assets
├── api/             # Vercel serverless (memories)
├── server/          # Local FastAPI backend (optional)
└── vercel.json      # Deployment config
```

---

## Deployment

Deployed on **Vercel** with a serverless `/api/get-memory` endpoint. See [SHARE.md](SHARE.md) for details.
