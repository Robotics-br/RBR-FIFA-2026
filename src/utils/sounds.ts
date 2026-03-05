let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playStickerCollectedSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    playNote(ctx, 523.25, now, 0.15, 0.5, 'sine');
    playNote(ctx, 659.25, now + 0.08, 0.15, 0.5, 'sine');
    playNote(ctx, 783.99, now + 0.16, 0.25, 0.45, 'sine');
    playNote(ctx, 1046.5, now + 0.24, 0.4, 0.35, 'sine');

    playNote(ctx, 523.25, now, 0.12, 0.15, 'triangle');
    playNote(ctx, 783.99, now + 0.16, 0.18, 0.12, 'triangle');
  } catch { /* audio not supported */ }
}

export function playStickerRemovedSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    playNote(ctx, 440, now, 0.18, 0.3, 'sine');
    playNote(ctx, 349.23, now + 0.1, 0.25, 0.25, 'sine');
  } catch { /* audio not supported */ }
}
