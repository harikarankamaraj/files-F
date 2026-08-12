# 🧞‍♂️ GameGenie AI – AI-Powered Game Discovery & Creation Platform

> **"Describe your game. Discover it. Create it."**

GameGenie AI is a full-stack, hackathon-ready application designed to transform natural language game prompts into personalized game recommendations and instantly playable browser games.

---

## 🌟 Key Features

1. **Natural-Language AI Search & Intent Extraction**:
   - Accepts complex prompts like *"I want a multiplayer shooting game with futuristic weapons"* or *"Suggest a relaxing farming game for PC"*.
   - Extracts genre, theme, gameplay style, difficulty, platform, and multiplayer preferences.

2. **Multi-Factor Recommendation Engine**:
   - Scores candidates using a 7-factor weighted algorithm:
     - Genre match (30%)
     - Gameplay style match (20%)
     - Platform match (15%)
     - Multiplayer match (15%)
     - Theme match (10%)
     - Difficulty match (5%)
     - Rating score (5%)
   - Generates contextual *"Why we recommend this"* explanations.

3. **AI Game Creator & Playable HTML5 Canvas Engine**:
   - Formulates structured game specifications (player, enemies, controls, difficulty, level progression).
   - Generates and compiles playable 2D HTML5 Canvas mini-games directly in the browser with Web Audio sound synthesis, keyboard & on-screen mobile controls, high score tracking, and pause/restart states.
   - Supports 8 game templates: 2D Space Shooter, Endless Runner, Cyber Snake, Cyber Pong, Brick Breaker, Flappy Space Drone, Top-Down Survivor, and Memory Puzzle.

4. **Favorites, History & Personalization**:
   - Save/favorite games with persistent backend state.
   - Search history tracker with instant re-execution.
   - Personalization profile editor (favorite genres, platforms, difficulty) that dynamically tunes recommendation weights.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Glassmorphism dark cyberpunk UI), Lucide Icons, HTML5 Canvas game engine, Web Audio API sound synthesizer.
- **Backend**: Python FastAPI, SQLAlchemy ORM, SQLite database, Pydantic v2 validation.
- **AI Engine**: Modular `AIService` with OpenAI LLM API support (`AI_API_KEY`) and intelligent rule-based/keyword NLP fallback parser when no API key is provided.

---

## ⚙️ Installation & Setup (Windows PowerShell / CMD)

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
Navigate to the backend directory:
```powershell
cd d:\New folder\gamegenie-ai\backend
```

Create and activate a virtual environment (optional but recommended):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install Python dependencies:
```powershell
pip install -r requirements.txt
```

### 3. Frontend Setup
In a separate terminal, navigate to the frontend directory:
```powershell
cd d:\New folder\gamegenie-ai\frontend
```

Install Node packages:
```powershell
npm install
```

---

## 🚀 Running the Application

### Start Backend Server
Inside `d:\New folder\gamegenie-ai\backend`:
```powershell
python main.py
```
*or via Uvicorn:*
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
> The server will automatically initialize SQLite database (`gamegenie.db`) and seed **30 curated sample games**.
> Interactive API documentation available at: `http://localhost:8000/docs`

### Start Frontend Dev Server
Inside `d:\New folder\gamegenie-ai\frontend`:
```powershell
npm run dev
```
> Open your browser at: `http://localhost:5173`

---

## 🔐 Environment Variables (`.env.example`)

Copy `.env.example` to `.env` in the root or backend directory:
```env
# Optional LLM Key for enhanced prompt parsing
AI_API_KEY=your_openai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional external game API key
GAME_API_KEY=
```
*Note: If no API key is set, GameGenie AI automatically switches to its high-precision rule-based NLP fallback engine.*

---

## 🔌 Core API Endpoints

- `POST /api/recommend`: NLP query search + match score ranking + AI intent breakdown.
- `GET /api/games`: List all catalog games with filtering.
- `GET /api/games/{id}`: Detailed metadata for a single game.
- `GET /api/similar-games/{id}`: Returns 4–6 related games.
- `POST /api/favorites` / `DELETE /api/favorites/{id}`: Manage user favorites.
- `GET /api/preferences` / `POST /api/preferences`: Gamer profile preferences.
- `POST /api/generate-game`: Prompt -> Structured spec + Canvas game configuration.
- `GET /api/generated-games`: History of user-created AI games.

---

## 🎮 How Playable Browser Games Work

1. **Prompt Parsing**: User inputs a concept like *"Create a futuristic space shooter with increasing difficulty"*.
2. **Spec Formulation**: The backend generates a structured spec and maps it to a responsive HTML5 Canvas game template.
3. **Canvas Engine Execution**: React mounts `GameCanvas.jsx`, rendering real-time 60FPS canvas graphics, audio synthesis via Web Audio API, collision detection, and score/level state management.

---

## 🔮 Future Improvements

- Procedural sprite asset generation using WebGL shaders.
- Community game sharing & multiplayer WebRTC room lobbies.
- Integration with external game databases (IGDB / RAWG / Steam API).
