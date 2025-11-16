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
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/invoices/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        // Response is not JSON (e.g., from ingress/proxy)
        const text = await response.text();
        errorMessage = text || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get single invoice by ID
   */
  async getInvoice(id: number): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/api/invoices/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invoice not found');
      }
      let errorMessage = 'Failed to fetch invoice';
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * List invoices with pagination and filtering
   */
  async listInvoices(params?: ListInvoicesParams): Promise<InvoiceListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `${this.baseUrl}/api/invoices${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch invoices';
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Approve invoice with user corrections
   */
  async approveInvoice(id: number, data: ApproveInvoiceData): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/api/invoices/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to approve invoice';
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/invoices/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invoice not found');
      }
      let errorMessage = 'Failed to delete invoice';
      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || `Server error (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    // 204 No Content - successful deletion
    return;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
