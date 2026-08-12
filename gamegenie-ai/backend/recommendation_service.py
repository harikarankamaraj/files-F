from typing import List, Dict, Any, Tuple
from models import Game, UserPreference
from schemas import AIUnderstanding

class RecommendationEngine:
    """
    Weighted Game Recommendation Scoring Engine
    - Genre match: 30%
    - Gameplay style match: 20%
    - Platform match: 15%
    - Multiplayer match: 15%
    - Theme match: 10%
    - Difficulty match: 5%
    - Rating score: 5%
    """

    def calculate_score(
        self,
        game: Game,
        ai_intent: Dict[str, Any],
        user_pref: UserPreference = None
    ) -> Tuple[int, Dict[str, float], str]:
        
        target_genre = ai_intent.get("genre", "").lower()
        target_theme = ai_intent.get("theme", "").lower()
        target_gameplay = ai_intent.get("gameplay_style", "").lower()
        target_difficulty = ai_intent.get("difficulty", "").lower()
        target_platforms = [p.lower() for p in ai_intent.get("platform", [])]
        target_multiplayer = ai_intent.get("multiplayer", False)
        target_single = ai_intent.get("single_player", True)
        keywords = ai_intent.get("keywords", [])

        # 1. Genre Score (30%)
        genre_score = 0.0
        g_game = game.genre.lower()
        sub_game = (game.subgenre or "").lower()
        tags_game = (game.tags or "").lower()
        
        if target_genre == g_game:
            genre_score = 30.0
        elif target_genre in sub_game or target_genre in tags_game or g_game in target_genre:
            genre_score = 22.0
        elif any(k in g_game or k in tags_game for k in keywords):
            genre_score = 15.0
        else:
            genre_score = 5.0

        # 2. Gameplay Style Score (20%)
        gameplay_score = 0.0
        gp_game = game.gameplay_style.lower()
        if target_gameplay == gp_game:
            gameplay_score = 20.0
        elif any(word in gp_game for word in target_gameplay.split()):
            gameplay_score = 14.0
        elif any(k in gp_game or k in tags_game for k in keywords):
            gameplay_score = 10.0
        else:
            gameplay_score = 4.0

        # 3. Platform Match (15%)
        platform_score = 0.0
        game_platforms = [p.strip().lower() for p in game.platform.split(",")]
        matched_plat = False
        for tp in target_platforms:
            if any(tp in gp or gp in tp for gp in game_platforms):
                matched_plat = True
                break
        if matched_plat:
            platform_score = 15.0
        else:
            platform_score = 5.0

        # 4. Multiplayer / Single-player Match (15%)
        multi_score = 0.0
        if target_multiplayer and game.multiplayer:
            multi_score = 15.0
        elif target_single and game.single_player:
            multi_score = 15.0
        elif game.multiplayer or game.single_player:
            multi_score = 8.0

        # 5. Theme Match (10%)
        theme_score = 0.0
        th_game = game.theme.lower()
        if target_theme == th_game:
            theme_score = 10.0
        elif target_theme in th_game or th_game in target_theme or target_theme in tags_game:
            theme_score = 7.0
        elif any(k in th_game for k in keywords):
            theme_score = 5.0
        else:
            theme_score = 2.0

        # 6. Difficulty Match (5%)
        diff_score = 0.0
        df_game = game.difficulty.lower()
        if target_difficulty == df_game:
            diff_score = 5.0
        else:
            diff_score = 2.5

        # 7. Rating Score (5%)
        # Rating 0-5 scaled to 0-5
        rating_score = (game.rating / 5.0) * 5.0

        # User Personalization Bonus (up to +5%)
        user_bonus = 0.0
        if user_pref:
            fav_genres = [g.strip().lower() for g in (user_pref.favorite_genres or "").split(",")]
            fav_plats = [p.strip().lower() for p in (user_pref.favorite_platforms or "").split(",")]
            if g_game in fav_genres:
                user_bonus += 2.5
            if any(p in fav_plats for p in game_platforms):
                user_bonus += 2.5

        total_score = min(100, int(round(genre_score + gameplay_score + platform_score + multi_score + theme_score + diff_score + rating_score + user_bonus)))

        breakdown = {
            "genre_match": round(genre_score, 1),
            "gameplay_match": round(gameplay_score, 1),
            "platform_match": round(platform_score, 1),
            "multiplayer_match": round(multi_score, 1),
            "theme_match": round(theme_score, 1),
            "difficulty_match": round(diff_score, 1),
            "rating_score": round(rating_score, 1)
        }

        # Generate human-readable explanation
        reasons = []
        if genre_score >= 20.0:
            reasons.append(f"it is a standout {game.genre} game")
        if multi_score >= 12.0:
            if target_multiplayer:
                reasons.append("offers robust multiplayer support")
            else:
                reasons.append("features an immersive single-player experience")
        if theme_score >= 7.0:
            reasons.append(f"has a rich {game.theme} aesthetic")
        if gameplay_score >= 14.0:
            reasons.append(f"matches your desired {game.gameplay_style.lower()} gameplay")
        if platform_score >= 12.0:
            reasons.append(f"is available on your preferred platforms ({game.platform})")

        if not reasons:
            reasons.append("shares key atmospheric and gameplay characteristics with your prompt")

        explanation = f"Matches your request because {', '.join(reasons[:-1]) + (' and ' if len(reasons) > 1 else '') + reasons[-1]}."

        return total_score, breakdown, explanation

recommendation_engine = RecommendationEngine()
