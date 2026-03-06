interface HeaderProps {
  title?: string;
  subtitle?: string;
}

function TrophyIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="header-trophy"
    >
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="60%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <linearGradient id="trophyShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="baseGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
      </defs>
      {/* Cup body */}
      <path
        d="M18 10 H46 L42 34 C41 38 37 42 32 42 C27 42 23 38 22 34 Z"
        fill="url(#trophyGold)"
        stroke="#B8860B"
        strokeWidth="1.5"
      />
      {/* Shine on cup */}
      <path
        d="M22 12 H30 L28 32 C27 35 26 36 25 36 C24 35 23 32 22 28 Z"
        fill="url(#trophyShine)"
      />
      {/* Left handle */}
      <path
        d="M18 14 C10 14 6 20 8 28 C9 32 14 34 18 30"
        fill="none"
        stroke="url(#trophyGold)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Right handle */}
      <path
        d="M46 14 C54 14 58 20 56 28 C55 32 50 34 46 30"
        fill="none"
        stroke="url(#trophyGold)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Stem */}
      <rect x="29" y="42" width="6" height="8" rx="1" fill="url(#baseGold)" />
      {/* Base */}
      <rect x="22" y="50" width="20" height="5" rx="2.5" fill="url(#baseGold)" stroke="#B8860B" strokeWidth="1" />
      {/* Star */}
      <polygon
        points="32,18 34,24 40,24 35,28 37,34 32,30 27,34 29,28 24,24 30,24"
        fill="#FFF9C4"
        opacity="0.85"
      />
    </svg>
  );
}

export default function Header({ title = 'Meu Álbum - Copa do Mundo FIFA 2026', subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <TrophyIcon size={36} />
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        <img
          src="/RoboticsBr.gif"
          alt="RoboticsBr Logo"
          className="header-logo"
        />
      </div>
    </header>
  );
}
