import { Album, LayoutGrid, ArrowLeftRight, BarChart3, Settings } from 'lucide-react';
import { useAlbum } from '../store/useAlbumStore';
import type { Page } from '../types';

const navItems: { page: Page; label: string; icon: typeof Album }[] = [
  { page: 'album', label: 'Álbum', icon: Album },
  { page: 'general', label: 'Geral', icon: LayoutGrid },
  { page: 'trade', label: 'Trocas', icon: ArrowLeftRight },
  { page: 'stats', label: 'Progresso', icon: BarChart3 },
  { page: 'settings', label: 'Ajustes', icon: Settings },
];

export default function BottomNav() {
  const { state, setPage } = useAlbum();
  const senior = state.settings.seniorMode;

  return (
    <nav className={`bottom-nav ${senior ? 'senior' : ''}`}>
      {navItems.map(({ page, label, icon: Icon }) => {
        const active = state.currentPage === page;
        return (
          <button
            key={page}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => setPage(page)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={senior ? 28 : 22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
