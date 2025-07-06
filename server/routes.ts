import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Component search and filtering
  app.get("/api/components", async (req, res) => {
    try {
      const {
        search,
        category,
        silLevel,
        minRamsScore,
        standardIds,
        limit = "20",
        offset = "0",
        sortBy = "relevance"
      } = req.query;

      const filters: any = {};
      
      if (search) filters.search = String(search);
      if (category) filters.category = String(category);
      if (silLevel) filters.silLevel = parseInt(String(silLevel));
      if (minRamsScore) filters.minRamsScore = parseFloat(String(minRamsScore));
      if (standardIds) {
        filters.standardIds = String(standardIds).split(',').map(id => parseInt(id));
      }
      filters.limit = parseInt(String(limit));
      filters.offset = parseInt(String(offset));
      filters.sortBy = String(sortBy);

      const result = await storage.getComponents(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching components:", error);
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });

  // Get component details
  app.get("/api/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getComponent(id);
      
      if (!component) {
        return res.status(404).json({ error: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      console.error("Error fetching component:", error);
      res.status(500).json({ error: "Failed to fetch component" });
    }
  });

  // Get all standards
  app.get("/api/standards", async (req, res) => {
    try {
      const {
        search,
        category,
        limit = "50",
        offset = "0"
      } = req.query;

      const filters: any = {};
      
      if (search) filters.search = String(search);
      if (category) filters.category = String(category);
      filters.limit = parseInt(String(limit));
      filters.offset = parseInt(String(offset));

      const result = await storage.getStandards(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching standards:", error);
      res.status(500).json({ error: "Failed to fetch standards" });
    }
  });

  // Get standard details with clauses
  app.get("/api/standards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const standard = await storage.getStandard(id);
      
      if (!standard) {
        return res.status(404).json({ error: "Standard not found" });
      }
      
      res.json(standard);
    } catch (error) {
      console.error("Error fetching standard:", error);
      res.status(500).json({ error: "Failed to fetch standard" });
    }
  });

  // Get component RAMS analysis
  app.get("/api/components/:id/rams", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ramsScore = await storage.calculateRAMSScore(id);
      res.json(ramsScore);
    } catch (error) {
      console.error("Error calculating RAMS score:", error);
      res.status(500).json({ error: "Failed to calculate RAMS score" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // Search components (simplified endpoint for quick search)
  app.get("/api/search/components", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.json([]);
      }

      const components = await storage.searchComponents(String(q));
      res.json(components.slice(0, 10)); // Limit for autocomplete
    } catch (error) {
      console.error("Error searching components:", error);
      res.status(500).json({ error: "Failed to search components" });
    }
  });

  // Get components by standard
  app.get("/api/standards/:id/components", async (req, res) => {
    try {
      const standardId = parseInt(req.params.id);
      const components = await storage.getComponentsByStandard(standardId);
      res.json(components);
    } catch (error) {
      console.error("Error fetching components by standard:", error);
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });

  // Export components data
  app.get("/api/export/components", async (req, res) => {
    try {
      const { format = "csv" } = req.query;
      const result = await storage.getComponents({ limit: 1000 });
      
      if (format === "csv") {
        const csvHeaders = [
          "Name", "Model", "Manufacturer", "Category", "SIL Level", 
          "RAMS Score", "Reliability", "Availability", "Maintainability", "Safety",
          "Risk Level", "Certification Status"
        ];
        
        const csvRows = result.components.map(comp => [
          comp.name,
          comp.model,
          comp.manufacturer,
          comp.category,
          comp.silLevel || "",
          comp.ramsScore || "",
          comp.reliabilityScore || "",
          comp.availabilityScore || "",
          comp.maintainabilityScore || "",
          comp.safetyScore || "",
          comp.riskLevel,
          comp.certificationStatus
        ]);

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=railway_components.csv");
        res.send(csvContent);
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error exporting components:", error);
      res.status(500).json({ error: "Failed to export components" });
    }
  });

  // Get suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
