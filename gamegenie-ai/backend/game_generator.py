from typing import Dict, Any, Optional
from ai_service import ai_service
from schemas import StructuredGameSpec

class GameGenerator:
    """
    AI Game Generator that converts prompts into structured game specifications
    and HTML5 Canvas playable game configurations.
    """

    def generate(self, prompt: str, similar_game: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        # 1. AI Intent & Structured Spec
        spec_dict = ai_service.generate_game_spec(prompt, similar_game)
        spec = StructuredGameSpec(**spec_dict)

        # 2. Build template-specific canvas configuration
        game_type = spec.game_type
        config = self._build_canvas_config(game_type, spec, prompt)

        return {
            "spec": spec,
            "config": config
        }

    def _build_canvas_config(self, game_type: str, spec: StructuredGameSpec, prompt: str) -> Dict[str, Any]:
        lower = prompt.lower()

        # Theme Color Palette Selector
        if "cyber" in lower or "neon" in lower:
            player_color = "#00f0ff"
            enemy_color = "#ff0055"
            accent_color = "#7000ff"
            bg_gradient = ["#090a0f", "#121526"]
        elif "farming" in lower or "cozy" in lower or "relaxing" in lower or "green" in lower:
            player_color = "#10b981"
            enemy_color = "#f59e0b"
            accent_color = "#84cc16"
            bg_gradient = ["#064e3b", "#022c22"]
        elif "space" in lower or "futuristic" in lower:
            player_color = "#3b82f6"
            enemy_color = "#ef4444"
            accent_color = "#8b5cf6"
            bg_gradient = ["#030712", "#0b0f19"]
        else:
            player_color = "#00f0ff"
            enemy_color = "#ff0055"
            accent_color = "#a855f7"
            bg_gradient = ["#0a0a16", "#14142b"]

        base_config = {
            "title": spec.title,
            "game_type": game_type,
            "canvas": {
                "width": 800,
                "height": 500,
                "bg_gradient": bg_gradient
            },
            "theme": {
                "player_color": player_color,
                "enemy_color": enemy_color,
                "accent_color": accent_color,
                "grid_overlay": True
            },
            "controls": {
                "up": "ArrowUp / W",
                "down": "ArrowDown / S",
                "left": "ArrowLeft / A",
                "right": "ArrowRight / D",
                "action": "Spacebar"
            },
            "audio": {
                "synth_effects": True,
                "laser_freq": 880,
                "explosion_freq": 120,
                "score_freq": 523
            }
        }

        # Template Specific Rules & Objects
        if game_type == "space_shooter":
            base_config["gameplay"] = {
                "player": {"speed": 6, "width": 40, "height": 30, "lives": 3, "fire_rate_ms": 200},
                "enemies": {"speed": 2.5, "spawn_interval_ms": 1200, "width": 32, "height": 32, "points": 100},
                "bullets": {"speed": 10, "width": 4, "height": 14, "color": player_color},
                "wave_scaling": True
            }
        elif game_type == "endless_runner":
            base_config["gameplay"] = {
                "player": {"gravity": 0.6, "jump_strength": -12, "width": 30, "height": 50, "x": 100},
                "obstacles": {"speed": 6, "width": 25, "height": 45, "spawn_interval_ms": 1500},
                "points_per_sec": 10
            }
        elif game_type == "snake":
            base_config["gameplay"] = {
                "grid_size": 20,
                "initial_length": 4,
                "speed_ms": 100,
                "food_color": enemy_color,
                "points_per_food": 100
            }
        elif game_type == "pong":
            base_config["gameplay"] = {
                "paddle_height": 90,
                "paddle_width": 15,
                "ball_radius": 8,
                "ball_speed": 7,
                "ai_difficulty": 0.85
            }
        elif game_type == "breakout":
            base_config["gameplay"] = {
                "paddle_width": 100,
                "paddle_height": 15,
                "ball_radius": 8,
                "ball_speed": 6,
                "brick_rows": 5,
                "brick_cols": 8,
                "brick_height": 20
            }
        elif game_type == "flappy":
            base_config["gameplay"] = {
                "player": {"gravity": 0.45, "lift": -9, "radius": 15},
                "pipes": {"gap": 140, "width": 50, "speed": 3, "spawn_ms": 1600}
            }
        elif game_type == "topdown_shooter":
            base_config["gameplay"] = {
                "player": {"speed": 5, "radius": 18, "lives": 3},
                "enemies": {"speed": 2.0, "spawn_ms": 1000, "radius": 14, "health": 1},
                "bullet_speed": 9
            }
        elif game_type == "memory_puzzle":
            base_config["gameplay"] = {
                "grid_cols": 4,
                "grid_rows": 3,
                "card_symbols": ["🚀", "⚡", "🔮", "👾", "💎", "🛡️"],
                "flip_delay_ms": 800
            }

        return base_config

game_generator = GameGenerator()
