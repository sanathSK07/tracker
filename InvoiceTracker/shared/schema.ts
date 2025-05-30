import { pgTable, text, serial, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address").notNull(),
  companyPhone: text("company_phone").notNull(),
  companyEmail: text("company_email").notNull(),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address").notNull(),
  dateIssued: text("date_issued").notNull(),
  workPeriod: text("work_period"),
  workers: text("workers"),
  services: text("services").notNull(), // JSON string of services array
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Service item schema for validation
export const serviceItemSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Service description is required"),
  amount: z.number().min(0, "Amount must be positive"),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;

// Invoice form schema for frontend validation
export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyEmail: z.string().email("Valid email is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  dateIssued: z.string().min(1, "Date is required"),
  workPeriod: z.string().optional(),
  workers: z.string().optional(),
  services: z.array(serviceItemSchema).min(1, "At least one service is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
