export async function onRequestGet(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const playerName = url.searchParams.get('name');
    
    if (!playerName) {
      return new Response(
        JSON.stringify({ error: 'Nome giocatore richiesto' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Recupera le statistiche del giocatore
    const player = await env.DB.prepare(
      'SELECT * FROM players WHERE name = ?'
    ).bind(playerName).first();

    if (!player) {
      return new Response(
        JSON.stringify({ exists: false }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Conta il numero di partite giocate
    const gamesCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM game_sessions WHERE player_name = ?'
    ).bind(playerName).first();

    // Recupera l'ultima partita
    const lastGame = await env.DB.prepare(
      'SELECT created_at FROM game_sessions WHERE player_name = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(playerName).first();

    return new Response(
      JSON.stringify({ 
        exists: true,
        player: {
          ...player,
          games_played: gamesCount?.count || 0,
          last_played: lastGame?.created_at || null
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Errore nel recuperare le statistiche:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}