import type { UserCollection, AppSettings } from '../types';
import { getPhoto, savePhoto, getAllPhotoIds } from '../store/usePhotoStore';

interface BackupData {
  version: 1;
  exportedAt: string;
  collection: UserCollection;
  settings: AppSettings;
  photos: Record<number, string>;
}

const STORAGE_KEY = 'album-copa-2026';

export async function exportBackup(): Promise<void> {
  const saved = localStorage.getItem(STORAGE_KEY);
  const parsed = saved ? JSON.parse(saved) : {};

  const photoIds = await getAllPhotoIds();
  const photos: Record<number, string> = {};
  for (const id of photoIds) {
    const data = await getPhoto(id);
    if (data) photos[id] = data;
  }

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    collection: parsed.collection ?? {},
    settings: parsed.settings ?? {},
    photos,
  };

  const json = JSON.stringify(backup);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `album-copa-2026-backup-${date}.json`;

  if (navigator.share && isMobile()) {
    const file = new File([blob], filename, { type: 'application/json' });
    try {
      await navigator.share({ files: [file], title: 'Backup Álbum Copa 2026' });
      URL.revokeObjectURL(url);
      return;
    } catch { /* user cancelled or share not supported for files */ }
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<{ stickers: number; photos: number }> {
  const text = await file.text();
  let data: BackupData;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Arquivo inválido. Selecione um backup válido (.json).');
  }

  if (!data.version || !data.collection) {
    throw new Error('Este arquivo não é um backup válido do Álbum Copa 2026.');
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    collection: data.collection,
    settings: data.settings,
  }));

  let photoCount = 0;
  if (data.photos) {
    for (const [idStr, dataUrl] of Object.entries(data.photos)) {
      await savePhoto(Number(idStr), dataUrl);
      photoCount++;
    }
  }

  const stickerCount = Object.values(data.collection).filter((q) => q > 0).length;

  return { stickers: stickerCount, photos: photoCount };
}

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
