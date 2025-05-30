import { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import type { InvoiceFormData } from "@shared/schema";
import { FileText } from "lucide-react";

export default function InvoiceGenerator() {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    clientName: "",
    clientAddress: "",
    dateIssued: "",
    workPeriod: "",
    workers: "",
    services: []
  });

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Trigger PDF save
        const event = new CustomEvent('savePDF');
        document.dispatchEvent(event);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        // Trigger print
        window.print();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Print optimization
  useEffect(() => {
    const handleBeforePrint = () => {
      document.body.style.background = 'white';
    };

    const handleAfterPrint = () => {
      document.body.style.background = '';
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-invoice-primary text-white py-4 shadow-lg no-print">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Invoice Generator
            </h1>
            <div className="text-sm opacity-90">
              MGR Cleaning Service
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-2 no-print">
            <InvoiceForm 
              formData={formData} 
              onChange={setFormData} 
            />
          </div>

          {/* Invoice Preview */}
          <div className="lg:col-span-3 print-area">
            <InvoicePreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
