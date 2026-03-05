import { useRef, useEffect } from 'react';
import { teams } from '../data/teams';
import { useAlbum } from '../store/useAlbumStore';

export default function TeamTabs() {
  const { state, setTeam } = useAlbum();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const senior = state.settings.seniorMode;

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [state.currentTeam]);

  return (
    <div className="team-tabs-wrapper">
      <div className="team-tabs" ref={scrollRef}>
        {teams.map((team) => {
          const active = state.currentTeam === team.id;
          return (
            <button
              key={team.id}
              ref={active ? activeRef : undefined}
              className={`team-tab ${active ? 'active' : ''} ${senior ? 'senior' : ''}`}
              onClick={() => setTeam(team.id)}
              aria-label={team.name}
              aria-pressed={active}
            >
              <span className="team-flag">{team.flag}</span>
              <span className="team-code">{team.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
