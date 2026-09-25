/**
 * Haversine formula — returns distance in kilometres between two lat/lng points.
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns a Leaflet-compatible DivIcon HTML string for a project pin.
 * @param {string} color  – hex colour matching project status
 * @param {boolean} pulse – animate ring for ACTIVE projects
 */
export function buildPinSvg(color, pulse = false) {
  return `
    <div style="position:relative;width:36px;height:36px;">
      ${pulse ? `<div style="
        position:absolute;top:0;left:0;width:36px;height:36px;
        border-radius:50%;border:2px solid ${color};
        animation:pingMap 1.6s ease-out infinite;opacity:0.6;
      "></div>` : ''}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" style="width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
        <path d="M18 2C10.3 2 4 8.3 4 16c0 10.5 14 26 14 26s14-15.5 14-26C32 8.3 25.7 2 18 2z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="18" cy="16" r="6" fill="white" opacity="0.9"/>
      </svg>
    </div>`;
}

/** Returns the status colour for a project's map pin. */
export function statusColor(status) {
  const map = {
    ACTIVE: '#059669',
    DELAYED: '#D97706',
    WORK_STOPPED: '#DC2626',
    NOT_STARTED: '#64748B',
    COMPLETED: '#1D4ED8',
  };
  return map[status] || '#64748B';
}
