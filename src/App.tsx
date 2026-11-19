import { useMemo, useRef, useState } from 'react';
import { Download, Grid3X3, Layers, Printer, Tag } from 'lucide-react';
import {
  InstallationDiagram,
  type VisualMode,
} from './components/InstallationDiagram';
import { InstructionDeck, type DeckTab } from './components/InstructionDeck';
import { SimulationToolbar } from './components/SimulationToolbar';
import {
  SOP_STAGES,
  type FlowRegime,
  type SopStage,
} from './data/installationData';
import {
  downloadDiagramPng,
  downloadDiagramSvg,
} from './utils/exportIllustration';
import { computeHydraulicState } from './utils/metrology';

export default function App() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [visualMode, setVisualMode] = useState<VisualMode>('minimalist');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showCallouts, setShowCallouts] = useState<boolean>(true);

  const [selectedComponentId, setSelectedComponentId] = useState<string>('test-meter');
  const [activeTab, setActiveTab] = useState<DeckTab>('components');
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  const [pumpOn, setPumpOn] = useState<boolean>(true);
  const [ballValveOpen, setBallValveOpen] = useState<boolean>(true);
  const [regime, setRegime] = useState<FlowRegime>('Q3');

  const [testedVolumeInput, setTestedVolumeInput] = useState<string>('100.8');
  const [masterVolumeInput, setMasterVolumeInput] = useState<string>('100.0');
  const [calcRegime, setCalcRegime] = useState<FlowRegime>('Q3');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const hydraulic = useMemo(
    () => computeHydraulicState({ pumpOn, ballValveOpen, regime }),
    [pumpOn, ballValveOpen, regime]
  );

  const activeStage = useMemo(
    () => SOP_STAGES.find((s) => s.id === activeStageId) ?? null,
    [activeStageId]
  );

  const highlightedIds = activeStage ? activeStage.focusComponentIds : [];

  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
    setActiveTab('components');
  };

  const handleApplySopStage = (stage: SopStage) => {
    setActiveStageId(stage.id);
    setPumpOn(stage.preset.pumpOn);
    setBallValveOpen(stage.preset.ballValveOpen);
    setRegime(stage.preset.regime);
    setCalcRegime(stage.preset.regime);
    if (stage.focusComponentIds.length > 0) {
      setSelectedComponentId(stage.focusComponentIds[0]);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    downloadDiagramSvg(svgRef.current);
    setExportStatus('File SVG pelat ilustrasi berhasil diunduh.');
    window.setTimeout(() => setExportStatus(null), 3500);
  };

  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    try {
      await downloadDiagramPng(svgRef.current);
      setExportStatus('File PNG resolusi tinggi berhasil diunduh.');
    } catch {
      setExportStatus('Ekspor PNG gagal. Gunakan tombol Unduh Ilustrasi (SVG).');
    }
    window.setTimeout(() => setExportStatus(null), 3500);
  };

  const handleHeaderNav = (tab: DeckTab | 'diagram') => {
    if (tab === 'diagram') {
      document.getElementById('stage-diagram')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar Contract */}
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-8 px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#stage-diagram"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Modul Metrologi Air
          </a>

          {/* Zone 2: Single-line Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
            aria-label="Navigasi modul pelatihan"
          >
            <button
              type="button"
              onClick={() => handleHeaderNav('diagram')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Diagram Uji
            </button>
            <button
              type="button"
              onClick={() => handleHeaderNav('components')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Komponen
            </button>
            <button
              type="button"
              onClick={() => handleHeaderNav('sop')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Prosedur SOP
            </button>
            <button
              type="button"
              onClick={() => handleHeaderNav('calculator')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Kalkulator Galat
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Unduh Ilustrasi</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1380px] px-4 py-4 sm:px-6 lg:px-8">
        {/* Editorial Module Heading & Unboxed Metadata */}
        <section className="mb-4 flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Pelatihan Teknisi Lapangan</span>
              <span aria-hidden="true">·</span>
              <span>Instalasi Sirkulasi Tertutup</span>
              <span aria-hidden="true">·</span>
              <span>10 Komponen Utama</span>
            </div>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Instalasi Pengujian Meter Air dengan Master Meter
            </h1>
          </div>

          {exportStatus && (
            <div
              role="status"
              className="text-xs font-medium text-sky-800"
            >
              {exportStatus}
            </div>
          )}
        </section>

        {/* Two-Zone Educational Workbench */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
          {/* Left Zone: Interactive Visual Stage + Simulation Toolbar */}
          <section id="stage-diagram" className="space-y-3 lg:col-span-8">
            {/* Stage Toolbar */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
              {/* Visual Mode Segmented Control */}
              <div
                className="flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5"
                role="group"
                aria-label="Mode tampilan ilustrasi"
              >
                <button
                  type="button"
                  onClick={() => setVisualMode('minimalist')}
                  aria-pressed={visualMode === 'minimalist'}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                    visualMode === 'minimalist'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ilustrasi Minimalis</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualMode('reference')}
                  aria-pressed={visualMode === 'reference'}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                    visualMode === 'reference'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Referensi Asli</span>
                </button>
              </div>

              {/* Drafting Utilities */}
              <div className="flex flex-wrap items-center gap-2">
                {visualMode === 'minimalist' && (
                  <button
                    type="button"
                    onClick={() => setShowGrid((prev) => !prev)}
                    aria-pressed={showGrid}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                      showGrid
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Grid Teknis</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowCallouts((prev) => !prev)}
                  aria-pressed={showCallouts}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600 ${
                    showCallouts
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Label 01–10</span>
                </button>

                {visualMode === 'minimalist' && (
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Ekspor PNG</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Cetak Pelat</span>
                </button>
              </div>
            </div>

            {/* Interactive Minimalist Technical Plate */}
            <InstallationDiagram
              svgRef={svgRef}
              visualMode={visualMode}
              showGrid={showGrid}
              showCallouts={showCallouts}
              selectedId={selectedComponentId}
              highlightedIds={highlightedIds}
              pumpOn={pumpOn}
              ballValveOpen={ballValveOpen}
              regime={regime}
              hydraulic={hydraulic}
              onSelectComponent={handleSelectComponent}
              onTogglePump={() => setPumpOn((prev) => !prev)}
              onToggleBallValve={() => setBallValveOpen((prev) => !prev)}
            />

            {/* Hydraulic Simulation Toolbar */}
            <div className="no-print">
              <SimulationToolbar
                pumpOn={pumpOn}
                ballValveOpen={ballValveOpen}
                regime={regime}
                hydraulic={hydraulic}
                onTogglePump={() => setPumpOn((prev) => !prev)}
                onToggleBallValve={() => setBallValveOpen((prev) => !prev)}
                onChangeRegime={(next) => setRegime(next)}
              />
            </div>
          </section>

          {/* Right Zone: Instructional Component / SOP / Calculator Deck */}
          <div className="no-print lg:col-span-4">
            <InstructionDeck
              activeTab={activeTab}
              selectedComponentId={selectedComponentId}
              activeStageId={activeStageId}
              testedVolumeInput={testedVolumeInput}
              masterVolumeInput={masterVolumeInput}
              calcRegime={calcRegime}
              onChangeTab={setActiveTab}
              onSelectComponent={handleSelectComponent}
              onApplySopStage={handleApplySopStage}
              onChangeTestedVolume={setTestedVolumeInput}
              onChangeMasterVolume={setMasterVolumeInput}
              onChangeCalcRegime={setCalcRegime}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
