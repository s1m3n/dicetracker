import { Box, HStack, Text } from '@chakra-ui/react';
import type { Player, Roll } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex?: number;
  selectedPlayerIndex: number | null;
  rolls: Roll[];
  onPlayerClick: (index: number | null) => void;
}

export function PlayerList({
  players,
  selectedPlayerIndex,
  rolls,
  onPlayerClick,
}: PlayerListProps) {
  const getPlayerRollCount = (playerIndex: number): number => {
    return rolls.filter(roll => roll.playerIndex === playerIndex).length;
  };

  const handlePlayerClick = (index: number) => {
    if (selectedPlayerIndex === index) {
      onPlayerClick(null);
    } else {
      onPlayerClick(index);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
      <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
        Filter by Player (click to filter)
      </Text>
      <HStack gap={2} flexWrap="wrap">
        {players.map((player, index) => {
          const rollCount = getPlayerRollCount(index);
          const isSelected = selectedPlayerIndex === index;

          return (
            <Box
              key={index}
              px={3}
              py={2}
              borderRadius="md"
              borderWidth="2px"
              borderColor={isSelected ? player.color : 'gray.200'}
              bg={isSelected ? `${player.color}15` : 'white'}
              cursor="pointer"
              onClick={() => handlePlayerClick(index)}
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                borderColor: player.color,
                boxShadow: 'sm',
              }}
            >
              <HStack gap={2}>
                <Box
                  w="3"
                  h="3"
                  borderRadius="full"
                  bg={player.color}
                  flexShrink={0}
                />
                <Text fontWeight="medium" fontSize="sm" color="gray.900">
                  {player.name}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  ({rollCount})
                </Text>
              </HStack>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
}
