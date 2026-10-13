"use client";

import React, { useState } from "react";

export default function VietnamExtendedItineraryMap({ lang = "en" }) {
  const [hoveredStop, setHoveredStop] = useState(null);

  const stops = [
    {
      id: "ext-hcmc",
      num: 1,
      name: "HO CHI MINH CITY",
      nameVi: "TP. HỒ CHÍ MINH",
      x: 320,
      y: 710,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
    },
    {
      id: "ext-dalat",
      num: 2,
      name: "DA LAT",
      nameVi: "ĐÀ LẠT",
      x: 365,
      y: 670,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
    },
    {
      id: "ext-nhatrang",
      num: 3,
      name: "NHA TRANG",
      nameVi: "NHA TRANG",
      x: 418,
      y: 642,
      labelPos: "right",
      labelOffset: { x: 18, y: 0 },
    },
    {
      id: "ext-hoian",
      num: 4,
      name: "HOI AN",
      nameVi: "HỘI AN",
      x: 366,
      y: 504,
      labelPos: "right",
      labelOffset: { x: 18, y: 4 },
    },
    {
      id: "ext-danang",
      num: 5,
      name: "DA NANG",
      nameVi: "ĐÀ NẴNG",
      x: 350,
      y: 472,
      labelPos: "right",
      labelOffset: { x: 18, y: -4 },
    },
    {
      id: "ext-hue",
      num: 6,
      name: "HUE",
      nameVi: "HUẾ",
      x: 325,
      y: 440,
      labelPos: "right",
      labelOffset: { x: 18, y: -2 },
    },
    {
      id: "ext-donghoi",
      num: 7,
      name: "DONG HOI",
      nameVi: "ĐỒNG HỚI",
      x: 295,
      y: 395,
      labelPos: "right",
      labelOffset: { x: 18, y: -2 },
    },
    {
      id: "ext-ninhbinh",
      num: 8,
      name: "NINH BINH",
      nameVi: "NINH BÌNH",
      x: 276,
      y: 278,
      labelPos: "left",
      labelOffset: { x: -18, y: 2 },
    },
    {
      id: "ext-hanoi",
      num: 9,
      name: "HANOI",
      nameVi: "HÀ NỘI",
      x: 278,
      y: 226,
      labelPos: "left",
      labelOffset: { x: -18, y: -2 },
    },
  ];

  return (
    <div className="itin-map-card">
      <div className="itin-map-svg-wrap">
        <svg
          viewBox="0 0 620 860"
          className="itin-map-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="extMapShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>
            <filter id="extPinShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* ─── VIETNAM BASE MAP OUTLINE ─── */}
          <g filter="url(#extMapShadow)">
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
            {/* Central Region */}
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
          </g>

          {/* ─── EXTENDED EXPLORATION ROUTE PATHS ─── */}
          {/* Bus 1: HCMC -> Da Lat (Dark line) */}
          <path
            d="M 320 710 Q 345 700 365 670"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Bus 2: Da Lat -> Nha Trang (Dark line) */}
          <path
            d="M 365 670 Q 395 660 418 642"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Train: Nha Trang -> Hoi An / Da Nang (Green Solid Line) */}
          <path
            d="M 418 642 
               Q 395 580 375 530 
               Q 360 495 350 472"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Bus: Da Nang <-> Hoi An (Dark line) */}
          <path
            d="M 350 472 Q 358 488 366 504"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Train: Da Nang -> Hue (Green Line over Hai Van Pass) */}
          <path
            d="M 350 472 Q 338 456 325 440"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Train: Hue -> Dong Hoi (Green Line) */}
          <path
            d="M 325 440 Q 310 418 295 395"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Train: Dong Hoi -> Ninh Binh (Green Line along North Central Coast) */}
          <path
            d="M 295 395 
               Q 275 350 270 315 
               Q 272 295 276 278"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Bus / Train: Ninh Binh -> Hanoi */}
          <path
            d="M 276 278 Q 272 255 278 226"
            fill="none"
            stroke="#374151"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* ─── NUMBERED PINS ─── */}
          {stops.map((stop) => {
            const isHovered = hoveredStop === stop.id;

            return (
              <g
                key={stop.id}
                className="map-pin-group"
                onMouseEnter={() => setHoveredStop(stop.id)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Pin Teardrop Shape */}
                <g transform={`translate(${stop.x}, ${stop.y})`} filter="url(#extPinShadow)">
                  <path
                    d="M 0 0 C -7 -10, -11 -16, -11 -22 C -11 -28.5, -6 -33.5, 0 -33.5 C 6 -33.5, 11 -28.5, 11 -22 C 11 -16, 7 -10, 0 0 Z"
                    fill={isHovered ? "#0284c7" : "#ef4444"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="0" cy="-22" r="7.5" fill="#ffffff" />
                  <text
                    x="0"
                    y="-19"
                    textAnchor="middle"
                    fill={isHovered ? "#0284c7" : "#b91c1c"}
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    {stop.num}
                  </text>
                </g>

                {/* Label Box */}
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
                        stroke={isHovered ? "#0284c7" : "#475569"}
                        strokeWidth="1.2"
                        filter="url(#extPinShadow)"
                      />
                      <text
                        x="-54"
                        y="3"
                        textAnchor="middle"
                        fill={isHovered ? "#0284c7" : "#0f172a"}
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
                        stroke={isHovered ? "#0284c7" : "#475569"}
                        strokeWidth="1.2"
                        filter="url(#extPinShadow)"
                      />
                      <text
                        x="50"
                        y="3"
                        textAnchor="middle"
                        fill={isHovered ? "#0284c7" : "#0f172a"}
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

          {/* ─── LEGEND (BOTTOM RIGHT) ─── */}
          <g transform="translate(450, 750)">
            <rect
              x="0"
              y="0"
              width="135"
              height="60"
              rx="10"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="#e2e8f0"
              strokeWidth="1"
              filter="url(#extPinShadow)"
            />
            {/* Train */}
            <line x1="16" y1="20" x2="48" y2="20" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" />
            <text x="58" y="24" fontSize="12" fontWeight="600" fill="#334155" fontFamily="sans-serif">
              {lang === "vi" ? "Tàu hỏa (Train)" : "Train"}
            </text>

            {/* Bus */}
            <line x1="16" y1="42" x2="48" y2="42" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
            <text x="58" y="46" fontSize="12" fontWeight="600" fill="#334155" fontFamily="sans-serif">
              {lang === "vi" ? "Xe buýt (Bus)" : "Bus"}
            </text>
          </g>

          {/* ─── WATERMARK ─── */}
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
