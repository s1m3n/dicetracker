import { useMemo } from 'react';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import type { Roll, Player } from '../types/game';

interface DistributionChartProps {
  rolls: Roll[];
  players: Player[];
  selectedPlayerIndex: number | null;
}

interface RollsBySum {
  [sum: number]: Roll[];
}

// Expected probability distribution for 2d6
const EXPECTED_PROBABILITIES: { [sum: number]: number } = {
  2: 1/36,
  3: 2/36,
  4: 3/36,
  5: 4/36,
  6: 5/36,
  7: 6/36,
  8: 5/36,
  9: 4/36,
  10: 3/36,
  11: 2/36,
  12: 1/36,
};

export function DistributionChart({ rolls, players, selectedPlayerIndex }: DistributionChartProps) {
  const rollsBySum = useMemo<RollsBySum>(() => {
    const filtered = selectedPlayerIndex === null
      ? rolls
      : rolls.filter(roll => roll.playerIndex === selectedPlayerIndex);

    const grouped: RollsBySum = {};
    for (let i = 2; i <= 12; i++) {
      grouped[i] = [];
    }

    filtered.forEach(roll => {
      if (roll.sum >= 2 && roll.sum <= 12) {
        grouped[roll.sum].push(roll);
      }
    });

    return grouped;
  }, [rolls, selectedPlayerIndex]);

  const totalRolls = rolls.length;
  const maxCount = Math.max(...Object.values(rollsBySum).map(r => r.length), 1);
  const containerHeight = 400;
  const topMargin = 80; // Large margin at top so bars never reach it
  const maxHeight = containerHeight - topMargin;

  // Reserve space for legend text below bars (sum + count)
  const legendHeight = 50;
  const availableHeightForSegments = maxHeight - legendHeight;

  // Calculate segment height based on the bar with the most rolls
  // Account for borders: each segment has 1px total border (0.5px top + 0.5px bottom)
  const baseSegmentHeight = 20;
  const borderHeightPerSegment = 1;

  // Calculate what the segment height needs to be to fit all segments in available height
  // Formula: maxCount * (segmentHeight + borderHeight) <= availableHeightForSegments
  // Solving for segmentHeight: segmentHeight <= (availableHeightForSegments / maxCount) - borderHeight
  const calculatedSegmentHeight = Math.floor((availableHeightForSegments / maxCount) - borderHeightPerSegment);

  // Use calculated height if we need to shrink, otherwise use base height
  const segmentHeight = calculatedSegmentHeight < baseSegmentHeight
    ? calculatedSegmentHeight
    : baseSegmentHeight;

  const barWidth = `${100 / 11}%`; // Each bar takes exactly 1/11th of total width (11 possible sums: 2-12)

  return (
    <Box p={4} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
      {totalRolls === 0 ? (
        <Box textAlign="center" py={12} color="gray.500">
          <Text fontSize="sm">No rolls yet. Start rolling!</Text>
        </Box>
      ) : (
        <Box position="relative" h={containerHeight + 60} overflow="hidden" w="full">
          <Box
            display="flex"
            alignItems="end"
            h={maxHeight}
            position="absolute"
            bottom="60px"
            left="0"
            right="0"
            overflow="hidden"
            w="full"
          >
            {Object.entries(rollsBySum).map(([sum, sumRolls]) => {
              const sumNumber = parseInt(sum);
              const actualCount = sumRolls.length;
              const expectedCount = Math.round(totalRolls * EXPECTED_PROBABILITIES[sumNumber]);
              const difference = actualCount - expectedCount;
              const sumBorderColor = difference === 0 ? 'gray.300' : difference > 0 ? 'green.700' : 'red.700';

              return (
                <Box
                  key={sum}
                  w={barWidth}
                  h="full"
                  display="flex"
                  flexDirection="column"
                  alignItems="stretch"
                  justifyContent="end"
                  px={0.5}
                >
                  <Box position="relative" flexGrow={1} display="flex" flexDirection="column" justifyContent="end">
                    <VStack gap={0} align="stretch" zIndex={1} overflow="hidden" maxH={availableHeightForSegments}>
                      {sumRolls.map((roll: Roll, idx: number) => (
                        <Box
                          key={`${roll.id}-${idx}`}
                          h={`${segmentHeight}px`}
                          minH={`${segmentHeight}px`}
                          maxH={`${segmentHeight}px`}
                          bg={players[roll.playerIndex]?.color || 'gray.400'}
                          borderWidth="0.5px"
                          borderColor="white"
                          flexShrink={0}
                          _hover={{
                            opacity: 0.8,
                          }}
                        />
                      ))}
                    </VStack>
                  </Box>

                  <Box
                    borderWidth="1px"
                    borderColor={sumBorderColor}
                    borderRadius="sm"
                    mt={2}
                    px={1}
                    py={0.5}
                    alignSelf="center"
                    minW="fit-content"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      textAlign="center"
                      color="gray.700"
                    >
                      {sum}
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    gap={0.5}
                    justifyContent="center"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="sm"
                    minW="fit-content"
                    alignSelf="center"
                    px={1}
                  >
                    <Text
                      fontSize="xs"
                      color="gray.700"
                      fontWeight="semibold"
                    >
                      {actualCount}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      /
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {expectedCount}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
