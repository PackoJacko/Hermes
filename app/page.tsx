'use client';

import { useStore } from '@/lib/store';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import BurnoutPredictor from '@/components/BurnoutPredictor';

export default function DashboardPage() {
  const { projects, tasks, invoices } = useStore();

  // Calculate stats
  const todayTasks = tasks.filter((t) => {
    const today = new Date().toDateString();
    return new Date(t.dueDate).toDateString() === today && t.status !== 'done';
  });

  const overdueTasks = tasks.filter((t) => {
    const today = new Date();
    return new Date(t.dueDate) < today && t.status !== 'done';
  });

  const activeProjects = projects.filter((p) => p.status === 'in-progress');

  const pendingInvoices = invoices.filter((i) => i.status === 'sent');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const paidThisMonth = invoices
    .filter((i) => {
      const invDate = new Date(i.date);
      const now = new Date();
      return (
        i.status === 'paid' &&
        invDate.getMonth() === now.getMonth() &&
        invDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Buenos días, Packo 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-hermes-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-hermes-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{todayTasks.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tareas Hoy</h3>
          {overdueTasks.length > 0 && (
            <p className="text-xs text-red-600 mt-2">
              {overdueTasks.length} atrasadas
            </p>
          )}
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{activeProjects.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Proyectos Activos</h3>
        </div>

        {/* Pending Payment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-gold-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              €{totalPending.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Por Cobrar</h3>
          <p className="text-xs text-gray-500 mt-2">
            {pendingInvoices.length} facturas pendientes
          </p>
        </div>

        {/* Monthly Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              €{paidThisMonth.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Cobrado Este Mes</h3>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Burnout Predictor - Full width on mobile, spans 1 column */}
        <div className="lg:col-span-1">
          <BurnoutPredictor />
        </div>

        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tareas de Hoy
          </h2>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">¡Todo listo por hoy! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Projects - Full width */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Proyectos en Marcha
        </h2>
          {activeProjects.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay proyectos activos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg border-l-4 hover:bg-gray-50 transition-colors"
                  style={{ borderLeftColor: project.color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-600">
                      €{project.budget.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{project.client}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Fin: {format(new Date(project.endDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium">
          + Nuevo Proyecto
        </button>
        <button className="p-4 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium">
          + Nueva Factura
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          + Nueva Tarea
        </button>
      </div>
    </div>
  );
}
