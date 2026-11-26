'use client';

import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TranscriptLine } from '@/components/interview/TranscriptLine';

interface ReplayTurn {
  speaker: 'ai' | 'user';
  text: string;
  startMs: number;
  endMs: number;
}

interface ReplayPlayerProps {
  turns: ReplayTurn[];
  audioUrl?: string | null;
}

export function ReplayPlayer({ turns, audioUrl }: ReplayPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  function handleJump(idx: number, startMs: number) {
    setActiveIdx(idx);
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = startMs / 1000;
      void audioRef.current.play();
      setPlaying(true);
    }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="space-y-3">
      {audioUrl && (
        <div className="flex items-center gap-3 rounded-[8px] border border-border bg-bg p-3">
          <Button type="button" size="sm" variant="outline" onClick={togglePlay}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Play recording'}
          </Button>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setPlaying(false)}
            className="w-full"
            controls
          />
        </div>
      )}

      <div className="space-y-2">
        {turns.map((turn, idx) => {
          const sec = Math.floor(turn.startMs / 1000);
          const mm = String(Math.floor(sec / 60)).padStart(2, '0');
          const ss = String(sec % 60).padStart(2, '0');
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleJump(idx, turn.startMs)}
              className={`block w-full text-left transition-opacity ${
                activeIdx === idx ? 'ring-2 ring-primary rounded-[8px]' : 'hover:opacity-90'
              }`}
            >
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="font-mono text-[11px] text-text-muted">
                  {mm}:{ss}
                </span>
                {audioUrl && (
                  <span className="text-[11px] text-primary">Jump to timestamp</span>
                )}
              </div>
              <TranscriptLine speaker={turn.speaker} text={turn.text} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
