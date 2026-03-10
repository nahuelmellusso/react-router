import React, { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Modal } from "~/components/modal/Modal";

type Props = {
  open: boolean;
  src: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
  aspect?: number;
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function cropToBlob(src: string, area: Area): Promise<Blob> {
  const image = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to crop image"))),
      "image/jpeg",
      0.92,
    );
  });
}

export function CropModal({ open, src, onCancel, onConfirm, aspect = 1 }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAreaPx(null);
      setBusy(false);
    }
  }, [open]);

  const onCropComplete = useCallback((_a: Area, px: Area) => setAreaPx(px), []);

  const save = useCallback(async () => {
    if (!areaPx) return;
    setBusy(true);
    try {
      const blob = await cropToBlob(src, areaPx);
      const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });
      onConfirm(file);
    } finally {
      setBusy(false);
    }
  }, [areaPx, onConfirm, src]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Crop avatar"
      description="Drag to reposition and use zoom."
      size="xl"
      closeOnOverlay={!busy}
      closeOnEsc={!busy}
      footer={
        <div className="flex items-center justify-between gap-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
            disabled={busy}
          />

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={save}
              className="rounded-lg px-3 py-2 text-sm bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              disabled={busy || !areaPx}
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      }
    >
      <div className="relative h-[50vh] max-h-[420px] bg-black rounded-xl overflow-hidden">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
    </Modal>
  );
}
