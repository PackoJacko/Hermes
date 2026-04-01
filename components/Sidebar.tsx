'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Palette,
  Settings,
  Zap,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Proyectos', href: '/projects', icon: FolderKanban },
  { name: 'Facturación', href: '/invoices', icon: FileText },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Canvas Ideas', href: '/canvas', icon: Palette },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-hermes-900 to-hermes-800 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-hermes-700">
        <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-hermes-900" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Hermes</h1>
          <p className="text-xs text-hermes-300">OS para Autónomos</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-hermes-700 text-white shadow-lg'
                  : 'text-hermes-200 hover:bg-hermes-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="px-6 py-4 border-t border-hermes-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-bold text-hermes-900">
            P
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Packo</p>
            <p className="text-xs text-hermes-300">Diseñador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
