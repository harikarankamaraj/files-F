from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class GameBase(BaseModel):
    title: str
    description: str
    genre: str
    subgenre: Optional[str] = None
    platform: str
    multiplayer: bool = False
    single_player: bool = True
    difficulty: str = "Medium"
    gameplay_style: str = "Action"
    theme: str = "Sci-Fi"
    release_year: int = 2023
    rating: float = 4.5
    price: float = 0.0
    image_url: str
    tags: Optional[str] = ""

class GameResponse(GameBase):
    id: int
    is_favorite: Optional[bool] = False

    class Config:
        from_attributes = True

class RecommendationFilters(BaseModel):
    genre: Optional[str] = None
    platform: Optional[str] = None
    multiplayer: Optional[bool] = None
    single_player: Optional[bool] = None
    difficulty: Optional[str] = None
    game_mode: Optional[str] = None
    price_max: Optional[float] = None
    min_rating: Optional[float] = None
    release_year: Optional[int] = None
    play_style: Optional[str] = None

class RecommendationRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "default_user"
    filters: Optional[RecommendationFilters] = None

class AIUnderstanding(BaseModel):
    genre: str
    subgenre: Optional[str] = None
    theme: str
    gameplay_style: str
    difficulty: str
    platform: List[str]
    multiplayer: bool
    single_player: bool
    keywords: List[str] = []
    summary: str

class ScoredGame(BaseModel):
    game: GameResponse
    match_score: int  # 0 to 100 percentage
    score_breakdown: Dict[str, float]
    match_explanation: str

class RecommendationResponse(BaseModel):
    prompt: str
    ai_understanding: AIUnderstanding
    recommendations: List[ScoredGame]

class FavoriteRequest(BaseModel):
    game_id: int
    user_id: Optional[str] = "default_user"

class FavoriteResponse(BaseModel):
    id: int
    user_id: str
    game_id: int
    created_at: datetime
    game: Optional[GameResponse] = None

    class Config:
        from_attributes = True

class SearchHistoryResponse(BaseModel):
    id: int
    user_id: str
    query: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserPreferenceSchema(BaseModel):
    favorite_genres: List[str] = ["Action", "Shooter", "RPG"]
    favorite_platforms: List[str] = ["PC", "PlayStation"]
    difficulty: str = "Medium"
    game_mode: str = "Both"

class UserPreferenceResponse(BaseModel):
    id: int
    user_id: str
    favorite_genres: List[str]
    favorite_platforms: List[str]
    difficulty: str
    game_mode: str

    class Config:
        from_attributes = True

class GenerateGameRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "default_user"
    similar_game_id: Optional[int] = None

class StructuredGameSpec(BaseModel):
    title: str
    game_type: str  # e.g., "space_shooter", "endless_runner", "snake", "pong", "breakout", "flappy", "topdown_shooter", "memory_puzzle"
    genre: str
    theme: str
    player: str
    enemies: str
    controls: str
    objective: str
    difficulty: str
    scoring: str
    levels: str
    visual_style: str

class PlayableGameConfig(BaseModel):
    spec: StructuredGameSpec
    config: Dict[str, Any]

class GeneratedGameResponse(BaseModel):
    id: int
    user_id: str
    prompt: str
    title: str
    game_type: str
    game_config: Dict[str, Any]
    spec: StructuredGameSpec
    created_at: datetime

    class Config:
        from_attributes = True
