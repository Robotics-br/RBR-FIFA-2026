import { useRef, useState } from 'react';
import { useAlbum } from '../store/useAlbumStore';
import { teams } from '../data/teams';
import { Volume2, VolumeX, Eye, Trash2, Download, Upload, Check, Loader } from 'lucide-react';
import { exportBackup, importBackup } from '../utils/backup';

export default function SettingsPage() {
  const { state, updateSettings } = useAlbum();
  const { settings } = state;
  const senior = settings.seniorMode;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as figurinhas e fotos? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('album-copa-2026');
      indexedDB.deleteDatabase('album-copa-2026-photos');
      window.location.reload();
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      await exportBackup();
      setMessage('Backup exportado com sucesso!');
    } catch {
      setMessage('Erro ao exportar backup.');
    }
    setExporting(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage(null);
    try {
      const result = await importBackup(file);
      setMessage(`Restaurado: ${result.stickers} figurinhas e ${result.photos} fotos. Recarregando...`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao importar backup.');
    }
    setImporting(false);
    e.target.value = '';
  };

  return (
    <div className="settings-page">
      <div className="settings-group">
        <h3 className="settings-title">Acessibilidade</h3>

        <label className={`setting-row ${senior ? 'senior' : ''}`}>
          <div className="setting-info">
            <Eye size={20} />
            <div>
              <span className="setting-label">Modo Sênior</span>
              <span className="setting-desc">Botões e textos maiores</span>
            </div>
          </div>
          <div className={`toggle ${settings.seniorMode ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={settings.seniorMode}
              onChange={(e) => updateSettings({ seniorMode: e.target.checked })}
            />
            <span className="toggle-slider" />
          </div>
        </label>

        <label className={`setting-row ${senior ? 'senior' : ''}`}>
          <div className="setting-info">
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <div>
              <span className="setting-label">Sons</span>
              <span className="setting-desc">Efeito sonoro ao marcar figurinha</span>
            </div>
          </div>
          <div className={`toggle ${settings.soundEnabled ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            />
            <span className="toggle-slider" />
          </div>
        </label>
      </div>

      <div className="settings-group">
        <h3 className="settings-title">Preferências</h3>

        <div className={`setting-row ${senior ? 'senior' : ''}`}>
          <div className="setting-info">
            <span style={{ fontSize: '20px' }}>⭐</span>
            <div>
              <span className="setting-label">Seleção Favorita</span>
              <span className="setting-desc">Destacar no álbum</span>
            </div>
          </div>
          <select
            className="setting-select"
            value={settings.favoriteTeam ?? ''}
            onChange={(e) =>
              updateSettings({
                favoriteTeam: e.target.value || null,
              })
            }
          >
            <option value="">Nenhuma</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.flag} {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3 className="settings-title">Backup</h3>

        <button
          className={`setting-row ${senior ? 'senior' : ''}`}
          onClick={handleExport}
          disabled={exporting}
        >
          <div className="setting-info">
            {exporting ? <Loader size={20} className="spin" /> : <Download size={20} />}
            <div>
              <span className="setting-label">Exportar Backup</span>
              <span className="setting-desc">Salvar figurinhas e fotos em arquivo</span>
            </div>
          </div>
        </button>

        <button
          className={`setting-row ${senior ? 'senior' : ''}`}
          onClick={handleImportClick}
          disabled={importing}
        >
          <div className="setting-info">
            {importing ? <Loader size={20} className="spin" /> : <Upload size={20} />}
            <div>
              <span className="setting-label">Importar Backup</span>
              <span className="setting-desc">Restaurar de um arquivo salvo</span>
            </div>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="sticker-file-input"
          onChange={handleImportFile}
        />

        {message && (
          <div className="settings-message">
            <Check size={16} />
            {message}
          </div>
        )}
      </div>

      <div className="settings-group danger">
        <h3 className="settings-title">Dados</h3>
        <button className={`setting-row danger-btn ${senior ? 'senior' : ''}`} onClick={handleReset}>
          <div className="setting-info">
            <Trash2 size={20} />
            <div>
              <span className="setting-label">Resetar Álbum</span>
              <span className="setting-desc">Apagar todas as figurinhas e fotos</span>
            </div>
          </div>
        </button>
      </div>

      <div className="settings-about">
        <p>Meu Álbum Copa 2026</p>
        <p className="about-version">v1.0.0 · Feito com ⚽</p>
      </div>
    </div>
  );
}
