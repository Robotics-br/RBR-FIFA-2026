import { useMemo, useRef, useCallback } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { stickers } from '../data/teams';

export default function TradePage() {
  const { state } = useAlbum();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const senior = state.settings.seniorMode;

  const duplicates = useMemo(
    () =>
      stickers
        .filter((s) => (state.collection[s.id] ?? 0) > 1)
        .map((s) => ({
          ...s,
          extra: (state.collection[s.id] ?? 0) - 1,
        })),
    [state.collection],
  );

  const missing = useMemo(
    () => stickers.filter((s) => (state.collection[s.id] ?? 0) === 0),
    [state.collection],
  );

  const tradeText = useMemo(() => {
    const dupList = duplicates.map((d) => `${d.id}`).join(', ');
    const missList = missing.map((m) => `${m.id}`).join(', ');
    return `⚽ ÁLBUM COPA 2026\n\n🔄 TENHO REPETIDAS (${duplicates.length}):\n${dupList || 'Nenhuma'}\n\n❌ PRECISO (${missing.length}):\n${missList || 'Nenhuma'}\n\n📱 Meu Álbum Digital Copa 2026`;
  }, [duplicates, missing]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: tradeText });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(tradeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [tradeText]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(tradeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tradeText]);

  return (
    <div className="trade-page">
      <div className="trade-card" ref={cardRef}>
        <div className="trade-section duplicates">
          <h3 className="trade-section-title">
            🔄 Minhas Repetidas
            <span className="trade-count">{duplicates.length}</span>
          </h3>
          {duplicates.length === 0 ? (
            <p className="trade-empty">Nenhuma figurinha repetida ainda</p>
          ) : (
            <div className="trade-chips">
              {duplicates.map((d) => (
                <span key={d.id} className={`trade-chip duplicate ${senior ? 'senior' : ''}`}>
                  {d.id}
                  {d.extra > 1 && <small>×{d.extra}</small>}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="trade-section missing">
          <h3 className="trade-section-title">
            ❌ Preciso
            <span className="trade-count">{missing.length}</span>
          </h3>
          {missing.length === 0 ? (
            <p className="trade-empty">Parabéns! Álbum completo!</p>
          ) : (
            <div className="trade-chips">
              {missing.slice(0, 60).map((m) => (
                <span key={m.id} className={`trade-chip need ${senior ? 'senior' : ''}`}>
                  {m.id}
                </span>
              ))}
              {missing.length > 60 && (
                <span className="trade-chip more">+{missing.length - 60}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="trade-actions">
        <button className={`trade-btn share ${senior ? 'senior' : ''}`} onClick={handleShare}>
          <Share2 size={20} />
          Compartilhar Lista
        </button>
        <button className={`trade-btn copy ${senior ? 'senior' : ''}`} onClick={handleCopy}>
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'Copiado!' : 'Copiar Texto'}
        </button>
      </div>
    </div>
  );
}
