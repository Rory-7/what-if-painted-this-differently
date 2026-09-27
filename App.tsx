import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Workspace from "./components/Workspace";

type Stage = "landing" | "workspace";

/**
 * App
 * Root component: swaps between the landing page and the transformation
 * workspace, and owns the uploaded image state shared between them.
 */
export default function App() {
  const [stage, setStage] = useState<Stage>("landing");
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImg(img);
        setOriginalSrc(e.target?.result as string);
        setStage("workspace");
      };
      img.onerror = () => setUploadError("This file could not be read as an image.");
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setUploadError("This file could not be read.");
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setStage("landing");
    setOriginalImg(null);
    setOriginalSrc(null);
  };

  return (
    <div className="font-sans">
      {uploadError && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 text-sm z-50 font-sans"
          style={{ background: "#FBEFE9", color: "#8A3B24", border: "1px solid #E7B7A5" }}
        >
          {uploadError}
        </div>
      )}

      {stage === "landing" || !originalImg || !originalSrc ? (
        <LandingPage onUpload={handleUpload} />
      ) : (
        <Workspace originalImg={originalImg} originalSrc={originalSrc} onReset={handleReset} />
      )}
    </div>
  );
}
