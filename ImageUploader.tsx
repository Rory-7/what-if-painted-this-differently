import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

function IconUpload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
      <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * ImageUploader
 * Handles both the primary "Upload a Painting" button and the drag-and-drop
 * zone on the landing page. Validates that the dropped/selected file is an
 * image before handing it off.
 */
export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="group inline-flex items-center gap-3 px-7 py-4 bg-ink text-cream font-medium transition-colors duration-200 hover:bg-clay"
      >
        <IconUpload className="w-4 h-4" />
        Upload a Painting
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />

      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="mt-10 py-16 px-8 text-center transition-all duration-200 cursor-pointer border"
        style={{
          borderColor: dragActive ? "#B54B3A" : "#E4E0D6",
          background: dragActive ? "rgba(181,75,58,0.03)" : "transparent",
        }}
      >
        <p className="text-sm text-muted font-sans">
          Drag a painting here, or click to browse — JPG, PNG, WebP
        </p>
      </section>
    </>
  );
}
