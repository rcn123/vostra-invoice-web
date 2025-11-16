import { useParams, Link } from 'react-router-dom';
import { LineItem } from '../data/mockInvoices';
import { useState, useEffect } from 'react';
import DemoLayout from '../components/DemoLayout';
import AccountDropdown from '../components/AccountDropdown';
import { apiClient, type Invoice } from '../services/api';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any | null>(null);
  const [lines, setLines] = useState<LineItem[]>([]);
  const [expandedExplanations, setExpandedExplanations] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  // Fetch invoice data on mount
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        console.error('InvoiceDetailPage: No invoice ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`InvoiceDetailPage: Fetching invoice #${id}`);

        const data = await apiClient.getInvoice(parseInt(id));
        console.log('InvoiceDetailPage: Invoice data received:', data);
        setInvoice(data);

        // Extract lines from raw_ai_data
        if (data.raw_ai_data?.lines) {
          console.log(`InvoiceDetailPage: Found ${data.raw_ai_data.lines.length} line items`);
          setLines(data.raw_ai_data.lines);
        } else {
          console.warn('InvoiceDetailPage: No lines found in raw_ai_data');
        }
      } catch (err) {
        console.error('InvoiceDetailPage: Error fetching invoice:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <DemoLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DemoLayout>
    );
  }

  if (error || !invoice) {
    return (
      <DemoLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {error || 'Faktura hittades inte'}
            </h2>
            <Link to="/demo/invoices" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              Tillbaka till fakturor
            </Link>
          </div>
        </div>
      </DemoLayout>
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
        ? { ...line, approved: true, user_account: line.user_account || line.ai_suggestions[0]?.account_number }
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

  const handleApproveInvoice = async () => {
    if (!invoice || !id) return;

    try {
      setApproving(true);
      setError(null);

      // Build validated data with current line selections
      const validatedData = {
        ...invoice.raw_ai_data,
        lines: lines.map(line => ({
          ...line,
          // Only include user_account if it exists or if ai_suggestions exist
          user_account: line.user_account ||
            (line.ai_suggestions && line.ai_suggestions[0]?.account_number) ||
            undefined
        }))
      };

      console.log('handleApproveInvoice: Sending validated data:', validatedData);

      const updatedInvoice = await apiClient.approveInvoice(parseInt(id), {
        validated_data: validatedData
      });

      console.log('handleApproveInvoice: Invoice approved successfully:', updatedInvoice);
      setInvoice(updatedInvoice);
      alert('Faktura godkänd!');
    } catch (err) {
      console.error('handleApproveInvoice: Error approving invoice:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve invoice';
      setError(errorMessage);
      alert(`Fel vid godkännande: ${errorMessage}`);
    } finally {
      setApproving(false);
    }
  };

  const toggleExplanation = (lineNumber: number) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
      } else {
        newSet.add(lineNumber);
      }
      return newSet;
    });
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
                Faktura {invoice.raw_ai_data?.invoice_number || invoice.original_filename}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-gray-900">
                {invoice.raw_ai_data?.total ? formatCurrency(invoice.raw_ai_data.total) : '-'}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {invoice.raw_ai_data?.currency || 'SEK'}
              </div>
            </div>
          </div>

          {/* Invoice Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Leverantör</h3>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {invoice.raw_ai_data?.supplier?.name || '-'}
                </div>
                <div className="text-gray-600">
                  {invoice.raw_ai_data?.supplier?.org_number || '-'}
                </div>
                <div className="text-gray-600">
                  {invoice.raw_ai_data?.supplier?.address || '-'}
                </div>
                {invoice.raw_ai_data?.supplier?.phone && (
                  <div className="text-gray-600">{invoice.raw_ai_data.supplier.phone}</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Mottagare</h3>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {invoice.raw_ai_data?.buyer?.name || '-'}
                </div>
                <div className="text-gray-600">
                  {invoice.raw_ai_data?.buyer?.address || '-'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Datum</h3>
              <div className="text-sm text-gray-900">
                <div>
                  Fakturadatum:{' '}
                  {invoice.raw_ai_data?.invoice_date
                    ? formatDate(invoice.raw_ai_data.invoice_date)
                    : '-'}
                </div>
                <div>
                  Förfallodatum:{' '}
                  {invoice.raw_ai_data?.due_date
                    ? formatDate(invoice.raw_ai_data.due_date)
                    : '-'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Betalning</h3>
              <div className="text-sm text-gray-900">
                {invoice.raw_ai_data?.payment_method && (
                  <div>Metod: {invoice.raw_ai_data.payment_method}</div>
                )}
                {invoice.raw_ai_data?.ocr_number && (
                  <div>OCR: {invoice.raw_ai_data.ocr_number}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-gray-200">
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
                {lines.map((line) => {
                  const hasSuggestions = line.ai_suggestions && line.ai_suggestions.length > 0;
                  const selectedSuggestion = hasSuggestions
                    ? (line.ai_suggestions.find(
                        s => s.account_number === (line.user_account || line.ai_suggestions[0]?.account_number)
                      ) || line.ai_suggestions[0])
                    : null;
                  const isExpanded = expandedExplanations.has(line.line_number);

                  return (
                    <>
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                          {formatCurrency(line.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {hasSuggestions ? (
                            <AccountDropdown
                              suggestions={line.ai_suggestions}
                              selectedAccount={line.user_account || line.ai_suggestions[0]?.account_number || ''}
                              onChange={(account) => handleAccountChange(line.line_number, account)}
                            />
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              Konteringsförslag kommer snart
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {hasSuggestions && selectedSuggestion ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      selectedSuggestion.confidence >= 0.9
                                        ? 'bg-green-500'
                                        : selectedSuggestion.confidence >= 0.7
                                        ? 'bg-yellow-500'
                                        : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${selectedSuggestion.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-12">
                                  {Math.round(selectedSuggestion.confidence * 100)} %
                                </span>
                              </div>
                              <button
                                onClick={() => toggleExplanation(line.line_number)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                title="Visa förklaring"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">–</span>
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
                      {isExpanded && selectedSuggestion && selectedSuggestion.xai && (
                        <tr key={`explanation-${line.line_number}`}>
                          <td colSpan={7} className="px-6 py-4 bg-blue-50 border-l-4 border-blue-400">
                            <div className="text-sm">
                              <div className="font-semibold text-blue-900 mb-2">Förklaring:</div>
                              <ul className="space-y-1 text-blue-800">
                                <li>
                                  <span className="font-medium">Matchade ord:</span>{' '}
                                  {selectedSuggestion.xai.matched_words.length > 0
                                    ? selectedSuggestion.xai.matched_words.map(w => `"${w}"`).join(', ')
                                    : '–'}
                                </li>
                                <li>
                                  <span className="font-medium">Liknande historik:</span>{' '}
                                  {selectedSuggestion.xai.similar_history} fakturor
                                </li>
                                <li>
                                  <span className="font-medium">Osäkerhet:</span>{' '}
                                  {selectedSuggestion.xai.uncertainty}
                                </li>
                                <li>
                                  <span className="font-medium">Underlag:</span>{' '}
                                  {selectedSuggestion.xai.basis}
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delsumma:</span>
                  <span className="text-gray-900">
                    {invoice.raw_ai_data?.subtotal
                      ? formatCurrency(invoice.raw_ai_data.subtotal)
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Moms:</span>
                  <span className="text-gray-900">
                    {invoice.raw_ai_data?.vat_amount
                      ? formatCurrency(invoice.raw_ai_data.vat_amount)
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Totalt:</span>
                  <span className="text-gray-900">
                    {invoice.raw_ai_data?.total
                      ? formatCurrency(invoice.raw_ai_data.total)
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Fel</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Approve Button */}
        {invoice.status === 'extracted' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleApproveInvoice}
              disabled={approving}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                approving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {approving ? 'Godkänner...' : 'Godkänn hela fakturan'}
            </button>
          </div>
        )}

        {/* Status Display */}
        {invoice.status === 'approved' && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            <p className="font-medium">✓ Fakturan är godkänd</p>
            {invoice.approved_at && (
              <p className="text-sm mt-1">
                Godkänd: {new Date(invoice.approved_at).toLocaleString('sv-SE')}
              </p>
            )}
          </div>
        )}

        {invoice.status === 'extraction_failed' && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Extraheringen misslyckades</p>
            {invoice.error_message && (
              <p className="text-sm mt-1">{invoice.error_message}</p>
            )}
          </div>
        )}

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
