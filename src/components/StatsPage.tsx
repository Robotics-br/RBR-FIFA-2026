import { useMemo } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { teams, getStickersByTeam, stickers, totalStickers } from '../data/teams';

export default function StatsPage() {
  const { state } = useAlbum();
  const senior = state.settings.seniorMode;

  const stats = useMemo(() => {
    const owned = stickers.filter((s) => (state.collection[s.id] ?? 0) > 0).length;
    const totalDuplicates = Object.values(state.collection).reduce(
      (sum, q) => sum + Math.max(0, q - 1),
      0,
    );
    const pct = Math.round((owned / totalStickers) * 100);

    const teamStats = teams.map((team) => {
      const teamStickers = getStickersByTeam(team.id);
      const teamOwned = teamStickers.filter(
        (s) => (state.collection[s.id] ?? 0) > 0,
      ).length;
      const teamPct = Math.round((teamOwned / teamStickers.length) * 100);
      return { team, owned: teamOwned, total: teamStickers.length, pct: teamPct };
    });

    teamStats.sort((a, b) => b.pct - a.pct);

    return { owned, totalDuplicates, pct, teamStats };
  }, [state.collection]);

  return (
    <div className="stats-page">
      <div className="stats-hero">
        <div className="stats-ring-large">
          <svg viewBox="0 0 36 36" className="progress-ring large">
            <path
              className="progress-ring-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-ring-fill"
              strokeDasharray={`${stats.pct}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="stats-ring-text">
            <span className="stats-pct">{stats.pct}%</span>
            <span className="stats-label">completo</span>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className={`stat-card ${senior ? 'senior' : ''}`}>
          <span className="stat-number">{stats.owned}</span>
          <span className="stat-desc">Figurinhas</span>
        </div>
        <div className={`stat-card ${senior ? 'senior' : ''}`}>
          <span className="stat-number">{totalStickers - stats.owned}</span>
          <span className="stat-desc">Faltam</span>
        </div>
        <div className={`stat-card ${senior ? 'senior' : ''}`}>
          <span className="stat-number">{stats.totalDuplicates}</span>
          <span className="stat-desc">Repetidas</span>
        </div>
      </div>

      <div className="stats-teams">
        <h3 className="stats-teams-title">Progresso por Seleção</h3>
        {stats.teamStats.map(({ team, owned, total, pct }) => (
          <div key={team.id} className={`team-progress ${senior ? 'senior' : ''}`}>
            <div className="team-progress-header">
              <span className="team-progress-flag">{team.flag}</span>
              <span className="team-progress-name">{team.name}</span>
              <span className="team-progress-count">
                {owned}/{total}
              </span>
            </div>
            <div className="team-progress-bar">
              <div
                className="team-progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
