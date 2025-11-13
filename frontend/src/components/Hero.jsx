export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          VostraInvoice
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          AI-kontering med människa i loopen
        </p>
        <p className="text-xl text-gray-600 mb-12">
          Smidig fakturahantering för kommuner och små organisationer
        </p>
        <a
          href="/vostra-invoice/demo"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Testa Demo
        </a>
      </div>
    </div>
  );
}
