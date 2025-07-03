import React, { useState, useEffect } from 'react';
import { Trophy, User, Clock, Target, RotateCcw, Star, Globe, TrendingUp, Users } from 'lucide-react';

const KarateQuiz = () => {
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, finished
  const [playerName, setPlayerName] = useState(() => {
    // Recupera il nome salvato da localStorage
    return localStorage.getItem('karateQuizPlayerName') || '';
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameSession, setGameSession] = useState({
    questions: [],
    answers: [],
    startTime: null,
    duration: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  // Database dei termini giapponesi di karate (stesso di prima)
  const karateTerms = [
    { term: "Age", meaning: "Sollevare, levare alto" },
    { term: "Age tsuki", meaning: "Colpo di pugno crescente" },
    { term: "Age empi uchi", meaning: "Colpo di gomito verso l'alto" },
    { term: "Age uke", meaning: "Parata crescente" },
    { term: "Ago", meaning: "Mento" },
    { term: "Ai", meaning: "Armonia" },
    { term: "Aikido", meaning: "Via dell'armonia con l'energia universale" },
    { term: "Arigato", meaning: "Grazie" },
    { term: "Ashi", meaning: "Piede" },
    { term: "Ashi barai", meaning: "Spazzata di piede" },
    { term: "Ashi waza", meaning: "Tecniche di piede" },
    { term: "Ashibo", meaning: "Tibia" },
    { term: "Ashikubi", meaning: "Caviglia" },
    { term: "Atama", meaning: "Testa" },
    { term: "Ate", meaning: "Percossa" },
    { term: "Awase", meaning: "Coordinazione, armonizzazione" },
    { term: "Barai", meaning: "Spazzare, parare spazzando, falciare" },
    { term: "Bassai", meaning: "Penetrare la fortezza" },
    { term: "Bo", meaning: "Bastone di legno lungo circa 180 cm" },
    { term: "Bokken", meaning: "Spada di legno" },
    { term: "Bu", meaning: "Marziale, guerriero" },
    { term: "Budo", meaning: "La Via marziale" },
    { term: "Bunkai", meaning: "Applicazione pratica di un kata" },
    { term: "Bushi", meaning: "Nobile guerriero" },
    { term: "Bushido", meaning: "La Via del guerriero" },
    { term: "Chi", meaning: "Terra" },
    { term: "Chikai", meaning: "Vicino" },
    { term: "Chikara", meaning: "Forza" },
    { term: "Choku tsuki", meaning: "Pugno diritto" },
    { term: "Chu", meaning: "Medio" },
    { term: "Chudan", meaning: "Livello medio" },
    { term: "Chudan geri", meaning: "Calcio a livello medio" },
    { term: "Chudan tsuki", meaning: "Colpo di pugno medio" },
    { term: "Dachi", meaning: "Posizione del corpo" },
    { term: "Dai", meaning: "Grande" },
    { term: "Dan", meaning: "Livello, grado di cintura nera" },
    { term: "Deshi", meaning: "Discepolo, studente" },
    { term: "Do", meaning: "Via, cammino" },
    { term: "Dojo", meaning: "Luogo dove si cerca la via" },
    { term: "Empi", meaning: "Gomito" },
    { term: "Empi uchi", meaning: "Percossa col gomito" },
    { term: "En", meaning: "Lontano" },
    { term: "Ensho", meaning: "Tallone" },
    { term: "Fudo", meaning: "Immobile, immutabile" },
    { term: "Fudo dachi", meaning: "Posizione consolidata" },
    { term: "Fumikiri", meaning: "Calcio tagliente" },
    { term: "Fumikomi", meaning: "Calcio battente" },
    { term: "Geri", meaning: "Calcio" },
    { term: "Gi", meaning: "Uniforme" },
    { term: "Go", meaning: "Cinque, forza" },
    { term: "Gohon kumite", meaning: "Combattimento su cinque attacchi" },
    { term: "Goju ryu", meaning: "Stile di Karate creato da Miyagi Chojun" },
    { term: "Goshin", meaning: "Autodifesa" },
    { term: "Gyaku", meaning: "Opposto, contrario" },
    { term: "Gyaku tsuki", meaning: "Colpo di pugno opposto alla gamba avanzata" },
    { term: "Hachi", meaning: "Otto" },
    { term: "Hachiji dachi", meaning: "Posizione naturale eretta" },
    { term: "Hai", meaning: "Sì" },
    { term: "Haishu", meaning: "Dorso della mano" },
    { term: "Haisoku", meaning: "Collo del piede" },
    { term: "Haito", meaning: "Taglio interno della mano" },
    { term: "Hajime", meaning: "Cominciare, partire" },
    { term: "Hangetsu", meaning: "Mezza luna" },
    { term: "Hanmi", meaning: "Posizione semifrontale" },
    { term: "Hara", meaning: "Ventre, addome" },
    { term: "Harai", meaning: "Spazzare, parare spazzando" },
    { term: "Heian", meaning: "Mente pacifica" },
    { term: "Heiko", meaning: "Parallelo" },
    { term: "Heiko dachi", meaning: "Posizione a piedi paralleli" },
    { term: "Hidari", meaning: "Sinistra" },
    { term: "Hiji", meaning: "Gomito" },
    { term: "Hiki", meaning: "Tirare" },
    { term: "Hikite", meaning: "Richiamo della mano" },
    { term: "Hiraken", meaning: "Pugno con le falangette piegate" },
    { term: "Hitai", meaning: "Fronte" },
    { term: "Hiza", meaning: "Ginocchio" },
    { term: "Hiza geri", meaning: "Colpo di ginocchio" },
    { term: "Hon", meaning: "Fondamentale" },
    { term: "Ichi", meaning: "Uno" },
    { term: "Ikken hissatsu", meaning: "Uccidere con un colpo solo" },
    { term: "Ippon", meaning: "Uno solo, punto pieno" },
    { term: "Ippon kumite", meaning: "Combattimento ad un attacco" },
    { term: "Jiyu kumite", meaning: "Combattimento libero" },
    { term: "Jo", meaning: "Alto, bastone di legno 120-140 cm" },
    { term: "Jodan", meaning: "Livello alto" },
    { term: "Jodan tsuki", meaning: "Colpo di pugno a livello alto" },
    { term: "Ju", meaning: "Dieci, cedevolezza" },
    { term: "Judo", meaning: "Via della cedevolezza" },
    { term: "Juji", meaning: "Incrociare, croce" },
    { term: "Juji uke", meaning: "Parata a croce" },
    { term: "Kagi tsuki", meaning: "Pugno a gancio" },
    { term: "Kakato", meaning: "Tallone" },
    { term: "Kake", meaning: "Aggancio, gancio" },
    { term: "Kakuto", meaning: "Polso piegato a testa di gru" },
    { term: "Kama", meaning: "Piccola falce per tagliare il riso" },
    { term: "Kamae", meaning: "Guardia" },
    { term: "Kami", meaning: "Dei" },
    { term: "Kanku", meaning: "Osservando il cielo" },
    { term: "Kao", meaning: "Faccia, viso" },
    { term: "Kara", meaning: "Vuoto" },
    { term: "Karada", meaning: "Corpo" },
    { term: "Karate", meaning: "Mano vuota" },
    { term: "Karate do", meaning: "La via della mano vuota" },
    { term: "Kata", meaning: "Forma, modello, esercizio di stile" },
    { term: "Katana", meaning: "Spada lunga dei Samurai" },
    { term: "Keage", meaning: "Frustato, di slancio" },
    { term: "Keiko", meaning: "Allenamento" },
    { term: "Kekomi", meaning: "Penetrante, di spinta" },
    { term: "Ken", meaning: "Spada, pugno" },
    { term: "Kendo", meaning: "Via della spada" },
    { term: "Keri", meaning: "Calcio" },
    { term: "Ki", meaning: "Energia universale, energia vitale" },
    { term: "Kiai", meaning: "Unione di energia" },
    { term: "Kiba dachi", meaning: "Posizione del cavaliere" },
    { term: "Kihon", meaning: "Fondamentali" },
    { term: "Kime", meaning: "Massima concentrazione di energia" },
    { term: "Kiri", meaning: "Fendente, tagliente" },
    { term: "Kiru", meaning: "Tagliare, fendere" },
    { term: "Kizami tsuki", meaning: "Pugno frontale improvviso" },
    { term: "Ko", meaning: "Piccolo, dorso del pugno" },
    { term: "Kobudo", meaning: "Antiche arti marziali" },
    { term: "Kobushi", meaning: "Pugno normale" },
    { term: "Kokoro", meaning: "Cuore, spirito, anima" },
    { term: "Kokutsu dachi", meaning: "Posizione di guardia arretrata" },
    { term: "Kosa", meaning: "Croce o incrociare" },
    { term: "Koshi", meaning: "Anca, fianco" },
    { term: "Kote", meaning: "Polso" },
    { term: "Ku", meaning: "Nove, vuoto" },
    { term: "Kubi", meaning: "Collo" },
    { term: "Kumite", meaning: "Combattimento" },
    { term: "Kyu", meaning: "Classe, grado inferiore" },
    { term: "Kyudo", meaning: "La via dell'arco" },
    { term: "Ma", meaning: "Distanza giusta di combattimento" },
    { term: "Mae", meaning: "Frontale, in avanti" },
    { term: "Mae geri", meaning: "Calcio frontale" },
    { term: "Makiwara", meaning: "Bersaglio elastico per allenare" },
    { term: "Mawashi", meaning: "Circolare" },
    { term: "Mawashi geri", meaning: "Calcio circolare" },
    { term: "Me", meaning: "Occhio" },
    { term: "Michi", meaning: "Via, itinerario" },
    { term: "Migi", meaning: "Destra" },
    { term: "Mikazuki geri", meaning: "Calcio a luna crescente" },
    { term: "Mimi", meaning: "Orecchio" },
    { term: "Mokuso", meaning: "Pensare in silenzio" },
    { term: "Morote", meaning: "Due mani" },
    { term: "Mune", meaning: "Torace, petto" },
    { term: "Mushin", meaning: "Mente senza mente" },
    { term: "Musubi dachi", meaning: "Posizione a talloni uniti" },
    { term: "Nagashi", meaning: "Deviare, fluire" },
    { term: "Naginata", meaning: "Alabarda giapponese" },
    { term: "Naore", meaning: "Ritornare in Yoi" },
    { term: "Neko ashi dachi", meaning: "Posizione del gatto" },
    { term: "Ni", meaning: "Due" },
    { term: "Nidan", meaning: "Secondo grado" },
    { term: "Nukite", meaning: "Mano a lancia" },
    { term: "Nunchaku", meaning: "Arma con due bastoni uniti" },
    { term: "O", meaning: "Grande" },
    { term: "Obi", meaning: "Cintura" },
    { term: "Oi tsuki", meaning: "Pugno che prosegue" },
    { term: "Okinawa te", meaning: "Mano di Okinawa" },
    { term: "Osae", meaning: "Pressante" },
    { term: "Otoshi", meaning: "Spingere verso il basso" },
    { term: "Rei", meaning: "Saluto" },
    { term: "Ren", meaning: "Combinare, collegare" },
    { term: "Renoji dachi", meaning: "Posizione a L" },
    { term: "Ryu", meaning: "Stile o scuola" },
    { term: "Sabaki", meaning: "Schivare" },
    { term: "Sai", meaning: "Stiletto in ferro del Kobudo" },
    { term: "Samurai", meaning: "Servitore, sinonimo di bushi" },
    { term: "San", meaning: "Tre" },
    { term: "Sanchin dachi", meaning: "Posizione a clessidra" },
    { term: "Sandan", meaning: "Terzo grado" },
    { term: "Seiken", meaning: "Pugno normale fondamentale" },
    { term: "Seiza", meaning: "Posizione in ginocchio" },
    { term: "Sen", meaning: "Iniziativa" },
    { term: "Sensei", meaning: "Maestro di dojo" },
    { term: "Shi", meaning: "Quattro, morte" },
    { term: "Shiho", meaning: "Nelle quattro direzioni" },
    { term: "Shiko dachi", meaning: "Posizione quadrata, Sumo" },
    { term: "Shin", meaning: "Spirito, cuore, anima" },
    { term: "Shisei", meaning: "Posizione" },
    { term: "Shito ryu", meaning: "Stile creato da Mabuni Kenwa" },
    { term: "Shizen tai", meaning: "Posizione naturale" },
    { term: "Sho", meaning: "Piccolo, primo, palmo" },
    { term: "Shodan", meaning: "Primo grado" },
    { term: "Shomen", meaning: "Di fronte, davanti" },
    { term: "Shotokan", meaning: "Scuola di Shoto" },
    { term: "Shuto", meaning: "Taglio esterno della mano" },
    { term: "Sokutei", meaning: "Pianta del piede" },
    { term: "Sokuto", meaning: "Taglio esterno del piede" },
    { term: "Soto", meaning: "Esterno" },
    { term: "Soto uke", meaning: "Parata dall'esterno verso l'interno" },
    { term: "Suigetsu", meaning: "Plesso solare" },
    { term: "Sukui", meaning: "Cucchiaio" },
    { term: "Sun dome", meaning: "Fermare prima del contatto" },
    { term: "Tai", meaning: "Corpo, attendere" },
    { term: "Tai sabaki", meaning: "Rotazione del corpo" },
    { term: "Tanden", meaning: "Basso addome" },
    { term: "Tatami", meaning: "Materassina" },
    { term: "Tate", meaning: "Verticale" },
    { term: "Te", meaning: "Mano" },
    { term: "Teiji dachi", meaning: "Posizione a T" },
    { term: "Teisho", meaning: "Base del palmo della mano" },
    { term: "Tekki", meaning: "Montando a cavallo" },
    { term: "Tekubi", meaning: "Polso" },
    { term: "Ten", meaning: "Cielo, universo" },
    { term: "Tettsui", meaning: "Pugno a martello" },
    { term: "Tobi", meaning: "Saltare" },
    { term: "Tobi geri", meaning: "Calcio volante" },
    { term: "Tsugi ashi", meaning: "Marcia successiva" },
    { term: "Tsuki", meaning: "Attacco diretto di pugno" },
    { term: "Tsumasaki", meaning: "Punta delle dita del piede" },
    { term: "Tsuri ashi", meaning: "Scivolamento del corpo" },
    { term: "Uchi", meaning: "Percossa, interno" },
    { term: "Uchi uke", meaning: "Parata dall'interno verso l'esterno" },
    { term: "Ude", meaning: "Avambraccio" },
    { term: "Uke", meaning: "Parata, bloccaggio" },
    { term: "Ukemi", meaning: "Caduta" },
    { term: "Ura", meaning: "Nascosto, rovescio" },
    { term: "Uraken", meaning: "Dorso della mano" },
    { term: "Ushiro", meaning: "Indietro" },
    { term: "Ushiro geri", meaning: "Calcio all'indietro" },
    { term: "Wado ryu", meaning: "Scuola della via della pace" },
    { term: "Waza", meaning: "Tecnica" },
    { term: "Wazari", meaning: "Mezzo punto" },
    { term: "Yame", meaning: "Arrestarsi, fermarsi" },
    { term: "Yoi", meaning: "Pronti, attenzione" },
    { term: "Yoko", meaning: "Laterale" },
    { term: "Yoko geri", meaning: "Calcio laterale" },
    { term: "Zazen", meaning: "Meditare in posizione Seiza" },
    { term: "Zen", meaning: "Corrente contemplativa del buddismo" },
    { term: "Zenkutsu dachi", meaning: "Posizione frontale" },
    { term: "Zuki", meaning: "Colpo diretto di pugno" }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(null);
    }
  }, [timeLeft, gameState, showResult]);

  // Carica la classifica globale all'avvio
  useEffect(() => {
    fetchLeaderboard();
    if (playerName) {
      fetchPlayerStats(playerName);
    }
  }, []);

  // Fetch player stats when name changes
  useEffect(() => {
    if (playerName && playerName.trim()) {
      fetchPlayerStats(playerName);
    }
  }, [playerName]);

  // API calls
  const fetchPlayerStats = async (name) => {
    try {
      const response = await fetch(`/api/player-stats?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      if (data.exists) {
        setPlayerStats(data.player);
      } else {
        setPlayerStats(null);
      }
    } catch (error) {
      console.error('Errore nel recuperare le statistiche del giocatore:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setGlobalStats(data.stats || null);
    } catch (error) {
      console.error('Errore nel caricare la classifica:', error);
      setLeaderboard([]);
    }
  };

  const saveScore = async () => {
    setIsLoading(true);
    try {
      const avgTime = gameSession.duration > 0 ? gameSession.duration / 15 : 0;
      
      const response = await fetch('/api/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName,
          score,
          questionsAnswered: 15,
          correctAnswers,
          avgTimePerQuestion: avgTime,
          maxStreak,
          gameSession: {
            questions: gameSession.questions,
            answers: gameSession.answers,
            duration: gameSession.duration
          }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setLeaderboard(result.leaderboard || []);
        
        // Ricarica le statistiche del giocatore
        fetchPlayerStats(playerName);
      }
    } catch (error) {
      console.error('Errore nel salvare il punteggio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random wrong answers
  const getWrongAnswers = (correctAnswer, count = 3) => {
    const wrongAnswers = karateTerms
      .filter(term => term.meaning !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(term => term.meaning);
    return wrongAnswers;
  };

  // Generate quiz questions
  const generateQuestions = () => {
    const shuffledTerms = [...karateTerms].sort(() => Math.random() - 0.5);
    const quizQuestions = shuffledTerms.slice(0, 15).map(term => {
      const wrongAnswers = getWrongAnswers(term.meaning);
      const allAnswers = [term.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        term: term.term,
        correctAnswer: term.meaning,
        options: allAnswers
      };
    });
    setQuestions(quizQuestions);
    setGameSession({
      questions: quizQuestions,
      answers: [],
      startTime: Date.now(),
      duration: 0
    });
  };

  const startGame = () => {
    if (playerName.trim()) {
      // Salva il nome in localStorage
      localStorage.setItem('karateQuizPlayerName', playerName.trim());
      generateQuestions();
      setGameState('playing');
      setCurrentQuestion(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectAnswers(0);
      setTimeLeft(15);
    }
  };

  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    setShowResult(true);
    
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    
    // Registra la risposta
    const answerData = {
      question: questions[currentQuestion],
      selectedAnswer: selectedOption,
      isCorrect,
      timeSpent: 15 - timeLeft,
      timestamp: Date.now()
    };
    
    setGameSession(prev => ({
      ...prev,
      answers: [...prev.answers, answerData],
      duration: Date.now() - prev.startTime
    }));
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const streakBonus = streak >= 3 ? streak * 2 : 0;
      const totalPoints = 10 + timeBonus + streakBonus;
      setScore(score + totalPoints);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < 14) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = async () => {
    setGameState('finished');
    await saveScore();
  };

  const resetGame = () => {
    setGameState('welcome');
    setPlayerName('');
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
    setGameSession({
      questions: [],
      answers: [],
      startTime: null,
      duration: 0
    });
  };

  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-onami-light">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInUp">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-onami-gradient rounded-full flex items-center justify-center shadow-lg hover-lift">
                <span className="text-white font-bold text-2xl japanese-wave animate-wave">波</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-800">O-Nami Karate Quiz</h1>
                <p className="text-blue-600 font-medium">Firenze</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl text-blue-700 mb-2 font-semibold">どれくらい知っているか見てみましょう</h2>
            <p className="text-blue-600 italic text-lg">Ma quanto ne sai?!</p>
          </div>

          {/* Welcome Card */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 hover-lift">
            <div className="text-center mb-6">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse-gentle" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Benvenuto al Quiz!</h3>
              <p className="text-gray-600">
                Metti alla prova la tua conoscenza dei termini giapponesi del karate
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Il tuo nome:
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Inserisci il tuo nome"
                    maxLength={20}
                  />
                  {playerStats && (
                    <div className="text-xs text-gray-600">
                      Bentornato! Hai giocato {playerStats.games_played} {playerStats.games_played === 1 ? 'partita' : 'partite'}
                    </div>
                  )}
                </div>
              </div>
              
              {playerStats && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-medium">
                    Il tuo miglior punteggio: <span className="font-bold">{playerStats.score}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {playerStats.correct_answers}/{playerStats.questions_answered} risposte corrette totali • 
                    Serie max: {playerStats.streak_max} • 
                    Partite giocate: {playerStats.games_played}
                  </p>
                </div>
              )}
              
              <button
                onClick={startGame}
                disabled={!playerName.trim()}
                className="w-full bg-onami-gradient text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                {playerStats ? 'Riprova' : 'Inizia Quiz'}
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
              <p>📚 15 domande casuali</p>
              <p>⏱️ 15 secondi per risposta</p>
              <p>🏆 Punteggi bonus per velocità e serie</p>
              <p>🌐 Classifica globale O-Nami</p>
            </div>
          </div>

          {/* Global Stats */}
          {globalStats && (
            <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Statistiche O-Nami
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{globalStats.total_players || 0}</div>
                  <div className="text-xs text-gray-600">Karateka</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{Math.round(globalStats.avg_score) || 0}</div>
                  <div className="text-xs text-gray-600">Punteggio Medio</div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Preview */}
          {leaderboard.length > 0 && (
            <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Classifica Globale
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 30).map((player, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">{player.name}</span>
                    </div>
                    <span className="font-bold text-blue-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentQ = questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-onami-light">
        <div className="container mx-auto px-4 py-8">
          {/* Game Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">{playerName}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-800">{score}</span>
                </div>
                {streak >= 3 && (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse-gentle">
                    🔥 {streak} di fila!
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Domanda {currentQuestion + 1} di 15
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
              <div 
                className="bg-onami-gradient h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-sm text-gray-600 mb-4">Cosa significa questo termine?</h2>
              <div className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 font-mono japanese-wave">
                {currentQ?.term}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ?.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 font-medium ";
                
                if (showResult) {
                  if (option === currentQ.correctAnswer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800 shadow-lg transform scale-105";
                  } else if (option === selectedAnswer && option !== currentQ.correctAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer hover-lift";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-6 p-4 rounded-xl text-center">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <div className="text-green-700">
                    <div className="text-3xl mb-2">🎉 Corretto!</div>
                    {timeLeft > 10 && <p className="text-sm">Bonus velocità: +{Math.floor(timeLeft / 3)} punti</p>}
                    {streak >= 3 && <p className="text-sm">Bonus serie: +{streak * 2} punti</p>}
                  </div>
                ) : (
                  <div className="text-red-700">
                    <div className="text-3xl mb-2">❌ Sbagliato!</div>
                    <p className="text-sm">La risposta corretta era: <strong>{currentQ.correctAnswer}</strong></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const playerRank = leaderboard.findIndex(p => p.name === playerName && p.score === score) + 1;
    const accuracy = Math.round((correctAnswers / 15) * 100);
    
    return (
      <div className="min-h-screen bg-onami-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            {isLoading && (
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Salvando il punteggio...</p>
              </div>
            )}
            
            <div className="mb-6">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-pulse-gentle" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completato!</h2>
              <p className="text-xl text-blue-600">Complimenti {playerName}!</p>
            </div>

            <div className="bg-onami-light rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-blue-800 mb-2">{score}</div>
              <div className="text-lg text-gray-600 mb-2">punti totali</div>
              {playerRank > 0 && (
                <div className="text-gray-600">
                  Posizione in classifica: <span className="font-bold text-blue-600">#{playerRank}</span>
                </div>
              )}
              {playerStats && playerStats.score < score && (
                <div className="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold animate-pulse-gentle">
                  🎉 Nuovo record personale! (+{score - playerStats.score} punti)
                </div>
              )}
              {playerStats && playerStats.score >= score && (
                <div className="mt-3 text-gray-600 text-sm">
                  Il tuo record personale: {playerStats.score} punti
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Le tue statistiche
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Risposte corrette:</span>
                    <span className="font-semibold text-green-600">{correctAnswers}/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precisione:</span>
                    <span className="font-semibold">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Serie massima:</span>
                    <span className="font-semibold text-orange-600">{maxStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo medio:</span>
                    <span className="font-semibold">{Math.round(gameSession.duration / 15000)}s</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top 5 O-Nami
                </h3>
                <div className="space-y-2">
                  {leaderboard.slice(0, 30).map((player, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-2 rounded-lg ${
                        player.name === playerName && player.score === score 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <span className="font-bold text-blue-600">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={resetGame}
                className="bg-onami-gradient text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Gioca Ancora
              </button>
              
              <button
                onClick={fetchLeaderboard}
                className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Aggiorna Classifica
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-onami-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold japanese-wave">波</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-800">O-Nami Karate Firenze</p>
                  <p className="text-sm text-blue-600">"Grandi Onde"</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Continua ad allenarti con noi!
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>📧 onamikaratefirenze@gmail.com</p>
                <p>📞 +39 371 315 7112</p>
                <div className="flex justify-center gap-4 mt-2">
                  <span>🏢 Campo di Marte • Coverciano • Mannelli</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KarateQuiz;