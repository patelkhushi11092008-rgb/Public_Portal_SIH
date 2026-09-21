import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Maximize2 } from 'lucide-react';

export default function ImageContainer({
  src,
  alt = 'Site ground photo evidence',
  caption,
  locationTag,
  dateTag,
  aspectRatio = 'aspect-video',
  className = '',
  allowZoom = true,
}) {
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div
        className={`relative group overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${className}`}
      >
        <div className={`w-full ${aspectRatio} relative overflow-hidden bg-slate-900/5`}>
          {!hasError && src ? (
            <img
              src={src}
              alt={alt}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 p-4">
              <Camera className="w-8 h-8 text-slate-400 mb-2 stroke-[1.5]" />
              <span className="text-xs font-medium text-slate-600">
                Ground Evidence Photo
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Geotagged citizen submission
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
            {locationTag && (
              <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                {locationTag}
              </span>
            )}
            {dateTag && (
              <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm">
                <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                {dateTag}
              </span>
            )}
          </div>

          {/* Zoom button */}
          {allowZoom && src && !hasError && (
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              aria-label="View enlarged photo"
              className="absolute bottom-2 right-2 p-1.5 bg-slate-900/75 hover:bg-slate-900 text-white rounded shadow transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {caption && (
          <div className="px-3 py-2 bg-white border-t border-slate-100 text-xs text-slate-600 leading-snug">
            {caption}
          </div>
        )}
      </div>

      {/* Simple Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-slate-900 rounded-lg p-2 overflow-hidden">
            <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain rounded" />
            {caption && (
              <p className="text-xs text-white/80 text-center mt-2 px-4">{caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
