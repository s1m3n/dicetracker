import { Box, VStack, HStack, Text, Button, Spinner, Badge } from '@chakra-ui/react';
import { FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';
import type { Game } from '../types/game';

interface GameHistoryProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onNewGame: () => void;
  loading?: boolean;
}

export function GameHistory({ games, onSelectGame, onNewGame, loading = false }: GameHistoryProps) {
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box maxW="800px" mx="auto" p={8} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">Loading games...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack gap={4} align="stretch">
        <Button
          onClick={onNewGame}
          colorPalette="blue"
          size="lg"
          w="full"
        >
          New Game
        </Button>

        {games.length === 0 ? (
          <Box
            p={8}
            textAlign="center"
            borderRadius="lg"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="gray.300"
          >
            <Text fontSize="md" color="gray.500" mb={2}>
              No games yet
            </Text>
            <Text fontSize="sm" color="gray.400">
              Tap "New Game" above to start
            </Text>
          </Box>
        ) : (
          <VStack gap={3} align="stretch">
            {games.map((game) => (
              <Box
                key={game.id}
                p={5}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                bg="white"
                cursor="pointer"
                onClick={() => onSelectGame(game.id)}
                transition="all 0.2s"
                _hover={{
                  borderColor: 'blue.400',
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={2} flex="1">
                    <HStack gap={2}>
                      <Badge
                        colorPalette={game.status === 'active' ? 'green' : 'gray'}
                        size="sm"
                      >
                        {game.status === 'active' ? 'Active' : 'Completed'}
                      </Badge>
                      <HStack gap={1} color="gray.600" fontSize="sm">
                        <FiClock />
                        <Text>{formatDate(game.createdAt)}</Text>
                      </HStack>
                    </HStack>

                    <HStack gap={3} mt={1}>
                      <HStack gap={1} color="gray.700">
                        <FiUsers />
                        <Text fontSize="sm" fontWeight="medium">
                          {game.players.length} player{game.players.length > 1 ? 's' : ''}
                        </Text>
                      </HStack>
                    </HStack>

                    <HStack gap={2} mt={1}>
                      {game.players.map((player, idx) => (
                        <HStack key={idx} gap={2}>
                          <Box
                            w="3"
                            h="3"
                            borderRadius="full"
                            bg={player.color}
                          />
                          <Text fontSize="sm" color="gray.700">
                            {player.name}
                          </Text>
                        </HStack>
                      ))}
                    </HStack>
                  </VStack>

                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <FiTrendingUp />
                    View
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
