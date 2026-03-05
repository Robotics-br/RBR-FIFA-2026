import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserCollection, AppSettings, Page, StickerFilter } from '../types';

interface AlbumState {
  collection: UserCollection;
  settings: AppSettings;
  currentPage: Page;
  currentTeam: string;
  stickerFilter: StickerFilter;
}

type Action =
  | { type: 'SET_QUANTITY'; stickerId: number; quantity: number }
  | { type: 'TOGGLE_STICKER'; stickerId: number }
  | { type: 'SET_PAGE'; page: Page }
  | { type: 'SET_TEAM'; teamId: string }
  | { type: 'SET_FILTER'; filter: StickerFilter }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'LOAD_STATE'; state: Partial<AlbumState> };

const STORAGE_KEY = 'album-copa-2026';

function loadFromStorage(): Partial<AlbumState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveToStorage(state: AlbumState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        collection: state.collection,
        settings: state.settings,
      }),
    );
  } catch { /* ignore */ }
}

const defaultSettings: AppSettings = {
  seniorMode: false,
  soundEnabled: true,
  favoriteTeam: null,
};

const initialState: AlbumState = {
  collection: {},
  settings: defaultSettings,
  currentPage: 'album',
  currentTeam: 'bra',
  stickerFilter: 'all',
};

function reducer(state: AlbumState, action: Action): AlbumState {
  switch (action.type) {
    case 'TOGGLE_STICKER': {
      const current = state.collection[action.stickerId] ?? 0;
      const next = current === 0 ? 1 : 0;
      return {
        ...state,
        collection: { ...state.collection, [action.stickerId]: next },
      };
    }
    case 'SET_QUANTITY': {
      const qty = Math.max(0, action.quantity);
      return {
        ...state,
        collection: { ...state.collection, [action.stickerId]: qty },
      };
    }
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'SET_TEAM':
      return { ...state, currentTeam: action.teamId };
    case 'SET_FILTER':
      return { ...state, stickerFilter: action.filter };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'LOAD_STATE':
      return {
        ...state,
        collection: action.state.collection ?? state.collection,
        settings: { ...state.settings, ...action.state.settings },
      };
    default:
      return state;
  }
}

interface AlbumContextType {
  state: AlbumState;
  toggleSticker: (id: number) => void;
  setQuantity: (id: number, qty: number) => void;
  setPage: (page: Page) => void;
  setTeam: (teamId: string) => void;
  setFilter: (filter: StickerFilter) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  getQuantity: (id: number) => number;
}

const AlbumContext = createContext<AlbumContextType | null>(null);

export function AlbumProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.collection || saved.settings) {
      dispatch({ type: 'LOAD_STATE', state: saved });
    }
  }, []);

  useEffect(() => {
    saveToStorage(state);
  }, [state.collection, state.settings]);

  const toggleSticker = useCallback(
    (id: number) => dispatch({ type: 'TOGGLE_STICKER', stickerId: id }),
    [],
  );

  const setQuantity = useCallback(
    (id: number, qty: number) =>
      dispatch({ type: 'SET_QUANTITY', stickerId: id, quantity: qty }),
    [],
  );

  const setPage = useCallback(
    (page: Page) => dispatch({ type: 'SET_PAGE', page }),
    [],
  );

  const setTeam = useCallback(
    (teamId: string) => dispatch({ type: 'SET_TEAM', teamId }),
    [],
  );

  const setFilter = useCallback(
    (filter: StickerFilter) => dispatch({ type: 'SET_FILTER', filter }),
    [],
  );

  const updateSettings = useCallback(
    (s: Partial<AppSettings>) => dispatch({ type: 'UPDATE_SETTINGS', settings: s }),
    [],
  );

  const getQuantity = useCallback(
    (id: number) => state.collection[id] ?? 0,
    [state.collection],
  );

  return (
    <AlbumContext.Provider
      value={{
        state,
        toggleSticker,
        setQuantity,
        setPage,
        setTeam,
        setFilter,
        updateSettings,
        getQuantity,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}

export function useAlbum() {
  const ctx = useContext(AlbumContext);
  if (!ctx) throw new Error('useAlbum must be used within AlbumProvider');
  return ctx;
}
