'use client';

import { useEffect, useState, useCallback } from 'react';

export default function Slideshow({ media = [], onClose }) {
  const [index,   setIndex]   = useState(0);
  const [playing, setPlaying] = useState(true);

  const current = media[index];

  const next = useCallback(() =>
    setIndex(i => (i + 1) % media.length), [media.length]);

  const prev = () =>
    setIndex(i => (i - 1 + media.length) % media.length);

  // Auto-advance mỗi 4 giây (chỉ khi đang phát và là ảnh)
  useEffect(() => {
    if (!playing || !media.length || current?.media_type === 'video') return;
    const t = setTimeout(next, 4000);
    return () => clearTimeout(t);
  }, [playing, index, next, current, media.length]);

  // Phím tắt
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'Escape')     onClose?.();
      if (e.key === ' ')          setPlaying(p => !p);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, onClose]);

  if (!media.length) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,.95)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Đóng */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '1rem', right: '1rem',
        color: '#fff', fontSize: '1.5rem', opacity: .8,
      }}>✕</button>

      {/* Số thứ tự */}
      <div style={{
        position: 'absolute', top: '1rem', left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff', fontSize: '.85rem', opacity: .7,
      }}>
        {index + 1} / {media.length}
      </div>

      {/* Media */}
      <div style={{ maxWidth: '90vw', maxHeight: '75vh', position: 'relative' }}>
        {current?.media_type === 'video' ? (
          <video
            key={current.id}
            src={current.file_url}
            controls autoPlay
            style={{ maxWidth: '90vw', maxHeight: '75vh', borderRadius: 8 }}
            onEnded={next}
          />
        ) : (
          <img
            key={current?.id}
            src={current?.file_url}
            alt={current?.caption_user || current?.caption_ai || ''}
            style={{
              maxWidth: '90vw', maxHeight: '75vh',
              objectFit: 'contain', borderRadius: 8,
              transition: 'opacity .3s',
            }}
          />
        )}
      </div>

      {/* Caption */}
      {(current?.caption_user || current?.caption_ai) && (
        <p style={{
          color: '#fff', marginTop: '1rem',
          maxWidth: 560, textAlign: 'center',
          fontSize: '.9rem', opacity: .85,
          padding: '0 1rem',
        }}>
          {current.caption_user || current.caption_ai}
        </p>
      )}

      {/* Điều khiển */}
      <div style={{
        display: 'flex', gap: '1rem', marginTop: '1.25rem',
        alignItems: 'center',
      }}>
        <button onClick={prev} style={btnStyle}>◀</button>

        <button
          onClick={() => setPlaying(p => !p)}
          style={{ ...btnStyle, minWidth: 80 }}
        >
          {playing ? '⏸ Dừng' : '▶ Phát'}
        </button>

        <button onClick={next} style={btnStyle}>▶</button>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        display: 'flex', gap: '.4rem',
        overflowX: 'auto', maxWidth: '90vw',
        marginTop: '1rem', padding: '.5rem 0',
      }}>
        {media.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setIndex(i)}
            style={{
              width: 56, height: 40, flexShrink: 0,
              borderRadius: 4, overflow: 'hidden',
              cursor: 'pointer',
              border: i === index ? '2px solid var(--primary)' : '2px solid transparent',
              opacity: i === index ? 1 : 0.55,
            }}
          >
            <img
              src={m.thumbnail_url || m.file_url}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'rgba(255,255,255,.15)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '.5rem 1rem',
  fontSize: '.9rem',
  cursor: 'pointer',
};