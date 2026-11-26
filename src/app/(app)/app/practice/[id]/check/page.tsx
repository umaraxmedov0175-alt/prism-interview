'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Camera, CameraOff, Mic, MicOff, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DeviceCheckPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [micLevel, setMicLevel] = useState(0);
  const [micReady, setMicReady] = useState(false);
  const [micError, setMicError] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    let audioCtx: AudioContext | null = null;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setMicReady(true);

        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!active) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setMicError('Microphone permission denied or unavailable. You can still use text fallback.');
      }
    }

    void initMic();

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtx?.close();
    };
  }, []);

  async function toggleCamera() {
    setCameraError('');
    if (cameraOn) {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraOn(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch {
      setCameraError('Camera unavailable. Camera is optional.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Device Check</h1>
        <p className="text-sm text-text-muted">
          Verify your microphone and optional camera before entering the live interview room.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Audio & Video Preview</CardTitle>
            <Badge variant={micReady ? 'success' : 'warning'}>
              <Wifi className="h-3 w-3" />
              {micReady ? 'Ready' : 'Text fallback ready'}
            </Badge>
          </div>
          <CardDescription>
            Eye-contact tracking (when camera is on) runs 100% on-device in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mic Level Meter */}
          <div className="space-y-2 rounded-[8px] border border-border bg-bg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-text">
                {micReady ? (
                  <Mic className="h-4 w-4 text-success" />
                ) : (
                  <MicOff className="h-4 w-4 text-text-muted" />
                )}
                Microphone Level
              </span>
              <span className="font-mono text-xs text-text-muted">{micLevel}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-75"
                style={{ width: `${micLevel}%` }}
              />
            </div>
            {micError && <p className="text-xs text-warning">{micError}</p>}
          </div>

          {/* Optional Camera Preview */}
          <div className="space-y-3 rounded-[8px] border border-border bg-bg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">Camera (optional)</span>
              <Button type="button" size="sm" variant="outline" onClick={toggleCamera}>
                {cameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                {cameraOn ? 'Turn off camera' : 'Enable camera'}
              </Button>
            </div>
            {cameraOn && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full rounded-[8px] border border-border bg-black object-cover"
              />
            )}
            {cameraError && <p className="text-xs text-warning">{cameraError}</p>}
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push(`/app/practice/${params.id}/live`)}
          >
            Enter interview room
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
