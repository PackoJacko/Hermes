'use client';

import { useState } from 'react';
import { useStore, Invoice } from '@/lib/store';
import {
  Plus,
  Download,
  Send,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-700', icon: FileText },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-700', icon: Send },
  paid: { label: 'Pagada', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  overdue: { label: 'Vencida', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function InvoicesPage() {
  const { invoices, clients } = useStore();
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');

  const filteredInvoices =
    filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Cliente no encontrado';
  };

  // Calculate stats
  const totalPending = invoices
    .filter((i) => i.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus facturas y presupuestos
          </p>
        </div>
        <button className="px-6 py-2 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              €{totalPending.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pendiente de Cobro</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              €{totalPaid.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Cobrado Este Mes</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{overdueCount}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Facturas Vencidas</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1 mb-6 w-fit">
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-hermes-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status === 'all' ? 'Todas' : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay facturas en esta categoría</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Número
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Cliente
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Fecha
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Vencimiento
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Estado
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const config = statusConfig[invoice.status];
                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          {invoice.number}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {getClientName(invoice.clientId)}
                      </td>
                      <td className="p-4 text-gray-600">
                        {format(new Date(invoice.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="p-4 text-gray-600">
                        {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          €{invoice.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-hermes-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-hermes-600 transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-hermes-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
