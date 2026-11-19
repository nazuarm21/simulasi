export type FlowRegime = 'Q1' | 'Q2' | 'Q3';

export interface InstallationComponent {
  id: string;
  code: string;
  name: string;
  shortLabel: string;
  category: 'Kelistrikan & Penggerak' | 'Katup & Sambungan' | 'Alat Ukur' | 'Perpipaan & Sumber';
  anchor: { x: number; y: number };
  labelPos: { x: number; y: number };
  functionSummary: string;
  fieldRole: string;
  inspectionPoints: string[];
}

export interface SopStage {
  id: string;
  stepNumber: string;
  title: string;
  durationHint: string;
  summary: string;
  focusComponentIds: string[];
  preset: {
    pumpOn: boolean;
    ballValveOpen: boolean;
    regime: FlowRegime;
  };
  actions: string[];
  safetyNote: string;
}

export const INSTALLATION_COMPONENTS: InstallationComponent[] = [
  {
    id: 'switch-box',
    code: '01',
    name: 'Panel Sakelar Pompa (Start / Stop)',
    shortLabel: 'Sakelar Pompa',
    category: 'Kelistrikan & Penggerak',
    anchor: { x: 33, y: 295 },
    labelPos: { x: 78, y: 186 },
    functionSummary:
      'Sakelar kontrol daya listrik utama untuk menghidupkan, mematikan, dan menghentikan pompa secara darurat selama pengujian berlangsung.',
    fieldRole:
      'Dipasang di sisi kiri pada ketinggian jangkauan operator agar teknisi dapat memutus aliran seketika jika terjadi kebocoran sambungan atau lonjakan tekanan.',
    inspectionPoints: [
      'Pastikan penutup boks kedap percikan air dan tidak ada kabel terkelupas menuju motor pompa.',
      'Uji respons tombol merah sebelum mengisi air ke jalur pengujian.',
      'Pastikan kondisi tombol berada pada posisi OFF sebelum melepas atau memasang meter uji.',
    ],
  },
  {
    id: 'pump',
    code: '02',
    name: 'Pompa Sentrifugal & Fondasi',
    shortLabel: 'Pompa Sentrifugal',
    category: 'Kelistrikan & Penggerak',
    anchor: { x: 128, y: 394 },
    labelPos: { x: 170, y: 108 },
    functionSummary:
      'Menghisap air dari bak penampung bawah dan memberikan tekanan dorong stabil menuju jalur pipa pengujian meter air.',
    fieldRole:
      'Terpasang di atas dudukan beton (fondasi) untuk meredam getaran mekanis agar aliran tetap laminer dan tidak memengaruhi pembacaan register meter.',
    inspectionPoints: [
      'Periksa baut pengikat kaki pompa pada fondasi beton agar tidak kendor saat beroperasi.',
      'Dengarkan suara impeller; suara kasar menandakan adanya udara terjebak (kavitasi).',
      'Pastikan rumah pompa terisi air (priming) sebelum dinyalakan.',
    ],
  },
  {
    id: 'ball-valve',
    code: '03',
    name: 'Katup Bola (Ball Valve Isolasi)',
    shortLabel: 'Katup Bola',
    category: 'Katup & Sambungan',
    anchor: { x: 318, y: 374 },
    labelPos: { x: 304, y: 186 },
    functionSummary:
      'Katup buka-tutup cepat (seperempat putaran) untuk mengisolasi seluruh jalur uji dari tekanan pompa secara instan.',
    fieldRole:
      'Tuas merah sejajar pipa menandakan katup TERBUKA penuh; tuas tegak lurus pipa menandakan katup TERTUTUP rapat untuk penggantian meter uji.',
    inspectionPoints: [
      'Gunakan hanya untuk posisi buka penuh atau tutup penuh, jangan dipakai untuk mengatur debit.',
      'Periksa kekedapan seal batang tuas agar tidak menetes saat tekanan pompa penuh.',
      'Pastikan katup dibuka perlahan pada awal start agar tidak terjadi water hammer.',
    ],
  },
  {
    id: 'coupling',
    code: '04',
    name: 'Kopling Fleksibel & Sambungan Uji',
    shortLabel: 'Kopling Fleksibel',
    category: 'Katup & Sambungan',
    anchor: { x: 394, y: 394 },
    labelPos: { x: 408, y: 108 },
    functionSummary:
      'Menyerap getaran pompa agar tidak merambat ke jalur alat ukur sekaligus memudahkan penyetelan kelurusan pipa uji.',
    fieldRole:
      'Menjadi pemutus getaran mekanis antara katup isolasi dan rangkaian meter air agar kalibrasi berlangsung stabil dan bebas kebocoran aksial.',
    inspectionPoints: [
      'Periksa kondisi karet selongsong dan klem pengunci logam terhadap retak atau rembesan.',
      'Pastikan sumbu pipa kiri dan kanan sejajar tanpa beban tekuk berlebih.',
    ],
  },
  {
    id: 'gate-valve',
    code: '05',
    name: 'Katup Pengatur Debit (Gate Valve)',
    shortLabel: 'Katup Pengatur Debit',
    category: 'Katup & Sambungan',
    anchor: { x: 504, y: 372 },
    labelPos: { x: 516, y: 186 },
    functionSummary:
      'Mengatur besaran laju aliran air secara bertahap untuk mencapai titik uji debit minimum (Q₁), transisi (Q₂), dan nominal (Q₃).',
    fieldRole:
      'Diputar menggunakan roda tangan merah di atas pipa. Bukaan katup menentukan kecepatan aliran yang terbaca pada master meter.',
    inspectionPoints: [
      'Putar roda tangan secara halus hingga angka laju aliran pada master meter stabil.',
      'Hindari memutar paksa melebihi batas henti dudukan katup.',
      'Catat posisi bukaan referensi untuk mempercepat perpindahan dari Q₃ ke Q₂ dan Q₁.',
    ],
  },
  {
    id: 'test-meter',
    code: '06',
    name: 'Meter Air Uji (Unit yang Diperiksa)',
    shortLabel: 'Meter Air Uji',
    category: 'Alat Ukur',
    anchor: { x: 632, y: 376 },
    labelPos: { x: 632, y: 108 },
    functionSummary:
      'Meter air pelanggan atau unit sampel yang sedang diuji akurasi penunjukan volumenya terhadap standar master meter.',
    fieldRole:
      'Dipasang sejajar secara seri pada jalur pipa lurus. Pembacaan jarum/angka awalnya dicatat sebagai V₀ sebelum aliran dibuka penuh.',
    inspectionPoints: [
      'Pastikan arah panah pada bodi meter searah dengan arah aliran air (kiri ke kanan).',
      'Pastikan posisi dial menghadap tegak lurus ke atas agar bebas kesalahan paralaks.',
      'Keluarkan seluruh gelembung udara dari ruang ukur sebelum mencatat volume awal.',
    ],
  },
  {
    id: 'master-meter',
    code: '07',
    name: 'Master Meter (Meter Referensi Terkalibrasi)',
    shortLabel: 'Master Meter',
    category: 'Alat Ukur',
    anchor: { x: 785, y: 378 },
    labelPos: { x: 778, y: 186 },
    functionSummary:
      'Alat ukur standar presisi tinggi yang telah dikalibrasi oleh laboratorium metrologi sebagai acuan volume sebenarnya (Vₘ).',
    fieldRole:
      'Mengukur volume total dan debit sesaat dengan ketidakpastian rendah. Selisih bacaan Meter Uji terhadap Master Meter menentukan nilai galat (error).',
    inspectionPoints: [
      'Verifikasi sertifikat kalibrasi master meter masih berlaku sebelum memulai pengujian.',
      'Pastikan tampilan digital terbaca jelas dan baterai/catu daya dalam kondisi penuh.',
      'Gunakan volume uji minimal sesuai ketentuan debit agar resolusi pembacaan akurat.',
    ],
  },
  {
    id: 'return-pipe',
    code: '08',
    name: 'Pipa Pembuangan / Resirkulasi',
    shortLabel: 'Pipa Resirkulasi',
    category: 'Perpipaan & Sumber',
    anchor: { x: 955, y: 394 },
    labelPos: { x: 892, y: 108 },
    functionSummary:
      'Menyalurkan air keluaran dari master meter kembali ke bak penampung dalam sistem sirkulasi tertutup tanpa membuang air.',
    fieldRole:
      'Ujung pipa tercelup di bawah permukaan air bak penampung untuk mencegah percikan berlebih dan menjaga tekanan balik konstan di hilir meter.',
    inspectionPoints: [
      'Pastikan ujung pipa kembali berada di bawah muka air agar tidak timbul pusaran udara.',
      'Periksa siku 90° dan klem penyangga agar tidak bergetar pada pengujian debit Q₃.',
    ],
  },
  {
    id: 'suction-pipe',
    code: '09',
    name: 'Pipa Hisap Bawah (Suction Line)',
    shortLabel: 'Pipa Hisap',
    category: 'Perpipaan & Sumber',
    anchor: { x: 435, y: 624 },
    labelPos: { x: 435, y: 674 },
    functionSummary:
      'Menghubungkan bak penampung di sisi kanan ke sisi masuk (suction) pompa sentrifugal di bawah meja kerja uji.',
    fieldRole:
      'Berada di ruang bawah meja uji agar jalur pipa atas tetap ringkas dan ergonomis bagi teknisi saat memasang serta membaca meter air.',
    inspectionPoints: [
      'Periksa sambungan elbow dan soket bawah secara berkala dari kebocoran hisap udara.',
      'Pastikan tidak ada sedimen atau kotoran yang menyumbat saluran masuk dari bak.',
    ],
  },
  {
    id: 'reservoir',
    code: '10',
    name: 'Bak Penampung Air (Reservoir Sirkulasi)',
    shortLabel: 'Bak Penampung',
    category: 'Perpipaan & Sumber',
    anchor: { x: 850, y: 556 },
    labelPos: { x: 850, y: 616 },
    functionSummary:
      'Tangki penyedia air uji berkapasitas memadai untuk menjaga sirkulasi tertutup tetap stabil dan bebas gelembung udara.',
    fieldRole:
      'Menjaga tinggi muka air selalu di atas lubang pipa hisap dan pipa kembali sehingga suhu serta tekanan air uji tetap seragam.',
    inspectionPoints: [
      'Pastikan ketinggian air selalu berada minimal 15 cm di atas sambungan pipa hisap.',
      'Jaga kebersihan air bak dari partikel pasir agar tidak merusak turbin meter uji.',
    ],
  },
];

export const SOP_STAGES: SopStage[] = [
  {
    id: 'stage-prep',
    stepNumber: 'Tahap 1',
    title: 'Persiapan & Pengisian Jalur (Flushing)',
    durationHint: '2–3 menit',
    summary:
      'Pastikan meter uji terpasang searah panah aliran, buang udara dari seluruh pipa dengan membuka katup bola dan menyalakan pompa pada debit nominal.',
    focusComponentIds: ['switch-box', 'pump', 'ball-valve', 'coupling', 'test-meter'],
    preset: {
      pumpOn: true,
      ballValveOpen: true,
      regime: 'Q3',
    },
    actions: [
      'Periksa arah panah Meter Air Uji (06) sudah menghadap dari kiri ke kanan.',
      'Buka Katup Bola (03) penuh (tuas sejajar pipa) dan buka Katup Pengatur Debit (05).',
      'Tekan Sakelar Pompa (01) ke posisi ON dan alirkan air selama 1 menit hingga gelembung udara hilang.',
    ],
    safetyNote:
      'Jangan menyalakan pompa jika Katup Bola (03) tertutup rapat terlalu lama untuk mencegah beban tekan berlebih.',
  },
  {
    id: 'stage-q3',
    stepNumber: 'Tahap 2',
    title: 'Pengujian Debit Nominal (Q₃)',
    durationHint: '3–5 menit',
    summary:
      'Uji akurasi pada kapasitas aliran kerja penuh. Batas kesalahan maksimum yang diizinkan (BKD) pada rentang Q₂ ≤ Q ≤ Q₄ adalah ±2,0%.',
    focusComponentIds: ['gate-valve', 'test-meter', 'master-meter'],
    preset: {
      pumpOn: true,
      ballValveOpen: true,
      regime: 'Q3',
    },
    actions: [
      'Atur Katup Pengatur Debit (05) hingga Master Meter (07) menunjukkan laju aliran nominal Q₃ (2.500 L/jam).',
      'Catat penunjukan awal Meter Uji dan Master Meter secara bersamaan saat aliran stabil.',
      'Hentikan aliran lewat Katup Bola (03) setelah volume uji tercapai, lalu hitung galat relatif.',
    ],
    safetyNote:
      'Pastikan pembacaan dial Meter Uji (06) dilakukan tegak lurus dari atas untuk menghindari kesalahan paralaks.',
  },
  {
    id: 'stage-q2',
    stepNumber: 'Tahap 3',
    title: 'Pengujian Debit Transisi (Q₂)',
    durationHint: '4–6 menit',
    summary:
      'Verifikasi sensitivitas peralihan meter air pada aliran menengah dengan batas toleransi akurasi ±2,0%.',
    focusComponentIds: ['gate-valve', 'test-meter', 'master-meter'],
    preset: {
      pumpOn: true,
      ballValveOpen: true,
      regime: 'Q2',
    },
    actions: [
      'Putar roda tangan Katup Pengatur Debit (05) searah jarum jam untuk menurunkan debit menuju titik Q₂ (50 L/jam).',
      'Tunggu stabilisasi aliran pada Master Meter (07) selama minimal 30 detik.',
      'Catat volume awal dan akhir kedua meter lalu bandingkan pada tab Hitung Error.',
    ],
    safetyNote:
      'Hindari menyentuh kopling atau menggoyang meja uji selama pencatatan aliran rendah berlangsung.',
  },
  {
    id: 'stage-q1',
    stepNumber: 'Tahap 4',
    title: 'Pengujian Debit Minimum (Q₁) & Penutupan',
    durationHint: '5–8 menit',
    summary:
      'Uji batas bawah kepekaan start dan pembacaan lambat meter air. Batas kesalahan maksimum pada Q₁ ≤ Q < Q₂ adalah ±5,0%.',
    focusComponentIds: ['gate-valve', 'test-meter', 'master-meter', 'ball-valve', 'switch-box'],
    preset: {
      pumpOn: true,
      ballValveOpen: true,
      regime: 'Q1',
    },
    actions: [
      'Kecilkan bukaan Katup Pengatur Debit (05) secara halus ke titik Q₁ (32 L/jam).',
      'Pastikan jarum indikator putaran pada Meter Air Uji (06) berputar konsisten tanpa tersendat.',
      'Setelah selesai, tutup Katup Bola (03) lalu matikan Sakelar Pompa (01) ke posisi OFF.',
    ],
    safetyNote:
      'Selalu matikan pompa sebelum melepas sambungan meter uji agar lantai kerja tetap kering dan aman.',
  },
];
