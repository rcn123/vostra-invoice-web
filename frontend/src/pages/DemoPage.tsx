import DemoLayout from '../components/DemoLayout';

export default function DemoPage() {
  return (
    <DemoLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700">
            ← Tillbaka
          </a>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Systemöversikt
        </h1>
        <p className="text-gray-600 mb-8">
          Data från en exempelregion. Visar hur systemet presterar i praktiken.
        </p>

        {/* Row 1: Three large boxes */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Box 1: Historical data volume */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Historisk datamängd
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-700">2023:</span>
                <span className="text-2xl font-bold text-gray-900">487 129</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-700">2024:</span>
                <span className="text-2xl font-bold text-gray-900">545 883</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-700">2025:</span>
                <span className="text-2xl font-bold text-gray-900">453 441</span>
                <span className="text-sm text-gray-500">hittills</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Bygger på en sammanställd exempelregion. All statistik baseras på verkliga fakturor.
            </p>
          </div>

          {/* Box 2: Current year status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              2025 – Fakturastatus
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Konterade</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">223 331</div>
                  <div className="text-sm text-gray-500">95%</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Väntar på granskning</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">11 882</div>
                  <div className="text-sm text-gray-500">5%</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Flaggade för avvikelse</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">418</div>
                  <div className="text-sm text-gray-500">0,2%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Rule engine */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Regelmotor
            </h2>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              102 441 <span className="text-base font-normal text-gray-600">aktiva regler</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Automatiskt genererade</span>
                <span className="font-semibold text-gray-900">87 902</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leverantörsregler</span>
                <span className="font-semibold text-gray-900">12 331</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Beloppsintervall</span>
                <span className="font-semibold text-gray-900">2 208</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moms-/kontoregler</span>
                <span className="font-semibold text-gray-900">1 213</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Säsongsmönster</span>
                <span className="font-semibold text-gray-900">787</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Reglerna baseras på stabila mönster i historiska transaktioner.
            </p>
          </div>
        </div>

        {/* Row 2: Three smaller boxes */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Box 4: AI precision */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              AI-precision (verklig användning)
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Konto:</span>
                <span className="font-mono text-gray-900">
                  top-1 <strong>92%</strong>, top-3 <strong>99%</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">KST:</span>
                <span className="font-mono text-gray-900">
                  top-1 <strong>88%</strong>, top-3 <strong>97%</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Projekt:</span>
                <span className="font-mono text-gray-900">
                  top-1 <strong>84%</strong>, top-3 <strong>96%</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Moms:</span>
                <span className="font-mono text-gray-900">
                  top-1 <strong>99%</strong>
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Beräknat på sampledata från exempelregionen.
            </p>
          </div>

          {/* Box 5: Anomaly detection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Avvikelselogg (30 dagar)
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Dubblettmatchningar</span>
                <span className="font-semibold text-gray-900">182</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Nya betalningsuppgifter</span>
                <span className="font-semibold text-gray-900">41</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Ovanliga kontoavvikelser</span>
                <span className="font-semibold text-gray-900">13</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Ovanligt stora fakturor</span>
                <span className="font-semibold text-gray-900">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Misstänkt mönsterförändring</span>
                <span className="font-semibold text-gray-900">1</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Avvikelser markeras för granskning, inget sker automatiskt.
            </p>
          </div>

          {/* Box 6: Supplier breadth */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Leverantörsbredd
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">6 112</div>
                <div className="text-sm text-gray-600">unika leverantörer</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">134 000</div>
                <div className="text-sm text-gray-600">unika fakturarader per månad i snitt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
