import { onRequestGet as __api_leaderboard_js_onRequestGet } from "/Users/spleenteo/Sites/onami-quiz/functions/api/leaderboard.js"
import { onRequestPost as __api_save_score_js_onRequestPost } from "/Users/spleenteo/Sites/onami-quiz/functions/api/save-score.js"

export const routes = [
    {
      routePath: "/api/leaderboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_leaderboard_js_onRequestGet],
    },
  {
      routePath: "/api/save-score",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_save_score_js_onRequestPost],
    },
  ]