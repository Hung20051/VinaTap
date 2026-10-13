"use client";

import React, { useState } from "react";

export default function VietnamItineraryMap({ onSelectDestination, activeId, lang = "en" }) {
  const [hoveredStop, setHoveredStop] = useState(null);

  const stops = [
    {
      id: "dest-hcmc",
      num: 1,
      name: "HO CHI MINH CITY",
      nameVi: "TP. HỒ CHÍ MINH",
      x: 320,
      y: 710,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
    {
      id: "dest-nhatrang",
      num: 2,
      name: "NHA TRANG",
      nameVi: "NHA TRANG",
      x: 418,
      y: 642,
      labelPos: "right",
      labelOffset: { x: 18, y: 0 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
    {
      id: "dest-danang",
      num: 3,
      name: "DA NANG",
      nameVi: "ĐÀ NẴNG",
      x: 350,
      y: 472,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
    {
      id: "dest-hoian",
      num: 4,
      name: "HOI AN",
      nameVi: "HỘI AN",
      x: 366,
      y: 504,
      labelPos: "right",
      labelOffset: { x: 18, y: 4 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
    {
      id: "dest-hanoi",
      num: 5,
      name: "HANOI",
      nameVi: "HÀ NỘI",
      x: 278,
      y: 226,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
    {
      id: "dest-halong",
      num: 6,
      name: "HA LONG",
      nameVi: "HẠ LONG",
      x: 342,
      y: 232,
      labelPos: "right",
      labelOffset: { x: 18, y: -2 },
      nights: "2 nights",
      nightsVi: "2 đêm",
    },
    {
      id: "dest-ninhbinh",
      num: 7,
      name: "NINH BINH",
      nameVi: "NINH BÌNH",
      x: 276,
      y: 278,
      labelPos: "left",
      labelOffset: { x: -18, y: 2 },
      nights: "3 nights",
      nightsVi: "3 đêm",
    },
  ];

  const handleClick = (id) => {
    if (onSelectDestination) {
      onSelectDestination(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("is-active-target");
        setTimeout(() => el.classList.remove("is-active-target"), 2000);
      }
    }
  };

  return (
    <div className="itin-map-card">
      <div className="itin-map-svg-wrap">
        <svg
          viewBox="0 0 620 860"
          className="itin-map-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>
            <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* ─── VIETNAM BASE MAP OUTLINE (High Resolution Shaded Silhouette) ─── */}
          <g filter="url(#mapShadow)">
            {/* Northern Region */}
            <path
              d="M 175 160 
                 C 195 120, 245 105, 305 130 
                 C 345 145, 375 160, 405 185 
                 C 385 200, 360 215, 360 235 
                 C 360 248, 335 255, 320 270 
                 C 305 285, 290 310, 275 320 
                 C 255 295, 235 275, 215 250 
                 C 185 220, 165 190, 175 160 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.8"
            />
            {/* Provincial boundaries inside Northern Region */}
            <path
              d="M 235 150 Q 255 195 275 225
                 M 275 225 Q 315 220 345 230
                 M 275 225 Q 265 260 275 280
                 M 300 135 Q 320 175 345 195
                 M 215 200 Q 250 210 275 225"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Central Region (S-shape curve) */}
            <path
              d="M 275 320 
                 C 285 345, 305 380, 325 415 
                 C 335 435, 345 460, 355 480 
                 C 365 500, 370 525, 375 550 
                 C 385 580, 395 610, 420 635 
                 C 425 650, 420 665, 410 680 
                 C 390 670, 375 640, 365 605 
                 C 355 570, 340 530, 330 495 
                 C 320 460, 300 425, 285 385 
                 C 275 355, 270 335, 275 320 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.8"
            />
            {/* Central Region Boundaries */}
            <path
              d="M 325 415 Q 340 445 350 475
                 M 350 475 Q 360 495 365 510
                 M 365 510 Q 375 565 390 600
                 M 390 600 Q 405 625 418 642"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Southern Region */}
            <path
              d="M 410 680 
                 C 395 700, 385 715, 365 730 
                 C 345 745, 325 765, 305 790 
                 C 285 805, 260 815, 245 800 
                 C 235 780, 240 760, 260 740 
                 C 280 720, 310 700, 330 680 
                 C 350 660, 380 655, 410 680 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.8"
            />
            {/* Southern Region Boundaries */}
            <path
              d="M 365 730 Q 330 735 305 750
                 M 330 680 Q 330 710 320 740
                 M 280 720 Q 295 760 305 790"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Vietnam Islands (Hoàng Sa & Trường Sa & Phú Quốc) */}
            {/* Paracel Islands (Hoàng Sa) */}
            <g opacity="0.8">
              <ellipse cx="465" cy="450" rx="4" ry="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="480" cy="460" rx="5" ry="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="472" cy="470" rx="3.5" ry="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="492" cy="475" rx="4.5" ry="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
            </g>
            {/* Spratly Islands (Trường Sa) */}
            <g opacity="0.8">
              <ellipse cx="505" cy="670" rx="5" ry="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="525" cy="685" rx="4" ry="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="540" cy="710" rx="4.5" ry="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <ellipse cx="515" cy="725" rx="3.5" ry="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
            </g>
            {/* Phu Quoc Island */}
            <path
              d="M 215 780 C 220 770, 226 785, 222 795 C 218 805, 212 795, 215 780 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
          </g>

          {/* ─── ROUTE PATHS ─── */}
          {/* 1. Train Route: HCMC -> Nha Trang -> Da Nang (Solid Green) */}
          <path
            d="M 320 710 
               Q 370 705 385 675 
               Q 405 660 418 642
               Q 395 580 375 530
               Q 360 495 350 472"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Bus Route: Da Nang -> Hoi An (Solid Dark Gray) */}
          <path
            d="M 350 472 Q 358 488 366 504"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* 3. Plane Route: Hoi An / Da Nang -> Hanoi (Cyan Dashed Curve) */}
          <path
            d="M 366 504 
               C 420 440, 410 320, 278 226"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.8"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          {/* Plane Icon on flight curve */}
          <g transform="translate(372, 335) rotate(-55)">
            <path
              d="M 0 -7 L 2 -1 L 8 2 L 2 3 L 1 7 L -1 7 L -2 3 L -8 2 L -2 -1 Z"
              fill="#06b6d4"
            />
          </g>

          {/* 4. Bus Route: Hanoi -> Ha Long (Solid Dark Gray) */}
          <path
            d="M 278 226 Q 310 224 342 232"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* 5. Bus Route: Hanoi -> Ninh Binh (Solid Dark Gray) */}
          <path
            d="M 278 226 Q 272 255 276 278"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* ─── 7 NUMBERED PINS AND LABELS ─── */}
          {stops.map((stop) => {
            const isHovered = hoveredStop === stop.id;
            const isActive = activeId === stop.id;

            return (
              <g
                key={stop.id}
                className="map-pin-group"
                onClick={() => handleClick(stop.id)}
                onMouseEnter={() => setHoveredStop(stop.id)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Pin Teardrop Shape */}
                <g transform={`translate(${stop.x}, ${stop.y})`} filter="url(#pinShadow)">
                  {/* Pin Background Shape */}
                  <path
                    d="M 0 0 C -7 -10, -11 -16, -11 -22 C -11 -28.5, -6 -33.5, 0 -33.5 C 6 -33.5, 11 -28.5, 11 -22 C 11 -16, 7 -10, 0 0 Z"
                    fill={isActive || isHovered ? "#0284c7" : "#ef4444"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* White circle inside pin */}
                  <circle cx="0" cy="-22" r="7.5" fill="#ffffff" />
                  {/* Number inside pin */}
                  <text
                    x="0"
                    y="-19"
                    textAnchor="middle"
                    fill={isActive || isHovered ? "#0284c7" : "#b91c1c"}
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    {stop.num}
                  </text>
                </g>

                {/* Destination Label Pill Box */}
                <g
                  className="map-pin-label"
                  transform={`translate(${stop.x + stop.labelOffset.x}, ${stop.y - 22 + stop.labelOffset.y})`}
                >
                  {stop.labelPos === "left" ? (
                    <g>
                      <rect
                        x="-102"
                        y="-11"
                        width="96"
                        height="20"
                        rx="10"
                        fill="#ffffff"
                        stroke={isActive || isHovered ? "#0284c7" : "#475569"}
                        strokeWidth="1.2"
                        filter="url(#pinShadow)"
                      />
                      <text
                        x="-54"
                        y="3"
                        textAnchor="middle"
                        fill={isActive || isHovered ? "#0284c7" : "#0f172a"}
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="sans-serif"
                        letterSpacing="0.04em"
                      >
                        {lang === "vi" ? stop.nameVi : stop.name}
                      </text>
                    </g>
                  ) : (
                    <g>
                      <rect
                        x="6"
                        y="-11"
                        width="88"
                        height="20"
                        rx="10"
                        fill="#ffffff"
                        stroke={isActive || isHovered ? "#0284c7" : "#475569"}
                        strokeWidth="1.2"
                        filter="url(#pinShadow)"
                      />
                      <text
                        x="50"
                        y="3"
                        textAnchor="middle"
                        fill={isActive || isHovered ? "#0284c7" : "#0f172a"}
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="sans-serif"
                        letterSpacing="0.04em"
                      >
                        {lang === "vi" ? stop.nameVi : stop.name}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* ─── MAP LEGEND (BOTTOM RIGHT) ─── */}
          <g transform="translate(435, 730)">
            <rect
              x="0"
              y="0"
              width="145"
              height="80"
              rx="10"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="#e2e8f0"
              strokeWidth="1"
              filter="url(#pinShadow)"
            />
            {/* Train item */}
            <line x1="16" y1="22" x2="48" y2="22" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" />
            <text x="58" y="26" fontSize="12" fontWeight="600" fill="#334155" fontFamily="sans-serif">
              {lang === "vi" ? "Tàu hỏa (Train)" : "Train"}
            </text>

            {/* Bus item */}
            <line x1="16" y1="44" x2="48" y2="44" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
            <text x="58" y="48" fontSize="12" fontWeight="600" fill="#334155" fontFamily="sans-serif">
              {lang === "vi" ? "Xe buýt (Bus)" : "Bus"}
            </text>

            {/* Plane item */}
            <line x1="16" y1="64" x2="48" y2="64" stroke="#06b6d4" strokeWidth="2.6" strokeDasharray="5 4" strokeLinecap="round" />
            <text x="58" y="68" fontSize="12" fontWeight="600" fill="#334155" fontFamily="sans-serif">
              {lang === "vi" ? "Máy bay (Plane)" : "Plane"}
            </text>
          </g>

          {/* ─── COPYRIGHT WATERMARK (BOTTOM LEFT) ─── */}
          <text
            x="40"
            y="830"
            fill="#64748b"
            fontSize="13"
            fontWeight="500"
            fontFamily="sans-serif"
          >
            © VinaTap
          </text>
        </svg>
      </div>
    </div>
  );
}
