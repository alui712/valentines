# Share the game with a link

## Permanent link (recommended) — Deploy to Vercel

Deploy once and share a link that works 24/7 without running anything on your PC.

### One-time setup

1. **Push to GitHub** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/valentines-aim-trainer.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in (free account).
   - Click **Add New** → **Project**.
   - Import your GitHub repo `valentines-aim-trainer`.
   - Vercel will auto-detect the config from `vercel.json`.
   - Click **Deploy**.

3. **Share the link**  
   Vercel gives you a URL like `https://valentines-aim-trainer.vercel.app`. Anyone can open it and play — no setup, no backend to run.

---

## Local dev / temporary link (ngrok)

For quick local testing with a shareable link:

1. **Start the backend**:
   ```bash
   cd server
   pip install uvicorn fastapi
   python main.py
   ```

2. **Start the frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Expose with ngrok** (from project root):
   ```bash
   ngrok http 5173
   ```

4. **Share the ngrok URL**  
   The link only works while your PC is running these processes.
