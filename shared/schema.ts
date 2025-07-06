import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

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

// Relations
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
  component: one(components, {
    fields: [componentStandards.componentId],
    references: [components.id],
  }),
  standard: one(standards, {
    fields: [componentStandards.standardId],
    references: [standards.id],
  }),
}));

export const standardClausesRelations = relations(standardClauses, ({ one, many }) => ({
  standard: one(standards, {
    fields: [standardClauses.standardId],
    references: [standards.id],
  }),
  componentClauses: many(componentClauses),
}));

export const componentClausesRelations = relations(componentClauses, ({ one }) => ({
  component: one(components, {
    fields: [componentClauses.componentId],
    references: [components.id],
  }),
  clause: one(standardClauses, {
    fields: [componentClauses.clauseId],
    references: [standardClauses.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  componentSuppliers: many(componentSuppliers),
}));

export const componentSuppliersRelations = relations(componentSuppliers, ({ one }) => ({
  component: one(components, {
    fields: [componentSuppliers.componentId],
    references: [components.id],
  }),
  supplier: one(suppliers, {
    fields: [componentSuppliers.supplierId],
    references: [suppliers.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStandardSchema = createInsertSchema(standards).omit({
  id: true,
  lastUpdated: true,
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
  lastUpdated: true,
  createdAt: true,
});

export const insertComponentStandardSchema = createInsertSchema(componentStandards).omit({
  id: true,
  lastVerified: true,
});

export const insertStandardClauseSchema = createInsertSchema(standardClauses).omit({
  id: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Standard = typeof standards.$inferSelect;
export type Component = typeof components.$inferSelect;
export type ComponentStandard = typeof componentStandards.$inferSelect;
export type StandardClause = typeof standardClauses.$inferSelect;
export type ComponentClause = typeof componentClauses.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type ComponentSupplier = typeof componentSuppliers.$inferSelect;

export type InsertStandard = z.infer<typeof insertStandardSchema>;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type InsertComponentStandard = z.infer<typeof insertComponentStandardSchema>;
export type InsertStandardClause = z.infer<typeof insertStandardClauseSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
