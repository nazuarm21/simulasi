import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import {
  INSTALLATION_COMPONENTS,
  SOP_STAGES,
  type FlowRegime,
  type SopStage,
} from '../data/installationData';
import { calculateMeterError } from '../utils/metrology';

export type DeckTab = 'components' | 'sop' | 'calculator';

interface InstructionDeckProps {
  activeTab: DeckTab;
  selectedComponentId: string;
  activeStageId: string | null;
  testedVolumeInput: string;
  masterVolumeInput: string;
  calcRegime: FlowRegime;
  onChangeTab: (tab: DeckTab) => void;
  onSelectComponent: (id: string) => void;
  onApplySopStage: (stage: SopStage) => void;
  onChangeTestedVolume: (val: string) => void;
  onChangeMasterVolume: (val: string) => void;
  onChangeCalcRegime: (regime: FlowRegime) => void;
}

export const InstructionDeck: React.FC<InstructionDeckProps> = ({
  activeTab,
  selectedComponentId,
  activeStageId,
  testedVolumeInput,
  masterVolumeInput,
  calcRegime,
  onChangeTab,
  onSelectComponent,
  onApplySopStage,
  onChangeTestedVolume,
  onChangeMasterVolume,
  onChangeCalcRegime,
}) => {
  const selectedIndex = INSTALLATION_COMPONENTS.findIndex((c) => c.id === selectedComponentId);
  const currentComponent =
    INSTALLATION_COMPONENTS[selectedIndex] ?? INSTALLATION_COMPONENTS[0];

  const handlePrev = () => {
    const prevIdx =
      (selectedIndex - 1 + INSTALLATION_COMPONENTS.length) % INSTALLATION_COMPONENTS.length;
    onSelectComponent(INSTALLATION_COMPONENTS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % INSTALLATION_COMPONENTS.length;
    onSelectComponent(INSTALLATION_COMPONENTS[nextIdx].id);
  };

  const testedNum = Number.parseFloat(testedVolumeInput);
  const masterNum = Number.parseFloat(masterVolumeInput);
  const errorResult = calculateMeterError({
    testedVolumeL: Number.isNaN(testedNum) ? -1 : testedNum,
    masterVolumeL: Number.isNaN(masterNum) ? 0 : masterNum,
    regime: calcRegime,
  });

  return (
    <aside className="flex flex-col rounded-lg border border-slate-200 bg-white">
      {/* Segmented Tab Navigation */}
      <div
        className="grid grid-cols-3 gap-1 border-b border-slate-200 bg-slate-50 p-1.5"
        role="tablist"
        aria-label="Panel materi pelatihan"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'components'}
          onClick={() => onChangeTab('components')}
          className={`min-h-9 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
            activeTab === 'components'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Komponen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sop'}
          onClick={() => onChangeTab('sop')}
          className={`min-h-9 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
            activeTab === 'sop'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Prosedur Uji
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'calculator'}
          onClick={() => onChangeTab('calculator')}
          className={`min-h-9 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
            activeTab === 'calculator'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hitung Error
        </button>
      </div>

      {/* Tab 1: Component Details & Field Checklist */}
      {activeTab === 'components' && (
        <div className="flex flex-1 flex-col p-4">
          {/* Unboxed Metadata + Stepper */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-slate-900">
                Komponen {currentComponent.code} / 10
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{currentComponent.category}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Komponen sebelumnya"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Komponen berikutnya"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <h2 className="mt-2.5 text-base font-semibold leading-snug text-slate-900">
            {currentComponent.code}. {currentComponent.name}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            {currentComponent.functionSummary}
          </p>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <h3 className="text-xs font-semibold text-slate-900">
              Peran di Instalasi Lapangan
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {currentComponent.fieldRole}
            </p>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <h3 className="text-xs font-semibold text-slate-900">
              Titik Pemeriksaan Teknisi
            </h3>
            <ul className="mt-2 space-y-1.5">
              {currentComponent.inspectionPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                >
                  <span className="mt-0.5 font-mono text-[11px] font-semibold tabular-nums text-sky-700">
                    0{idx + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Component Index */}
          <div className="mt-4 border-t border-slate-200 pt-3">
            <div className="mb-2 text-xs font-semibold text-slate-900">
              Daftar Seluruh Komponen
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {INSTALLATION_COMPONENTS.map((comp) => {
                const isActive = comp.id === currentComponent.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => onSelectComponent(comp.id)}
                    className={`flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 font-semibold text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-[11px] tabular-nums opacity-75">
                      {comp.code}
                    </span>
                    <span className="truncate">{comp.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Progressive Guided SOP Stages */}
      {activeTab === 'sop' && (
        <div className="flex flex-1 flex-col divide-y divide-slate-200">
          {SOP_STAGES.map((stage) => {
            const isSelected = activeStageId === stage.id;
            return (
              <div
                key={stage.id}
                className={`p-4 transition-colors ${isSelected ? 'bg-sky-50/60' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-900">
                        {stage.stepNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{stage.durationHint}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">
                      {stage.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApplySopStage(stage)}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded border px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                      isSelected
                        ? 'border-sky-700 bg-sky-700 text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    <span>{isSelected ? 'Aktif' : 'Simulasikan'}</span>
                  </button>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">{stage.summary}</p>

                {isSelected && (
                  <div className="mt-3 space-y-2.5 border-t border-sky-200/70 pt-3">
                    <ol className="space-y-1.5">
                      {stage.actions.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs leading-relaxed text-slate-800"
                        >
                          <span className="font-mono font-semibold tabular-nums text-sky-700">
                            {i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
                      <span className="font-semibold">Catatan Keselamatan: </span>
                      {stage.safetyNote}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Metrology Error Calculator */}
      {activeTab === 'calculator' && (
        <div className="flex flex-1 flex-col p-5">
          <div className="text-xs text-slate-500">
            Evaluasi Akurasi · Standar SNI / OIML R49
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-900">
            Kalkulator Galat Pengujian (E)
          </h2>
          <p className="mt-1.5 font-mono text-xs text-slate-600">
            E = ((V_uji − V_master) / V_master) × 100%
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-800">
                Titik Debit Pengujian
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {(['Q1', 'Q2', 'Q3'] as FlowRegime[]).map((r) => {
                  const active = calcRegime === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onChangeCalcRegime(r)}
                      aria-pressed={active}
                      className={`min-h-9 rounded border px-2 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                        active
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r} ({r === 'Q1' ? '±5%' : '±2%'})
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="tested-volume-input"
                className="block text-xs font-semibold text-slate-800"
              >
                Volume Meter Air Uji (Liter)
              </label>
              <input
                id="tested-volume-input"
                type="number"
                step="0.1"
                min="0"
                value={testedVolumeInput}
                onChange={(e) => onChangeTestedVolume(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="master-volume-input"
                className="block text-xs font-semibold text-slate-800"
              >
                Volume Master Meter Referensi (Liter)
              </label>
              <input
                id="master-volume-input"
                type="number"
                step="0.1"
                min="0.1"
                value={masterVolumeInput}
                onChange={(e) => onChangeMasterVolume(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div
            data-testid="error-calc-result"
            className={`mt-5 rounded-md border p-4 ${
              !errorResult.valid
                ? 'border-amber-300 bg-amber-50'
                : errorResult.isWithinTolerance
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {errorResult.isWithinTolerance ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                ) : (
                  <AlertTriangle
                    className={`h-4 w-4 ${errorResult.valid ? 'text-red-700' : 'text-amber-700'}`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={
                    !errorResult.valid
                      ? 'text-amber-900'
                      : errorResult.isWithinTolerance
                        ? 'text-emerald-900'
                        : 'text-red-900'
                  }
                >
                  {errorResult.statusLabel}
                </span>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-700">
                Batas ±{errorResult.tolerancePercent.toFixed(1)}%
              </span>
            </div>

            <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-slate-900">
              {errorResult.errorPercent === null
                ? '—'
                : `${errorResult.errorPercent > 0 ? '+' : ''}${errorResult.errorPercent.toFixed(2)}%`}
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
              {errorResult.recommendation}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
