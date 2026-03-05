import { AlbumProvider, useAlbum } from './store/useAlbumStore';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AlbumPage from './components/AlbumPage';
import GeneralPage from './components/GeneralPage';
import TradePage from './components/TradePage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';

const pageTitles = {
  album: 'Meu Álbum - Mundial FIFA 2026',
  general: 'Visão Geral',
  trade: 'Modo Troca',
  stats: 'Meu Progresso',
  settings: 'Ajustes',
} as const;

function AppContent() {
  const { state } = useAlbum();
  const { currentPage } = state;

  return (
    <div className={`app ${state.settings.seniorMode ? 'senior-mode' : ''}`}>
      <Header title={pageTitles[currentPage]} />
      <main className="main-content">
        {currentPage === 'album' && <AlbumPage />}
        {currentPage === 'general' && <GeneralPage />}
        {currentPage === 'trade' && <TradePage />}
        {currentPage === 'stats' && <StatsPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AlbumProvider>
      <AppContent />
    </AlbumProvider>
  );
}
