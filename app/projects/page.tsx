'use client';

import { useState } from 'react';
import { useStore, Project, Task } from '@/lib/store';
import {
  Plus,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const statusColumns = [
  { id: 'planning', label: 'Planificación', color: 'bg-gray-100' },
  { id: 'in-progress', label: 'En Progreso', color: 'bg-blue-100' },
  { id: 'review', label: 'Revisión', color: 'bg-yellow-100' },
  { id: 'completed', label: 'Completado', color: 'bg-green-100' },
] as const;

export default function ProjectsPage() {
  const { projects, tasks, addProject } = useStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const getProjectTasks = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getCompletedPercentage = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter((t) => t.status === 'done').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos tus proyectos en un solo lugar
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button
              onClick={() => setView('kanban')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'kanban'
                  ? 'bg-hermes-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-hermes-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
          </div>
          <button className="px-6 py-2 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => {
            const columnProjects = projects.filter(
              (p) => p.status === column.id
            );

            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">{column.label}</h2>
                    <span className="text-sm text-gray-500">
                      {columnProjects.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {columnProjects.map((project) => {
                    const progress = getCompletedPercentage(project.id);
                    const projectTasks = getProjectTasks(project.id);
                    const overdueTasks = projectTasks.filter(
                      (t) =>
                        new Date(t.dueDate) < new Date() && t.status !== 'done'
                    );

                    return (
                      <div
                        key={project.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: project.color,
                        }}
                      >
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Client */}
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          {project.client}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-hermes-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(project.endDate), 'dd/MM/yy')}
                          </div>
                          <div className="flex items-center gap-1 text-gray-900 font-medium">
                            <DollarSign className="w-4 h-4" />
                            €{project.budget.toLocaleString()}
                          </div>
                        </div>

                        {/* Warnings */}
                        {overdueTasks.length > 0 && (
                          <div className="mt-3 flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            <AlertCircle className="w-3 h-3" />
                            {overdueTasks.length} tareas atrasadas
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Card Button */}
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-hermes-600 hover:text-hermes-600 transition-colors">
                    + Añadir Proyecto
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Proyecto
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Cliente
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Estado
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Progreso
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Fecha Fin
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Presupuesto
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const progress = getCompletedPercentage(project.id);

                return (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {project.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{project.client}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : project.status === 'review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusColumns.find((s) => s.id === project.status)
                          ?.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-hermes-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {format(new Date(project.endDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4 text-gray-900 font-medium">
                      €{project.budget.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
