import { openDB, type IDBPDatabase } from 'idb';
import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'album-copa-2026-photos';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function savePhoto(stickerId: number, dataUrl: string): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, dataUrl, stickerId);
}

export async function getPhoto(stickerId: number): Promise<string | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, stickerId);
}

export async function deletePhoto(stickerId: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, stickerId);
}

export async function getAllPhotoIds(): Promise<number[]> {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE_NAME);
  return keys as number[];
}

export function useStickerPhoto(stickerId: number) {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPhoto(stickerId).then((data) => {
      if (!cancelled) {
        setPhoto(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [stickerId]);

  const updatePhoto = useCallback(async (dataUrl: string) => {
    await savePhoto(stickerId, dataUrl);
    setPhoto(dataUrl);
  }, [stickerId]);

  const removePhoto = useCallback(async () => {
    await deletePhoto(stickerId);
    setPhoto(undefined);
  }, [stickerId]);

  return { photo, loading, updatePhoto, removePhoto };
}
