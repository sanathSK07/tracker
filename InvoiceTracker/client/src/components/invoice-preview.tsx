import type { InvoiceFormData } from "@shared/schema";
import { formatCurrency, formatDate, calculateTotal } from "@/lib/invoice-utils";

interface InvoicePreviewProps {
  formData: InvoiceFormData;
}

export function InvoicePreview({ formData }: InvoicePreviewProps) {
  const total = calculateTotal(formData.services || []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Print Controls (visible only on screen) */}
      <div className="bg-blue-50 border-2 border-dashed border-invoice-primary p-4 text-center no-print">
        <div className="text-invoice-primary font-medium mb-2">Live Invoice Preview</div>
        <div className="text-sm text-gray-600">
          Make changes in the form panel to see real-time updates
        </div>
      </div>

      {/* Invoice Content */}
      <div className="invoice-content p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-4 border-invoice-primary pb-4">
          <div className="flex-1">
            <div className="text-3xl font-bold text-invoice-primary mb-2">
              {formData.companyName || "MGR CLEANING SERVICE"}
            </div>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {formData.companyAddress || "106-45 Silverstone Drive\nToronto, ON M9V 4B1"}<br />
              Phone: {formData.companyPhone || "(437) 777-3124"}<br />
              Email: {formData.companyEmail || "mgrcscan@gmail.com"}
            </div>
          </div>
          <div className="text-right flex-1">
            <h1 className="text-4xl text-invoice-primary font-bold">INVOICE</h1>
          </div>
        </div>

        {/* Invoice Meta Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="font-bold text-invoice-primary mb-2">BILL TO:</div>
            <div className="mb-2">
              <strong>Client Name:</strong><br />
              {formData.clientName || ""}
            </div>
            <div>
              <strong>Address:</strong><br />
              <span className="whitespace-pre-line">{formData.clientAddress || ""}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="font-bold text-invoice-primary mb-2">INVOICE DETAILS:</div>
            <div className="mb-1">
              <strong>Invoice #:</strong> {formData.invoiceNumber || ""}
            </div>
            <div className="mb-1">
              <strong>Date Issued:</strong> {formatDate(formData.dateIssued || "")}
            </div>
            <div className="mb-1">
              <strong>Work Period:</strong> {formData.workPeriod || ""}
            </div>
            <div>
              <strong>Workers:</strong> {formData.workers || ""}
            </div>
          </div>
        </div>

        {/* Services Table */}
        <table className="w-full invoice-table mb-8 border border-gray-200">
          <thead>
            <tr>
              <th className="text-left p-4 font-bold">Description of Services</th>
              <th className="text-right p-4 font-bold w-40">Amount (CAD)</th>
            </tr>
          </thead>
          <tbody>
            {formData.services?.map((service, index) => (
              <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="p-4 border-b border-gray-200 align-top">
                  <strong>{service.title}</strong><br />
                  <div className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 text-right font-bold text-lg">
                  {formatCurrency(service.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Section */}
        <div className="flex justify-end mb-8">
          <table className="w-80 border-collapse">
            <tr className="border-t-2 border-b-2 border-invoice-primary">
              <td className="text-right font-bold p-3 text-lg text-invoice-primary">
                TOTAL AMOUNT DUE:
              </td>
              <td className="text-right font-bold p-3 text-lg text-invoice-primary w-40">
                {formatCurrency(total)}
              </td>
            </tr>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm border-t border-gray-200 pt-4">
          <p className="font-bold mb-1">Thank you for your business!</p>
          <p>Please remit payment by the due date specified above.</p>
        </div>
      </div>
    </div>
  );
}
