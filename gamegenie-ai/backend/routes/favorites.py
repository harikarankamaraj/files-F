from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Favorite, Game
from schemas import FavoriteRequest, FavoriteResponse, GameResponse

router = APIRouter(prefix="/api", tags=["Favorites"])

@router.get("/favorites", response_model=List[FavoriteResponse])
def get_favorites(
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    results = []
    for f in favs:
        g_resp = None
        if f.game:
            g_resp = GameResponse.model_validate(f.game)
            g_resp.is_favorite = True
        results.append(
            FavoriteResponse(
                id=f.id,
                user_id=f.user_id,
                game_id=f.game_id,
                created_at=f.created_at,
                game=g_resp
            )
        )
    return results

@router.post("/favorites", response_model=FavoriteResponse)
def add_favorite(
    req: FavoriteRequest,
    db: Session = Depends(get_db)
):
    user_id = req.user_id or "default_user"
    
    # Check if game exists
    game = db.query(Game).filter(Game.id == req.game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.game_id == req.game_id
    ).first()

    if existing:
        g_resp = GameResponse.model_validate(game)
        g_resp.is_favorite = True
        return FavoriteResponse(
            id=existing.id,
            user_id=existing.user_id,
            game_id=existing.game_id,
            created_at=existing.created_at,
            game=g_resp
        )

    new_fav = Favorite(user_id=user_id, game_id=req.game_id)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)

    g_resp = GameResponse.model_validate(game)
    g_resp.is_favorite = True

    return FavoriteResponse(
        id=new_fav.id,
        user_id=new_fav.user_id,
        game_id=new_fav.game_id,
        created_at=new_fav.created_at,
        game=g_resp
    )

@router.delete("/favorites/{game_id}")
def remove_favorite(
    game_id: int,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    fav = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.game_id == game_id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()

    return {"message": "Favorite removed successfully", "game_id": game_id}
