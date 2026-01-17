import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import type { RememberedPlayerName } from '../types/game';

export function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase();
}

export function formatDisplayName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function usePlayerNames(userId: string | null) {
  const [playerNames, setPlayerNames] = useState<RememberedPlayerName[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setPlayerNames([]);
      return;
    }

    setLoading(true);

    const playerNamesRef = collection(firestore, 'users', userId, 'playerNames');
    const playerNamesQuery = query(
      playerNamesRef,
      orderBy('count', 'desc'),
      limit(8)
    );

    const unsubscribe = onSnapshot(
      playerNamesQuery,
      (snapshot) => {
        const names: RememberedPlayerName[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            normalizedName: doc.id,
            displayName: data.displayName,
            count: data.count,
            lastUsed: data.lastUsed?.toDate() || new Date(),
          };
        });
        setPlayerNames(names);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading player names:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { playerNames, loading };
}

export async function savePlayerNames(userId: string, names: string[]): Promise<void> {
  const uniqueNormalizedNames = new Set<string>();
  const namesToSave: { normalized: string; display: string }[] = [];

  for (const name of names) {
    const normalized = normalizePlayerName(name);
    if (normalized && !uniqueNormalizedNames.has(normalized)) {
      uniqueNormalizedNames.add(normalized);
      namesToSave.push({
        normalized,
        display: formatDisplayName(name),
      });
    }
  }

  const promises = namesToSave.map(({ normalized, display }) => {
    const docRef = doc(firestore, 'users', userId, 'playerNames', normalized);
    return setDoc(
      docRef,
      {
        displayName: display,
        count: increment(1),
        lastUsed: Timestamp.now(),
      },
      { merge: true }
    );
  });

  await Promise.all(promises);
}
