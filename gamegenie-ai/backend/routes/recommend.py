from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Game, UserPreference, Favorite, SearchHistory
from schemas import RecommendationRequest, RecommendationResponse, AIUnderstanding, ScoredGame, GameResponse
from ai_service import ai_service
from recommendation_service import recommendation_engine
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Recommendation"])

@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(
    req: RecommendationRequest,
    db: Session = Depends(get_db)
):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    user_id = req.user_id or "default_user"

    # 1. Save to search history
    history_entry = SearchHistory(user_id=user_id, query=req.prompt.strip(), created_at=datetime.utcnow())
    db.add(history_entry)
    db.commit()

    # 2. Extract AI Intent
    intent = ai_service.extract_intent(req.prompt)

    # Apply manual filters if provided
    if req.filters:
        if req.filters.genre: intent["genre"] = req.filters.genre
        if req.filters.platform: intent["platform"] = [req.filters.platform]
        if req.filters.multiplayer is not None: intent["multiplayer"] = req.filters.multiplayer
        if req.filters.difficulty: intent["difficulty"] = req.filters.difficulty

    ai_understanding = AIUnderstanding(
        genre=intent["genre"],
        subgenre=intent.get("subgenre"),
        theme=intent["theme"],
        gameplay_style=intent["gameplay_style"],
        difficulty=intent["difficulty"],
        platform=intent["platform"],
        multiplayer=intent["multiplayer"],
        single_player=intent["single_player"],
        keywords=intent.get("keywords", []),
        summary=intent.get("summary", "")
    )

    # 3. Retrieve user profile preferences
    user_pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    # 4. Fetch candidate games from DB
    all_games = db.query(Game).all()

    # Check user favorites
    fav_ids = set(
        f.game_id for f in db.query(Favorite).filter(Favorite.user_id == user_id).all()
    )

    # 5. Calculate scores for each game
    scored_games: List[ScoredGame] = []

    for game in all_games:
        score, breakdown, explanation = recommendation_engine.calculate_score(
            game=game,
            ai_intent=intent,
            user_pref=user_pref
        )

        g_resp = GameResponse.model_validate(game)
        g_resp.is_favorite = game.id in fav_ids

        scored_games.append(
            ScoredGame(
                game=g_resp,
                match_score=score,
                score_breakdown=breakdown,
                match_explanation=explanation
            )
        )

    # Sort descending by match_score, then by rating
    scored_games.sort(key=lambda x: (x.match_score, x.game.rating), reverse=True)

    return RecommendationResponse(
        prompt=req.prompt,
        ai_understanding=ai_understanding,
        recommendations=scored_games
    )
