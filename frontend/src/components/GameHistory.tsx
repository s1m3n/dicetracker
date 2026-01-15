import { Box, VStack, HStack, Text, Button, Spinner, Badge } from '@chakra-ui/react';
import { FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';
import type { Game } from '../types/game';
import { useLocale } from '../hooks/useLocale';

interface GameHistoryProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onNewGame: () => void;
  loading?: boolean;
}

export function GameHistory({ games, onSelectGame, onNewGame, loading = false }: GameHistoryProps) {
  const { t, locale } = useLocale();

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) {
      const unit = diffMins === 1 ? t('minuteAgo') : t('minutesAgo');
      return locale === 'es' ? `${t('ago')} ${diffMins} ${unit}` : `${diffMins} ${unit} ${t('ago')}`;
    }
    if (diffHours < 24) {
      const unit = diffHours === 1 ? t('hourAgo') : t('hoursAgo');
      return locale === 'es' ? `${t('ago')} ${diffHours} ${unit}` : `${diffHours} ${unit} ${t('ago')}`;
    }
    if (diffDays < 7) {
      const unit = diffDays === 1 ? t('dayAgo') : t('daysAgo');
      return locale === 'es' ? `${t('ago')} ${diffDays} ${unit}` : `${diffDays} ${unit} ${t('ago')}`;
    }

    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box maxW="800px" mx="auto" p={8} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">{t('loadingGames')}</Text>
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
          {t('newGame')}
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
              {t('noGamesYet')}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {t('tapNewGameToStart')}
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
                <VStack align="stretch" gap={3} w="full">
                  <HStack justify="space-between" align="start">
                    <HStack gap={2} flexWrap="wrap">
                      <Badge
                        colorPalette={game.status === 'active' ? 'green' : 'gray'}
                        size="sm"
                      >
                        {game.status === 'active' ? t('active') : t('completed')}
                      </Badge>
                      <HStack gap={1} color="gray.600" fontSize="sm">
                        <FiClock />
                        <Text>{formatDate(game.createdAt)}</Text>
                      </HStack>
                    </HStack>

                    <Button
                      size="sm"
                      variant="outline"
                      flexShrink={0}
                    >
                      <FiTrendingUp />
                      {t('view')}
                    </Button>
                  </HStack>

                  <HStack gap={3}>
                    <HStack gap={1} color="gray.700">
                      <FiUsers />
                      <Text fontSize="sm" fontWeight="medium">
                        {game.players.length} {game.players.length === 1 ? t('player') : t('players')}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack gap={2} flexWrap="wrap">
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
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
