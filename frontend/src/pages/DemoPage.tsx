import { Link } from 'react-router-dom';
import DemoLayout from '../components/DemoLayout';

export default function DemoPage() {
  return (
    <DemoLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700">
            ← Tillbaka
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            VostraInvoice Demo
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            AI-assisterad fakturahantering för svenska kommuner
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/demo/upload"
              className="block p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-4">📤</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ladda upp faktura
              </h2>
              <p className="text-gray-600">
                Ladda upp en PDF eller bild och låt AI extrahera och föreslå kontering
              </p>
            </Link>

            <Link
              to="/demo/invoices"
              className="block p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Visa fakturor
              </h2>
              <p className="text-gray-600">
                Se alla fakturor, granska AI-förslag och godkänn kontering
              </p>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Demo-funktioner:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ AI-extraktion av fakturaData</li>
              <li>✓ Automatisk konteringsförslag med BAS-konton</li>
              <li>✓ Interaktiv granskning och godkännande</li>
              <li>✓ Feedback-loop för förbättrad noggrannhet</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
