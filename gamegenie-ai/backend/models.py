from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_order=True, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    genre = Column(String, nullable=False, index=True)
    subgenre = Column(String, nullable=True)
    platform = Column(String, nullable=False)  # Comma separated e.g. "PC, PlayStation, Xbox"
    multiplayer = Column(Boolean, default=False)
    single_player = Column(Boolean, default=True)
    difficulty = Column(String, default="Medium")  # Easy, Medium, Hard
    gameplay_style = Column(String, default="Action")
    theme = Column(String, default="Sci-Fi")
    release_year = Column(Integer, default=2023)
    rating = Column(Float, default=4.5)
    price = Column(Float, default=0.0)  # 0.0 means Free to Play
    image_url = Column(String, nullable=False)
    tags = Column(String, nullable=True)  # Comma separated e.g. "Futuristic, FPS, Competitive"

    favorites = relationship("Favorite", back_populates="game", cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    favorite_genres = Column(String, default="Action, Shooter, RPG")
    favorite_platforms = Column(String, default="PC, PlayStation")
    difficulty = Column(String, default="Medium")
    game_mode = Column(String, default="Both")  # Single Player, Multiplayer, Both

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    game = relationship("Game", back_populates="favorites")

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    query = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class GeneratedGame(Base):
    __tablename__ = "generated_games"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)
    prompt = Column(Text, nullable=False)
    title = Column(String, nullable=False)
    game_type = Column(String, nullable=False)
    game_config = Column(Text, nullable=False)  # JSON formatted string
    created_at = Column(DateTime, default=datetime.utcnow)
