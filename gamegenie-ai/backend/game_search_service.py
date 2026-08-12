import os
import httpx
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models import Game
from dotenv import load_dotenv

load_dotenv()

GAME_API_KEY = os.getenv("GAME_API_KEY")

class GameSearchService:
    """
    Game Search Service supporting local SQLite lookup and external game API integration
    with graceful fallback.
    """

    def __init__(self):
        self.api_key = GAME_API_KEY

    def search_games(
        self,
        db: Session,
        query: str = "",
        genre: Optional[str] = None,
        platform: Optional[str] = None,
        multiplayer: Optional[bool] = None,
        difficulty: Optional[str] = None,
        price_max: Optional[float] = None,
        min_rating: Optional[float] = None
    ) -> List[Game]:
        """
        Queries the database with flexible filtering.
        """
        stmt = db.query(Game)

        if query:
            q_pattern = f"%{query}%"
            stmt = stmt.filter(
                (Game.title.ilike(q_pattern)) |
                (Game.description.ilike(q_pattern)) |
                (Game.genre.ilike(q_pattern)) |
                (Game.theme.ilike(q_pattern)) |
                (Game.tags.ilike(q_pattern))
            )

        if genre and genre != "All":
            stmt = stmt.filter(Game.genre.ilike(f"%{genre}%"))

        if platform and platform != "All":
            stmt = stmt.filter(Game.platform.ilike(f"%{platform}%"))

        if multiplayer is not None:
            if multiplayer:
                stmt = stmt.filter(Game.multiplayer == True)
            else:
                stmt = stmt.filter(Game.single_player == True)

        if difficulty and difficulty != "All":
            stmt = stmt.filter(Game.difficulty.ilike(f"%{difficulty}%"))

        if price_max is not None:
            stmt = stmt.filter(Game.price <= price_max)

        if min_rating is not None:
            stmt = stmt.filter(Game.rating >= min_rating)

        return stmt.all()

    async def search_external_api(self, query: str) -> List[Dict[str, Any]]:
        """
        External Game API client (e.g., RAWG or IGDB) with fallback.
        """
        if not self.api_key or self.api_key.startswith("your_"):
            return []

        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"https://api.rawg.io/api/games?key={self.api_key}&search={query}&page_size=5",
                    timeout=5.0
                )
                if res.status_code == 200:
                    data = res.json()
                    return data.get("results", [])
        except Exception as e:
            print(f"[GameSearchService] External API search failed: {e}")

        return []

game_search_service = GameSearchService()
