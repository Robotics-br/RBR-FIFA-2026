import { useState, useEffect, useCallback } from 'react';
import { X, Minus, Plus, Camera, Trash2 } from 'lucide-react';
import { useAlbum } from '../store/useAlbumStore';
import { useStickerPhoto } from '../store/usePhotoStore';
import { compressImage } from '../utils/imageCompressor';
import type { Sticker } from '../types';
import { getTeamById } from '../data/teams';
import CameraModal from './CameraModal';

interface StickerModalProps {
  sticker: Sticker | null;
  onClose: () => void;
}

export default function StickerModal({ sticker, onClose }: StickerModalProps) {
  const { getQuantity, setQuantity, state } = useAlbum();
  const [qty, setQty] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const senior = state.settings.seniorMode;

  const stickerIdForPhoto = sticker?.id ?? 0;
  const { photo, updatePhoto, removePhoto } = useStickerPhoto(stickerIdForPhoto);

  useEffect(() => {
    if (sticker) {
      setQty(getQuantity(sticker.id));
    }
  }, [sticker, getQuantity]);

  useEffect(() => {
    if (!sticker) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [sticker, onClose]);

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

  const handleRemovePhoto = useCallback(async () => {
    if (window.confirm('Remover a foto desta figurinha?')) {
      await removePhoto();
    }
  }, [removePhoto]);

  if (!sticker) return null;

  const team = getTeamById(sticker.teamId);

  const handleSave = () => {
    setQuantity(sticker.id, qty);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className={`modal-content ${senior ? 'senior' : ''}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={`Detalhes: ${sticker.name}`}
        >
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>

          <div className="modal-header">
            {photo ? (
              <img src={photo} alt={sticker.name} className="modal-photo" />
            ) : (
              <span className="modal-flag">{team?.flag}</span>
            )}
            <div>
              <h2 className="modal-name">{sticker.name}</h2>
              <p className="modal-team">{team?.name} · #{sticker.id}</p>
            </div>
          </div>

          <div className="modal-photo-actions">
            <button
              className="modal-photo-btn"
              onClick={() => setCameraOpen(true)}
            >
              <Camera size={16} />
              {photo ? 'Trocar foto' : 'Tirar foto'}
            </button>
            {photo && (
              <button className="modal-photo-btn danger" onClick={handleRemovePhoto}>
                <Trash2 size={16} />
                Remover
              </button>
            )}
          </div>

          <div className="modal-body">
            <p className="modal-label">Quantas figurinhas você tem?</p>
            <div className="qty-controls">
              <button
                className="qty-btn"
                onClick={() => setQty(Math.max(0, qty - 1))}
                aria-label="Diminuir"
              >
                <Minus size={senior ? 28 : 22} />
              </button>
              <span className="qty-value">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => setQty(qty + 1)}
                aria-label="Aumentar"
              >
                <Plus size={senior ? 28 : 22} />
              </button>
            </div>

            <div className="qty-quick">
              {[0, 1, 2, 3, 5].map((n) => (
                <button
                  key={n}
                  className={`qty-quick-btn ${qty === n ? 'active' : ''}`}
                  onClick={() => setQty(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="modal-save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>

      <CameraModal
        open={cameraOpen}
        onCapture={handleCapture}
        onClose={() => setCameraOpen(false)}
      />
    </>
  );
}
