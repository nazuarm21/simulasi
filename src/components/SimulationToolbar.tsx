import React from 'react';
import { AlertTriangle, CheckCircle2, Droplets, Power } from 'lucide-react';
import type { FlowRegime } from '../data/installationData';
import type { HydraulicState } from '../utils/metrology';

interface SimulationToolbarProps {
  pumpOn: boolean;
  ballValveOpen: boolean;
  regime: FlowRegime;
  hydraulic: HydraulicState;
  onTogglePump: () => void;
  onToggleBallValve: () => void;
  onChangeRegime: (regime: FlowRegime) => void;
}

const REGIMES: { value: FlowRegime; label: string; hint: string }[] = [
  { value: 'Q1', label: 'Q₁ Min', hint: '32 L/jam' },
  { value: 'Q2', label: 'Q₂ Transisi', hint: '50 L/jam' },
  { value: 'Q3', label: 'Q₃ Nominal', hint: '2.500 L/jam' },
];

export const SimulationToolbar: React.FC<SimulationToolbarProps> = ({
  pumpOn,
  ballValveOpen,
  regime,
  hydraulic,
  onTogglePump,
  onToggleBallValve,
  onChangeRegime,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Interactive Hydraulic Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onTogglePump}
            aria-pressed={pumpOn}
            className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              pumpOn
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Power className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sakelar Pompa: {pumpOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleBallValve}
            aria-pressed={ballValveOpen}
            className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              ballValveOpen
                ? 'border-sky-700 bg-sky-50 text-sky-900 hover:bg-sky-100'
                : 'border-red-700 bg-red-50 text-red-900 hover:bg-red-100'
            }`}
          >
            <span>Katup Bola: {ballValveOpen ? 'TERBUKA' : 'TERTUTUP'}</span>
          </button>

          <div
            className="flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5"
            role="group"
            aria-label="Pilih titik debit katup pengatur"
          >
            {REGIMES.map((item) => {
              const active = regime === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChangeRegime(item.value)}
                  aria-pressed={active}
                  className={`min-h-9 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Tabular Metrics */}
        <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Debit Aliran</div>
            <div className="font-mono text-sm font-semibold tabular-nums text-slate-900">
              {hydraulic.flowRateLph.toLocaleString('id-ID')} L/jam
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Tekanan Jalur</div>
            <div className="font-mono text-sm font-semibold tabular-nums text-slate-900">
              {hydraulic.pressureBar.toFixed(1)} bar
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Status Sistem</div>
            <div
              data-testid="hydraulic-status"
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                hydraulic.statusCode === 'FLOWING'
                  ? 'text-sky-700'
                  : hydraulic.statusCode === 'BLOCKED'
                    ? 'text-red-700'
                    : 'text-slate-700'
              }`}
            >
              {hydraulic.statusCode === 'FLOWING' ? (
                <Droplets className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : hydraulic.statusCode === 'BLOCKED' ? (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="whitespace-nowrap">{hydraulic.statusLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-slate-100 pt-2.5 text-xs leading-relaxed text-slate-600">
        {hydraulic.statusNote}
      </p>
    </div>
  );
};
