import type { ServiceItem, InvoiceFormData } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function calculateTotal(services: ServiceItem[]): number {
  return services.reduce((sum, service) => sum + (service.amount || 0), 0);
}

export function generateInvoiceNumber(): string {
  const prefix = 'MGR';
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(3, '0');
  return `${prefix}-${randomNum}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDefaultCompanyInfo() {
  return {
    companyName: "MGR CLEANING SERVICE",
    companyAddress: "106-45 Silverstone Drive\nToronto, ON M9V 4B1",
    companyPhone: "(437) 777-3124",
    companyEmail: "mgrcscan@gmail.com"
  };
}

export function getDefaultService(): ServiceItem {
  return {
    title: "New Service",
    description: "Service description",
    amount: 0
  };
}

export function printInvoice(): void {
  window.print();
}

export function savePDF(invoiceNumber: string): void {
  const originalTitle = document.title;
  document.title = `Invoice_${invoiceNumber}_${new Date().toISOString().split('T')[0]}`;
  window.print();
  document.title = originalTitle;
}

export function saveHTML(invoiceNumber: string): void {
  const invoiceHTML = document.documentElement.outerHTML;
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateInvoiceForm(data: Partial<InvoiceFormData>): string[] {
  const errors: string[] = [];
  
  if (!data.clientName?.trim()) {
    errors.push("Client name is required");
  }
  
  if (!data.clientAddress?.trim()) {
    errors.push("Client address is required");
  }
  
  if (!data.invoiceNumber?.trim()) {
    errors.push("Invoice number is required");
  }
  
  if (!data.services?.length) {
    errors.push("At least one service is required");
  }
  
  data.services?.forEach((service, index) => {
    if (!service.title?.trim()) {
      errors.push(`Service ${index + 1}: Title is required`);
    }
    if (!service.description?.trim()) {
      errors.push(`Service ${index + 1}: Description is required`);
    }
    if (service.amount < 0) {
      errors.push(`Service ${index + 1}: Amount must be positive`);
    }
  });
  
  return errors;
}
