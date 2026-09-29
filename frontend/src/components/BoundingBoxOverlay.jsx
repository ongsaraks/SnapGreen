import React from 'react';
import { getClassMeta } from '../config/trashClasses';

export default function BoundingBoxOverlay({ predictions = [] }) {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {predictions.map((pred, idx) => {
        const box = pred.bounding_box || {};
        const meta = getClassMeta(pred.raw_class);

        // Get styled colors (custom override or fallback)
        const borderColor = pred.box_color || meta.boxBorder || '#FF2E2E';
        const badgeBg = pred.badge_bg || meta.badgeBg || '#E60000';
        const badgeText = pred.badge_text || meta.badgeText || '#FFFFFF';
        const labelText = pred.thai_name || meta.thaiName || pred.raw_class;

        const left = `${box.left_pct ?? 10}%`;
        const top = `${box.top_pct ?? 10}%`;
        const width = `${box.width_pct ?? 30}%`;
        const height = `${box.height_pct ?? 30}%`;

        return (
          <div
            key={pred.id || idx}
            className="absolute rounded-2xl transition-all duration-300"
            style={{
              left,
              top,
              width,
              height,
              border: `2.5px solid ${borderColor}`,
              boxShadow: `0 0 12px ${borderColor}40`,
            }}
          >
            {/* Top Attached Badge Pill matching Figma design */}
            <div
              className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-t-lg text-[11px] font-bold tracking-wide shadow-sm flex items-center justify-center whitespace-nowrap"
              style={{
                backgroundColor: badgeBg,
                color: badgeText,
              }}
            >
              {labelText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
