import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, FileText, Printer, Download } from "lucide-react";
import type { InvoiceFormData, ServiceItem } from "@shared/schema";
import { 
  formatCurrency, 
  generateInvoiceNumber, 
  getTodayDate, 
  getDefaultCompanyInfo, 
  getDefaultService,
  printInvoice,
  savePDF,
  validateInvoiceForm
} from "@/lib/invoice-utils";
import { useToast } from "@/hooks/use-toast";

interface InvoiceFormProps {
  formData: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
}

export function InvoiceForm({ formData, onChange }: InvoiceFormProps) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with default data if empty
    if (!formData.invoiceNumber) {
      const defaultCompany = getDefaultCompanyInfo();
      onChange({
        ...formData,
        ...defaultCompany,
        invoiceNumber: generateInvoiceNumber(),
        dateIssued: getTodayDate(),
        workPeriod: "7 days",
        workers: "5",
        services: [{
          title: "Labour & Cleaning Services",
          description: "• Gym room shifting and equipment installation\n• Senior room cleaning and arrangement\n• Superintendent room, store room, and garbage room cleaning and shifting",
          amount: 3500
        }]
      });
    }
  }, []);

  const updateField = (field: keyof InvoiceFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const updateService = (index: number, field: keyof ServiceItem, value: any) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    updateField('services', updatedServices);
  };

  const addService = () => {
    updateField('services', [...formData.services, getDefaultService()]);
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      updateField('services', updatedServices);
    } else {
      toast({
        title: "Cannot remove service",
        description: "At least one service is required.",
        variant: "destructive"
      });
    }
  };

  const handleAction = (action: 'print' | 'pdf') => {
    const validationErrors = validateInvoiceForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setErrors([]);
    
    switch (action) {
      case 'print':
        printInvoice();
        break;
      case 'pdf':
        savePDF(formData.invoiceNumber);
        break;
    }
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-invoice-primary">
          <FileText className="h-5 w-5" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Company Information */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Company Information</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                id="companyAddress"
                rows={3}
                value={formData.companyAddress || ""}
                onChange={(e) => updateField('companyAddress', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  type="tel"
                  value={formData.companyPhone || ""}
                  onChange={(e) => updateField('companyPhone', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail || ""}
                  onChange={(e) => updateField('companyEmail', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Client Information</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
              <Input
                id="clientName"
                value={formData.clientName || ""}
                onChange={(e) => updateField('clientName', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientAddress">Client Address <span className="text-red-500">*</span></Label>
              <Textarea
                id="clientAddress"
                rows={3}
                value={formData.clientAddress || ""}
                onChange={(e) => updateField('clientAddress', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Invoice Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="invoiceNumber">Invoice # <span className="text-red-500">*</span></Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber || ""}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="dateIssued">Date Issued</Label>
              <Input
                id="dateIssued"
                type="date"
                value={formData.dateIssued || ""}
                onChange={(e) => updateField('dateIssued', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="workPeriod">Work Period</Label>
              <Input
                id="workPeriod"
                value={formData.workPeriod || ""}
                onChange={(e) => updateField('workPeriod', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="workers">Workers</Label>
              <Input
                id="workers"
                value={formData.workers || ""}
                onChange={(e) => updateField('workers', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Services</h3>
            <Button
              type="button"
              onClick={addService}
              className="bg-invoice-success hover:bg-green-600 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          </div>
          <div className="space-y-3">
            {formData.services?.map((service, index) => (
              <div key={index} className="service-row border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="mb-2">
                  <Label>Service Title</Label>
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
                <div className="mb-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <Label>Amount (CAD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={service.amount}
                      onChange={(e) => updateService(index, 'amount', e.target.value)}
                      className="form-input text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeService(index)}
                    variant="destructive"
                    size="sm"
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleAction('print')}
            className="w-full bg-invoice-primary hover:bg-invoice-primary-dark text-white"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button
            onClick={() => handleAction('pdf')}
            className="w-full bg-invoice-success hover:bg-green-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Save PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
