export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700">
            ← Tillbaka
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo kommer snart
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vi bygger just nu en interaktiv demo av VostraInvoice
          </p>
          <div className="inline-block bg-blue-50 text-blue-800 px-6 py-3 rounded-lg">
            Placeholder för demo-funktionalitet
          </div>
        </div>
      </div>
    </div>
  );
}
