from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import SearchHistory
from schemas import SearchHistoryResponse

router = APIRouter(prefix="/api", tags=["Search History"])

@router.get("/history", response_model=List[SearchHistoryResponse])
def get_search_history(
    user_id: str = "default_user",
    limit: int = 10,
    db: Session = Depends(get_db)
):
    history = db.query(SearchHistory).filter(
        SearchHistory.user_id == user_id
    ).order_by(SearchHistory.created_at.desc()).limit(limit).all()

    return history

@router.delete("/history")
def clear_search_history(
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
    db.commit()
    return {"message": "Search history cleared successfully"}
