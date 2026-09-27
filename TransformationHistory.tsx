import React from "react";
import type { HistoryEntry } from "../types";

interface TransformationHistoryProps {
  history: HistoryEntry[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * TransformationHistory
 * Lists every version the user has produced in this session, letting them
 * jump back to (or branch from) any earlier state.
 */
export default function TransformationHistory({ history, activeIndex, onSelect }: TransformationHistoryProps) {
  if (history.length <= 1) return null;

  return (
    <div>
      <p className="font-sans text-bronze text-xs tracking-wide mb-3">History</p>
      <div className="flex flex-col gap-1">
        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150"
            style={{ background: i === activeIndex ? "#EDE9E0" : "transparent" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: i === activeIndex ? "#B54B3A" : "#C9C3B6" }}
            />
            <span className="font-sans text-ink text-sm">{h.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
