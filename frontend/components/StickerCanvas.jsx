"use client";

import { useEffect, useRef, useState } from "react";
import { mediaAPI, stickerAPI } from "../lib/api";

export default function StickerCanvas({ mediaItem, onClose, onSaved }) {
  const canvasRef = useRef(null);
  const [stickers, setStickers] = useState([]); // danh sách sticker từ API
  const [overlays, setOverlays] = useState([]); // sticker đã dán lên ảnh
  const [selected, setSelected] = useState(null); // overlay đang chọn
  const [bgImage, setBgImage] = useState(null); // HTMLImageElement của ảnh nền
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const CANVAS_W = 600;
  const CANVAS_H = 450;

  // Load sticker list + ảnh nền
  useEffect(() => {
    stickerAPI
      .getAll()
      .then((d) => setStickers(d.stickers || []))
      .catch(console.error);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImage(img);
    img.src = mediaItem.file_url;

    // Load overlay hiện có từ DB (nếu có)
    // mediaItem.overlays được truyền từ trang album
    if (mediaItem.overlays?.length) {
      const loaded = mediaItem.overlays.map((o, i) => ({
        _key: i,
        id: o.id,
        sticker_id: o.sticker_id,
        image_url: o.image_url,
        x: (o.pos_x / 100) * CANVAS_W,
        y: (o.pos_y / 100) * CANVAS_H,
        scale: o.scale,
        rotation: o.rotation_deg,
        z_index: o.z_index,
      }));
      setOverlays(loaded);
    }
  }, [mediaItem]);

  // Vẽ canvas mỗi khi bgImage hoặc overlays thay đổi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Vẽ ảnh nền cover
    const scale = Math.min(CANVAS_W / bgImage.width, CANVAS_H / bgImage.height);
    const dw = bgImage.width * scale;
    const dh = bgImage.height * scale;
    const dx = (CANVAS_W - dw) / 2;
    const dy = (CANVAS_H - dh) / 2;
    ctx.drawImage(bgImage, dx, dy, dw, dh);

    // Vẽ sticker overlays theo z_index
    const sorted = [...overlays].sort((a, b) => a.z_index - b.z_index);
    sorted.forEach((ov) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const size = 80 * ov.scale;
        ctx.save();
        ctx.translate(ov.x, ov.y);
        ctx.rotate((ov.rotation * Math.PI) / 180);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);

        // Viền khi đang chọn
        if (selected?._key === ov._key) {
          ctx.strokeStyle = "var(--primary, #e85d04)";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.strokeRect(-size / 2 - 4, -size / 2 - 4, size + 8, size + 8);
        }
        ctx.restore();
      };
      img.src = ov.image_url;
    });
  }, [bgImage, overlays, selected]);

  // Thêm sticker vào giữa canvas
  const addSticker = (sticker) => {
    const newOv = {
      _key: Date.now(),
      sticker_id: sticker.id,
      image_url: sticker.image_url,
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      scale: 1,
      rotation: 0,
      z_index: overlays.length,
    };
    setOverlays((prev) => [...prev, newOv]);
    setSelected(newOv);
  };

  // Hit-test: tìm overlay gần điểm click nhất
  const hitTest = (cx, cy) => {
    const sorted = [...overlays].sort((a, b) => b.z_index - a.z_index);
    return (
      sorted.find((ov) => {
        const size = (80 * ov.scale) / 2 + 10;
        return Math.abs(cx - ov.x) < size && Math.abs(cy - ov.y) < size;
      }) || null
    );
  };

  const getCanvasPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const onMouseDown = (e) => {
    const pos = getCanvasPos(e);
    const hit = hitTest(pos.x, pos.y);
    setSelected(hit);
    if (hit) {
      setDragging(true);
      setDragStart({ x: pos.x - hit.x, y: pos.y - hit.y });
    }
  };

  const onMouseMove = (e) => {
    if (!dragging || !selected) return;
    const pos = getCanvasPos(e);
    setOverlays((prev) =>
      prev.map((ov) =>
        ov._key === selected._key
          ? { ...ov, x: pos.x - dragStart.x, y: pos.y - dragStart.y }
          : ov,
      ),
    );
    setSelected((prev) =>
      prev ? { ...prev, x: pos.x - dragStart.x, y: pos.y - dragStart.y } : prev,
    );
  };

  const onMouseUp = () => setDragging(false);

  const deleteSelected = () => {
    if (!selected) return;
    setOverlays((prev) => prev.filter((ov) => ov._key !== selected._key));
    setSelected(null);
  };

  const adjustSelected = (prop, delta) => {
    if (!selected) return;
    setOverlays((prev) =>
      prev.map((ov) =>
        ov._key === selected._key
          ? { ...ov, [prop]: Math.max(0.2, ov[prop] + delta) }
          : ov,
      ),
    );
    setSelected((prev) =>
      prev ? { ...prev, [prop]: Math.max(0.2, prev[prop] + delta) } : prev,
    );
  };

  // Lưu lên DB
  const handleSave = async () => {
    setSaving(true);
    try {
      // Xóa overlay cũ có id (đã lưu DB)
      const existing = overlays.filter((ov) => ov.id);
      for (const ov of existing) {
        await mediaAPI.deleteSticker(ov.id);
      }
      // Lưu tất cả overlay hiện tại
      for (const ov of overlays) {
        await mediaAPI.addSticker(mediaItem.id, {
          sticker_id: ov.sticker_id,
          pos_x: (ov.x / CANVAS_W) * 100,
          pos_y: (ov.y / CANVAS_H) * 100,
          scale: ov.scale,
          rotation_deg: ov.rotation,
          z_index: ov.z_index,
        });
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      alert("Lưu thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: CANVAS_W,
        }}
      >
        <h2 style={{ color: "#fff", fontWeight: 700 }}>✨ Thêm sticker</h2>
        <button onClick={onClose} style={{ color: "#fff", fontSize: "1.3rem" }}>
          ✕
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          maxWidth: "100%",
          borderRadius: 12,
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
      />

      {/* Controls cho sticker đang chọn */}
      {selected && (
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button onClick={() => adjustSelected("scale", 0.1)} style={ctrlBtn}>
            🔍+
          </button>
          <button onClick={() => adjustSelected("scale", -0.1)} style={ctrlBtn}>
            🔍-
          </button>
          <button
            onClick={() => adjustSelected("rotation", 15)}
            style={ctrlBtn}
          >
            ↩ +15°
          </button>
          <button
            onClick={() => adjustSelected("rotation", -15)}
            style={ctrlBtn}
          >
            ↪ -15°
          </button>
          <button
            onClick={deleteSelected}
            style={{ ...ctrlBtn, background: "#dc2626" }}
          >
            🗑 Xóa
          </button>
        </div>
      )}

      {/* Sticker picker */}
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          overflowX: "auto",
          maxWidth: CANVAS_W,
          padding: ".5rem",
          background: "rgba(255,255,255,.1)",
          borderRadius: 10,
        }}
      >
        {stickers.map((s) => (
          <img
            key={s.id}
            src={s.image_url}
            alt={s.name}
            title={s.name}
            onClick={() => addSticker(s)}
            style={{
              width: 48,
              height: 48,
              flexShrink: 0,
              cursor: "pointer",
              borderRadius: 8,
              border: "2px solid transparent",
              transition: "border-color .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--primary, #e85d04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "transparent")
            }
          />
        ))}
        {!stickers.length && (
          <p
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: ".85rem",
              padding: ".5rem",
            }}
          >
            Admin chưa thêm sticker nào
          </p>
        )}
      </div>

      {/* Lưu */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: "var(--primary, #e85d04)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: ".7rem 2rem",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Đang lưu..." : "💾 Lưu sticker"}
      </button>
    </div>
  );
}

const ctrlBtn = {
  background: "rgba(255,255,255,.15)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: ".4rem .8rem",
  cursor: "pointer",
  fontSize: ".85rem",
};
