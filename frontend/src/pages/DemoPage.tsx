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
        <p className="text-gray-600 mb-6">
          Data från en exempelregion. Visar hur systemet presterar i praktiken.
        </p>

        {/* Dataset Information */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-900 leading-relaxed">
            Demo-datasetet är hämtat från offentlig reskontradata från en större verksamhet och kompletterat med ett mindre antal syntetiska kolumner.
            AI-modellerna och regelmotorn är tränade på samma dataset, och alla visade regler, avvikelser och precisionstal är beräknade direkt från detta underlag.
            Måtten ger en realistisk bild av vilken nivå man typiskt kan förvänta sig vid liknande datamängder, exempelvis omkring en miljon rader historik över två år.
          </p>
        </div>

        {/* Row 1: Three large boxes */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Box 1: Historical data volume */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Historisk datamängd
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 font-medium">2023:</span>
                <span className="text-3xl font-bold text-gray-900 tabular-nums">487 129</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '89%' }}></div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 font-medium">2024:</span>
                <span className="text-3xl font-bold text-gray-900 tabular-nums">545 883</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 font-medium">2025:</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 tabular-nums">453 441</span>
                  <span className="text-sm text-gray-500 ml-2">hittills</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
              Bygger på en sammanställd exempelregion. All statistik baseras på verkliga fakturor.
            </p>
          </div>

          {/* Box 2: Current year status */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                2025 – Fakturastatus
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-700 font-medium">Konterade</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">223 331</span>
                    <span className="text-sm text-green-600 ml-2 font-semibold">95%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-700 font-medium">Väntar på granskning</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">11 882</span>
                    <span className="text-sm text-amber-600 ml-2 font-semibold">5%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-700 font-medium">Flaggade för avvikelse</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">418</span>
                    <span className="text-sm text-red-600 ml-2 font-semibold">0,2%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '0.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Rule engine */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Regelmotor
              </h2>
            </div>
            <div className="mb-5">
              <div className="text-4xl font-bold text-gray-900 tabular-nums">102 441</div>
              <div className="text-sm text-gray-600 font-medium mt-1">aktiva regler</div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Automatiskt genererade</span>
                <span className="font-bold text-gray-900 tabular-nums">87 902</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '86%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Leverantörsregler</span>
                <span className="font-bold text-gray-900 tabular-nums">12 331</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Beloppsintervall</span>
                <span className="font-bold text-gray-900 tabular-nums">2 208</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moms-/kontoregler</span>
                <span className="font-bold text-gray-900 tabular-nums">1 213</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Säsongsmönster</span>
                <span className="font-bold text-gray-900 tabular-nums">787</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
              Reglerna baseras på stabila mönster i historiska transaktioner.
            </p>
          </div>
        </div>

        {/* Row 2: Three smaller boxes */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Box 4: AI precision */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI-precision
              </h2>
            </div>
            <div className="text-xs text-gray-500 mb-4">verklig användning</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-gray-700 font-medium">Konto:</span>
                  <span className="text-sm font-mono text-gray-900">
                    top-1 <strong className="text-indigo-600">92%</strong>, top-3 <strong className="text-indigo-600">99%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-gray-700 font-medium">KST:</span>
                  <span className="text-sm font-mono text-gray-900">
                    top-1 <strong className="text-indigo-600">88%</strong>, top-3 <strong className="text-indigo-600">97%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-gray-700 font-medium">Projekt:</span>
                  <span className="text-sm font-mono text-gray-900">
                    top-1 <strong className="text-indigo-600">84%</strong>, top-3 <strong className="text-indigo-600">96%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-gray-700 font-medium">Moms:</span>
                  <span className="text-sm font-mono text-gray-900">
                    top-1 <strong className="text-indigo-600">99%</strong>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '99%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
              Beräknat på sampledata från exempelregionen.
            </p>
          </div>

          {/* Box 5: Anomaly detection */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Avvikelselogg
              </h2>
            </div>
            <div className="text-xs text-gray-500 mb-4">senaste 30 dagarna</div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-sm text-gray-700">Dubblettmatchningar</span>
                <span className="font-bold text-gray-900 tabular-nums">182</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-sm text-gray-700">Nya betalningsuppgifter</span>
                <span className="font-bold text-gray-900 tabular-nums">41</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-sm text-gray-700">Ovanliga kontoavvikelser</span>
                <span className="font-bold text-gray-900 tabular-nums">13</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-sm text-gray-700">Ovanligt stora fakturor</span>
                <span className="font-bold text-gray-900 tabular-nums">6</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-gray-700">Misstänkt mönsterförändring</span>
                <span className="font-bold text-orange-600 tabular-nums">1</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
              Avvikelser markeras för granskning, inget sker automatiskt.
            </p>
          </div>

          {/* Box 6: Supplier breadth */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Leverantörsbredd
              </h2>
            </div>
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
                <div className="text-4xl font-bold text-gray-900 tabular-nums">6 112</div>
                <div className="text-sm text-gray-600 font-medium mt-1">unika leverantörer</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="text-4xl font-bold text-gray-900 tabular-nums">134 000</div>
                <div className="text-sm text-gray-600 font-medium mt-1">fakturarader/månad i snitt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
