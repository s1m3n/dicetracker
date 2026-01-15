import { useState } from 'react';
import { Box, VStack, HStack, Spinner, Text, IconButton } from '@chakra-ui/react';
import { FiHome, FiCheck, FiLogOut } from 'react-icons/fi';
import type { Game, Roll } from '../types/game';
import { DiceRoller } from './DiceRoller';
import { DistributionChart } from './DistributionChart';
import { PlayerList } from './PlayerList';

interface GameScreenProps {
  game: Game;
  rolls: Roll[];
  onRoll: (die1: number, die2: number) => Promise<void>;
  onEndGame: () => Promise<void>;
  onBackToHome: () => void;
  onSignOut: () => void;
  loading?: boolean;
}

export function GameScreen({
  game,
  rolls,
  onRoll,
  onEndGame,
  onBackToHome,
  onSignOut,
  loading = false,
}: GameScreenProps) {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const currentPlayer = game.players[game.currentPlayerIndex];

  const handleEndGame = async () => {
    setIsEnding(true);
    try {
      await onEndGame();
    } finally {
      setIsEnding(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">Loading game...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" pb={4}>
      {/* Mobile Navigation Bar */}
      <Box
        position="sticky"
        top="0"
        zIndex="10"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <HStack justify="space-between" px={4} py={3}>
          <HStack gap={2}>
            <Box
              w="2"
              h="2"
              borderRadius="full"
              bg={game.status === 'active' ? 'green.500' : 'gray.400'}
            />
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              {game.status === 'active' ? 'In Progress' : 'Completed'}
            </Text>
          </HStack>
          <HStack gap={1}>
            <IconButton
              aria-label="Home"
              onClick={onBackToHome}
              size="sm"
              variant="ghost"
            >
              <FiHome />
            </IconButton>
            {game.status === 'active' && (
              <IconButton
                aria-label="End game"
                onClick={handleEndGame}
                disabled={isEnding}
                size="sm"
                variant="ghost"
                colorPalette="green"
              >
                <FiCheck />
              </IconButton>
            )}
            <IconButton
              aria-label="Sign out"
              onClick={onSignOut}
              size="sm"
              variant="ghost"
            >
              <FiLogOut />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      {/* Main content */}
      <VStack gap={4} align="stretch" p={4}>
        {game.status === 'active' && (
          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            textAlign="center"
          >
            <DiceRoller
              onRoll={onRoll}
              currentPlayerName={currentPlayer.name}
              currentPlayerColor={currentPlayer.color}
              disabled={game.status !== 'active'}
            />
          </Box>
        )}

        <DistributionChart
          rolls={rolls}
          players={game.players}
          selectedPlayerIndex={selectedPlayerIndex}
        />

        <PlayerList
          players={game.players}
          currentPlayerIndex={game.currentPlayerIndex}
          selectedPlayerIndex={selectedPlayerIndex}
          rolls={rolls}
          onPlayerClick={setSelectedPlayerIndex}
        />
      </VStack>
    </Box>
  );
}
