// Mock invoice data following ground-truth-schema.json
// All data is realistic Swedish invoice examples

export interface LineItem {
  line_number: number;
  description: string;
  period?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  amount: number;
  vat_rate: number;
  vat_amount: number;
  // AI prediction fields
  ai_suggestion?: {
    account_number: string;
    confidence: number;
    explanation: string;
  };
  // User correction
  user_account?: string;
  approved: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  supplier: {
    name: string;
    org_number: string;
    address: string;
    phone?: string;
  };
  buyer: {
    name: string;
    address: string;
  };
  lines: LineItem[];
  subtotal: number;
  vat_amount: number;
  total: number;
  currency: string;
  status: 'draft' | 'review' | 'approved' | 'paid';
  ocr_number?: string;
  payment_method?: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoice_number: '21196546317',
    invoice_date: '2025-06-09',
    due_date: '2025-06-30',
    supplier: {
      name: 'AB Svenska Bostäder',
      org_number: '556043-6429',
      address: 'Box 95, 16212 Vällingby',
      phone: '08-508 370 00'
    },
    buyer: {
      name: 'Timrå Kommun',
      address: 'Storgatan 14, 861 33 Timrå'
    },
    lines: [
      {
        line_number: 1,
        description: 'Hyra lokal',
        period: '2025-07-01 – 2025-09-30',
        amount: 22257,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestion: {
          account_number: '5010',
          confidence: 0.92,
          explanation: 'Lokalhyra klassificeras vanligtvis som konto 5010 (Lokalhyra)'
        },
        approved: false
      },
      {
        line_number: 2,
        description: 'Tillägg värme/varmvatten',
        period: '2025-07-01 – 2025-09-30',
        amount: 3227,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestion: {
          account_number: '5020',
          confidence: 0.88,
          explanation: 'Uppvärmning och energi kategoriseras under 5020 (Fastighetskostnader)'
        },
        approved: false
      },
      {
        line_number: 3,
        description: 'Tillägg el',
        period: '2025-07-01 – 2025-09-30',
        amount: 8329,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestion: {
          account_number: '5060',
          confidence: 0.94,
          explanation: 'Elkostnader bokförs normalt på 5060 (Elkostnader)'
        },
        approved: false
      }
    ],
    subtotal: 33813,
    vat_amount: 0,
    total: 33813,
    currency: 'SEK',
    status: 'review',
    ocr_number: '21196546317',
    payment_method: 'Plusgiro'
  },
  {
    id: '2',
    invoice_number: 'INV-2025-0042',
    invoice_date: '2025-11-01',
    due_date: '2025-11-30',
    supplier: {
      name: 'Kontorsgiganten AB',
      org_number: '556789-1234',
      address: 'Industrivägen 12, 171 48 Solna',
      phone: '08-123 456 78'
    },
    buyer: {
      name: 'Timrå Kommun',
      address: 'Storgatan 14, 861 33 Timrå'
    },
    lines: [
      {
        line_number: 1,
        description: 'Kontorspapper A4, 80g, 2500 ark',
        quantity: 10,
        unit: 'paket',
        unit_price: 89.50,
        amount: 895,
        vat_rate: 25,
        vat_amount: 223.75,
        ai_suggestion: {
          account_number: '6100',
          confidence: 0.96,
          explanation: 'Kontorsmaterial bokförs på 6100 (Kontorsmaterial och trycksaker)'
        },
        approved: false
      },
      {
        line_number: 2,
        description: 'Kulspetspennor, svart, förp om 50 st',
        quantity: 5,
        unit: 'förpackning',
        unit_price: 125,
        amount: 625,
        vat_rate: 25,
        vat_amount: 156.25,
        ai_suggestion: {
          account_number: '6100',
          confidence: 0.98,
          explanation: 'Pennor och skrivmaterial är kontorsmaterial (6100)'
        },
        approved: false
      }
    ],
    subtotal: 1520,
    vat_amount: 380,
    total: 1900,
    currency: 'SEK',
    status: 'approved',
    ocr_number: '5566778899',
    payment_method: 'Bankgiro'
  },
  {
    id: '3',
    invoice_number: 'F-2025-11-089',
    invoice_date: '2025-11-08',
    due_date: '2025-12-08',
    supplier: {
      name: 'Städ & Service Norrland AB',
      org_number: '559012-3456',
      address: 'Servicevägen 5, 851 72 Sundsvall',
      phone: '060-12 34 56'
    },
    buyer: {
      name: 'Timrå Kommun',
      address: 'Storgatan 14, 861 33 Timrå'
    },
    lines: [
      {
        line_number: 1,
        description: 'Städning kontorslokaler',
        quantity: 40,
        unit: 'timmar',
        unit_price: 285,
        amount: 11400,
        vat_rate: 25,
        vat_amount: 2850,
        ai_suggestion: {
          account_number: '6230',
          confidence: 0.91,
          explanation: 'Städtjänster klassas som 6230 (Städning och renhållning)'
        },
        approved: false
      }
    ],
    subtotal: 11400,
    vat_amount: 2850,
    total: 14250,
    currency: 'SEK',
    status: 'review',
    ocr_number: '1122334455',
    payment_method: 'Bankgiro'
  }
];
