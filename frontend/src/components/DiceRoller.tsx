import { useState } from 'react';
import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';

interface DiceRollerProps {
  onRoll: (die1: number, die2: number) => void;
  currentPlayerName?: string;
  currentPlayerColor?: string;
  disabled?: boolean;
}

interface DiceProps {
  value: number;
  isRolling: boolean;
}

function Dice({ value, isRolling }: DiceProps) {
  const getDotPositions = (val: number): [number, number][] => {
    const positions: Record<number, [number, number][]> = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
    };
    return positions[val] || [];
  };

  return (
    <Box
      w="80px"
      h="80px"
      bg="white"
      borderRadius="lg"
      borderWidth="2px"
      borderColor="gray.300"
      position="relative"
      boxShadow="lg"
      animation={isRolling ? 'spin 0.5s ease-in-out' : undefined}
      css={{
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      {getDotPositions(value).map(([x, y], index) => (
        <Box
          key={index}
          position="absolute"
          w="12px"
          h="12px"
          bg="gray.800"
          borderRadius="full"
          left={`${x}%`}
          top={`${y}%`}
          transform="translate(-50%, -50%)"
        />
      ))}
    </Box>
  );
}

export function DiceRoller({ onRoll, currentPlayerName, currentPlayerColor, disabled }: DiceRollerProps) {
  const [die1, setDie1] = useState<number>(1);
  const [die2, setDie2] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const handleRoll = async () => {
    if (disabled || isRolling) return;

    setIsRolling(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const newDie1 = Math.floor(Math.random() * 6) + 1;
    const newDie2 = Math.floor(Math.random() * 6) + 1;

    setDie1(newDie1);
    setDie2(newDie2);
    setIsRolling(false);

    onRoll(newDie1, newDie2);
  };

  return (
    <VStack gap={4}>
      <HStack gap={4}>
        <Dice value={die1} isRolling={isRolling} />
        <Dice value={die2} isRolling={isRolling} />
      </HStack>

      <Button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        colorPalette="blue"
        size="lg"
        w="full"
        maxW="300px"
      >
        <Box
          w="5"
          h="5"
          borderRadius="full"
          bg={currentPlayerColor}
          border="2px solid"
          borderColor="white"
          boxShadow="0 0 0 1px rgba(0,0,0,0.1)"
        />
        <FiRefreshCw />
        {isRolling ? 'Rolling...' : `Roll Dice ${currentPlayerName || ''}`}
      </Button>
    </VStack>
  );
}
