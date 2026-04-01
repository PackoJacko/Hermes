import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  startDate: string;
  endDate: string;
  budget: number;
  tasks: Task[];
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: string;
  assignee?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  taxId: string;
}

export interface CanvasNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  createdAt: string;
}

interface AppState {
  // Projects
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Clients
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Canvas
  canvasNotes: CanvasNote[];
  addCanvasNote: (note: CanvasNote) => void;
  updateCanvasNote: (id: string, note: Partial<CanvasNote>) => void;
  deleteCanvasNote: (id: string) => void;
  
  // User
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Projects
      projects: [],
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      
      // Tasks
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      
      // Invoices
      invoices: [],
      addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((i) => i.id !== id),
        })),
      
      // Clients
      clients: [],
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),
      
      // Canvas
      canvasNotes: [],
      addCanvasNote: (note) => set((state) => ({ canvasNotes: [...state.canvasNotes, note] })),
      updateCanvasNote: (id, updates) =>
        set((state) => ({
          canvasNotes: state.canvasNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),
      deleteCanvasNote: (id) =>
        set((state) => ({
          canvasNotes: state.canvasNotes.filter((n) => n.id !== id),
        })),
      
      // User
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'hermes-storage',
    }
  )
);
