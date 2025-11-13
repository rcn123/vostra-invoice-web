// Mock invoice data following ground-truth-schema.json
// All data is realistic Swedish invoice examples

export interface AISuggestion {
  account_number: string;
  account_name: string;
  confidence: number;
  explanation: string;
  xai?: {
    matched_words: string[];
    similar_history: number;
    uncertainty: 'låg' | 'medel' | 'hög';
    basis: string;
  };
}

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
  // AI prediction fields - multiple suggestions ranked by confidence
  ai_suggestions: AISuggestion[];
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
      name: 'Sundsvalls Kommun',
      address: 'Storgatan 14, 851 85 Sundsvall'
    },
    lines: [
      {
        line_number: 1,
        description: 'Hyra lokal',
        period: '2025-07-01 – 2025-09-30',
        amount: 22257,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestions: [
          {
            account_number: '5010',
            account_name: 'Lokalhyra',
            confidence: 0.92,
            explanation: 'Lokalhyra klassificeras vanligtvis som konto 5010',
            xai: {
              matched_words: ['hyra', 'lokal'],
              similar_history: 43,
              uncertainty: 'låg',
              basis: 'radtext + tidigare feedback'
            }
          },
          {
            account_number: '5000',
            account_name: 'Lokalkostnader',
            confidence: 0.78,
            explanation: 'Alternativ för generella lokalkostnader',
            xai: {
              matched_words: ['lokal'],
              similar_history: 28,
              uncertainty: 'medel',
              basis: 'radtext'
            }
          },
          {
            account_number: '5020',
            account_name: 'Fastighetskostnader',
            confidence: 0.45,
            explanation: 'Möjlig klassificering som fastighetskostnad',
            xai: {
              matched_words: [],
              similar_history: 12,
              uncertainty: 'hög',
              basis: 'tidigare feedback'
            }
          }
        ],
        approved: false
      },
      {
        line_number: 2,
        description: 'Tillägg värme/varmvatten',
        period: '2025-07-01 – 2025-09-30',
        amount: 3227,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestions: [
          {
            account_number: '5020',
            account_name: 'Fastighetskostnader',
            confidence: 0.88,
            explanation: 'Uppvärmning kategoriseras under fastighetskostnader'
          },
          {
            account_number: '5060',
            account_name: 'Elkostnader',
            confidence: 0.65,
            explanation: 'Energikostnader kan också klassas som el'
          },
          {
            account_number: '5010',
            account_name: 'Lokalhyra',
            confidence: 0.32,
            explanation: 'Mindre sannolik klassificering'
          }
        ],
        approved: false
      },
      {
        line_number: 3,
        description: 'Tillägg el',
        period: '2025-07-01 – 2025-09-30',
        amount: 8329,
        vat_rate: 0,
        vat_amount: 0,
        ai_suggestions: [
          {
            account_number: '5060',
            account_name: 'Elkostnader',
            confidence: 0.94,
            explanation: 'Elkostnader bokförs normalt på 5060'
          },
          {
            account_number: '5020',
            account_name: 'Fastighetskostnader',
            confidence: 0.72,
            explanation: 'Kan kategoriseras som fastighetskostnad'
          },
          {
            account_number: '5000',
            account_name: 'Lokalkostnader',
            confidence: 0.28,
            explanation: 'Alternativ vid osäkerhet'
          }
        ],
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
      name: 'Sundsvalls Kommun',
      address: 'Storgatan 14, 851 85 Sundsvall'
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
        ai_suggestions: [
          {
            account_number: '6100',
            account_name: 'Kontorsmaterial',
            confidence: 0.96,
            explanation: 'Kontorspapper bokförs på 6100',
            xai: {
              matched_words: ['kontorspapper', 'A4'],
              similar_history: 52,
              uncertainty: 'låg',
              basis: 'radtext + tidigare feedback'
            }
          },
          {
            account_number: '6110',
            account_name: 'Trycksaker',
            confidence: 0.58,
            explanation: 'Alternativ klassificering',
            xai: {
              matched_words: ['papper'],
              similar_history: 15,
              uncertainty: 'medel',
              basis: 'radtext'
            }
          }
        ],
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
        ai_suggestions: [
          {
            account_number: '6100',
            account_name: 'Kontorsmaterial',
            confidence: 0.98,
            explanation: 'Pennor och skrivmaterial är kontorsmaterial'
          },
          {
            account_number: '6110',
            account_name: 'Trycksaker',
            confidence: 0.42,
            explanation: 'Mindre sannolik klassificering'
          }
        ],
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
      name: 'Sundsvalls Kommun',
      address: 'Storgatan 14, 851 85 Sundsvall'
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
        ai_suggestions: [
          {
            account_number: '6230',
            account_name: 'Städning och renhållning',
            confidence: 0.91,
            explanation: 'Städtjänster klassas som 6230'
          },
          {
            account_number: '6210',
            account_name: 'Fastighetstjänster',
            confidence: 0.68,
            explanation: 'Alternativ vid fastighetsinriktad städning'
          },
          {
            account_number: '6200',
            account_name: 'Övriga lokalkostnader',
            confidence: 0.41,
            explanation: 'Generell kategori för lokalkostnader'
          }
        ],
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
