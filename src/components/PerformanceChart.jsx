import React from 'react';

/**
 * Monkeytype-style Interactive SVG Performance Graph
 * Plots WPM and Raw WPM over time with error marks
 */
export default function PerformanceChart({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-sm text-[var(--sub-color)]">
        የግራፍ መረጃ የለም (No chart data)
      </div>
    );
  }

  const width = 640;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 25, left: 40 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxSeconds = Math.max(1, timeline[timeline.length - 1]?.second || 1);
  const maxWpmVal = Math.max(
    40,
    ...timeline.map(t => Math.max(t.wpm || 0, t.rawWpm || 0))
  );
  const yMax = Math.ceil(maxWpmVal / 10) * 10 + 10;

  const getX = (second) => padding.left + (second / maxSeconds) * innerWidth;
  const getY = (val) => padding.top + innerHeight - (val / yMax) * innerHeight;

  // Build SVG path points
  const pointsWpm = timeline.map(t => `${getX(t.second)},${getY(t.wpm)}`).join(' ');
  const pointsRaw = timeline.map(t => `${getX(t.second)},${getY(t.rawWpm)}`).join(' ');

  // Area under curve for WPM
  const firstX = getX(timeline[0]?.second || 0);
  const lastX = getX(timeline[timeline.length - 1]?.second || maxSeconds);
  const baseY = getY(0);
  const areaD = `M ${firstX},${baseY} L ${pointsWpm.replace(/ /g, ' L ')} L ${lastX},${baseY} Z`;

  // Grid lines
  const yTicks = [0, Math.round(yMax / 2), yMax];
  const xTicks = [
    1,
    Math.round(maxSeconds / 2),
    maxSeconds
  ];

  return (
    <div className="w-full relative overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-44 overflow-visible font-mono text-[11px]"
      >
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--main-color)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--main-color)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & labels */}
        {yTicks.map(tick => (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={getY(tick)}
              x2={width - padding.right}
              y2={getY(tick)}
              stroke="var(--sub-alt-color)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={getY(tick) + 4}
              textAnchor="end"
              fill="var(--sub-color)"
              fontSize="10"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Vertical seconds labels */}
        {xTicks.map(sec => (
          <text
            key={sec}
            x={getX(sec)}
            y={height - 6}
            textAnchor="middle"
            fill="var(--sub-color)"
            fontSize="10"
          >
            {sec}s
          </text>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#wpmGradient)" />

        {/* Raw WPM line (faded) */}
        <polyline
          fill="none"
          stroke="var(--sub-color)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
          points={pointsRaw}
        />

        {/* Net WPM line (vibrant primary) */}
        <polyline
          fill="none"
          stroke="var(--main-color)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsWpm}
        />

        {/* Error points */}
        {timeline.map((t, idx) => {
          if (t.errors && t.errors > 0) {
            return (
              <g key={idx}>
                <circle
                  cx={getX(t.second)}
                  cy={getY(t.wpm)}
                  r="3.5"
                  fill="var(--error-color)"
                />
                <circle
                  cx={getX(t.second)}
                  cy={getY(t.wpm)}
                  r="6"
                  fill="var(--error-color)"
                  opacity="0.3"
                />
              </g>
            );
          }
          return null;
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mt-1 text-xs text-[var(--sub-color)] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[var(--main-color)] rounded-full"></span>
          <span>WPM (ቃላት/ደቂቃ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t border-dashed border-[var(--sub-color)]"></span>
          <span>Raw WPM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--error-color)]"></span>
          <span>ስህተቶች (Errors)</span>
        </div>
      </div>
    </div>
  );
}
