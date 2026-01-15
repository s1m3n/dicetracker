import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import type { Game, Roll, Player } from '../types/game';

export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setRolls([]);
      return;
    }

    setLoading(true);
    setError(null);

    const gameRef = doc(firestore, 'games', gameId);

    const unsubscribeGame = onSnapshot(
      gameRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setGame({
            id: snapshot.id,
            players: data.players,
            currentPlayerIndex: data.currentPlayerIndex,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            userId: data.userId,
          });
        } else {
          setError('Game not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading game:', err);
        setError('Failed to load game');
        setLoading(false);
      }
    );

    const rollsRef = collection(firestore, 'games', gameId, 'rolls');
    const rollsQuery = query(rollsRef, orderBy('timestamp', 'asc'));

    const unsubscribeRolls = onSnapshot(
      rollsQuery,
      (snapshot) => {
        const rollsData: Roll[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            gameId,
            playerIndex: data.playerIndex,
            die1: data.die1,
            die2: data.die2,
            sum: data.sum,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        });
        setRolls(rollsData);
      },
      (err) => {
        console.error('Error loading rolls:', err);
      }
    );

    return () => {
      unsubscribeGame();
      unsubscribeRolls();
    };
  }, [gameId]);

  return { game, rolls, loading, error };
}

export function useGames(userId: string | null) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setGames([]);
      return;
    }

    setLoading(true);
    setError(null);

    const gamesRef = collection(firestore, 'games');
    const gamesQuery = query(
      gamesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      gamesQuery,
      (snapshot) => {
        const gamesData: Game[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            players: data.players,
            currentPlayerIndex: data.currentPlayerIndex,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            userId: data.userId,
          };
        });
        setGames(gamesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading games:', err);
        setError('Failed to load games');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { games, loading, error };
}

export async function createGame(players: Player[], userId: string): Promise<string> {
  const gamesRef = collection(firestore, 'games');
  const gameData = {
    players,
    currentPlayerIndex: 0,
    status: 'active',
    createdAt: Timestamp.now(),
    userId,
  };

  const docRef = await addDoc(gamesRef, gameData);
  return docRef.id;
}

export async function addRoll(
  gameId: string,
  playerIndex: number,
  die1: number,
  die2: number
): Promise<void> {
  const rollsRef = collection(firestore, 'games', gameId, 'rolls');
  await addDoc(rollsRef, {
    playerIndex,
    die1,
    die2,
    sum: die1 + die2,
    timestamp: Timestamp.now(),
  });
}

export async function advanceTurn(gameId: string, currentPlayerIndex: number, totalPlayers: number): Promise<void> {
  const gameRef = doc(firestore, 'games', gameId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
  await updateDoc(gameRef, {
    currentPlayerIndex: nextPlayerIndex,
  });
}

export async function endGame(gameId: string): Promise<void> {
  const gameRef = doc(firestore, 'games', gameId);
  await updateDoc(gameRef, {
    status: 'completed',
  });
}
