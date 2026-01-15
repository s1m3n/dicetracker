export const translations = {
  en: {
    // LoginPage
    appTitle: 'Dice Tracker for Cry Babies',
    signInPrompt: 'Sign in with your Google account to continue',
    signInWithGoogle: 'Sign in with Google',
    signingIn: 'Signing in...',
    signInError: 'Failed to sign in. Please try again.',

    // BlockedPage
    accessBlocked: 'Access Blocked',
    accessBlockedMessage: 'Your account has been blocked from accessing this application. Please contact the administrator if you believe this is an error.',
    signOut: 'Sign Out',

    // GameSetup
    enterPlayerNames: 'Enter player names and set order',
    playerPlaceholder: 'Player',
    addPlayer: 'Add Player',
    allPlayerNamesMustBeFilled: 'All player names must be filled in',
    playerNamesMustBeUnique: 'Player names must be unique',
    startInCurrentOrder: 'Start in Current Order',
    randomOrder: 'Random Order',
    playerStarts: 'starts!',
    playersRandomlyOrdered: 'Players have been randomly ordered',

    // GameHistory
    newGame: 'New Game',
    noGamesYet: 'No games yet',
    tapNewGameToStart: 'Tap "New Game" above to start',
    loadingGames: 'Loading games...',
    active: 'Active',
    completed: 'Completed',
    player: 'player',
    players: 'players',
    view: 'View',
    justNow: 'Just now',
    minuteAgo: 'minute',
    minutesAgo: 'minutes',
    hourAgo: 'hour',
    hoursAgo: 'hours',
    dayAgo: 'day',
    daysAgo: 'days',
    ago: 'ago',

    // GameScreen
    inProgress: 'In Progress',
    home: 'Home',
    endGame: 'End game',
    loadingGame: 'Loading game...',

    // DiceRoller
    rollDice: 'Roll Dice',
    rolling: 'Rolling...',

    // PlayerList
    filterByPlayer: 'Filter by Player (click to filter)',

    // App
    setupGame: 'Setup Game',
    diceTracker: 'Dice Tracker',
  },
  es: {
    // LoginPage
    appTitle: 'Dados y llorones',
    signInPrompt: 'Inicia sesión con tu cuenta de Google para continuar',
    signInWithGoogle: 'Iniciar sesión con Google',
    signingIn: 'Iniciando sesión...',
    signInError: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.',

    // BlockedPage
    accessBlocked: 'Acceso Bloqueado',
    accessBlockedMessage: 'Tu cuenta ha sido bloqueada para acceder a esta aplicación. Por favor, contacta al administrador si crees que esto es un error.',
    signOut: 'Cerrar Sesión',

    // GameSetup
    enterPlayerNames: 'Pon los nombres y establece el orden',
    playerPlaceholder: 'Jugador',
    addPlayer: 'Agregar Jugador',
    allPlayerNamesMustBeFilled: 'Todos los nombres de jugadores deben estar completos',
    playerNamesMustBeUnique: 'Los nombres de jugadores deben ser únicos',
    startInCurrentOrder: 'Comenzar en Orden Actual',
    randomOrder: 'Orden Aleatorio',
    playerStarts: 'comienza!',
    playersRandomlyOrdered: 'Los jugadores han sido ordenados aleatoriamente',

    // GameHistory
    newGame: 'Nueva Partida',
    noGamesYet: 'Aún no hay partidas',
    tapNewGameToStart: 'Toca "Nueva Partida" arriba para comenzar',
    loadingGames: 'Cargando partidas...',
    active: 'Activo',
    completed: 'Terminado',
    player: 'jugador',
    players: 'jugadores',
    view: 'Ver',
    justNow: 'Justo ahora',
    minuteAgo: 'minuto',
    minutesAgo: 'minutos',
    hourAgo: 'hora',
    hoursAgo: 'horas',
    dayAgo: 'día',
    daysAgo: 'días',
    ago: 'hace',

    // GameScreen
    inProgress: 'En Progreso',
    home: 'Inicio',
    endGame: 'Terminar partida',
    loadingGame: 'Cargando partida...',

    // DiceRoller
    rollDice: 'Tirar Dados',
    rolling: 'Tirando...',

    // PlayerList
    filterByPlayer: 'Filtrar por Jugador (clic para filtrar)',

    // App
    setupGame: 'Configurar Juego',
    diceTracker: 'Rastreador de Dados',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;
export type Locale = keyof typeof translations;
