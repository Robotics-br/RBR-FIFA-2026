import { useMemo } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { teams, stickers, totalStickers, getStickersByTeam } from '../data/teams';

export default function GeneralPage() {
  const { state } = useAlbum();
  const senior = state.settings.seniorMode;

  const ownedCount = useMemo(
    () => stickers.filter((s) => (state.collection[s.id] ?? 0) > 0).length,
    [state.collection],
  );

  const pct = Math.round((ownedCount / totalStickers) * 100);

  return (
    <div className="general-page">
      <div className="general-summary">
        <span className="general-summary-text">
          <strong>{ownedCount}</strong> / {totalStickers} figurinhas ({pct}%)
        </span>
        <div className="general-summary-bar">
          <div className="general-summary-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {teams.map((team) => {
        const teamStickers = getStickersByTeam(team.id);
        const teamOwned = teamStickers.filter(
          (s) => (state.collection[s.id] ?? 0) > 0,
        ).length;

        return (
          <div key={team.id} className="general-team-section">
            <div className="general-team-header">
              <span className="general-team-flag">{team.flag}</span>
              <span className="general-team-name">{team.name}</span>
              <span className="general-team-count">
                {teamOwned}/{teamStickers.length}
              </span>
            </div>

            <div className={`general-grid ${senior ? 'senior' : ''}`}>
              {teamStickers.map((sticker) => {
                const qty = state.collection[sticker.id] ?? 0;
                const owned = qty > 0;

                return (
                  <div
                    key={sticker.id}
                    className={`general-cell ${owned ? 'owned' : 'missing'} ${senior ? 'senior' : ''}`}
                  >
                    <span className="general-cell-number">{sticker.id}</span>
                    {qty > 1 && <span className="general-cell-qty">×{qty}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
