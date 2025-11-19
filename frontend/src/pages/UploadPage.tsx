import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DemoLayout from '../components/DemoLayout';
import { apiClient } from '../services/api';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Ogiltig filtyp. Endast PDF, PNG och JPG tillåts.');
      return;
    }

    // Validate file size (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Filen är för stor. Max storlek är 10 MB.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const invoice = await apiClient.uploadInvoice(file);

      // Navigate to invoice detail page after successful upload
      navigate(`/demo/invoice/${invoice.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploading(false);
    }
  };

  return (
    <DemoLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Ladda upp faktura
          </h1>
          <p className="text-gray-600">
            Dra och släpp en fil eller klicka för att välja
          </p>
        </div>

        {/* Privacy Warning */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900 leading-relaxed">
            <strong>Ladda inte upp dokument som innehåller sekretessbelagda uppgifter.</strong>
            <br />
            Demo-miljön är avsedd för test med öppna och offentliga dokument.
            <br />
            Filer du laddar upp används endast för visning i denna session/inloggning och sparas inte permanent.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Fel vid uppladdning</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Bearbetar faktura...
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  AI-extraherar data och föreslår kontering
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-lg font-medium text-gray-900">
                  Dra och släpp en fil här
                </p>
                <p className="text-sm text-gray-600">
                  eller
                </p>
              </div>

              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer transition-colors"
              >
                Välj fil
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleChange}
                />
              </label>

              <div className="mt-6 text-xs text-gray-500">
                <p>Stöd för PDF, PNG och JPG</p>
                <p className="mt-1">Max filstorlek: 10 MB</p>
              </div>
            </>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            Vad händer när du laddar upp?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>AI läser fakturan och extraherar all data (leverantör, belopp, rader)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Systemet kontrollerar efter dubbletter</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>AI föreslår BAS-konton för varje fakturarad</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Du kan granska, godkänna eller korrigera förslagen</span>
            </li>
          </ul>
        </div>
      </div>
    </DemoLayout>
  );
}
