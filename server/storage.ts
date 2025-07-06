import { 
  components, 
  standards, 
  componentStandards, 
  standardClauses,
  componentClauses,
  suppliers,
  componentSuppliers,
  users,
  type User, 
  type InsertUser,
  type Component,
  type Standard,
  type ComponentStandard,
  type StandardClause,
  type Supplier,
  type InsertComponent,
  type InsertStandard,
  type InsertComponentStandard,
  type InsertStandardClause,
  type InsertSupplier
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, desc, asc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Component management
  getComponents(filters?: {
    search?: string;
    category?: string;
    silLevel?: number;
    minRamsScore?: number;
    standardIds?: number[];
    limit?: number;
    offset?: number;
    sortBy?: string;
  }): Promise<{ components: (Component & { 
    componentStandards: (ComponentStandard & { standard: Standard })[];
    ramsBreakdown: {
      reliability: number;
      availability: number;
      maintainability: number;
      safety: number;
    };
  })[]; total: number }>;
  
  getComponent(id: number): Promise<(Component & {
    componentStandards: (ComponentStandard & { standard: Standard })[];
    componentClauses: (typeof componentClauses.$inferSelect & { 
      clause: StandardClause & { standard: Standard }; 
    })[];
    componentSuppliers: (typeof componentSuppliers.$inferSelect & { supplier: Supplier })[];
  }) | undefined>;
  
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: Partial<InsertComponent>): Promise<Component>;
  
  // Standards management
  getStandards(filters?: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ standards: Standard[]; total: number }>;
  
  getStandard(id: number): Promise<(Standard & {
    clauses: StandardClause[];
    componentStandards: (ComponentStandard & { component: Component })[];
  }) | undefined>;
  
  createStandard(standard: InsertStandard): Promise<Standard>;
  
  // Component-Standard relationships
  createComponentStandard(componentStandard: InsertComponentStandard): Promise<ComponentStandard>;
  updateComponentStandard(id: number, data: Partial<InsertComponentStandard>): Promise<ComponentStandard>;
  
  // Standard clauses
  getStandardClauses(standardId: number): Promise<StandardClause[]>;
  createStandardClause(clause: InsertStandardClause): Promise<StandardClause>;
  
  // RAMS analysis
  calculateRAMSScore(componentId: number): Promise<{
    overall: number;
    reliability: number;
    availability: number;
    maintainability: number;
    safety: number;
  }>;
  
  // Search and filtering
  searchComponents(query: string, filters?: any): Promise<Component[]>;
  getComponentsByStandard(standardId: number): Promise<Component[]>;
  
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Dashboard analytics
  getDashboardStats(): Promise<{
    totalComponents: number;
    totalStandards: number;
    certifiedSuppliers: number;
    averageRAMSScore: number;
    complianceRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getComponents(filters?: {
    search?: string;
    category?: string;
    silLevel?: number;
    minRamsScore?: number;
    standardIds?: number[];
    limit?: number;
    offset?: number;
    sortBy?: string;
  }) {
    let query = db
      .select({
        component: components,
        componentStandards: componentStandards,
        standard: standards,
      })
      .from(components)
      .leftJoin(componentStandards, eq(components.id, componentStandards.componentId))
      .leftJoin(standards, eq(componentStandards.standardId, standards.id));

    const conditions = [];

    if (filters?.search) {
      conditions.push(
        sql`${components.name} ILIKE ${`%${filters.search}%`} OR ${components.description} ILIKE ${`%${filters.search}%`} OR ${components.manufacturer} ILIKE ${`%${filters.search}%`}`
      );
    }

    if (filters?.category) {
      conditions.push(eq(components.category, filters.category));
    }

    if (filters?.silLevel !== undefined) {
      conditions.push(eq(components.silLevel, filters.silLevel));
    }

    if (filters?.minRamsScore !== undefined) {
      conditions.push(sql`${components.ramsScore} >= ${filters.minRamsScore}`);
    }

    if (filters?.standardIds && filters.standardIds.length > 0) {
      conditions.push(inArray(componentStandards.standardId, filters.standardIds));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    if (filters?.sortBy === 'rams_score') {
      query = query.orderBy(desc(components.ramsScore)) as any;
    } else if (filters?.sortBy === 'sil_level') {
      query = query.orderBy(desc(components.silLevel)) as any;
    } else if (filters?.sortBy === 'updated') {
      query = query.orderBy(desc(components.lastUpdated)) as any;
    } else {
      query = query.orderBy(asc(components.name)) as any;
    }

    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;

    const results = await query.limit(limit).offset(offset);
    
    // Group results by component
    const componentMap = new Map();
    
    for (const result of results) {
      const componentId = result.component.id;
      
      if (!componentMap.has(componentId)) {
        componentMap.set(componentId, {
          ...result.component,
          componentStandards: [],
          ramsBreakdown: {
            reliability: Number(result.component.reliabilityScore) || 0,
            availability: Number(result.component.availabilityScore) || 0,
            maintainability: Number(result.component.maintainabilityScore) || 0,
            safety: Number(result.component.safetyScore) || 0,
          }
        });
      }
      
      if (result.componentStandards && result.standard) {
        componentMap.get(componentId).componentStandards.push({
          ...result.componentStandards,
          standard: result.standard
        });
      }
    }

    const componentsArray = Array.from(componentMap.values());
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(distinct ${components.id})` })
      .from(components)
      .leftJoin(componentStandards, eq(components.id, componentStandards.componentId))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      components: componentsArray,
      total: count
    };
  }

  async getComponent(id: number) {
    const componentResult = await db
      .select()
      .from(components)
      .where(eq(components.id, id));

    if (componentResult.length === 0) {
      return undefined;
    }

    const component = componentResult[0];

    // Get component standards
    const componentStandardsResult = await db
      .select({
        componentStandard: componentStandards,
        standard: standards,
      })
      .from(componentStandards)
      .leftJoin(standards, eq(componentStandards.standardId, standards.id))
      .where(eq(componentStandards.componentId, id));

    // Get component clauses
    const componentClausesResult = await db
      .select({
        componentClause: componentClauses,
        clause: standardClauses,
        standard: standards,
      })
      .from(componentClauses)
      .leftJoin(standardClauses, eq(componentClauses.clauseId, standardClauses.id))
      .leftJoin(standards, eq(standardClauses.standardId, standards.id))
      .where(eq(componentClauses.componentId, id));

    // Get component suppliers
    const componentSuppliersResult = await db
      .select({
        componentSupplier: componentSuppliers,
        supplier: suppliers,
      })
      .from(componentSuppliers)
      .leftJoin(suppliers, eq(componentSuppliers.supplierId, suppliers.id))
      .where(eq(componentSuppliers.componentId, id));

    return {
      ...component,
      componentStandards: componentStandardsResult.map(r => ({
        ...r.componentStandard,
        standard: r.standard!
      })),
      componentClauses: componentClausesResult.map(r => ({
        ...r.componentClause,
        clause: {
          ...r.clause!,
          standard: r.standard!
        }
      })),
      componentSuppliers: componentSuppliersResult.map(r => ({
        ...r.componentSupplier,
        supplier: r.supplier!
      }))
    };
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const [newComponent] = await db
      .insert(components)
      .values(component)
      .returning();
    return newComponent;
  }

  async updateComponent(id: number, component: Partial<InsertComponent>): Promise<Component> {
    const [updatedComponent] = await db
      .update(components)
      .set(component)
      .where(eq(components.id, id))
      .returning();
    return updatedComponent;
  }

  async getStandards(filters?: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = db.select().from(standards);

    const conditions = [];

    if (filters?.search) {
      conditions.push(
        sql`${standards.title} ILIKE ${`%${filters.search}%`} OR ${standards.code} ILIKE ${`%${filters.search}%`} OR ${standards.description} ILIKE ${`%${filters.search}%`}`
      );
    }

    if (filters?.category) {
      conditions.push(eq(standards.category, filters.category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(asc(standards.code)) as any;

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    const standardsResult = await query.limit(limit).offset(offset);
    
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(standards)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      standards: standardsResult,
      total: count
    };
  }

  async getStandard(id: number) {
    const [standard] = await db
      .select()
      .from(standards)
      .where(eq(standards.id, id));

    if (!standard) {
      return undefined;
    }

    const clauses = await db
      .select()
      .from(standardClauses)
      .where(eq(standardClauses.standardId, id))
      .orderBy(asc(standardClauses.clauseNumber));

    const componentStandardsResult = await db
      .select({
        componentStandard: componentStandards,
        component: components,
      })
      .from(componentStandards)
      .leftJoin(components, eq(componentStandards.componentId, components.id))
      .where(eq(componentStandards.standardId, id));

    return {
      ...standard,
      clauses,
      componentStandards: componentStandardsResult.map(r => ({
        ...r.componentStandard,
        component: r.component!
      }))
    };
  }

  async createStandard(standard: InsertStandard): Promise<Standard> {
    const [newStandard] = await db
      .insert(standards)
      .values(standard)
      .returning();
    return newStandard;
  }

  async createComponentStandard(componentStandard: InsertComponentStandard): Promise<ComponentStandard> {
    const [newComponentStandard] = await db
      .insert(componentStandards)
      .values(componentStandard)
      .returning();
    return newComponentStandard;
  }

  async updateComponentStandard(id: number, data: Partial<InsertComponentStandard>): Promise<ComponentStandard> {
    const [updated] = await db
      .update(componentStandards)
      .set(data)
      .where(eq(componentStandards.id, id))
      .returning();
    return updated;
  }

  async getStandardClauses(standardId: number): Promise<StandardClause[]> {
    return await db
      .select()
      .from(standardClauses)
      .where(eq(standardClauses.standardId, standardId))
      .orderBy(asc(standardClauses.clauseNumber));
  }

  async createStandardClause(clause: InsertStandardClause): Promise<StandardClause> {
    const [newClause] = await db
      .insert(standardClauses)
      .values(clause)
      .returning();
    return newClause;
  }

  async calculateRAMSScore(componentId: number) {
    // This would involve complex calculations based on component clauses and standards
    // For now, return the stored scores
    const [component] = await db
      .select()
      .from(components)
      .where(eq(components.id, componentId));

    if (!component) {
      throw new Error("Component not found");
    }

    return {
      overall: Number(component.ramsScore) || 0,
      reliability: Number(component.reliabilityScore) || 0,
      availability: Number(component.availabilityScore) || 0,
      maintainability: Number(component.maintainabilityScore) || 0,
      safety: Number(component.safetyScore) || 0,
    };
  }

  async searchComponents(query: string, filters?: any): Promise<Component[]> {
    const result = await this.getComponents({ search: query, ...filters });
    return result.components;
  }

  async getComponentsByStandard(standardId: number): Promise<Component[]> {
    const result = await db
      .select({ component: components })
      .from(components)
      .leftJoin(componentStandards, eq(components.id, componentStandards.componentId))
      .where(eq(componentStandards.standardId, standardId));

    return result.map(r => r.component);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(asc(suppliers.name));
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db
      .insert(suppliers)
      .values(supplier)
      .returning();
    return newSupplier;
  }

  async getDashboardStats() {
    const [componentsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(components);

    const [standardsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(standards);

    const [suppliersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(suppliers)
      .where(eq(suppliers.irsCertified, true));

    const [avgRams] = await db
      .select({ avg: sql<number>`avg(${components.ramsScore})` })
      .from(components)
      .where(sql`${components.ramsScore} IS NOT NULL`);

    const [complianceStats] = await db
      .select({ 
        total: sql<number>`count(*)`,
        compliant: sql<number>`count(*) filter (where ${componentStandards.complianceStatus} = 'compliant')`
      })
      .from(componentStandards);

    const complianceRate = complianceStats.total > 0 
      ? (complianceStats.compliant / complianceStats.total) * 100 
      : 0;

    return {
      totalComponents: componentsCount.count,
      totalStandards: standardsCount.count,
      certifiedSuppliers: suppliersCount.count,
      averageRAMSScore: Number(avgRams.avg) || 0,
      complianceRate
    };
  }
}

export const storage = new DatabaseStorage();
