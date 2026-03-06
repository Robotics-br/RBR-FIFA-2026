import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, SwitchCamera, ImagePlus } from 'lucide-react';

interface CameraModalProps {
  open: boolean;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export default function CameraModal({ open, onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setReady(false);
  }, []);

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopCamera();
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setReady(true);
        };
      }
    } catch {
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  }, [stopCamera]);

  useEffect(() => {
    if (open) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return stopCamera;
  }, [open, facingMode, startCamera, stopCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    stopCamera();
    onCapture(dataUrl);
  }, [onCapture, stopCamera]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const size = Math.min(img.width, img.height);
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d')!;
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onCapture(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onCapture]);

  const handleSwitch = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="camera-overlay">
      <div className="camera-container">
        <button className="camera-close-btn" onClick={handleClose} aria-label="Fechar câmera">
          <X size={24} />
        </button>

        <div className="camera-viewfinder">
          {error ? (
            <div className="camera-error">
              <p>{error}</p>
              <button className="camera-fallback-btn" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus size={20} />
                Escolher da galeria
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-video ${ready ? 'ready' : ''}`}
            />
          )}
        </div>

        {!error && (
          <div className="camera-controls">
            <button className="camera-gallery-btn" onClick={() => fileInputRef.current?.click()} aria-label="Galeria">
              <ImagePlus size={22} />
            </button>
            <button className="camera-shutter" onClick={handleCapture} disabled={!ready} aria-label="Tirar foto">
              <div className="shutter-inner" />
            </button>
            <button className="camera-switch-btn" onClick={handleSwitch} aria-label="Trocar câmera">
              <SwitchCamera size={22} />
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="camera-canvas" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sticker-file-input"
          onChange={handleFileSelect}
        />
      </div>
    </div>,
    document.body,
  );
}
