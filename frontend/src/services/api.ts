/**
 * API Client for VostraInvoice Backend
 *
 * Connects React frontend to FastAPI backend endpoints using generated OpenAPI types
 */

import type { components } from '../types/api';

// Environment-based API URL
// In production, use relative path (served from same domain via ingress)
// In development, use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

// Type aliases from generated OpenAPI types
export type Invoice = components['schemas']['InvoiceResponse'];
export type InvoiceListResponse = components['schemas']['InvoiceListResponse'];
export type ApproveInvoiceData = components['schemas']['InvoiceApprove'];

// Additional interfaces
export interface ListInvoicesParams {
  skip?: number;
  limit?: number;
  status?: string;
}

// Custom error class with Swedish messages
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Swedish error messages
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Ogiltig begäran. Kontrollera dina uppgifter.',
  401: 'Du måste logga in för att fortsätta.',
  403: 'Du har inte behörighet att utföra denna åtgärd.',
  404: 'Resursen kunde inte hittas.',
  408: 'Begäran tog för lång tid. Försök igen.',
  409: 'Konflit: resursen finns redan.',
  413: 'Filen är för stor. Max 10 MB.',
  422: 'Ogiltigt filformat eller data.',
  429: 'För många förfrågningar. Vänta en stund och försök igen.',
  500: 'Serverfel. Försök igen om en stund.',
  502: 'Tjänsten är tillfälligt otillgänglig.',
  503: 'Tjänsten är under underhåll. Försök igen senare.',
  504: 'Servern svarar inte. Kontrollera din anslutning.',
};

// Helper to extract error message from response
async function extractErrorMessage(response: Response): Promise<string> {
  const statusMessage = ERROR_MESSAGES[response.status];

  try {
    const error = await response.json();
    const detailMessage = error.detail || error.message;
    return detailMessage || statusMessage || `Fel (${response.status})`;
  } catch {
    // Response is not JSON (e.g., from ingress/proxy)
    try {
      const text = await response.text();
      if (text && text.length < 200) {
        return text;
      }
    } catch {
      // Ignore text parsing errors
    }
    return statusMessage || `Serverfel (${response.status})`;
  }
}

// Helper to handle fetch errors
function handleFetchError(error: unknown, context: string): never {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new ApiError(
      'Kunde inte ansluta till servern. Kontrollera din internetanslutning.',
      0,
      error
    );
  }

  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError(
    `Oväntat fel: ${context}`,
    undefined,
    error
  );
}

/**
 * API Client Class
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Upload and extract invoice
   */
  async uploadInvoice(file: File): Promise<Invoice> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/invoices/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      return response.json();
    } catch (error) {
      handleFetchError(error, 'Uppladdning misslyckades');
    }
  }

  /**
   * Get single invoice by ID
   */
  async getInvoice(id: number): Promise<Invoice> {
    try {
      const response = await fetch(`${this.baseUrl}/api/invoices/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Fakturan kunde inte hittas', 404);
        }
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      return response.json();
    } catch (error) {
      handleFetchError(error, 'Kunde inte hämta faktura');
    }
  }

  /**
   * List invoices with pagination and filtering
   */
  async listInvoices(params?: ListInvoicesParams): Promise<InvoiceListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `${this.baseUrl}/api/invoices${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      return response.json();
    } catch (error) {
      handleFetchError(error, 'Kunde inte hämta fakturor');
    }
  }

  /**
   * Approve invoice with user corrections
   */
  async approveInvoice(id: number, data: ApproveInvoiceData): Promise<Invoice> {
    try {
      const response = await fetch(`${this.baseUrl}/api/invoices/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      return response.json();
    } catch (error) {
      handleFetchError(error, 'Kunde inte godkänna faktura');
    }
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Fakturan kunde inte hittas', 404);
        }
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      // 204 No Content - successful deletion
      return;
    } catch (error) {
      handleFetchError(error, 'Kunde inte ta bort faktura');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new ApiError(errorMessage, response.status);
      }

      return response.json();
    } catch (error) {
      handleFetchError(error, 'Hälsokontroll misslyckades');
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
