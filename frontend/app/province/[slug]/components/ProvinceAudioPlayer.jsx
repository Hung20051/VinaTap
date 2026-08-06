"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles } from "lucide-react";

export default function ProvinceAudioPlayer({ province, landmarks = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const sentencesRef = useRef([]);
  const currentSentenceIdx = useRef(0);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const prepareSpeechText = () => {
    if (!province) return "";
    let text = `Chào mừng bạn đến với ${province.name}. `;
    if (province.description) {
      text += `${province.description}. `;
    }
    if (province.specialties) {
      text += `Đặc sản và ẩm thực nổi tiếng tại đây gồm có ${province.specialties}. `;
    }
    if (landmarks.length > 0) {
      const landmarkNames = landmarks.slice(0, 4).map((l) => l.name).join(", ");
      text += `Các danh thắng nổi tiếng bạn không nên bỏ qua bao gồm: ${landmarkNames}. `;
    }
    text += `Chúc bạn có một chuyến đi tuyệt vời cùng VinaTap!`;
    return text;
  };

  // ─── ENGINE 1: BACKEND PROXY TTS (Google Neural Voice MP3) ────────
  const playProxyTts = (index) => {
    const sentences = sentencesRef.current;
    if (!sentences || index >= sentences.length) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    currentSentenceIdx.current = index;
    const sentence = sentences[index];
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const ttsUrl = `${API_BASE}/provinces/tts/stream?text=${encodeURIComponent(sentence)}`;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(ttsUrl);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    audio.playbackRate = speed;
    audio.volume = isMuted ? 0 : 1;

    audio.onended = () => {
      const nextIdx = index + 1;
      const pct = Math.round((nextIdx / sentences.length) * 100);
      setProgress(pct);
      playProxyTts(nextIdx);
    };

    audio.onerror = () => {
      // Fallback sang Web Speech Synthesis nếu proxy gặp sự cố
      playWebSpeechFallback();
    };

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        playWebSpeechFallback();
      });
  };

  // ─── ENGINE 2: WEB SPEECH SYNTHESIS FALLBACK ─────────────────────
  const playWebSpeechFallback = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const fullText = prepareSpeechText();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "vi-VN";
    utterance.rate = speed * 0.95;
    utterance.volume = isMuted ? 0 : 1;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const startAudio = () => {
    const fullText = prepareSpeechText();
    if (!fullText) return;

    // Tách câu ngắn dưới 120 ký tự để nạp audio mượt mà
    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    sentencesRef.current = sentences;
    playProxyTts(0);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : 1;
    }
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  if (!province) return null;

  return (
    <div className="province-audio-card card">
      <div className="province-audio-header">
        <div className="province-audio-title">
          <Radio size={20} className="province-audio-icon-radio" />
          <div>
            <h3>🎧 Audio Thuyết Minh Du Lịch {province.name}</h3>
            <p>Giọng đọc tự nhiên thuyết minh văn hóa, ẩm thực &amp; danh thắng</p>
          </div>
        </div>
        <div className="province-audio-badge">
          <Sparkles size={13} /> Giọng đọc chuẩn Việt Nam
        </div>
      </div>

      <div className="province-audio-controls">
        <button
          type="button"
          className={`province-audio-play-btn ${isPlaying ? "is-playing" : ""}`}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
        </button>

        <div className="province-audio-track">
          <div className="province-audio-bar-wrap">
            <div
              className="province-audio-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="province-audio-status-text">
            <span>
              {isPlaying
                ? "🔊 Đang phát thuyết minh giọng đọc tiếng Việt mượt mà..."
                : "Bấm Play để bắt đầu nghe thuyết minh du lịch"}
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="province-audio-side-btns">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleSpeed}
            title="Tốc độ đọc"
          >
            {speed}x
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
