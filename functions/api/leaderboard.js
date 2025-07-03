export async function onRequestGet(context) {
  const { env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Ottieni la classifica generale
    const leaderboard = await env.DB.prepare(`
      SELECT 
        name, 
        score, 
        questions_answered, 
        correct_answers,
        ROUND((correct_answers * 100.0 / questions_answered), 1) as accuracy,
        avg_time_per_question,
        streak_max,
        created_at
      FROM players 
      ORDER BY score DESC 
      LIMIT 100
    `).all();

    // Statistiche generali
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_players,
        SUM(questions_answered) as total_questions,
        AVG(score) as avg_score,
        MAX(score) as highest_score,
        COUNT(DISTINCT DATE(created_at)) as active_days
      FROM players
    `).first();

    // Giocatori più attivi (per numero di sessioni)
    const mostActive = await env.DB.prepare(`
      SELECT 
        player_name as name,
        COUNT(*) as sessions_played,
        AVG(score) as avg_score,
        MAX(score) as best_score
      FROM game_sessions 
      GROUP BY player_name 
      ORDER BY sessions_played DESC 
      LIMIT 30
    `).all();

    return new Response(
      JSON.stringify({ 
        leaderboard: leaderboard.results || [],
        stats: stats || {},
        mostActive: mostActive.results || []
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Errore nel recuperare la classifica:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Errore nel recuperare i dati',
        leaderboard: [],
        stats: {},
        mostActive: []
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}