import { useState } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from './hooks/useAuth';
import { useGames, useGame, createGame, addRoll, advanceTurn, endGame } from './hooks/useGame';
import { LoginPage } from './components/LoginPage';
import { BlockedPage } from './components/BlockedPage';
import { GameHistory } from './components/GameHistory';
import { GameSetup } from './components/GameSetup';
import { GameScreen } from './components/GameScreen';
import type { Player } from './types/game';
import './App.css';

type AppView = 'history' | 'setup' | 'game';

function App() {
  const { user, userData, loading: authLoading, signIn, signOutUser } = useAuth();
  const [view, setView] = useState<AppView>('history');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const { games, loading: gamesLoading } = useGames(user?.uid || null);
  const { game, rolls, loading: gameLoading } = useGame(selectedGameId);

  if (authLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} />;
  }

  if (userData?.blockedUser) {
    return <BlockedPage onSignOut={signOutUser} />;
  }

  const handleStartNewGame = () => {
    setView('setup');
  };

  const handleCreateGame = async (players: Player[]) => {
    if (!user) return;

    try {
      const gameId = await createGame(players, user.uid);
      setSelectedGameId(gameId);
      setView('game');
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setView('game');
  };

  const handleRoll = async (die1: number, die2: number) => {
    if (!selectedGameId || !game) return;

    try {
      await addRoll(selectedGameId, game.currentPlayerIndex, die1, die2);
      await advanceTurn(selectedGameId, game.currentPlayerIndex, game.players.length);
    } catch (error) {
      console.error('Error rolling dice:', error);
    }
  };

  const handleEndGame = async () => {
    if (!selectedGameId) return;

    try {
      await endGame(selectedGameId);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleBackToHome = () => {
    setSelectedGameId(null);
    setView('history');
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {view === 'history' && (
        <>
          <Box
            position="sticky"
            top="0"
            zIndex="10"
            bg="white"
            borderBottomWidth="1px"
            borderColor="gray.200"
            boxShadow="sm"
            px={4}
            py={3}
          >
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Dice Tracker
              </Text>
              <Button
                onClick={signOutUser}
                size="sm"
                variant="ghost"
              >
                <FiLogOut />
              </Button>
            </HStack>
          </Box>
          <GameHistory
            games={games}
            onSelectGame={handleSelectGame}
            onNewGame={handleStartNewGame}
            loading={gamesLoading}
          />
        </>
      )}

      {view === 'setup' && (
        <>
          <Box
            position="sticky"
            top="0"
            zIndex="10"
            bg="white"
            borderBottomWidth="1px"
            borderColor="gray.200"
            boxShadow="sm"
            px={4}
            py={3}
          >
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Setup Game
              </Text>
              <Button
                onClick={signOutUser}
                size="sm"
                variant="ghost"
              >
                <FiLogOut />
              </Button>
            </HStack>
          </Box>
          <GameSetup onStartGame={handleCreateGame} />
        </>
      )}

      {view === 'game' && game && (
        <GameScreen
          game={game}
          rolls={rolls}
          onRoll={handleRoll}
          onEndGame={handleEndGame}
          onBackToHome={handleBackToHome}
          onSignOut={signOutUser}
          loading={gameLoading}
        />
      )}
    </Box>
  );
}

export default App;
