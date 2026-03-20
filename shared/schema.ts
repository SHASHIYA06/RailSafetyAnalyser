import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"),
  fullName: text("full_name"),
  email: text("email"),
  isActive: boolean("is_active").default(true),
});

// ─── DLP VENDORS ─────────────────────────────────────────────────────────────
export const dlpVendors = pgTable("dlp_vendors", {
  id: serial("id").primaryKey(),
  vendorId: text("vendor_id").notNull().unique(),
  vendorName: text("vendor_name").notNull(),
  vendorCode: text("vendor_code").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  country: text("country"),
  paymentTerms: text("payment_terms"),
  deliveryDays: integer("delivery_days"),
  qualityRating: text("quality_rating"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DLP SYSTEMS ─────────────────────────────────────────────────────────────
export const dlpSystems = pgTable("dlp_systems", {
  id: serial("id").primaryKey(),
  systemId: text("system_id").notNull().unique(),
  systemName: text("system_name").notNull(),
  primaryVendor: text("primary_vendor"),
  totalItems: integer("total_items").default(0),
  totalReceived: integer("total_received").default(0),
  totalConsumed: integer("total_consumed").default(0),
  totalAvailable: integer("total_available").default(0),
  criticalStatus: boolean("critical_status").default(false),
  maintenanceFrequency: text("maintenance_frequency"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// ─── DLP ITEMS (Inventory) ───────────────────────────────────────────────────
export const dlpItems = pgTable("dlp_items", {
  id: serial("id").primaryKey(),
  itemId: text("item_id").notNull().unique(),
  partNumber: text("part_number").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  systemType: text("system_type").notNull(),
  vendorName: text("vendor_name"),
  vendorId: integer("vendor_id").references(() => dlpVendors.id),
  unitOfMeasure: text("unit_of_measure").notNull().default("Piece"),
  receivedQty: integer("received_qty").default(0),
  consumedQty: integer("consumed_qty").default(0),
  availableQty: integer("available_qty").default(0),
  recommendedQty: integer("recommended_qty").default(10),
  reorderLevel: integer("reorder_level").default(5),
  status: text("status").notNull().default("ACTIVE"),
  criticalFlag: boolean("critical_flag").default(false),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DLP TRANSACTIONS ────────────────────────────────────────────────────────
export const dlpTransactions = pgTable("dlp_transactions", {
  id: serial("id").primaryKey(),
  transactionType: text("transaction_type").notNull(), // RECEIPT, ISSUE, RETURN, TRANSFER, ADJUSTMENT
  itemId: integer("item_id").references(() => dlpItems.id),
  itemName: text("item_name"),
  partNumber: text("part_number"),
  quantity: integer("quantity").notNull(),
  fromLocation: text("from_location"),
  toLocation: text("to_location"),
  referenceType: text("reference_type"), // NCR, JOB_CARD, PO, OTHER
  referenceId: text("reference_id"),
  remarks: text("remarks"),
  initiatedBy: text("initiated_by").default("Admin"),
  status: text("status").notNull().default("COMPLETED"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── DLP ALERTS ──────────────────────────────────────────────────────────────
export const dlpAlerts = pgTable("dlp_alerts", {
  id: serial("id").primaryKey(),
  alertType: text("alert_type").notNull(), // LOW_STOCK, CRITICAL, EXPIRY, OVERSTOCK
  itemId: integer("item_id").references(() => dlpItems.id),
  itemName: text("item_name"),
  message: text("message").notNull(),
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// ─── DLP TOOLS ───────────────────────────────────────────────────────────────
export const dlpTools = pgTable("dlp_tools", {
  id: serial("id").primaryKey(),
  toolId: text("tool_id").notNull().unique(),
  toolName: text("tool_name").notNull(),
  toolNumber: text("tool_number"),
  category: text("category").notNull(),
  location: text("location"),
  condition: text("condition").notNull().default("Good"),
  calibrationDue: text("calibration_due"),
  issuedTo: text("issued_to"),
  issuedDate: text("issued_date"),
  remarks: text("remarks"),
  qty: integer("qty").default(1),
  consumable: boolean("consumable").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── EXISTING RAILWAY RAMS TABLES (kept for RAMS module) ─────────────────────
export const standards = pgTable("standards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  pdfUrl: text("pdf_url"),
  category: text("category").notNull(),
  status: text("status").notNull().default("active"),
  version: text("version"),
  publishedDate: timestamp("published_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  description: text("description"),
  technicalSpecs: jsonb("technical_specs"),
  operatingConditions: jsonb("operating_conditions"),
  certificationStatus: text("certification_status").notNull().default("pending"),
  silLevel: integer("sil_level"),
  ramsScore: decimal("rams_score", { precision: 5, scale: 2 }),
  reliabilityScore: decimal("reliability_score", { precision: 5, scale: 2 }),
  availabilityScore: decimal("availability_score", { precision: 5, scale: 2 }),
  maintainabilityScore: decimal("maintainability_score", { precision: 5, scale: 2 }),
  safetyScore: decimal("safety_score", { precision: 5, scale: 2 }),
  riskLevel: text("risk_level").notNull().default("medium"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const componentStandards = pgTable("component_standards", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id").notNull().references(() => components.id),
  standardId: integer("standard_id").notNull().references(() => standards.id),
  complianceStatus: text("compliance_status").notNull(),
  complianceScore: decimal("compliance_score", { precision: 5, scale: 2 }),
  certificationDate: timestamp("certification_date"),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
  verifiedBy: text("verified_by"),
  lastVerified: timestamp("last_verified").defaultNow(),
});

export const standardClauses = pgTable("standard_clauses", {
  id: serial("id").primaryKey(),
  standardId: integer("standard_id").notNull().references(() => standards.id),
  clauseNumber: text("clause_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  requirements: jsonb("requirements"),
  ramsCategory: text("rams_category"),
  silRelevance: integer("sil_relevance"),
  criticalityLevel: text("criticality_level").notNull().default("medium"),
});

export const componentClauses = pgTable("component_clauses", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id").notNull().references(() => components.id),
  clauseId: integer("clause_id").notNull().references(() => standardClauses.id),
  applicabilityScore: decimal("applicability_score", { precision: 5, scale: 2 }),
  complianceEvidence: text("compliance_evidence"),
  assessmentNotes: text("assessment_notes"),
  lastAssessed: timestamp("last_assessed").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country"),
  certifications: jsonb("certifications"),
  contactInfo: jsonb("contact_info"),
  irsCertified: boolean("irs_certified").default(false),
  qualityRating: decimal("quality_rating", { precision: 3, scale: 2 }),
  lastAudit: timestamp("last_audit"),
});

export const componentSuppliers = pgTable("component_suppliers", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id").notNull().references(() => components.id),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  supplierPartNumber: text("supplier_part_number"),
  leadTime: integer("lead_time"),
  priceRange: text("price_range"),
  availability: text("availability").notNull().default("available"),
});

// ─── RELATIONS ───────────────────────────────────────────────────────────────
export const standardsRelations = relations(standards, ({ many }) => ({
  componentStandards: many(componentStandards),
  clauses: many(standardClauses),
}));

export const componentsRelations = relations(components, ({ many }) => ({
  componentStandards: many(componentStandards),
  componentClauses: many(componentClauses),
  componentSuppliers: many(componentSuppliers),
}));

export const componentStandardsRelations = relations(componentStandards, ({ one }) => ({
  component: one(components, { fields: [componentStandards.componentId], references: [components.id] }),
  standard: one(standards, { fields: [componentStandards.standardId], references: [standards.id] }),
}));

export const standardClausesRelations = relations(standardClauses, ({ one, many }) => ({
  standard: one(standards, { fields: [standardClauses.standardId], references: [standards.id] }),
  componentClauses: many(componentClauses),
}));

export const componentClausesRelations = relations(componentClauses, ({ one }) => ({
  component: one(components, { fields: [componentClauses.componentId], references: [components.id] }),
  clause: one(standardClauses, { fields: [componentClauses.clauseId], references: [standardClauses.id] }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  componentSuppliers: many(componentSuppliers),
}));

export const componentSuppliersRelations = relations(componentSuppliers, ({ one }) => ({
  component: one(components, { fields: [componentSuppliers.componentId], references: [components.id] }),
  supplier: one(suppliers, { fields: [componentSuppliers.supplierId], references: [suppliers.id] }),
}));

export const dlpItemsRelations = relations(dlpItems, ({ one, many }) => ({
  vendor: one(dlpVendors, { fields: [dlpItems.vendorId], references: [dlpVendors.id] }),
  transactions: many(dlpTransactions),
  alerts: many(dlpAlerts),
}));

// ─── INSERT SCHEMAS ──────────────────────────────────────────────────────────
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export const insertStandardSchema = createInsertSchema(standards).omit({ id: true, lastUpdated: true });
export const insertComponentSchema = createInsertSchema(components).omit({ id: true, lastUpdated: true, createdAt: true });
export const insertComponentStandardSchema = createInsertSchema(componentStandards).omit({ id: true, lastVerified: true });
export const insertStandardClauseSchema = createInsertSchema(standardClauses).omit({ id: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true });
export const insertDlpVendorSchema = createInsertSchema(dlpVendors).omit({ id: true, createdAt: true });
export const insertDlpItemSchema = createInsertSchema(dlpItems).omit({ id: true, lastUpdated: true, createdAt: true });
export const insertDlpTransactionSchema = createInsertSchema(dlpTransactions).omit({ id: true, createdAt: true });
export const insertDlpToolSchema = createInsertSchema(dlpTools).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDlpSystemSchema = createInsertSchema(dlpSystems).omit({ id: true, lastUpdated: true });
export const insertDlpAlertSchema = createInsertSchema(dlpAlerts).omit({ id: true, createdAt: true });

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Standard = typeof standards.$inferSelect;
export type Component = typeof components.$inferSelect;
export type ComponentStandard = typeof componentStandards.$inferSelect;
export type StandardClause = typeof standardClauses.$inferSelect;
export type ComponentClause = typeof componentClauses.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type ComponentSupplier = typeof componentSuppliers.$inferSelect;
export type DlpVendor = typeof dlpVendors.$inferSelect;
export type DlpSystem = typeof dlpSystems.$inferSelect;
export type DlpItem = typeof dlpItems.$inferSelect;
export type DlpTransaction = typeof dlpTransactions.$inferSelect;
export type DlpAlert = typeof dlpAlerts.$inferSelect;
export type DlpTool = typeof dlpTools.$inferSelect;

export type InsertStandard = z.infer<typeof insertStandardSchema>;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type InsertComponentStandard = z.infer<typeof insertComponentStandardSchema>;
export type InsertStandardClause = z.infer<typeof insertStandardClauseSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertDlpVendor = z.infer<typeof insertDlpVendorSchema>;
export type InsertDlpItem = z.infer<typeof insertDlpItemSchema>;
export type InsertDlpTransaction = z.infer<typeof insertDlpTransactionSchema>;
export type InsertDlpTool = z.infer<typeof insertDlpToolSchema>;
export type InsertDlpSystem = z.infer<typeof insertDlpSystemSchema>;
export type InsertDlpAlert = z.infer<typeof insertDlpAlertSchema>;
