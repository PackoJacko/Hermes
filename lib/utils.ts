// Utilidades para generar datos de ejemplo
export const generateSampleData = () => {
  const clients = [
    {
      id: '1',
      name: 'María García',
      email: 'maria@empresa.com',
      phone: '+34 600 123 456',
      company: 'Diseños Creativos SL',
      address: 'Calle Mayor 123, Madrid',
      taxId: 'B12345678',
    },
    {
      id: '2',
      name: 'Juan Martínez',
      email: 'juan@tech.com',
      phone: '+34 600 789 012',
      company: 'Tech Solutions',
      address: 'Avenida Diagonal 456, Barcelona',
      taxId: 'B87654321',
    },
    {
      id: '3',
      name: 'Ana López',
      email: 'ana@marketing.com',
      phone: '+34 600 345 678',
      company: 'Marketing Pro',
      address: 'Paseo Marítimo 789, Palma',
      taxId: 'B11223344',
    },
  ];

  const projects = [
    {
      id: '1',
      name: 'Rediseño Web Corporativa',
      client: 'Diseños Creativos SL',
      status: 'in-progress' as const,
      startDate: '2026-03-01',
      endDate: '2026-04-15',
      budget: 5000,
      tasks: [],
      color: '#3b82f6',
    },
    {
      id: '2',
      name: 'Campaña Redes Sociales',
      client: 'Marketing Pro',
      status: 'planning' as const,
      startDate: '2026-04-01',
      endDate: '2026-05-30',
      budget: 3500,
      tasks: [],
      color: '#8b5cf6',
    },
    {
      id: '3',
      name: 'App Mobile iOS',
      client: 'Tech Solutions',
      status: 'review' as const,
      startDate: '2026-01-15',
      endDate: '2026-03-31',
      budget: 12000,
      tasks: [],
      color: '#ef4444',
    },
  ];

  const tasks = [
    {
      id: '1',
      title: 'Diseñar mockups de homepage',
      description: 'Crear 3 propuestas de diseño para la página principal',
      status: 'in-progress' as const,
      priority: 'high' as const,
      dueDate: new Date().toISOString(),
      projectId: '1',
    },
    {
      id: '2',
      title: 'Reunión con cliente',
      description: 'Presentar avances del proyecto',
      status: 'todo' as const,
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      projectId: '1',
    },
    {
      id: '3',
      title: 'Investigación de mercado',
      description: 'Analizar competencia y tendencias actuales',
      status: 'done' as const,
      priority: 'medium' as const,
      dueDate: new Date(Date.now() - 172800000).toISOString(),
      projectId: '2',
    },
    {
      id: '4',
      title: 'Testing de funcionalidades',
      description: 'Probar todas las características de la app',
      status: 'in-progress' as const,
      priority: 'high' as const,
      dueDate: new Date().toISOString(),
      projectId: '3',
    },
  ];

  const invoices = [
    {
      id: '1',
      number: 'INV-2026-001',
      clientId: '1',
      projectId: '1',
      date: '2026-03-15',
      dueDate: '2026-04-15',
      items: [
        {
          id: '1',
          description: 'Diseño web - 40 horas',
          quantity: 40,
          price: 50,
          total: 2000,
        },
        {
          id: '2',
          description: 'Desarrollo frontend',
          quantity: 30,
          price: 60,
          total: 1800,
        },
      ],
      subtotal: 3800,
      tax: 798,
      total: 4598,
      status: 'sent' as const,
    },
    {
      id: '2',
      number: 'INV-2026-002',
      clientId: '3',
      projectId: '2',
      date: '2026-02-01',
      dueDate: '2026-03-01',
      items: [
        {
          id: '1',
          description: 'Consultoría marketing',
          quantity: 20,
          price: 75,
          total: 1500,
        },
      ],
      subtotal: 1500,
      tax: 315,
      total: 1815,
      status: 'paid' as const,
    },
    {
      id: '3',
      number: 'INV-2026-003',
      clientId: '2',
      date: '2026-01-15',
      dueDate: '2026-02-15',
      items: [
        {
          id: '1',
          description: 'Desarrollo app mobile',
          quantity: 100,
          price: 80,
          total: 8000,
        },
      ],
      subtotal: 8000,
      tax: 1680,
      total: 9680,
      status: 'overdue' as const,
    },
  ];

  return { clients, projects, tasks, invoices };
};

// Helper para formatear moneda
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Helper para formatear fechas
export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

// Helper para calcular días restantes
export const daysUntil = (date: string | Date) => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper para obtener color según prioridad
export const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  const colors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };
  return colors[priority];
};

// Helper para obtener color según estado
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    planning: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    review: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    todo: 'bg-gray-100 text-gray-700',
    done: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};
