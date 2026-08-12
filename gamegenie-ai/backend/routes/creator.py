import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import GeneratedGame, Game
from schemas import GenerateGameRequest, GeneratedGameResponse, PlayableGameConfig, StructuredGameSpec
from game_generator import game_generator
from datetime import datetime

router = APIRouter(prefix="/api", tags=["AI Game Creator"])

@router.post("/generate-game", response_model=GeneratedGameResponse)
def generate_playable_game(
    req: GenerateGameRequest,
    db: Session = Depends(get_db)
):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required to create a game")

    user_id = req.user_id or "default_user"
    similar_game_dict = None

    if req.similar_game_id:
        g = db.query(Game).filter(Game.id == req.similar_game_id).first()
        if g:
            similar_game_dict = {
                "title": g.title,
                "genre": g.genre,
                "theme": g.theme,
                "gameplay_style": g.gameplay_style
            }

    # Generate game spec & canvas config
    result = game_generator.generate(req.prompt.strip(), similar_game=similar_game_dict)
    spec: StructuredGameSpec = result["spec"]
    config: dict = result["config"]

    # Save generated game entry to DB
    new_game = GeneratedGame(
        user_id=user_id,
        prompt=req.prompt.strip(),
        title=spec.title,
        game_type=spec.game_type,
        game_config=json.dumps(config),
        created_at=datetime.utcnow()
    )
    db.add(new_game)
    db.commit()
    db.refresh(new_game)

    return GeneratedGameResponse(
        id=new_game.id,
        user_id=new_game.user_id,
        prompt=new_game.prompt,
        title=new_game.title,
        game_type=new_game.game_type,
        game_config=config,
        spec=spec,
        created_at=new_game.created_at
    )

@router.get("/generated-games", response_model=List[GeneratedGameResponse])
def get_user_generated_games(
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    games = db.query(GeneratedGame).filter(
        GeneratedGame.user_id == user_id
    ).order_by(GeneratedGame.created_at.desc()).all()

    results = []
    for g in games:
        config_dict = json.loads(g.game_config) if g.game_config else {}
        # Reconstruct spec if needed or extract from config
        spec_dict = config_dict.get("spec", {
            "title": g.title,
            "game_type": g.game_type,
            "genre": "Action",
            "theme": "Sci-Fi",
            "player": "Player Vessel",
            "enemies": "Cyber Drones",
            "controls": "WASD / Arrow Keys",
            "objective": "High score survival",
            "difficulty": "Medium",
            "scoring": "100 pts per kill",
            "levels": "Procedural waves",
            "visual_style": "Neon Dark"
        })
        
        results.append(
            GeneratedGameResponse(
                id=g.id,
                user_id=g.user_id,
                prompt=g.prompt,
                title=g.title,
                game_type=g.game_type,
                game_config=config_dict,
                spec=StructuredGameSpec(**spec_dict) if isinstance(spec_dict, dict) else spec_dict,
                created_at=g.created_at
            )
        )

    return results

@router.get("/generated-games/{game_id}", response_model=GeneratedGameResponse)
def get_generated_game_by_id(
    game_id: int,
    db: Session = Depends(get_db)
):
    g = db.query(GeneratedGame).filter(GeneratedGame.id == game_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Generated game not found")

    config_dict = json.loads(g.game_config) if g.game_config else {}
    spec_dict = config_dict.get("spec", {
        "title": g.title,
        "game_type": g.game_type,
        "genre": "Action",
        "theme": "Sci-Fi",
        "player": "Player Vessel",
        "enemies": "Cyber Drones",
        "controls": "WASD / Arrow Keys",
        "objective": "High score survival",
        "difficulty": "Medium",
        "scoring": "100 pts per kill",
        "levels": "Procedural waves",
        "visual_style": "Neon Dark"
    })

    return GeneratedGameResponse(
        id=g.id,
        user_id=g.user_id,
        prompt=g.prompt,
        title=g.title,
        game_type=g.game_type,
        game_config=config_dict,
        spec=StructuredGameSpec(**spec_dict) if isinstance(spec_dict, dict) else spec_dict,
        created_at=g.created_at
    )
