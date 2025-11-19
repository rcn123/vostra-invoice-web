import DemoLayout from '../components/DemoLayout';
import '../styles/demo-dashboard.css';

export default function DemoPage() {
  return (
    <DemoLayout>
      <div style={{ backgroundColor: '#F6F6F7', minHeight: '100vh' }}>
        <div className="demo-container">
          {/* Back link */}
          <div style={{ marginBottom: '2rem' }}>
            <a href="/" style={{ color: '#6C5CE7', textDecoration: 'none' }}>
              ← Tillbaka
            </a>
          </div>

          {/* Hero / Header Section */}
          <div className="demo-header">
            <h1>Demo — VostraInvoice i praktiken</h1>
            <p>
              Demo-datasetet är hämtat från offentlig reskontradata från en större verksamhet och kompletterat med ett mindre antal syntetiska kolumner.
              AI-modellerna och regelmotorn är tränade på samma dataset, och alla visade regler, avvikelser och precisionstal är beräknade direkt från detta underlag.
              Måtten ger en realistisk bild av vilken nivå man typiskt kan förvänta sig vid liknande datamängder, exempelvis omkring en miljon rader historik över två år.
            </p>
            <div className="demo-header-separator"></div>
          </div>

          {/* SEKTION 1 — Översikt (3 breda kort) */}
          <div className="dashboard-grid">
            {/* KORT 1 — Historisk datamängd */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 2a1 1 0 00-1 1v1H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H9V3a1 1 0 00-1-1zm0 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"/>
                  </svg>
                </div>
                <div className="card-title">Historisk datamängd</div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>2023:</span>
                  <span className="card-metric-main" style={{ fontSize: '24px' }}>487 129</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>2024:</span>
                  <span className="card-metric-main" style={{ fontSize: '24px' }}>545 883</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>2025:</span>
                  <div>
                    <span className="card-metric-main" style={{ fontSize: '24px' }}>453 441</span>
                    <span style={{ fontSize: '11px', color: '#999', marginLeft: '6px' }}>hittills</span>
                  </div>
                </div>
              </div>
              <p className="card-metric-secondary" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E4E4E7' }}>
                Beräknat från datasetet i denna demo.
              </p>
            </div>

            {/* KORT 2 — 2025 Fakturastatus */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="card-title">2025 — Fakturastatus</div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Konterade</span>
                    <span style={{ fontWeight: '600' }}>95%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Väntar på granskning</span>
                    <span style={{ fontWeight: '600' }}>5%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Flaggade för avvikelse</span>
                    <span style={{ fontWeight: '600' }}>0,2%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* KORT 3 — Regelmotor */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                  </svg>
                </div>
                <div className="card-title">Regelmotor</div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div className="card-metric-main">102 441</div>
                <div className="card-metric-secondary">aktiva regler</div>
              </div>
              <ul className="card-list" style={{ marginTop: '12px' }}>
                <li><span>Automatgenererade</span><span style={{ fontWeight: '600' }}>87 902</span></li>
                <li><span>Leverantörsregler</span><span style={{ fontWeight: '600' }}>12 331</span></li>
                <li><span>Beloppsintervall</span><span style={{ fontWeight: '600' }}>2 208</span></li>
                <li><span>Moms/konto</span><span style={{ fontWeight: '600' }}>1 213</span></li>
                <li><span>Säsongsmönster</span><span style={{ fontWeight: '600' }}>787</span></li>
              </ul>
              <p className="card-metric-secondary" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E4E4E7' }}>
                Genererat från samma dataset.
              </p>
            </div>
          </div>

          {/* SEKTION 2 — AI-prestanda & Avvikelser (2 kort) */}
          <div className="dashboard-grid-wide">
            {/* KORT 4 — AI-precision */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                </div>
                <div className="card-title">AI-precision</div>
              </div>
              <div className="card-subtitle">Top-1 / Top-3</div>
              <div style={{ marginTop: '12px' }}>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Konto</span>
                    <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>92% / 99%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>KST</span>
                    <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>88% / 97%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Projekt</span>
                    <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>84% / 96%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label-row">
                    <span>Moms</span>
                    <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>99%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '99%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* KORT 5 — Avvikelser senaste 30 dagarna */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div className="card-title">Avvikelser senaste 30 dagarna</div>
              </div>
              <ul className="card-list" style={{ marginTop: '12px' }}>
                <li><span>Dubbletter</span><span style={{ fontWeight: '600' }}>182</span></li>
                <li><span>Nya betalningsuppgifter</span><span style={{ fontWeight: '600' }}>41</span></li>
                <li><span>Ovanliga konton</span><span style={{ fontWeight: '600' }}>13</span></li>
                <li><span>För stora belopp</span><span style={{ fontWeight: '600' }}>6</span></li>
                <li><span>Mönsterförändring</span><span style={{ fontWeight: '600' }}>1</span></li>
              </ul>
              <p className="card-metric-secondary" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E4E4E7' }}>
                Markeras för granskning, inget sker automatiskt.
              </p>
            </div>
          </div>

          {/* SEKTION 3 — Leverantörsbredd (1 brett kort) */}
          <div style={{ marginTop: '24px' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div className="card-title">Leverantörsbredd</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '16px' }}>
                <div>
                  <div className="card-metric-main">6 112</div>
                  <div className="card-metric-secondary">unika leverantörer</div>
                </div>
                <div>
                  <div className="card-metric-main">134 000</div>
                  <div className="card-metric-secondary">rader/månad</div>
                </div>
              </div>
            </div>
          </div>

          {/* SEKTION 4 — Footer */}
          <div className="demo-footer">
            Filer du laddar upp i denna demo sparas endast under din session och raderas automatiskt när sessionen avslutas. Ladda inte upp dokument som kan innehålla sekretessbelagd information.
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
