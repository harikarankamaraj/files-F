import os
import json
import re
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY")

class AIService:
    """
    Modular AI Service supporting LLM APIs (OpenAI) with an intelligent,
    robust rule-based NLP fallback engine.
    """

    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.use_llm = bool(self.api_key and not self.api_key.startswith("your_"))

    def extract_intent(self, prompt: str) -> Dict[str, Any]:
        """
        Extract user game preferences from natural language prompt.
        Returns structured dictionary.
        """
        if self.use_llm:
            try:
                return self._extract_intent_llm(prompt)
            except Exception as e:
                print(f"[AIService] LLM extraction error: {e}. Falling back to Rule Engine.")

        return self._extract_intent_rule_based(prompt)

    def _extract_intent_rule_based(self, prompt: str) -> Dict[str, Any]:
        lower_prompt = prompt.lower()

        # Genre Detection
        genre = "Action"  # default
        genre_map = {
            "shooter": ["fps", "shooter", "shooting", "gun", "gunplay", "weapons", "sniper", "tps", "battle royale"],
            "farming": ["farming", "farm", "crop", "harvest", "agriculture", "stardew"],
            "puzzle": ["puzzle", "brain", "logic", "tetris", "match", "riddle", "increasing difficulty", "memory"],
            "rpg": ["rpg", "role playing", "role-playing", "quest", "leveling", "dungeon", "character creation", "stats"],
            "adventure": ["adventure", "story", "exploration", "narrative", "quest", "journey", "open-world", "open world"],
            "action": ["action", "combat", "hack", "slash", "brawler", "fighting", "fast-paced"],
            "racing": ["racing", "race", "car", "driving", "drift", "speedway", "vehicle"],
            "strategy": ["strategy", "rts", "turn-based", "tactics", "base building", "command"],
            "simulation": ["simulation", "simulator", "sim", "flight", "sandbox", "crafting", "minecraft"],
            "horror": ["horror", "scary", "survival horror", "creepy", "ghost", "zombie", "dark"],
            "sports": ["sports", "football", "basketball", "soccer", "tennis", "golf"],
            "platformer": ["platformer", "platform", "jump", "mario", "side-scroller", "side scroller", "2d platformer"]
        }

        for g, keywords in genre_map.items():
            if any(k in lower_prompt for k in keywords):
                genre = g.capitalize()
                if genre == "Fps": genre = "Shooter"
                break

        # Theme Detection
        theme = "Sci-Fi"
        theme_map = {
            "futuristic": ["futuristic", "future", "laser", "cyber", "cyberpunk", "sci-fi", "scifi", "tech", "mech", "space"],
            "fantasy": ["fantasy", "magic", "dragon", "sword", "wizard", "spell", "medieval"],
            "relaxing": ["relaxing", "cozy", "chill", "peaceful", "calm", "casual", "farming", "soothing"],
            "dark": ["dark", "horror", "gothic", "scary", "apocalyptic", "post-apocalyptic", "zombie"],
            "modern": ["modern", "urban", "city", "realistic", "military"],
            "retro": ["retro", "pixel", "8-bit", "arcade", "classic", "vintage"]
        }

        for t, keywords in theme_map.items():
            if any(k in lower_prompt for k in keywords):
                theme = t.capitalize()
                break

        # Multiplayer vs Single Player
        multiplayer = any(k in lower_prompt for k in ["multiplayer", "co-op", "coop", "online", "pvp", "mmo", "friends", "team"])
        single_player = any(k in lower_prompt for k in ["single player", "singleplayer", "solo", "story", "campaign", "offline"])
        if not multiplayer and not single_player:
            single_player = True
            if any(k in lower_prompt for k in ["shooting", "fps", "battle royale"]):
                multiplayer = True

        # Difficulty Detection
        difficulty = "Medium"
        if any(k in lower_prompt for k in ["hard", "difficult", "challenging", "brutal", "souls", "tough", "increasing difficulty"]):
            difficulty = "Hard"
        elif any(k in lower_prompt for k in ["relaxing", "easy", "cozy", "chill", "casual", "simple"]):
            difficulty = "Easy"

        # Gameplay Style Detection
        gameplay_style = "Action-Packed"
        if any(k in lower_prompt for k in ["competitive", "ranked", "pvp", "fast"]):
            gameplay_style = "Competitive"
        elif any(k in lower_prompt for k in ["relaxing", "farming", "cozy", "chill"]):
            gameplay_style = "Relaxing & Casual"
        elif any(k in lower_prompt for k in ["story", "narrative", "lore"]):
            gameplay_style = "Story-Driven"
        elif any(k in lower_prompt for k in ["open world", "open-world", "sandbox", "exploration"]):
            gameplay_style = "Open-World Exploration"
        elif any(k in lower_prompt for k in ["puzzle", "brain", "logic"]):
            gameplay_style = "Logic & Problem Solving"

        # Platform Detection
        platforms = []
        if "pc" in lower_prompt or "computer" in lower_prompt or "steam" in lower_prompt:
            platforms.append("PC")
        if "playstation" in lower_prompt or "ps5" in lower_prompt or "ps4" in lower_prompt or "console" in lower_prompt:
            platforms.append("PlayStation")
        if "xbox" in lower_prompt or "console" in lower_prompt:
            platforms.append("Xbox")
        if "switch" in lower_prompt or "nintendo" in lower_prompt:
            platforms.append("Nintendo")
        if "mobile" in lower_prompt or "phone" in lower_prompt or "ios" in lower_prompt or "android" in lower_prompt:
            platforms.append("Mobile")

        if not platforms:
            platforms = ["PC", "Console"]

        # Extracted Keywords
        words = [w for w in re.findall(r'\b\w+\b', lower_prompt) if len(w) > 3 and w not in ["want", "like", "game", "with", "that", "play", "this", "some"]]

        return {
            "genre": genre,
            "subgenre": "Tactical" if genre == "Shooter" else ("Life Sim" if genre == "Farming" else "Action"),
            "theme": theme,
            "gameplay_style": gameplay_style,
            "difficulty": difficulty,
            "platform": platforms,
            "multiplayer": multiplayer,
            "single_player": single_player,
            "keywords": words[:6],
            "summary": f"Detected a {theme} {genre} game designed for {', '.join(platforms)} with {gameplay_style.lower()} gameplay."
        }

    def _extract_intent_llm(self, prompt: str) -> Dict[str, Any]:
        import httpx
        system_prompt = """
        You are an AI game discovery engine. Parse the user's natural language request into a strict JSON object with fields:
        {
          "genre": "Shooter|Farming|Puzzle|RPG|Adventure|Action|Racing|Strategy|Simulation|Horror|Sports|Platformer",
          "subgenre": "string",
          "theme": "Futuristic|Sci-Fi|Fantasy|Relaxing|Dark|Modern|Retro",
          "gameplay_style": "Competitive|Relaxing & Casual|Story-Driven|Open-World Exploration|Logic & Problem Solving|Action-Packed",
          "difficulty": "Easy|Medium|Hard",
          "platform": ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "Browser"],
          "multiplayer": true|false,
          "single_player": true|false,
          "keywords": ["tag1", "tag2"],
          "summary": "Short explanation"
        }
        Return ONLY JSON.
        """
        response = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.2
            },
            timeout=10.0
        )
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        return json.loads(content)

    def generate_game_spec(self, prompt: str, similar_game: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Converts user text prompt into structured playable game specification.
        """
        lower = prompt.lower()
        game_type = "space_shooter"  # default template

        if any(k in lower for k in ["runner", "endless", "dodge", "obstacle"]):
            game_type = "endless_runner"
        elif any(k in lower for k in ["snake", "grow", "slither", "tail", "worm"]):
            game_type = "snake"
        elif any(k in lower for k in ["pong", "paddle", "table tennis", "bounce"]):
            game_type = "pong"
        elif any(k in lower for k in ["breakout", "brick", "block breaker", "destroy bricks"]):
            game_type = "breakout"
        elif any(k in lower for k in ["flappy", "bird", "fly", "gate", "tunnel"]):
            game_type = "flappy"
        elif any(k in lower for k in ["top down", "top-down", "arena shooter", "zombie survival", "survivor"]):
            game_type = "topdown_shooter"
        elif any(k in lower for k in ["memory", "card match", "matching", "flip cards"]):
            game_type = "memory_puzzle"
        elif any(k in lower for k in ["shooter", "space", "ship", "laser", "galaxy", "futuristic"]):
            game_type = "space_shooter"

        # Construct title
        if similar_game:
            title = f"{similar_game.get('title', 'Galactic')} Reimagined"
        elif "space" in lower or "futuristic" in lower:
            title = "Galactic Strike AI"
        elif "runner" in lower:
            title = "Cyber Velocity Runner"
        elif "puzzle" in lower or "memory" in lower:
            title = "Neon Mind Matrix"
        elif "snake" in lower:
            title = "Quantum Cyber Snake"
        else:
            title = "Apex Neon Arena"

        intent = self.extract_intent(prompt)

        spec = {
            "title": title,
            "game_type": game_type,
            "genre": intent["genre"],
            "theme": intent["theme"],
            "player": f"{intent['theme']} Hero / Vessel",
            "enemies": "Autonomous Cyber Drones & Waves",
            "controls": "WASD / Arrow Keys to Move, Spacebar to Action/Shoot",
            "objective": "Survive incoming waves, collect power-ups, and reach the high score.",
            "difficulty": intent["difficulty"],
            "scoring": "100 points per enemy neutralized + survival time bonus",
            "levels": "Procedural wave scaling every 30 seconds",
            "visual_style": f"Glassmorphism Dark Theme with Neon {intent['theme']} Accents"
        }

        return spec

ai_service = AIService()
