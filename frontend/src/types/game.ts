export interface Player {
  name: string;
  color: string;
}

export interface Game {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  status: 'active' | 'completed';
  createdAt: Date;
  userId: string;
}

export interface Roll {
  id: string;
  gameId: string;
  playerIndex: number;
  die1: number;
  die2: number;
  sum: number;
  timestamp: Date;
}

export interface GameWithRolls extends Game {
  rolls: Roll[];
}

export const PLAYER_COLORS = [
  '#1E3A8A', // darker blue
  '#166534', // darker green
  '#115E59', // darker teal
  '#854D0E', // darker yellow
  '#C2410C', // darker orange
  '#6B21A8', // darker purple
];

export const EXPECTED_DISTRIBUTION: Record<number, number> = {
  2: 1 / 36,
  3: 2 / 36,
  4: 3 / 36,
  5: 4 / 36,
  6: 5 / 36,
  7: 6 / 36,
  8: 5 / 36,
  9: 4 / 36,
  10: 3 / 36,
  11: 2 / 36,
  12: 1 / 36,
};
