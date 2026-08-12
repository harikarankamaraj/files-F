from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserPreference
from schemas import UserPreferenceSchema, UserPreferenceResponse

router = APIRouter(prefix="/api", tags=["User Preferences"])

@router.get("/preferences", response_model=UserPreferenceResponse)
def get_user_preferences(
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    if not pref:
        pref = UserPreference(
            user_id=user_id,
            favorite_genres="Action, Shooter, RPG",
            favorite_platforms="PC, PlayStation",
            difficulty="Medium",
            game_mode="Both"
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)

    return UserPreferenceResponse(
        id=pref.id,
        user_id=pref.user_id,
        favorite_genres=[g.strip() for g in pref.favorite_genres.split(",") if g.strip()],
        favorite_platforms=[p.strip() for p in pref.favorite_platforms.split(",") if p.strip()],
        difficulty=pref.difficulty,
        game_mode=pref.game_mode
    )

@router.post("/preferences", response_model=UserPreferenceResponse)
def save_user_preferences(
    req: UserPreferenceSchema,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    genres_str = ", ".join(req.favorite_genres)
    platforms_str = ", ".join(req.favorite_platforms)

    if not pref:
        pref = UserPreference(
            user_id=user_id,
            favorite_genres=genres_str,
            favorite_platforms=platforms_str,
            difficulty=req.difficulty,
            game_mode=req.game_mode
        )
        db.add(pref)
    else:
        pref.favorite_genres = genres_str
        pref.favorite_platforms = platforms_str
        pref.difficulty = req.difficulty
        pref.game_mode = req.game_mode

    db.commit()
    db.refresh(pref)

    return UserPreferenceResponse(
        id=pref.id,
        user_id=pref.user_id,
        favorite_genres=[g.strip() for g in pref.favorite_genres.split(",") if g.strip()],
        favorite_platforms=[p.strip() for p in pref.favorite_platforms.split(",") if p.strip()],
        difficulty=pref.difficulty,
        game_mode=pref.game_mode
    )
