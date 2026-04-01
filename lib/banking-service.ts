// Banking API Service - PSD2 Integration
// Este es un servicio base para integración bancaria usando PSD2
// En producción real necesitarás certificados y aprobación de cada banco

export interface BankAccount {
  id: string;
  iban: string;
  name: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'business';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance: number;
  category?: string;
}

export class BankingService {
  private static apiKey: string | null = null;
  private static baseUrl: string = process.env.NEXT_PUBLIC_BANKING_API_URL || '';

  // Configurar credenciales
  static configure(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Obtener cuentas bancarias
  static async getAccounts(): Promise<BankAccount[]> {
    if (!this.apiKey) {
      throw new Error('Banking API not configured');
    }

    try {
      // En producción, esto se conectaría a un proveedor PSD2 como:
      // - TrueLayer
      // - Plaid
      // - Tink
      // - Salt Edge
      
      // Por ahora, retornamos datos de ejemplo
      return [
        {
          id: '1',
          iban: 'ES9121000418450200051332',
          name: 'Cuenta Corriente Principal',
          balance: 15750.50,
          currency: 'EUR',
          type: 'business',
        },
        {
          id: '2',
          iban: 'ES7620770024003102575766',
          name: 'Cuenta Ahorro',
          balance: 45000.00,
          currency: 'EUR',
          type: 'savings',
        },
      ];
    } catch (error) {
      console.error('Banking accounts error:', error);
      throw new Error('Error al obtener cuentas bancarias');
    }
  }

  // Obtener transacciones
  static async getTransactions(
    accountId: string,
    options: {
      from?: string;
      to?: string;
      limit?: number;
    } = {}
  ): Promise<Transaction[]> {
    if (!this.apiKey) {
      throw new Error('Banking API not configured');
    }

    try {
      // En producción, esto haría una llamada real a la API bancaria
      // Por ahora, retornamos datos de ejemplo
      return [
        {
          id: '1',
          date: new Date().toISOString(),
          description: 'Pago cliente - Proyecto Web',
          amount: 2500.00,
          type: 'credit',
          balance: 15750.50,
          category: 'income',
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'Adobe Creative Cloud',
          amount: -54.99,
          type: 'debit',
          balance: 13250.50,
          category: 'software',
        },
        {
          id: '3',
          date: new Date(Date.now() - 172800000).toISOString(),
          description: 'Transferencia - Proveedor',
          amount: -850.00,
          type: 'debit',
          balance: 13305.49,
          category: 'expense',
        },
      ];
    } catch (error) {
      console.error('Banking transactions error:', error);
      throw new Error('Error al obtener transacciones');
    }
  }

  // Conciliar una transacción con una factura
  static async reconcileTransaction(
    transactionId: string,
    invoiceId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Aquí implementarías la lógica de conciliación
      // Por ejemplo, marcar la factura como pagada y asociarla con la transacción
      
      return {
        success: true,
        message: 'Transacción conciliada correctamente',
      };
    } catch (error) {
      console.error('Transaction reconciliation error:', error);
      throw new Error('Error al conciliar la transacción');
    }
  }

  // Auto-conciliación inteligente
  static async autoReconcile(
    transactions: Transaction[],
    invoices: Array<{ id: string; number: string; total: number; clientName: string }>
  ): Promise<{
    matched: Array<{ transactionId: string; invoiceId: string; confidence: number }>;
    unmatched: string[];
  }> {
    const matched: Array<{ transactionId: string; invoiceId: string; confidence: number }> = [];
    const unmatched: string[] = [];

    for (const transaction of transactions) {
      if (transaction.type !== 'credit') continue;

      // Buscar facturas con el mismo monto
      const matchingInvoices = invoices.filter(
        inv => Math.abs(inv.total - transaction.amount) < 0.01
      );

      if (matchingInvoices.length === 1) {
        // Match perfecto por monto
        matched.push({
          transactionId: transaction.id,
          invoiceId: matchingInvoices[0].id,
          confidence: 0.95,
        });
      } else if (matchingInvoices.length > 1) {
        // Múltiples matches - buscar por descripción
        const bestMatch = matchingInvoices.find(inv =>
          transaction.description.toLowerCase().includes(inv.clientName.toLowerCase()) ||
          transaction.description.includes(inv.number)
        );

        if (bestMatch) {
          matched.push({
            transactionId: transaction.id,
            invoiceId: bestMatch.id,
            confidence: 0.85,
          });
        } else {
          unmatched.push(transaction.id);
        }
      } else {
        unmatched.push(transaction.id);
      }
    }

    return { matched, unmatched };
  }

  // Exportar movimientos para contabilidad
  static async exportTransactions(
    accountId: string,
    format: 'csv' | 'excel' | 'ofx',
    from: string,
    to: string
  ): Promise<Blob> {
    try {
      const transactions = await this.getTransactions(accountId, { from, to });

      if (format === 'csv') {
        const csv = this.transactionsToCSV(transactions);
        return new Blob([csv], { type: 'text/csv' });
      }

      throw new Error(`Formato ${format} no soportado aún`);
    } catch (error) {
      console.error('Transaction export error:', error);
      throw new Error('Error al exportar transacciones');
    }
  }

  // Helper: Convertir transacciones a CSV
  private static transactionsToCSV(transactions: Transaction[]): string {
    const header = 'Fecha,Descripción,Importe,Tipo,Saldo,Categoría\n';
    const rows = transactions
      .map(t =>
        `${t.date},${t.description},${t.amount},${t.type},${t.balance},${t.category || ''}`
      )
      .join('\n');

    return header + rows;
  }

  // Analizar patrones de gasto
  static analyzeSpendingPatterns(
    transactions: Transaction[]
  ): {
    byCategory: Record<string, number>;
    monthlyAverage: number;
    trends: Array<{ month: string; total: number }>;
  } {
    const byCategory: Record<string, number> = {};
    let totalExpenses = 0;

    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        const category = t.category || 'uncategorized';
        byCategory[category] = (byCategory[category] || 0) + Math.abs(t.amount);
        totalExpenses += Math.abs(t.amount);
      });

    const monthlyAverage = totalExpenses / 3; // Asumimos 3 meses de datos

    const trends = [
      { month: 'Mes 1', total: totalExpenses * 0.3 },
      { month: 'Mes 2', total: totalExpenses * 0.35 },
      { month: 'Mes 3', total: totalExpenses * 0.35 },
    ];

    return { byCategory, monthlyAverage, trends };
  }
}

// Proveedor de integración bancaria (ejemplo)
export interface BankingProvider {
  name: string;
  logo: string;
  supported: boolean;
  features: string[];
}

export const BANKING_PROVIDERS: BankingProvider[] = [
  {
    name: 'CaixaBank',
    logo: '/banks/caixabank.svg',
    supported: true,
    features: ['PSD2', 'Instant Sync', 'Auto-categorización'],
  },
  {
    name: 'BBVA',
    logo: '/banks/bbva.svg',
    supported: true,
    features: ['PSD2', 'Instant Sync'],
  },
  {
    name: 'Santander',
    logo: '/banks/santander.svg',
    supported: true,
    features: ['PSD2', 'Manual Sync'],
  },
  {
    name: 'Sabadell',
    logo: '/banks/sabadell.svg',
    supported: false,
    features: ['Coming Soon'],
  },
];
