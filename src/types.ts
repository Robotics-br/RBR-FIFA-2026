export interface Team {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export interface Sticker {
  id: number;
  code: string;
  name: string;
  teamId: string;
  type: 'badge' | 'team_photo' | 'player';
  position?: 'GOL' | 'DEF' | 'MEI' | 'ATA';
}

export interface UserCollection {
  [stickerId: number]: number;
}

export interface AppSettings {
  seniorMode: boolean;
  soundEnabled: boolean;
  favoriteTeam: string | null;
}

export type Page = 'album' | 'general' | 'trade' | 'stats' | 'settings';

export type StickerFilter = 'all' | 'missing' | 'owned' | 'duplicates';
