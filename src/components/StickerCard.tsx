import { useRef, useCallback, useState } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { useStickerPhoto } from '../store/usePhotoStore';
import { compressImage } from '../utils/imageCompressor';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import type { Sticker } from '../types';
import { Shield, Users, User, Camera } from 'lucide-react';
import CameraModal from './CameraModal';
import Celebration from './Celebration';

interface StickerCardProps {
  sticker: Sticker;
  onLongPress: (sticker: Sticker) => void;
}

const positionLabels: Record<string, string> = {
  GOL: 'GOL',
  DEF: 'DEF',
  MEI: 'MEI',
  ATA: 'ATA',
};

const positionColors: Record<string, string> = {
  GOL: '#F59E0B',
  DEF: '#3B82F6',
  MEI: '#10B981',
  ATA: '#EF4444',
};

export default function StickerCard({ sticker, onLongPress }: StickerCardProps) {
  const { toggleSticker, getQuantity, state } = useAlbum();
  const { photo, updatePhoto } = useStickerPhoto(sticker.id);
  const qty = getQuantity(sticker.id);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const senior = state.settings.seniorMode;

  const status = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';

  const handlePressStart = useCallback(() => {
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onLongPress(sticker);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  }, [sticker, onLongPress]);

  const handlePressEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!longPressTriggered.current) {
      const wasOwned = (getQuantity(sticker.id) ?? 0) > 0;
      toggleSticker(sticker.id);
      if (state.settings.soundEnabled) {
        if (wasOwned) {
          playStickerRemovedSound();
        } else {
          playStickerCollectedSound();
          setCelebrationKey((k) => k + 1);
        }
      } else if (!wasOwned) {
        setCelebrationKey((k) => k + 1);
      }
    }
  }, [toggleSticker, sticker.id, state.settings.soundEnabled, getQuantity]);

  const handlePressCancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCameraClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCameraOpen(true);
  }, []);

  const handleCapture = useCallback(async (dataUrl: string) => {
    setCameraOpen(false);
    try {
      const blob = await fetch(dataUrl).then(r => r.blob());
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const compressed = await compressImage(file);
      await updatePhoto(compressed);
    } catch {
      alert('Erro ao processar a foto. Tente novamente.');
    }
  }, [updatePhoto]);

  const TypeIcon = sticker.type === 'badge' ? Shield : sticker.type === 'team_photo' ? Users : User;

  return (
    <div className="sticker-card-wrapper">
      <Celebration trigger={celebrationKey} />
      <button
        className={`sticker-card ${status} ${photo ? 'has-photo' : ''} ${senior ? 'senior' : ''} ${celebrationKey > 0 && status === 'owned' ? 'just-collected' : ''}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onTouchStart={handlePressStart}
        onTouchEnd={(e) => { e.preventDefault(); handlePressEnd(); }}
        onTouchCancel={handlePressCancel}
        aria-label={`${sticker.name}, ${status === 'missing' ? 'não tenho' : status === 'owned' ? 'tenho' : `tenho ${qty} repetidas`}`}
      >
        {photo && <img src={photo} alt={sticker.name} className="sticker-photo-bg" />}

        <div className="sticker-top">
          <span className="sticker-number">{sticker.id}</span>
          {qty > 1 && <span className="sticker-badge">×{qty}</span>}
        </div>

        {!photo && (
          <div className="sticker-icon">
            <TypeIcon
              size={senior ? 28 : 22}
              strokeWidth={1.5}
              color={status === 'missing' ? '#9CA3AF' : '#fff'}
            />
          </div>
        )}

        <div className="sticker-info">
          <span className="sticker-name">{sticker.name}</span>
          {sticker.position && (
            <span
              className="sticker-position"
              style={{
                backgroundColor: status !== 'missing'
                  ? positionColors[sticker.position] + '30'
                  : undefined,
                color: status !== 'missing'
                  ? positionColors[sticker.position]
                  : undefined,
              }}
            >
              {positionLabels[sticker.position]}
            </span>
          )}
        </div>
      </button>

      <button
        className={`sticker-camera-btn ${senior ? 'senior' : ''}`}
        onClick={handleCameraClick}
        aria-label={`Tirar foto de ${sticker.name}`}
      >
        <Camera size={senior ? 16 : 12} />
      </button>

      <CameraModal
        open={cameraOpen}
        onCapture={handleCapture}
        onClose={() => setCameraOpen(false)}
      />
    </div>
  );
}
