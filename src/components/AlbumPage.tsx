import { useState, useMemo } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { getStickersByTeam, getTeamById, totalStickers } from '../data/teams';
import type { Sticker, StickerFilter } from '../types';
import TeamTabs from './TeamTabs';
import StickerCard from './StickerCard';
import StickerModal from './StickerModal';

const filters: { key: StickerFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'missing', label: 'Faltam' },
  { key: 'owned', label: 'Tenho' },
  { key: 'duplicates', label: 'Repetidas' },
];

export default function AlbumPage() {
  const { state, setFilter, getQuantity } = useAlbum();
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const senior = state.settings.seniorMode;

  const teamStickers = useMemo(
    () => getStickersByTeam(state.currentTeam),
    [state.currentTeam],
  );

  const filtered = useMemo(() => {
    switch (state.stickerFilter) {
      case 'missing':
        return teamStickers.filter((s) => getQuantity(s.id) === 0);
      case 'owned':
        return teamStickers.filter((s) => getQuantity(s.id) >= 1);
      case 'duplicates':
        return teamStickers.filter((s) => getQuantity(s.id) > 1);
      default:
        return teamStickers;
    }
  }, [teamStickers, state.stickerFilter, getQuantity]);

  const team = getTeamById(state.currentTeam);
  const ownedCount = Object.values(state.collection).filter((q) => q > 0).length;
  const pct = Math.round((ownedCount / totalStickers) * 100);

  return (
    <div className="album-page">
      <div className="album-summary">
        <div className="summary-progress">
          <div className="summary-ring">
            <svg viewBox="0 0 36 36" className="progress-ring">
              <path
                className="progress-ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="progress-ring-fill"
                strokeDasharray={`${pct}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="summary-pct">{pct}%</span>
          </div>
          <div className="summary-text">
            <strong>{ownedCount}</strong> de {totalStickers} figurinhas
          </div>
        </div>
      </div>

      <TeamTabs />

      <div className="filter-bar">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-chip ${state.stickerFilter === key ? 'active' : ''} ${senior ? 'senior' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="album-team-header">
        <span>{team?.flag}</span>
        <span>{team?.name}</span>
        <span className="team-count">
          {teamStickers.filter((s) => getQuantity(s.id) > 0).length}/{teamStickers.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="album-empty">
          <p>Nenhuma figurinha nesta categoria</p>
        </div>
      ) : (
        <div className={`sticker-grid ${senior ? 'senior' : ''}`}>
          {filtered.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              onLongPress={setSelectedSticker}
            />
          ))}
        </div>
      )}

      <StickerModal
        sticker={selectedSticker}
        onClose={() => setSelectedSticker(null)}
      />
    </div>
  );
}
