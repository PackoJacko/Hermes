'use client';

import { useStore } from '@/lib/store';
import { generateSampleData } from '@/lib/utils';
import { Download } from 'lucide-react';

export default function SampleDataLoader() {
  const { clients, projects, tasks, invoices } = useStore();
  const hasData = clients.length > 0 || projects.length > 0;

  const loadSampleData = () => {
    const { clients, projects, tasks, invoices } = generateSampleData();
    const store = useStore.getState();
    
    clients.forEach(client => store.addClient(client));
    projects.forEach(project => store.addProject(project));
    tasks.forEach(task => store.addTask(task));
    invoices.forEach(invoice => store.addInvoice(invoice));

    alert('✅ Datos de ejemplo cargados correctamente!');
    window.location.reload();
  };

  if (hasData) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={loadSampleData}
        className="flex items-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-full shadow-lg hover:bg-gold-700 transition-all hover:scale-105"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">Cargar Datos de Ejemplo</span>
      </button>
    </div>
  );
}
