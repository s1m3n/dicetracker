import { useState } from 'react';
import { Box, Button, Input, VStack, HStack, IconButton, Text } from '@chakra-ui/react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import type { Player } from '../types/game';
import { PLAYER_COLORS } from '../types/game';

interface GameSetupProps {
  onStartGame: (players: Player[]) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [error, setError] = useState<string>('');

  const handleAddPlayer = () => {
    if (playerNames.length < PLAYER_COLORS.length) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    setError('');
  };

  const handleStartGame = () => {
    const trimmedNames = playerNames.map(name => name.trim());

    if (trimmedNames.some(name => name === '')) {
      setError('All player names must be filled in');
      return;
    }

    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      setError('Player names must be unique');
      return;
    }

    const players: Player[] = trimmedNames.map((name, index) => ({
      name,
      color: PLAYER_COLORS[index],
    }));

    onStartGame(players);
  };

  return (
    <Box p={4}>
      <VStack gap={4} align="stretch">
        <Box textAlign="center">
          <Text fontSize="md" color="gray.600">Enter player names to start</Text>
        </Box>

        <VStack gap={3} align="stretch">
          {playerNames.map((name, index) => (
            <HStack key={index} gap={3}>
              <Box
                w="4"
                h="4"
                borderRadius="full"
                bg={PLAYER_COLORS[index]}
                flexShrink={0}
              />
              <Input
                placeholder={`Player ${index + 1}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.currentTarget.value)}
                size="lg"
                bg="white"
                color="gray.900"
              />
              <IconButton
                aria-label="Remove player"
                onClick={() => handleRemovePlayer(index)}
                disabled={playerNames.length <= 2}
                variant="ghost"
                colorScheme="red"
              >
                <FiTrash2 />
              </IconButton>
            </HStack>
          ))}
        </VStack>

        {playerNames.length < PLAYER_COLORS.length && (
          <Button
            onClick={handleAddPlayer}
            variant="outline"
          >
            <FiPlus />
            Add Player
          </Button>
        )}

        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}

        <Button
          onClick={handleStartGame}
          colorPalette="blue"
          size="lg"
          mt={4}
        >
          Start Game
        </Button>
      </VStack>
    </Box>
  );
}
