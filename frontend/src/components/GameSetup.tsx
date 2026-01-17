import { useState } from 'react';
import { Box, Button, Input, VStack, HStack, IconButton, Text, ColorPicker, Portal, parseColor, Flex } from '@chakra-ui/react';
import { FiTrash2, FiPlus, FiChevronUp, FiChevronDown, FiShuffle } from 'react-icons/fi';
import type { Player } from '../types/game';
import { PLAYER_COLORS } from '../types/game';
import { toaster } from './ui/toaster';
import { useLocale } from '../hooks/useLocale';
import { usePlayerNames, normalizePlayerName } from '../hooks/usePlayerNames';

interface GameSetupProps {
  onStartGame: (players: Player[]) => Promise<void>;
  userId: string;
}

export function GameSetup({ onStartGame, userId }: GameSetupProps) {
  const { t } = useLocale();
  const { playerNames: rememberedNames } = usePlayerNames(userId);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [playerColors, setPlayerColors] = useState<string[]>(PLAYER_COLORS.slice(0, 2));
  const [error, setError] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);

  const handleAddPlayer = () => {
    if (playerNames.length < PLAYER_COLORS.length) {
      setPlayerNames([...playerNames, '']);
      setPlayerColors([...playerColors, PLAYER_COLORS[playerNames.length]]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
      setPlayerColors(playerColors.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    setError('');
  };

  const handleQuickAddPlayer = (displayName: string) => {
    const normalizedNewName = normalizePlayerName(displayName);
    const existingNormalized = playerNames.map(normalizePlayerName);

    if (existingNormalized.includes(normalizedNewName)) {
      return;
    }

    const emptyIndex = playerNames.findIndex(name => name.trim() === '');

    if (emptyIndex !== -1) {
      const newNames = [...playerNames];
      newNames[emptyIndex] = displayName;
      setPlayerNames(newNames);
    } else if (playerNames.length < PLAYER_COLORS.length) {
      setPlayerNames([...playerNames, displayName]);
      setPlayerColors([...playerColors, PLAYER_COLORS[playerNames.length]]);
    }
    setError('');
  };

  const getAvailableQuickAddNames = () => {
    const currentNormalized = playerNames.map(normalizePlayerName);
    return rememberedNames.filter(
      (remembered) => !currentNormalized.includes(remembered.normalizedName)
    );
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...playerColors];
    newColors[index] = color;
    setPlayerColors(newColors);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newNames = [...playerNames];
    const newColors = [...playerColors];
    [newNames[index - 1], newNames[index]] = [newNames[index], newNames[index - 1]];
    [newColors[index - 1], newColors[index]] = [newColors[index], newColors[index - 1]];
    setPlayerNames(newNames);
    setPlayerColors(newColors);
  };

  const handleMoveDown = (index: number) => {
    if (index === playerNames.length - 1) return;
    const newNames = [...playerNames];
    const newColors = [...playerColors];
    [newNames[index], newNames[index + 1]] = [newNames[index + 1], newNames[index]];
    [newColors[index], newColors[index + 1]] = [newColors[index + 1], newColors[index]];
    setPlayerNames(newNames);
    setPlayerColors(newColors);
  };

  const validateAndCreatePlayers = (): Player[] | null => {
    const trimmedNames = playerNames.map(name => name.trim());

    if (trimmedNames.some(name => name === '')) {
      setError(t('allPlayerNamesMustBeFilled'));
      return null;
    }

    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      setError(t('playerNamesMustBeUnique'));
      return null;
    }

    return trimmedNames.map((name, index) => ({
      name,
      color: playerColors[index],
    }));
  };

  const handleStartInOrder = async () => {
    const players = validateAndCreatePlayers();
    if (players) {
      setIsStarting(true);
      try {
        await onStartGame(players);
      } catch {
        setIsStarting(false);
      }
    }
  };

  const handleStartRandom = async () => {
    const players = validateAndCreatePlayers();
    if (!players) return;

    setIsStarting(true);
    const randomIndex = Math.floor(Math.random() * players.length);
    const reorderedPlayers = [...players.slice(randomIndex), ...players.slice(0, randomIndex)];

    toaster.success({
      title: `${reorderedPlayers[0].name} ${t('playerStarts')}`,
      description: t('playersRandomlyOrdered'),
      duration: 3000,
    });

    try {
      await onStartGame(reorderedPlayers);
    } catch {
      setIsStarting(false);
    }
  };

  return (
    <Box p={{ base: 2, sm: 4 }} maxW="container.md" mx="auto" w="full">
      <VStack gap={{ base: 2, sm: 3 }} align="stretch">
        <Box textAlign="center" py={1}>
          <Text fontSize={{ base: "sm", sm: "md" }} color="gray.600">
            {t('enterPlayerNames')}
          </Text>
        </Box>

        {getAvailableQuickAddNames().length > 0 && (
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              {t('quickAdd')}
            </Text>
            <Flex gap={1.5} flexWrap="wrap">
              {getAvailableQuickAddNames().map((remembered) => (
                <Button
                  key={remembered.normalizedName}
                  size="xs"
                  variant="outline"
                  onClick={() => handleQuickAddPlayer(remembered.displayName)}
                >
                  {remembered.displayName}
                </Button>
              ))}
            </Flex>
          </Box>
        )}

        <VStack gap={{ base: 1.5, sm: 2 }} align="stretch">
          {playerNames.map((name, index) => (
            <HStack key={index} gap={{ base: 1, sm: 2 }} flexWrap="nowrap">
              <ColorPicker.Root
                value={parseColor(playerColors[index])}
                onValueChange={(e) => handleColorChange(index, e.valueAsString)}
              >
                <ColorPicker.HiddenInput />
                <ColorPicker.Trigger
                  w={{ base: "6", sm: "7" }}
                  h={{ base: "6", sm: "7" }}
                  minW="auto"
                  p={0}
                  border="4px solid"
                  borderColor={`color-mix(in srgb, ${playerColors[index]} 50%, transparent)`}
                  borderRadius="full"
                  flexShrink={0}
                >
                  <ColorPicker.ValueSwatch
                    w="full"
                    h="full"
                    borderRadius="full"
                  />
                </ColorPicker.Trigger>
                <Portal>
                  <ColorPicker.Positioner>
                    <ColorPicker.Content>
                      <ColorPicker.Area />
                      <HStack>
                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                        <ColorPicker.Sliders />
                      </HStack>
                      <ColorPicker.SwatchGroup>
                        {PLAYER_COLORS.map((color) => (
                          <ColorPicker.SwatchTrigger key={color} value={color}>
                            <ColorPicker.Swatch value={color} boxSize="5">
                              <ColorPicker.SwatchIndicator />
                            </ColorPicker.Swatch>
                          </ColorPicker.SwatchTrigger>
                        ))}
                      </ColorPicker.SwatchGroup>
                    </ColorPicker.Content>
                  </ColorPicker.Positioner>
                </Portal>
              </ColorPicker.Root>
              <HStack gap={0.5} flexShrink={0}>
                <IconButton
                  aria-label="Move player up"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  variant="ghost"
                  size="xs"
                  minW="auto"
                  px={1}
                >
                  <FiChevronUp />
                </IconButton>
                <IconButton
                  aria-label="Move player down"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === playerNames.length - 1}
                  variant="ghost"
                  size="xs"
                  minW="auto"
                  px={1}
                >
                  <FiChevronDown />
                </IconButton>
              </HStack>
              <Input
                placeholder={`${t('playerPlaceholder')} ${index + 1}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.currentTarget.value)}
                size={{ base: "md", sm: "lg" }}
                bg="white"
                color="gray.900"
                flex={1}
                minW={0}
              />
              <IconButton
                aria-label="Remove player"
                onClick={() => handleRemovePlayer(index)}
                disabled={playerNames.length <= 2}
                variant="ghost"
                colorScheme="red"
                size="xs"
                flexShrink={0}
                minW="auto"
                px={1}
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
            size="md"
            w="full"
          >
            <FiPlus />
            {t('addPlayer')}
          </Button>
        )}

        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center" py={1}>
            {error}
          </Text>
        )}

        <VStack gap={{ base: 1.5, sm: 2 }} mt={{ base: 2, sm: 3 }} w="full">
          <Button
            onClick={handleStartInOrder}
            colorPalette="blue"
            size="md"
            w="full"
            disabled={isStarting}
            loading={isStarting}
          >
            {t('startInCurrentOrder')}
          </Button>
          <Button
            onClick={handleStartRandom}
            colorPalette="purple"
            size="md"
            w="full"
            disabled={isStarting}
            loading={isStarting}
          >
            <FiShuffle />
            {t('randomOrder')}
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
