import DemoLayout from '../components/DemoLayout';

export default function DemoPage() {
  return (
    <DemoLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <a href="/" className="text-purple-600 hover:text-purple-700">
              ← Tillbaka
            </a>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-xl p-6 mb-6 border-b-2 border-purple-600">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Demo — VostraInvoice i praktiken
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              Data från en exempelregion. Visar hur systemet presterar i praktiken.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Demo-datasetet är hämtat från offentlig reskontradata från en större verksamhet och kompletterat med ett mindre antal syntetiska kolumner.
              AI-modellerna och regelmotorn är tränade på samma dataset, och alla visade regler, avvikelser och precisionstal är beräknade direkt från detta underlag.
              Måtten ger en realistisk bild av vilken nivå man typiskt kan förvänta sig vid liknande datamängder, exempelvis omkring en miljon rader historik över två år.
            </p>
          </div>

          {/* Sektion 1: Översiktsrad - 3 breda kort */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Kort 1: Historisk datamängd */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2a1 1 0 00-1 1v1H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H9V3a1 1 0 00-1-1zm0 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  Historisk datamängd
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">2023:</span>
                  <span className="text-3xl font-bold text-gray-800 tabular-nums">487 129</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">2024:</span>
                  <span className="text-3xl font-bold text-gray-800 tabular-nums">545 883</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">2025:</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-800 tabular-nums">453 441</span>
                    <span className="text-xs text-gray-500 ml-2">hittills</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
                Bygger på en sammanställd exempelregion. All statistik baseras på verkliga fakturor.
              </p>
            </div>

            {/* Kort 2: Status för årets fakturor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  2025 – Fakturastatus
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Konterade</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 tabular-nums">223 331</span>
                      <span className="text-sm text-gray-500 ml-2">95%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Väntar på granskning</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 tabular-nums">11 882</span>
                      <span className="text-sm text-gray-500 ml-2">5%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Flaggade för avvikelse</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 tabular-nums">418</span>
                      <span className="text-sm text-gray-500 ml-2">0,2%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kort 3: Regelmotor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  Regelmotor
                </h2>
              </div>
              <div className="mb-5">
                <div className="text-4xl font-bold text-gray-800 tabular-nums">102 441</div>
                <div className="text-sm text-gray-600 mt-1">aktiva regler</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Automatiskt genererade</span>
                  <span className="font-semibold text-gray-800 tabular-nums">87 902</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Leverantörsregler</span>
                  <span className="font-semibold text-gray-800 tabular-nums">12 331</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Beloppsintervall</span>
                  <span className="font-semibold text-gray-800 tabular-nums">2 208</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Moms-/kontoregler</span>
                  <span className="font-semibold text-gray-800 tabular-nums">1 213</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Säsongsmönster</span>
                  <span className="font-semibold text-gray-800 tabular-nums">787</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
                Reglerna baseras på stabila mönster i historiska transaktioner.
              </p>
            </div>
          </div>

          {/* Sektion 2: Prestanda & Avvikelser - 2 breda kort */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Kort 4: AI-precision */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI-precision
                </h2>
              </div>
              <div className="text-xs text-gray-500 mb-4">verklig användning</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Konto:</span>
                    <span className="text-sm font-mono text-gray-800">
                      top-1 <strong>92%</strong>, top-3 <strong>99%</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">KST:</span>
                    <span className="text-sm font-mono text-gray-800">
                      top-1 <strong>88%</strong>, top-3 <strong>97%</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Projekt:</span>
                    <span className="text-sm font-mono text-gray-800">
                      top-1 <strong>84%</strong>, top-3 <strong>96%</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-600">Moms:</span>
                    <span className="text-sm font-mono text-gray-800">
                      top-1 <strong>99%</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
                Beräknat på sampledata från exempelregionen.
              </p>
            </div>

            {/* Kort 5: Avvikelselogg */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  Avvikelselogg
                </h2>
              </div>
              <div className="text-xs text-gray-500 mb-4">senaste 30 dagarna</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Dubblettmatchningar</span>
                  <span className="font-semibold text-gray-800 tabular-nums">182</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Nya betalningsuppgifter</span>
                  <span className="font-semibold text-gray-800 tabular-nums">41</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Ovanliga kontoavvikelser</span>
                  <span className="font-semibold text-gray-800 tabular-nums">13</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Ovanligt stora fakturor</span>
                  <span className="font-semibold text-gray-800 tabular-nums">6</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Misstänkt mönsterförändring</span>
                  <span className="font-semibold text-gray-800 tabular-nums">1</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
                Avvikelser markeras för granskning, inget sker automatiskt.
              </p>
            </div>
          </div>

          {/* Sektion 3: Leverantörsbredd */}
          <div className="grid md:grid-cols-1 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  Leverantörsbredd
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-gray-800 tabular-nums">6 112</div>
                  <div className="text-sm text-gray-600 mt-2">unika leverantörer</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-800 tabular-nums">134 000</div>
                  <div className="text-sm text-gray-600 mt-2">fakturarader/månad i snitt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
