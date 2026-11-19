import React, { useState } from 'react';
import {
  INSTALLATION_COMPONENTS,
  type FlowRegime,
  type InstallationComponent,
} from '../data/installationData';
import type { HydraulicState } from '../utils/metrology';

export type VisualMode = 'minimalist' | 'reference';

interface InstallationDiagramProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  visualMode: VisualMode;
  showGrid: boolean;
  showCallouts: boolean;
  selectedId: string;
  highlightedIds: string[];
  pumpOn: boolean;
  ballValveOpen: boolean;
  regime: FlowRegime;
  hydraulic: HydraulicState;
  onSelectComponent: (id: string) => void;
  onTogglePump: () => void;
  onToggleBallValve: () => void;
}

const REFERENCE_IMAGE_PATH = '/assets/aistudio/INSTALASI_PENGUJIAN_METER_AIR_DG_MASTER_METER_1e87b9b1.png';

function buildLeaderPath(comp: InstallationComponent): string {
  const { anchor, labelPos } = comp;
  // Clean orthogonal drafting leader path
  if (comp.id === 'switch-box') {
    return `M ${anchor.x} ${anchor.y - 26} L ${anchor.x} ${labelPos.y + 18} L ${labelPos.x} ${labelPos.y + 18}`;
  }
  if (comp.id === 'suction-pipe') {
    return `M ${anchor.x} ${anchor.y + 12} L ${labelPos.x} ${labelPos.y - 16}`;
  }
  if (comp.id === 'reservoir') {
    return `M ${anchor.x} ${anchor.y} L ${labelPos.x} ${labelPos.y - 16}`;
  }
  if (Math.abs(anchor.x - labelPos.x) < 4) {
    return `M ${anchor.x} ${anchor.y} L ${labelPos.x} ${labelPos.y + 16}`;
  }
  const midY = labelPos.y + 38;
  return `M ${anchor.x} ${anchor.y} L ${anchor.x} ${midY} L ${labelPos.x} ${midY} L ${labelPos.x} ${labelPos.y + 16}`;
}

export const InstallationDiagram: React.FC<InstallationDiagramProps> = ({
  svgRef,
  visualMode,
  showGrid,
  showCallouts,
  selectedId,
  highlightedIds,
  pumpOn,
  ballValveOpen,
  regime,
  hydraulic,
  onSelectComponent,
  onTogglePump,
  onToggleBallValve,
}) => {
  const [imageError, setImageError] = useState(false);

  const flowClass =
    regime === 'Q3'
      ? 'flow-stream-fast'
      : regime === 'Q2'
        ? 'flow-stream-medium'
        : 'flow-stream-slow';

  const getDimOpacity = (id: string) => {
    if (!selectedId) return 1;
    if (selectedId === id || highlightedIds.includes(id)) return 1;
    return 0.58;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white select-none"
      style={{ aspectRatio: '1000 / 707' }}
      data-testid="installation-diagram-stage"
    >
      {/* Reference image layer (shown when visualMode === 'reference') */}
      {visualMode === 'reference' && (
        <div className="absolute inset-0 bg-white">
          {!imageError ? (
            <img
              src={REFERENCE_IMAGE_PATH}
              alt="Foto referensi asli instalasi pengujian meter air dengan master meter"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-6 text-center text-slate-600">
              <p className="text-sm font-medium text-slate-800">
                Gambar referensi asli tidak tersedia
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Gunakan mode Ilustrasi Minimalis untuk menampilkan skema teknis lengkap.
              </p>
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white/12"
          />
        </div>
      )}

      {/* Main SVG Technical Plate (Minimalist Schematic + Interactive/Export Leader Overlay) */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 707"
        className="relative z-[1] h-full w-full"
        role="img"
        aria-label="Ilustrasi teknis instalasi pengujian meter air dengan master meter"
      >
        <defs>
          <pattern id="drafting-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="0.6"
            />
          </pattern>
          <pattern
            id="concrete-hatch"
            width="10"
            height="10"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="10" stroke="#CBD5E1" strokeWidth="1.2" />
          </pattern>
          <marker
            id="flow-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 1 2 L 8 5 L 1 8 z" fill="#0284C7" />
          </marker>
        </defs>

        {/* Minimalist Plate Canvas */}
        {visualMode === 'minimalist' && (
          <g>
            <rect x="0" y="0" width="1000" height="707" fill="#FFFFFF" />
            {showGrid && <rect x="0" y="0" width="1000" height="707" fill="url(#drafting-grid)" />}
          </g>
        )}

        {/* Top Technical Plate Title Block & Minimalist Legend */}
        <g>
          {visualMode === 'reference' && (
            <rect
              x="16"
              y="14"
              width="968"
              height="52"
              rx="4"
              fill="#FFFFFF"
              fillOpacity="0.92"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          )}
          <text
            x="28"
            y="34"
            fill="#0F172A"
            fontSize="12"
            fontWeight="700"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="0.03em"
          >
            PELAT 01 · INSTALASI PENGUJIAN METER AIR DENGAN MASTER METER
          </text>
          <text
            x="28"
            y="52"
            fill="#64748B"
            fontSize="10.5"
            fontWeight="500"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Skema Sirkulasi Tertutup · Tata Letak Seri Horizontal · Standar Uji Q₁ / Q₂ / Q₃
          </text>

          {/* Compact Legend (Right side of header band) */}
          <g transform="translate(658, 25)">
            <rect x="0" y="4" width="14" height="6" rx="1" fill="#0284C7" />
            <text
              x="20"
              y="10"
              fill="#475569"
              fontSize="10"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Jalur Air
            </text>

            <rect x="82" y="4" width="14" height="6" rx="1" fill="#DC2626" />
            <text
              x="102"
              y="10"
              fill="#475569"
              fontSize="10"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Katup / Kontrol
            </text>

            <rect x="196" y="4" width="14" height="6" rx="1" fill="#0F172A" />
            <text
              x="216"
              y="10"
              fill="#475569"
              fontSize="10"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Instrumen Ukur
            </text>
          </g>

          <line x1="28" y1="68" x2="972" y2="68" stroke="#E2E8F0" strokeWidth="1" />
        </g>

        {/* Minimalist Vector Schematic Layer */}
        {visualMode === 'minimalist' && (
          <g>
            {/* Sub-bench architectural cross-section */}
            <rect x="0" y="524" width="762" height="183" fill="#F8FAFC" />
            <line x1="0" y1="524" x2="762" y2="524" stroke="#94A3B8" strokeWidth="1" />

            {/* Reservoir Tank (10) */}
            <g
              style={{ opacity: getDimOpacity('reservoir') }}
              onClick={() => onSelectComponent('reservoir')}
              className="cursor-pointer"
            >
              {/* Tank Outer Basin */}
              <rect x="762" y="476" width="238" height="231" fill="#F1F5F9" />
              {/* Water Fill */}
              <rect x="780" y="526" width="220" height="181" fill="#E0F2FE" />
              {/* Crisp Water Surface Line */}
              <line x1="780" y1="526" x2="1000" y2="526" stroke="#0284C7" strokeWidth="2" />
              {/* Subtle water surface ticks */}
              <line x1="802" y1="538" x2="848" y2="538" stroke="#7DD3FC" strokeWidth="1.2" />
              <line x1="870" y1="546" x2="914" y2="546" stroke="#7DD3FC" strokeWidth="1.2" />
              {/* Tank Left Concrete Wall */}
              <rect
                x="756"
                y="476"
                width="24"
                height="231"
                fill="#E2E8F0"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <rect x="756" y="476" width="24" height="231" fill="url(#concrete-hatch)" opacity="0.6" />
            </g>

            {/* Bench Concrete Slab */}
            <g>
              <polygon
                points="0,464 812,464 812,482 780,482 780,524 0,524"
                fill="#E2E8F0"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <polygon
                points="0,464 812,464 812,482 780,482 780,524 0,524"
                fill="url(#concrete-hatch)"
                opacity="0.45"
              />
            </g>

            {/* Suction Pipe (09) */}
            <g
              style={{ opacity: getDimOpacity('suction-pipe') }}
              onClick={() => onSelectComponent('suction-pipe')}
              className="cursor-pointer"
            >
              {/* Vertical drop from pump */}
              <rect
                x="92"
                y="490"
                width="20"
                height="130"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* 90-deg bottom elbow */}
              <path
                d="M 92 612 Q 92 634 114 634 L 128 634 L 128 614 L 114 614 Q 112 614 112 612 Z"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Horizontal suction line */}
              <rect
                x="128"
                y="614"
                width="652"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Pipe sleeve couplings */}
              <rect x="89" y="546" width="26" height="8" rx="1" fill="#0284C7" stroke="#0F172A" strokeWidth="1.2" />
              <rect x="210" y="611" width="10" height="26" rx="1" fill="#0284C7" stroke="#0F172A" strokeWidth="1.2" />
              <rect x="638" y="611" width="10" height="26" rx="1" fill="#0284C7" stroke="#0F172A" strokeWidth="1.2" />
              {/* Suction intake strainer mouth in tank */}
              <rect
                x="780"
                y="612"
                width="10"
                height="24"
                rx="1"
                fill="#0284C7"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
            </g>

            {/* Pump Concrete Pedestal */}
            <g style={{ opacity: getDimOpacity('pump') }}>
              <rect
                x="36"
                y="440"
                width="164"
                height="50"
                rx="2"
                fill="#CBD5E1"
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              <line x1="36" y1="450" x2="200" y2="450" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* Electrical Switch Box & Conduit (01) */}
            <g
              style={{ opacity: getDimOpacity('switch-box') }}
              onClick={() => {
                onSelectComponent('switch-box');
                onTogglePump();
              }}
              className="cursor-pointer"
            >
              {/* Conduit cable */}
              <path
                d="M 33 318 L 33 394 Q 33 402 41 402 L 54 402"
                fill="none"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Switch Enclosure */}
              <rect
                x="14"
                y="268"
                width="38"
                height="50"
                rx="3"
                fill="#F8FAFC"
                stroke="#0F172A"
                strokeWidth="1.75"
              />
              {/* Push Button */}
              <circle
                cx="33"
                cy="293"
                r="10"
                fill={pumpOn ? '#059669' : '#DC2626'}
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              <text
                x="33"
                y="262"
                textAnchor="middle"
                fill={pumpOn ? '#059669' : '#475569'}
                fontSize="8.5"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
              >
                {pumpOn ? 'ON' : 'OFF'}
              </text>
            </g>

            {/* Centrifugal Pump (02) */}
            <g
              style={{ opacity: getDimOpacity('pump') }}
              onClick={() => onSelectComponent('pump')}
              className="cursor-pointer"
            >
              {/* Mounting Feet */}
              <rect x="64" y="428" width="52" height="12" fill="#0284C7" stroke="#0F172A" strokeWidth="1.4" />
              <rect x="136" y="428" width="44" height="12" fill="#0284C7" stroke="#0F172A" strokeWidth="1.4" />
              {/* Motor Housing */}
              <rect
                x="52"
                y="364"
                width="88"
                height="62"
                rx="6"
                fill="#0284C7"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Terminal Top Box */}
              <rect
                x="78"
                y="352"
                width="36"
                height="12"
                rx="1.5"
                fill="#38BDF8"
                stroke="#0F172A"
                strokeWidth="1.4"
              />
              {/* Minimalist Cooling Fins */}
              <line x1="68" y1="376" x2="128" y2="376" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="68" y1="386" x2="128" y2="386" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="68" y1="396" x2="128" y2="396" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="68" y1="406" x2="128" y2="406" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="68" y1="416" x2="128" y2="416" stroke="#0F172A" strokeWidth="1.2" />
              {/* Pump Volute & Discharge Transition */}
              <path
                d="M 140 366 L 176 366 L 194 378 L 214 378 L 214 410 L 194 410 L 176 426 L 140 426 Z"
                fill="#38BDF8"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Impeller status ring */}
              <circle
                cx="164"
                cy="396"
                r="14"
                fill="#FFFFFF"
                fillOpacity="0.85"
                stroke="#0F172A"
                strokeWidth="1.2"
              />
              <path
                d="M 157 396 A 7 7 0 0 1 171 396"
                fill="none"
                stroke={pumpOn ? '#0284C7' : '#94A3B8'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Upper Horizontal Test Pipework */}
            <g>
              {/* Pipe Segment 1: Pump to Ball Valve */}
              <rect
                x="214"
                y="384"
                width="68"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Pipe Segment 2: Ball Valve to Coupling */}
              <rect
                x="354"
                y="384"
                width="16"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Pipe Segment 3: Coupling to Test Meter */}
              <rect
                x="420"
                y="384"
                width="184"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Pipe Segment 4: Test Meter to Master Meter */}
              <rect
                x="662"
                y="384"
                width="94"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Pipe Segment 5: Master Meter to Return Elbow */}
              <rect
                x="816"
                y="384"
                width="130"
                height="20"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />

              {/* Minimalist Flange Collars */}
              {[279, 368, 420, 586, 676, 738, 826].map((fx) => (
                <rect
                  key={fx}
                  x={fx}
                  y="379"
                  width="5"
                  height="30"
                  rx="1"
                  fill="#0284C7"
                  stroke="#0F172A"
                  strokeWidth="1.2"
                />
              ))}
            </g>

            {/* Return Pipe & 90-deg Elbow (08) */}
            <g
              style={{ opacity: getDimOpacity('return-pipe') }}
              onClick={() => onSelectComponent('return-pipe')}
              className="cursor-pointer"
            >
              {/* Elbow block */}
              <path
                d="M 936 382 L 958 382 Q 968 382 968 392 L 968 416 L 946 416 L 946 404 L 936 404 Z"
                fill="#7DD3FC"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Vertical drop into tank */}
              <rect
                x="946"
                y="416"
                width="20"
                height="248"
                fill="#BAE6FD"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Submerged sleeve collar */}
              <rect
                x="943"
                y="622"
                width="26"
                height="10"
                rx="1"
                fill="#0284C7"
                stroke="#0F172A"
                strokeWidth="1.2"
              />
            </g>

            {/* Ball Valve (03) */}
            <g
              style={{ opacity: getDimOpacity('ball-valve') }}
              onClick={() => {
                onSelectComponent('ball-valve');
                onToggleBallValve();
              }}
              className="cursor-pointer"
            >
              <polygon
                points="284,378 338,378 354,384 354,404 338,410 284,410"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Stem */}
              <rect x="319" y="356" width="8" height="22" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.2" />
              {/* Lever Handle (Horizontal = Open, Vertical = Closed) */}
              {ballValveOpen ? (
                <rect
                  x="284"
                  y="349"
                  width="46"
                  height="8"
                  rx="2"
                  fill="#DC2626"
                  stroke="#0F172A"
                  strokeWidth="1.3"
                />
              ) : (
                <rect
                  x="319"
                  y="314"
                  width="8"
                  height="44"
                  rx="2"
                  fill="#DC2626"
                  stroke="#0F172A"
                  strokeWidth="1.3"
                />
              )}
            </g>

            {/* Flexible Coupling (04) */}
            <g
              style={{ opacity: getDimOpacity('coupling') }}
              onClick={() => onSelectComponent('coupling')}
              className="cursor-pointer"
            >
              <rect
                x="372"
                y="381"
                width="46"
                height="26"
                rx="2"
                fill="#334155"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              <rect x="382" y="381" width="6" height="26" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1" />
              <rect x="402" y="381" width="6" height="26" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1" />
            </g>

            {/* Gate Valve / Flow Control Valve (05) */}
            <g
              style={{ opacity: getDimOpacity('gate-valve') }}
              onClick={() => onSelectComponent('gate-valve')}
              className="cursor-pointer"
            >
              {/* Bonnet */}
              <rect x="498" y="370" width="12" height="14" fill="#64748B" stroke="#0F172A" strokeWidth="1.2" />
              {/* Red Handwheel */}
              <rect
                x="476"
                y="361"
                width="56"
                height="9"
                rx="4"
                fill="#DC2626"
                stroke="#0F172A"
                strokeWidth="1.4"
              />
              <line x1="488" y1="361" x2="488" y2="370" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="520" y1="361" x2="520" y2="370" stroke="#0F172A" strokeWidth="1.2" />
              {/* Minimalist Regime Tag above handwheel */}
              <text
                x="504"
                y="354"
                textAnchor="middle"
                fill="#475569"
                fontSize="9"
                fontWeight="600"
                fontFamily="IBM Plex Mono, monospace"
              >
                {regime} · {hydraulic.valveOpeningPercent}%
              </text>
            </g>

            {/* Tested Water Meter (06) */}
            <g
              style={{ opacity: getDimOpacity('test-meter') }}
              onClick={() => onSelectComponent('test-meter')}
              className="cursor-pointer"
            >
              {/* Brass/Blue Meter Body */}
              <rect
                x="602"
                y="374"
                width="60"
                height="32"
                rx="3"
                fill="#0284C7"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Yellow Analog Register Top */}
              <ellipse
                cx="632"
                cy="374"
                rx="24"
                ry="6"
                fill="#FDE68A"
                stroke="#0F172A"
                strokeWidth="1.4"
              />
              {/* Flow direction arrow stamped on meter */}
              <path
                d="M 618 392 L 642 392 M 637 388 L 643 392 L 637 396"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Master Meter Reference (07) */}
            <g
              style={{ opacity: getDimOpacity('master-meter') }}
              onClick={() => onSelectComponent('master-meter')}
              className="cursor-pointer"
            >
              <rect
                x="755"
                y="370"
                width="62"
                height="36"
                rx="3"
                fill="#0F172A"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Signature Red Stripe from original reference */}
              <rect x="756" y="396" width="60" height="4" fill="#DC2626" />
              {/* Digital LCD Reading Window */}
              <rect x="762" y="375" width="48" height="16" rx="1.5" fill="#ECFEFF" />
              <text
                x="786"
                y="386.5"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="8.5"
                fontWeight="600"
                fontFamily="IBM Plex Mono, monospace"
              >
                {hydraulic.flowRateLph} L/h
              </text>
            </g>
          </g>
        )}

        {/* Hydraulic Flow Visualization Overlay (works in BOTH Minimalist & Reference modes!) */}
        <g className="pointer-events-none">
          {/* Suction flow from reservoir right -> left -> up to pump */}
          {hydraulic.suctionActive && (
            <path
              d="M 776 623 L 106 623 Q 102 623 102 617 L 102 496"
              fill="none"
              stroke="#0284C7"
              strokeWidth="3.5"
              strokeLinecap="round"
              className={flowClass}
            />
          )}

          {/* Upstream pipe from pump to Ball Valve */}
          {hydraulic.upstreamActive && (
            <line
              x1="216"
              y1="396"
              x2="282"
              y2="396"
              stroke={hydraulic.statusCode === 'BLOCKED' ? '#DC2626' : '#0284C7'}
              strokeWidth="3.5"
              className={hydraulic.statusCode === 'BLOCKED' ? '' : flowClass}
            />
          )}

          {/* Blocked barrier sign at Ball Valve */}
          {hydraulic.statusCode === 'BLOCKED' && (
            <g transform="translate(284, 396)">
              <line x1="0" y1="-14" x2="0" y2="14" stroke="#DC2626" strokeWidth="3" />
              <rect x="-44" y="-34" width="88" height="17" rx="2" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1" />
              <text
                x="0"
                y="-22.5"
                textAnchor="middle"
                fill="#B91C1C"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
              >
                TERTAHAN 2.4 bar
              </text>
            </g>
          )}

          {/* Downstream flow through meters & return pipe to reservoir */}
          {hydraulic.downstreamActive && (
            <g>
              <path
                d="M 354 396 L 948 396 Q 956 396 956 404 L 956 658"
                fill="none"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeLinecap="round"
                className={flowClass}
              />
              {/* Static crisp flow direction indicators */}
              <line
                x1="232"
                y1="422"
                x2="268"
                y2="422"
                stroke="#0284C7"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />
              <line
                x1="690"
                y1="422"
                x2="726"
                y2="422"
                stroke="#0284C7"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />
              <line
                x1="928"
                y1="482"
                x2="928"
                y2="518"
                stroke="#0284C7"
                strokeWidth="1.5"
                markerEnd="url(#flow-arrow)"
              />
            </g>
          )}
        </g>

        {/* Minimalist Technical Leader Lines & Anchors */}
        {showCallouts && (
          <g>
            {INSTALLATION_COMPONENTS.map((comp) => {
              const isSelected = selectedId === comp.id;
              const isStageFocus = highlightedIds.includes(comp.id);
              const strokeColor = isSelected
                ? '#0F172A'
                : isStageFocus
                  ? '#0284C7'
                  : '#64748B';

              return (
                <g key={comp.id}>
                  <path
                    d={buildLeaderPath(comp)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '1.8' : '1.15'}
                    strokeDasharray={isSelected || isStageFocus ? undefined : 'none'}
                  />
                  <circle
                    cx={comp.anchor.x}
                    cy={comp.anchor.y}
                    r={isSelected ? '4.5' : '3.2'}
                    fill={isSelected ? '#DC2626' : '#FFFFFF'}
                    stroke={strokeColor}
                    strokeWidth="1.6"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Export-Only Static Labels (Hidden on screen because accessible HTML buttons render there) */}
        <g data-export-only="true" display="none">
          {INSTALLATION_COMPONENTS.map((comp) => (
            <g
              key={`export-${comp.id}`}
              transform={`translate(${comp.labelPos.x}, ${comp.labelPos.y})`}
            >
              <rect
                x="-62"
                y="-14"
                width="124"
                height="26"
                rx="3"
                fill="#FFFFFF"
                stroke="#334155"
                strokeWidth="1.1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="9.5"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {comp.code} · {comp.shortLabel}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Accessible Interactive HTML Callout Buttons aligned identically to SVG labelPos */}
      {showCallouts && (
        <div className="pointer-events-none absolute inset-0 z-[2]">
          {INSTALLATION_COMPONENTS.map((comp) => {
            const isSelected = selectedId === comp.id;
            const isStageFocus = highlightedIds.includes(comp.id);
            const leftPct = (comp.labelPos.x / 1000) * 100;
            const topPct = (comp.labelPos.y / 707) * 100;

            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => onSelectComponent(comp.id)}
                aria-label={`Pilih komponen ${comp.code}: ${comp.name}`}
                aria-pressed={isSelected}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-medium leading-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 md:px-2 md:py-1 md:text-[11px] ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : isStageFocus
                      ? 'border-sky-600 bg-sky-50 text-sky-950 hover:bg-sky-100'
                      : 'border-slate-300 bg-white/95 text-slate-800 hover:border-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono tabular-nums font-semibold">
                  {comp.code}
                </span>
                <span className="mx-1 hidden opacity-40 md:inline" aria-hidden="true">
                  ·
                </span>
                <span className="hidden md:inline">{comp.shortLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
