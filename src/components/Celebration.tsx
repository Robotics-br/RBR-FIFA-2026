import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  shape: 'star' | 'circle' | 'diamond';
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
const SHAPES: Particle['shape'][] = ['star', 'circle', 'diamond'];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 50 + (Math.random() - 0.5) * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 6,
    angle: (360 / count) * i + (Math.random() - 0.5) * 30,
    speed: 40 + Math.random() * 60,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));
}

interface CelebrationProps {
  trigger: number;
}

export default function Celebration({ trigger }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setParticles(createParticles(12));
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="celebration-container" aria-hidden="true">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed;

        return (
          <div
            key={p.id}
            className={`celebration-particle ${p.shape}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
