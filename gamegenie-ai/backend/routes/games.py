from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Game, Favorite
from schemas import GameResponse
from game_search_service import game_search_service

router = APIRouter(prefix="/api", tags=["Games"])

@router.get("/games", response_model=List[GameResponse])
def get_games(
    query: Optional[str] = None,
    genre: Optional[str] = None,
    platform: Optional[str] = None,
    difficulty: Optional[str] = None,
    multiplayer: Optional[bool] = None,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    games = game_search_service.search_games(
        db, query=query, genre=genre, platform=platform,
        multiplayer=multiplayer, difficulty=difficulty
    )
    
    # Check favorite status
    fav_ids = set(
        f.game_id for f in db.query(Favorite).filter(Favorite.user_id == user_id).all()
    )

    results = []
    for g in games:
        g_resp = GameResponse.model_validate(g)
        g_resp.is_favorite = g.id in fav_ids
        results.append(g_resp)

    return results

@router.get("/games/{game_id}", response_model=GameResponse)
def get_game_by_id(
    game_id: int,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    fav = db.query(Favorite).filter(Favorite.user_id == user_id, Favorite.game_id == game_id).first()
    g_resp = GameResponse.model_validate(game)
    g_resp.is_favorite = fav is not None
    return g_resp

@router.get("/similar-games/{game_id}", response_model=List[GameResponse])
def get_similar_games(
    game_id: int,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    target_game = db.query(Game).filter(Game.id == game_id).first()
    if not target_game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Find games sharing genre or theme or platform
    similar = db.query(Game).filter(
        Game.id != game_id,
        (Game.genre == target_game.genre) |
        (Game.theme == target_game.theme) |
        (Game.gameplay_style == target_game.gameplay_style)
    ).limit(6).all()

    if not similar:
        similar = db.query(Game).filter(Game.id != game_id).limit(4).all()

    fav_ids = set(
        f.game_id for f in db.query(Favorite).filter(Favorite.user_id == user_id).all()
    )

    results = []
    for g in similar:
        g_resp = GameResponse.model_validate(g)
        g_resp.is_favorite = g.id in fav_ids
        results.append(g_resp)

    return results
