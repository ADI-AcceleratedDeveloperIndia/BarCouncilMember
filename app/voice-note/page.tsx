"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VoiceNoteContent() {
  const searchParams = useSearchParams();
  const voiceNoteUrl = searchParams.get("url");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!voiceNoteUrl) {
      setError("No voice note URL provided");
      setIsLoading(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Auto-play when page loads (with user interaction)
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      // Auto-play if user interacted with the page (clicked notification)
      audio.play().catch((err) => {
        console.error("Auto-play failed:", err);
        setError("Please click play to listen to the voice note");
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError("Failed to load voice note. Please check the URL.");
      setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [voiceNoteUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Play failed:", err);
        setError("Failed to play voice note. Please try again.");
      });
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!voiceNoteUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold mb-4">No Voice Note</h1>
          <p className="text-white">No voice note URL provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black border border-gold rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gold mb-6 gold-text-shimmer">
          Voice Note
        </h1>

        <audio ref={audioRef} src={voiceNoteUrl} preload="metadata" className="hidden" />

        {error ? (
          <div className="text-red-400 mb-4">{error}</div>
        ) : (
          <>
            {isLoading && (
              <div className="text-white mb-4">Loading voice note...</div>
            )}

            {/* Audio Player Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 mx-auto bg-gold text-black rounded-full flex items-center justify-center hover:bg-yellow-400 gold-glow-hover transition-all active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}

        {/* Back Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 text-gold hover:text-yellow-400 underline transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default function VoiceNotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white">Loading voice note player...</div>
        </div>
      </div>
    }>
      <VoiceNoteContent />
    </Suspense>
  );
}
