export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await request.json();
    const { 
      playerName, 
      score, 
      questionsAnswered, 
      correctAnswers, 
      avgTimePerQuestion, 
      maxStreak,
      gameSession 
    } = data;

    // Validazione input
    if (!playerName || score === undefined) {
      return new Response(
        JSON.stringify({ error: 'Nome giocatore e punteggio sono obbligatori' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Inserisci o aggiorna il giocatore
    const existingPlayer = await env.DB.prepare(
      'SELECT * FROM players WHERE name = ?'
    ).bind(playerName).first();

    if (existingPlayer) {
      // Aggiorna se il nuovo punteggio è migliore
      if (score > existingPlayer.score) {
        await env.DB.prepare(`
          UPDATE players 
          SET score = ?, 
              questions_answered = questions_answered + ?,
              correct_answers = correct_answers + ?,
              avg_time_per_question = ?,
              streak_max = MAX(streak_max, ?),
              created_at = CURRENT_TIMESTAMP
          WHERE name = ?
        `).bind(
          score, 
          questionsAnswered || 15, 
          correctAnswers || 0,
          avgTimePerQuestion || 0,
          maxStreak || 0,
          playerName
        ).run();
      }
    } else {
      // Inserisci nuovo giocatore
      await env.DB.prepare(`
        INSERT INTO players (name, score, questions_answered, correct_answers, avg_time_per_question, streak_max)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        playerName, 
        score, 
        questionsAnswered || 15, 
        correctAnswers || 0,
        avgTimePerQuestion || 0,
        maxStreak || 0
      ).run();
    }

    // Salva la sessione di gioco
    if (gameSession) {
      await env.DB.prepare(`
        INSERT INTO game_sessions (player_name, score, questions, answers, duration)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        playerName,
        score,
        JSON.stringify(gameSession.questions || []),
        JSON.stringify(gameSession.answers || []),
        gameSession.duration || 0
      ).run();
    }

    // Ottieni la classifica aggiornata
    const leaderboard = await env.DB.prepare(
      'SELECT name, score, created_at FROM players ORDER BY score DESC LIMIT 10'
    ).all();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Punteggio salvato!',
        leaderboard: leaderboard.results 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Errore nel salvare il punteggio:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}