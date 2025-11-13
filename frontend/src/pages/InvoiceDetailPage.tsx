import { useParams, Link } from 'react-router-dom';
import { mockInvoices, LineItem } from '../data/mockInvoices';
import { useState } from 'react';
import DemoLayout from '../components/DemoLayout';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const invoice = mockInvoices.find(inv => inv.id === id);
  const [lines, setLines] = useState<LineItem[]>(invoice?.lines || []);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Faktura hittades inte</h2>
          <Link to="/demo/invoices" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Tillbaka till fakturor
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const handleApproveLine = (lineNumber: number) => {
    setLines(lines.map(line =>
      line.line_number === lineNumber
        ? { ...line, approved: true, user_account: line.ai_suggestion?.account_number }
        : line
    ));
  };

  const handleAccountChange = (lineNumber: number, newAccount: string) => {
    setLines(lines.map(line =>
      line.line_number === lineNumber
        ? { ...line, user_account: newAccount, approved: false }
        : line
    ));
  };

  return (
    <DemoLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/demo/invoices"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Tillbaka till fakturor
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Fakturadetaljer
              </h1>
              <p className="text-gray-600">
                Faktura {invoice.invoice_number}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-gray-900">
                {formatCurrency(invoice.total)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {invoice.currency}
              </div>
            </div>
          </div>

          {/* Invoice Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Leverantör</h3>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{invoice.supplier.name}</div>
                <div className="text-gray-600">{invoice.supplier.org_number}</div>
                <div className="text-gray-600">{invoice.supplier.address}</div>
                {invoice.supplier.phone && (
                  <div className="text-gray-600">{invoice.supplier.phone}</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Mottagare</h3>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{invoice.buyer.name}</div>
                <div className="text-gray-600">{invoice.buyer.address}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Datum</h3>
              <div className="text-sm text-gray-900">
                <div>Fakturadatum: {formatDate(invoice.invoice_date)}</div>
                <div>Förfallodatum: {formatDate(invoice.due_date)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Betalning</h3>
              <div className="text-sm text-gray-900">
                {invoice.payment_method && <div>Metod: {invoice.payment_method}</div>}
                {invoice.ocr_number && <div>OCR: {invoice.ocr_number}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fakturarader</h2>
            <p className="text-sm text-gray-600 mt-1">
              Granska och godkänn AI-förslagen för kontering
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beskrivning
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belopp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI-förslag
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sannolikhet
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lines.map((line) => (
                  <tr key={line.line_number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {line.line_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{line.description}</div>
                      {line.period && (
                        <div className="text-xs text-gray-500 mt-1">
                          Period: {line.period}
                        </div>
                      )}
                      {line.ai_suggestion && (
                        <div className="text-xs text-gray-600 mt-2 italic">
                          💡 {line.ai_suggestion.explanation}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                      {formatCurrency(line.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={line.user_account || line.ai_suggestion?.account_number || ''}
                        onChange={(e) => handleAccountChange(line.line_number, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {line.ai_suggestion && (
                          <option value={line.ai_suggestion.account_number}>
                            {line.ai_suggestion.account_number}
                          </option>
                        )}
                        <option value="5010">5010 - Lokalhyra</option>
                        <option value="5020">5020 - Fastighetskostnader</option>
                        <option value="5060">5060 - Elkostnader</option>
                        <option value="6100">6100 - Kontorsmaterial</option>
                        <option value="6230">6230 - Städning</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {line.ai_suggestion && (
                        <div className="inline-flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {Math.round(line.ai_suggestion.confidence * 100)}%
                          </div>
                          <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${line.ai_suggestion.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {line.approved ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          ✓ Godkänd
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Granskas
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {!line.approved && (
                        <button
                          onClick={() => handleApproveLine(line.line_number)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Godkänn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delsumma:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Moms:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.vat_amount)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Totalt:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            AI-prestanda
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-600 font-medium">Korrekt AI-förslag</div>
              <div className="text-2xl font-semibold text-blue-900 mt-1">82%</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Feedbackhändelser</div>
              <div className="text-2xl font-semibold text-blue-900 mt-1">14</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Senaste förbättring</div>
              <div className="text-2xl font-semibold text-blue-900 mt-1">2025-11-08</div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
