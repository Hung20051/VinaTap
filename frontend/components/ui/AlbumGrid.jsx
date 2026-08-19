'use client';

import { useState } from 'react';
import Slideshow from "@/components/ui/Slideshow";

export default function AlbumGrid({ media = [], tags = [] }) {
  const [activeTag,    setActiveTag]    = useState('all');
  const [slideIndex,   setSlideIndex]   = useState(null); // null = ẩn slideshow

  const tagMap = new Map(tags.map(t => [t.id, t]));

  // Lọc theo tag
  const filtered = activeTag === 'all'
    ? media
    : media.filter(m => {
        const mTags = (m.tags || '').split(',').filter(Boolean);
        const tag   = tags.find(t => t.label === activeTag);
        return tag && mTags.includes(tag.label);
      });

  if (!media.length) return null;

  return (
    <div>
      {/* Tag filter */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {['all', ...tags.map(t => t.label)].map(label => (
            <button
              key={label}
              onClick={() => setActiveTag(label)}
              style={{
                padding: '.3rem .8rem',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontSize: '.8rem',
                fontWeight: 600,
                background: activeTag === label ? 'var(--primary)' : 'var(--border)',
                color:      activeTag === label ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {label === 'all' ? 'Tất cả' : label}
            </button>
          ))}
        </div>
      )}

      {/* Slideshow button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.75rem' }}>
        <button
          onClick={() => setSlideIndex(0)}
          style={{
            padding: '.4rem 1rem', borderRadius: 999,
            background: 'var(--primary)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600,
          }}
        >
          ▶ Xem slideshow
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '.75rem',
      }}>
        {filtered.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setSlideIndex(i)}
            style={{
              borderRadius: 10, overflow: 'hidden',
              cursor: 'pointer', position: 'relative',
              aspectRatio: '1',
              background: '#000',
            }}
          >
            <img
              src={m.thumbnail_url || m.file_url}
              alt={m.caption_user || m.caption_ai || ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {m.media_type === 'video' && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,.3)',
                fontSize: '1.6rem',
              }}>▶</div>
            )}
            {/* Caption hover */}
            {(m.caption_user || m.caption_ai) && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,.7))',
                padding: '.5rem .6rem',
                fontSize: '.72rem', color: '#fff',
                opacity: 0,
                transition: 'opacity .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                {m.caption_user || m.caption_ai}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slideshow overlay */}
      {slideIndex !== null && (
        <Slideshow
          media={filtered}
          onClose={() => setSlideIndex(null)}
        />
      )}
    </div>
  );
}