export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">VostraInvoice</a>
          <nav className="flex gap-8">
            <a href="/demo" className="hover:opacity-80 transition-opacity font-medium">Demo</a>
            <a href="#features" className="hover:opacity-80 transition-opacity font-medium">Funktioner</a>
            <a href="#kontakt" className="hover:opacity-80 transition-opacity font-medium">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Automatiserad kontering med AI
          </h1>
          <p className="text-xl mb-2 opacity-95 leading-relaxed">
            Snabbt, precist och spårbart.
          </p>
          <p className="text-xl mb-2 opacity-95 leading-relaxed">
            VostraInvoice tolkar fakturor, föreslår rätt kontering och ger tydliga förklaringar bakom varje beslut.
          </p>
          <p className="text-xl mb-8 opacity-95 leading-relaxed">
            Mindre manuellt arbete. Färre fel. Bättre kontroll.
          </p>
          <a
            href="/demo"
            className="inline-block bg-white text-purple-700 px-10 py-4 rounded-lg text-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Testa demo
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-4xl font-bold mb-2">85–95%</h3>
              <p className="text-lg opacity-90">Träffsäkerhet (top-1)</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">97–99%</h3>
              <p className="text-lg opacity-90">Träffsäkerhet (top-3)</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">100%</h3>
              <p className="text-lg opacity-90">Spårbart och transparent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Varför VostraInvoice?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Hög träffsäkerhet direkt</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-modellen föreslår konto, kostnadsställe, projekt och momskod med hög precision.
                Top-1 runt 85–95%, top-3 runt 97–99%.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Full transparens och spårbarhet</h3>
              <p className="text-gray-600 leading-relaxed">
                Varje förslag kommer med sannolikhet, förklaring och historik.
                Alla ändringar loggas automatiskt i ett revisionsspår.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Stöd för alla fakturaformat</h3>
              <p className="text-gray-600 leading-relaxed">
                PDF, skannade bilder, Peppol BIS3 och Svefaktura hanteras utan extra arbete.
                Systemet läser fakturan som den kommer in.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Automatiska kontroller</h3>
              <p className="text-gray-600 leading-relaxed">
                Onormala belopp, nya betalningsuppgifter, ovanliga konton och dubbletter flaggas automatiskt.
                Tidiga varningar ger tryggare fakturaflöden.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                5
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Människa-i-loopen — gjort enkelt</h3>
              <p className="text-gray-600 leading-relaxed">
                AI ger förslag. Människan godkänner med ett klick.
                Top-3-val, kortkommandon och tydlig layout gör granskningen snabb.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                6
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Regelmotor + automatiskt skapade regler</h3>
              <p className="text-gray-600 leading-relaxed">
                Stöd för egna regler som kan overrida AI-modellen.
                Stabila mönster i historiska konteringar identifieras automatiskt och blir nya regler som förbättrar precisionen över tid.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                7
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Byggt för integrationer</h3>
              <p className="text-gray-600 leading-relaxed">
                API-drivet och flexibelt.
                VostraInvoice kan kopplas till befintliga ekonomisystem och arbetsflöden utan att störa vardagen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="bg-gray-800 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-lg">&copy; 2025 VostraInvoice. Alla rättigheter förbehållna.</p>
          <p className="mt-4 opacity-70">Kontakt: info@vostrainvoice.se</p>
        </div>
      </footer>
    </div>
  );
}
