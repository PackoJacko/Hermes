'use client';

import { User, Bell, Palette, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Personaliza tu experiencia con Hermes
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-hermes-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-hermes-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Perfil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                defaultValue="Packo"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hermes-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="packo@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hermes-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIF/CIF
              </label>
              <input
                type="text"
                placeholder="12345678X"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hermes-600"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
          </div>
          <div className="space-y-3">
            {[
              'Tareas vencidas',
              'Facturas pendientes',
              'Proyectos retrasados',
              'Nuevos pagos recibidos',
            ].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-hermes-600 rounded focus:ring-2 focus:ring-hermes-600"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-gold-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Apariencia</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hermes-600">
              <option>Claro</option>
              <option>Oscuro</option>
              <option>Automático</option>
            </select>
          </div>
        </div>

        {/* Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Datos</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Exportar todos los datos
            </button>
            <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
              Eliminar todos los datos
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>
          </div>
          <button className="w-full px-4 py-2 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium">
            Cambiar contraseña
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button className="px-8 py-3 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
