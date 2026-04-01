import { jsPDF } from 'jspdf';
import { Invoice, Client } from '@/lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class PDFGenerator {
  static generateInvoice(
    invoice: Invoice,
    client: Client,
    userInfo: {
      name: string;
      email: string;
      taxId?: string;
      address?: string;
      phone?: string;
    }
  ): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Colors
    const primaryColor: [number, number, number] = [14, 165, 233]; // Hermes blue
    const goldColor: [number, number, number] = [245, 158, 11]; // Gold

    // Header with Hermes branding
    doc.setFillColor(...goldColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HERMES', 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema Operativo para Autónomos', 15, 32);

    yPos = 50;

    // Invoice title and number
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 15, yPos);
    
    doc.setFontSize(12);
    doc.text(invoice.number, 15, yPos + 8);

    // Invoice date and due date - right aligned
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${format(new Date(invoice.date), 'dd/MM/yyyy', { locale: es })}`, pageWidth - 15, yPos, { align: 'right' });
    doc.text(`Vencimiento: ${format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: es })}`, pageWidth - 15, yPos + 6, { align: 'right' });

    yPos += 25;

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    // From section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DE:', 15, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(userInfo.name, 15, yPos + 6);
    if (userInfo.email) doc.text(userInfo.email, 15, yPos + 12);
    if (userInfo.taxId) doc.text(`NIF/CIF: ${userInfo.taxId}`, 15, yPos + 18);
    if (userInfo.address) doc.text(userInfo.address, 15, yPos + 24);
    if (userInfo.phone) doc.text(userInfo.phone, 15, yPos + 30);

    // To section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PARA:', pageWidth / 2 + 10, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(client.name, pageWidth / 2 + 10, yPos + 6);
    doc.text(client.company, pageWidth / 2 + 10, yPos + 12);
    if (client.email) doc.text(client.email, pageWidth / 2 + 10, yPos + 18);
    if (client.taxId) doc.text(`NIF/CIF: ${client.taxId}`, pageWidth / 2 + 10, yPos + 24);
    if (client.address) doc.text(client.address, pageWidth / 2 + 10, yPos + 30);

    yPos += 45;

    // Items table header
    doc.setFillColor(...primaryColor);
    doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Descripción', 20, yPos + 7);
    doc.text('Cant.', pageWidth - 90, yPos + 7);
    doc.text('Precio', pageWidth - 60, yPos + 7);
    doc.text('Total', pageWidth - 30, yPos + 7);

    yPos += 15;

    // Items
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    invoice.items.forEach((item) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(item.description, 20, yPos);
      doc.text(item.quantity.toString(), pageWidth - 90, yPos);
      doc.text(`€${item.price.toFixed(2)}`, pageWidth - 60, yPos);
      doc.text(`€${item.total.toFixed(2)}`, pageWidth - 30, yPos);
      
      yPos += 8;
    });

    yPos += 5;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    // Totals
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 80, yPos);
    doc.text(`€${invoice.subtotal.toFixed(2)}`, pageWidth - 30, yPos);
    
    yPos += 7;
    doc.text(`IVA (21%):`, pageWidth - 80, yPos);
    doc.text(`€${invoice.tax.toFixed(2)}`, pageWidth - 30, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', pageWidth - 80, yPos);
    doc.text(`€${invoice.total.toFixed(2)}`, pageWidth - 30, yPos);

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('Generado con Hermes - Sistema Operativo para Autónomos', pageWidth / 2, yPos, { align: 'center' });
    doc.text('https://hermes-app.vercel.app', pageWidth / 2, yPos + 5, { align: 'center' });

    // Status badge
    const statusText = invoice.status === 'paid' ? 'PAGADA' : 
                       invoice.status === 'sent' ? 'ENVIADA' : 
                       invoice.status === 'overdue' ? 'VENCIDA' : 'BORRADOR';
    
    const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                        invoice.status === 'sent' ? [59, 130, 246] : 
                        invoice.status === 'overdue' ? [239, 68, 68] : [156, 163, 175];
    
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 50, 15, 35, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, pageWidth - 32.5, 21.5, { align: 'center' });

    // Save
    doc.save(`Factura-${invoice.number}.pdf`);
  }

  static generateProjectReport(
    project: any,
    tasks: any[],
    userInfo: { name: string }
  ): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    const primaryColor: [number, number, number] = [14, 165, 233];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE PROYECTO', 15, 22);

    yPos = 45;

    // Project info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, 15, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${project.client}`, 15, yPos);
    doc.text(`Presupuesto: €${project.budget.toLocaleString()}`, 15, yPos + 6);
    doc.text(`Periodo: ${format(new Date(project.startDate), 'dd/MM/yyyy')} - ${format(new Date(project.endDate), 'dd/MM/yyyy')}`, 15, yPos + 12);

    yPos += 25;

    // Tasks summary
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Tareas', 15, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de tareas: ${tasks.length}`, 15, yPos);
    doc.text(`Completadas: ${completedTasks}`, 15, yPos + 6);
    doc.text(`Progreso: ${progress}%`, 15, yPos + 12);

    yPos += 20;

    // Tasks list
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Tareas', 15, yPos);
    
    yPos += 10;
    
    tasks.forEach((task, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const statusIcon = task.status === 'done' ? '✓' : task.status === 'in-progress' ? '◐' : '○';
      const statusColor = task.status === 'done' ? [34, 197, 94] : task.status === 'in-progress' ? [59, 130, 246] : [156, 163, 175];
      
      doc.setTextColor(...statusColor);
      doc.setFontSize(10);
      doc.text(statusIcon, 20, yPos);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(task.title, 28, yPos);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(task.description || '', 28, yPos + 5);
      
      yPos += 12;
    });

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generado por ${userInfo.name} con Hermes`, pageWidth / 2, yPos, { align: 'center' });

    doc.save(`Proyecto-${project.name}.pdf`);
  }
}
