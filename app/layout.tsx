import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import SampleDataLoader from '@/components/SampleDataLoader'
import AIAssistant from '@/components/AIAssistant'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hermes - Sistema Operativo para Autónomos',
  description: 'El primer sistema operativo Todo-en-Uno con Inteligencia Adaptativa para Autónomos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <SampleDataLoader />
          <AIAssistant />
        </div>
      </body>
    </html>
  )
}
