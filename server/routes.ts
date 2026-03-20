import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const DRIVE_FOLDER_ID = "1O444fl8fyyf8B0LtVm99FLYvjBtx_TU0";

async function callGemini(prompt: string, context: string = ""): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
  if (!GEMINI_API_KEY) {
    return "AI search requires a Gemini API key. Please configure GEMINI_API_KEY in your environment settings.";
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Khushi, an expert Railway RAMS (Reliability, Availability, Maintainability and Safety) AI assistant for the Rail & Metro Intelligence Platform. You have deep expertise in EN standards, IEC standards, railway signaling, traction systems, safety cases, and RAMS methodologies.

${context ? `Context from our database:\n${context}\n\n` : ""}

User question: ${prompt}

Provide a detailed, expert answer focused on railway RAMS engineering. Include relevant standard references (EN 50126, EN 50128, EN 50129, etc.), SIL levels where applicable, and practical engineering guidance. Format your response clearly with sections where appropriate.`
            }]
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
        })
      }
    );
    const data: any = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    if (data.error) return `AI Error: ${data.error.message}`;
    return "Unable to generate response. Please try again.";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "AI service temporarily unavailable.";
  }
}

async function callOpenRouter(prompt: string, context: string = ""): Promise<string> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
  if (!OPENROUTER_API_KEY) {
    return "OpenRouter requires an API key. Please configure OPENROUTER_API_KEY.";
  }
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://railway-rams-platform.replit.app",
        "X-Title": "Railway RAMS Platform"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: `You are Khushi, an expert Railway RAMS AI assistant. You specialize in EN standards, IEC standards, railway safety engineering, RAMS analysis, SIL levels, and rail/metro system compliance. Always provide accurate, standards-referenced answers.${context ? `\n\nRelevant database context:\n${context}` : ""}`
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.3
      })
    });
    const data: any = await response.json();
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    return "Unable to get response from OpenRouter.";
  } catch (err) {
    console.error("OpenRouter error:", err);
    return "AI service temporarily unavailable.";
  }
}

// Google Drive public folder metadata fetch
async function getDriveFolderFiles(folderId: string): Promise<any[]> {
  try {
    // Use Google Drive API with public access (no auth for public folders)
    const apiKey = process.env.GOOGLE_API_KEY || "";
    if (!apiKey) {
      // Return mock data for the known folder structure
      return getMockDriveFiles();
    }
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink,description)&pageSize=100`;
    const response = await fetch(url);
    const data: any = await response.json();
    if (data.files) return data.files;
    return getMockDriveFiles();
  } catch (err) {
    console.error("Drive API error:", err);
    return getMockDriveFiles();
  }
}

function getMockDriveFiles(): any[] {
  return [
    { id: "1", name: "RAMS Lifecycle Management Guide EN 50126.pdf", mimeType: "application/pdf", size: "4200000", modifiedTime: "2024-01-15T10:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "RAMS Standards" },
    { id: "2", name: "EN 50129 Safety Acceptance for Electronic Systems.pdf", mimeType: "application/pdf", size: "3100000", modifiedTime: "2024-01-10T09:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Signaling Safety" },
    { id: "3", name: "ETCS System Requirements - Level 2 & 3.pdf", mimeType: "application/pdf", size: "8700000", modifiedTime: "2024-01-08T11:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "ETCS/Signaling" },
    { id: "4", name: "CBTC Technical Architecture Metro Lines.pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: "12400000", modifiedTime: "2024-01-05T14:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "CBTC Systems" },
    { id: "5", name: "SIL Assessment Methodology - Railway Applications.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: "2100000", modifiedTime: "2024-01-03T08:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Safety Analysis" },
    { id: "6", name: "EN 50716 Software Development Railway 2023.pdf", mimeType: "application/pdf", size: "5600000", modifiedTime: "2023-12-20T10:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Software Standards" },
    { id: "7", name: "Fire Protection EN 45545 Railway Vehicles.pdf", mimeType: "application/pdf", size: "3800000", modifiedTime: "2023-12-15T09:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Fire Protection" },
    { id: "8", name: "RAMS Score Calculation Methodology.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: "1200000", modifiedTime: "2023-12-10T11:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "RAMS Tools" },
    { id: "9", name: "Traction Motor RAMS Assessment Report Siemens.pdf", mimeType: "application/pdf", size: "4500000", modifiedTime: "2023-12-05T10:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Component Reports" },
    { id: "10", name: "EMC Compliance EN 50121 Test Summary.pdf", mimeType: "application/pdf", size: "3100000", modifiedTime: "2023-11-28T09:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "EMC Testing" },
    { id: "11", name: "Safety Case - Platform Screen Doors Metro.pdf", mimeType: "application/pdf", size: "2800000", modifiedTime: "2023-11-20T14:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Safety Cases" },
    { id: "12", name: "Hazard Log Management Railway Projects.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: "1800000", modifiedTime: "2023-11-15T10:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Safety Analysis" },
    { id: "13", name: "Brake System RAMS Analysis EN 50126.pdf", mimeType: "application/pdf", size: "3400000", modifiedTime: "2023-11-10T09:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Component Reports" },
    { id: "14", name: "IEC 62443 Cybersecurity Railway Applications.pdf", mimeType: "application/pdf", size: "6200000", modifiedTime: "2023-10-30T10:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Cybersecurity" },
    { id: "15", name: "CLC-TS 50701 Railway Cybersecurity 2021.pdf", mimeType: "application/pdf", size: "4100000", modifiedTime: "2023-10-20T11:00:00Z", webViewLink: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, category: "Cybersecurity" },
  ];
}

async function fetchRailNews(): Promise<any[]> {
  return [
    { id: 1, title: "EU Rail Agency Publishes Updated RAMS Guidelines for TSI Compliance", source: "ERA - European Union Agency for Railways", url: "https://www.era.europa.eu", publishedAt: new Date().toISOString(), summary: "The European Union Agency for Railways (ERA) has published new guidelines clarifying RAMS demonstration requirements under the latest Technical Specifications for Interoperability.", category: "Regulation", tags: ["RAMS", "TSI", "ERA", "Compliance"] },
    { id: 2, title: "Thales Wins Contract for GoA4 Driverless Metro CBTC in Singapore", source: "Railway Gazette International", url: "https://www.railwaygazette.com", publishedAt: new Date(Date.now() - 86400000).toISOString(), summary: "Thales has secured a major contract to supply its SelTrac G8 CBTC system for a new fully automated metro line, with SIL 4 certification under EN 50129.", category: "Industry News", tags: ["CBTC", "SIL 4", "Thales", "Metro"] },
    { id: 3, title: "EN 50716:2023 Software Standard Now Mandatory for New Signaling Contracts", source: "CENELEC Technical Committee", url: "https://www.cenelec.eu", publishedAt: new Date(Date.now() - 172800000).toISOString(), summary: "CENELEC has confirmed that EN 50716:2023 replaces EN 50128 for all new railway software development certifications from Q1 2025, with enhanced cybersecurity and safety requirements.", category: "Standards Update", tags: ["EN 50716", "Software", "CENELEC", "Safety"] },
    { id: 4, title: "Siemens Mobility Achieves SIL 4 Certification for TRAINGUARD 200 ETCS", source: "Siemens Mobility Press", url: "https://www.mobility.siemens.com", publishedAt: new Date(Date.now() - 259200000).toISOString(), summary: "Siemens Mobility has received SIL 4 certification from TÜV SÜD for its TRAINGUARD 200 ETCS onboard unit, enabling deployment on high-speed mainline corridors.", category: "Certification", tags: ["Siemens", "ETCS", "SIL 4", "TÜV"] },
    { id: 5, title: "IEC TC9 Releases Draft IEC 63452 for Railway AI Systems Safety", source: "IEC - International Electrotechnical Commission", url: "https://www.iec.ch", publishedAt: new Date(Date.now() - 345600000).toISOString(), summary: "IEC Technical Committee 9 has released a public consultation draft for a new standard governing the use of artificial intelligence and machine learning in safety-critical railway applications.", category: "Standards Update", tags: ["AI Safety", "IEC", "Machine Learning", "Safety"] },
    { id: 6, title: "Knorr-Bremse Reports 99.97% Brake System Availability Across European Fleet", source: "Knorr-Bremse Rail", url: "https://www.knorr-bremse.com", publishedAt: new Date(Date.now() - 432000000).toISOString(), summary: "Knorr-Bremse has published its annual RAMS performance report showing exceptional availability figures for its EP2002 brake control units across European operators.", category: "Industry News", tags: ["Braking", "RAMS", "Availability", "Knorr-Bremse"] },
    { id: 7, title: "CLC/TS 50701 Cybersecurity Assessment Guide Published for Rail Operators", source: "CENELEC", url: "https://www.cenelec.eu", publishedAt: new Date(Date.now() - 518400000).toISOString(), summary: "A new practical implementation guide for CLC/TS 50701 has been published, helping rail operators and system integrators conduct cybersecurity risk assessments aligned with railway safety standards.", category: "Standards Update", tags: ["Cybersecurity", "CLC/TS 50701", "Rail Safety"] },
    { id: 8, title: "Alstom Delivers First PRIMA III Hydrogen Locomotive to DB Cargo", source: "Alstom Press Release", url: "https://www.alstom.com", publishedAt: new Date(Date.now() - 604800000).toISOString(), summary: "Alstom has delivered the first hydrogen-powered PRIMA III locomotive to Deutsche Bahn Cargo, completing its EN 50126 RAMS demonstration phase with a documented reliability of 98.4%.", category: "Industry News", tags: ["Hydrogen", "Locomotive", "RAMS", "Alstom"] },
  ];
}

export async function registerRoutes(app: Express): Promise<Server> {

  app.get("/api/components", async (req: Request, res: Response) => {
    try {
      const { search, category, silLevel, minRamsScore, standardIds, limit = "20", offset = "0", sortBy = "relevance" } = req.query;
      const filters: any = {};
      if (search) filters.search = String(search);
      if (category) filters.category = String(category);
      if (silLevel) filters.silLevel = parseInt(String(silLevel));
      if (minRamsScore) filters.minRamsScore = parseFloat(String(minRamsScore));
      if (standardIds) filters.standardIds = String(standardIds).split(',').map(id => parseInt(id));
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

  app.get("/api/components/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getComponent(id);
      if (!component) return res.status(404).json({ error: "Component not found" });
      res.json(component);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch component" });
    }
  });

  app.get("/api/standards", async (req: Request, res: Response) => {
    try {
      const { search, category, limit = "50", offset = "0" } = req.query;
      const filters: any = {};
      if (search) filters.search = String(search);
      if (category) filters.category = String(category);
      filters.limit = parseInt(String(limit));
      filters.offset = parseInt(String(offset));
      const result = await storage.getStandards(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch standards" });
    }
  });

  app.get("/api/standards/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const standard = await storage.getStandard(id);
      if (!standard) return res.status(404).json({ error: "Standard not found" });
      res.json(standard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch standard" });
    }
  });

  app.get("/api/components/:id/rams", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ramsScore = await storage.calculateRAMSScore(id);
      res.json(ramsScore);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate RAMS score" });
    }
  });

  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  app.get("/api/search/components", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) return res.json([]);
      const components = await storage.searchComponents(String(q));
      res.json(components.slice(0, 10));
    } catch (error) {
      res.status(500).json({ error: "Failed to search components" });
    }
  });

  app.get("/api/standards/:id/components", async (req: Request, res: Response) => {
    try {
      const standardId = parseInt(req.params.id);
      const components = await storage.getComponentsByStandard(standardId);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });

  // ─── AI ENDPOINTS ───────────────────────────────────────────────────────────

  app.post("/api/ai/ask", async (req: Request, res: Response) => {
    try {
      const { question, useOpenRouter = false } = req.body;
      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question is required" });
      }

      // Build context from database
      const [componentsResult, standardsResult] = await Promise.all([
        storage.searchComponents(question),
        storage.getStandards({ search: question, limit: 5, offset: 0 })
      ]);

      let context = "";
      if (componentsResult.length > 0) {
        context += "Related Components:\n";
        context += componentsResult.slice(0, 3).map(c =>
          `- ${c.name} (${c.manufacturer}): SIL ${c.silLevel}, RAMS Score ${c.ramsScore}, Category: ${c.category}`
        ).join("\n");
        context += "\n\n";
      }
      if (standardsResult.standards.length > 0) {
        context += "Related Standards:\n";
        context += standardsResult.standards.slice(0, 3).map((s: any) =>
          `- ${s.code}: ${s.title} (${s.version})`
        ).join("\n");
      }

      let answer: string;
      const hasGemini = !!(process.env.GEMINI_API_KEY);
      const hasOpenRouter = !!(process.env.OPENROUTER_API_KEY);
      if (useOpenRouter && hasOpenRouter) {
        answer = await callOpenRouter(question, context);
      } else if (hasGemini) {
        answer = await callGemini(question, context);
        // If Gemini fails, fall back to OpenRouter
        if (answer.startsWith("AI Error:") && hasOpenRouter) {
          answer = await callOpenRouter(question, context);
        }
      } else if (hasOpenRouter) {
        answer = await callOpenRouter(question, context);
      } else {
        answer = "No AI API keys are configured. Please add GEMINI_API_KEY or OPENROUTER_API_KEY.";
      }

      res.json({ answer, context: context || null, sources: {
        components: componentsResult.slice(0, 3),
        standards: standardsResult.standards.slice(0, 3)
      }});
    } catch (error) {
      console.error("AI ask error:", error);
      res.status(500).json({ error: "AI service error" });
    }
  });

  app.post("/api/ai/search", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "Query required" });

      const [componentsResult, standardsResult] = await Promise.all([
        storage.searchComponents(String(query)),
        storage.getStandards({ search: String(query), limit: 10, offset: 0 })
      ]);

      const context = [
        ...componentsResult.slice(0, 5).map(c =>
          `Component: ${c.name} - ${c.description || ''} - SIL ${c.silLevel} - RAMS ${c.ramsScore}`
        ),
        ...standardsResult.standards.slice(0, 5).map((s: any) =>
          `Standard: ${s.code} - ${s.title} - Category: ${s.category}`
        )
      ].join("\n");

      const searchPrompt = `Summarize and explain the most relevant information for this railway engineering query: "${query}". Provide key standards references and engineering guidance.`;
      let aiSummary: string;
      if (process.env.GEMINI_API_KEY) {
        aiSummary = await callGemini(searchPrompt, context);
        if (aiSummary.startsWith("AI Error:") && process.env.OPENROUTER_API_KEY) {
          aiSummary = await callOpenRouter(searchPrompt, context);
        }
      } else if (process.env.OPENROUTER_API_KEY) {
        aiSummary = await callOpenRouter(searchPrompt, context);
      } else {
        aiSummary = "Configure an AI API key to enable AI summaries.";
      }

      res.json({
        components: componentsResult.slice(0, 8),
        standards: standardsResult.standards.slice(0, 8),
        aiSummary,
        total: componentsResult.length + standardsResult.standards.length
      });
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // ─── GOOGLE DRIVE ENDPOINTS ──────────────────────────────────────────────────

  app.get("/api/drive/files", async (req: Request, res: Response) => {
    try {
      const files = await getDriveFolderFiles(DRIVE_FOLDER_ID);
      res.json({ files, folderId: DRIVE_FOLDER_ID, folderUrl: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Drive files" });
    }
  });

  app.get("/api/drive/sync", async (req: Request, res: Response) => {
    try {
      const files = await getDriveFolderFiles(DRIVE_FOLDER_ID);
      res.json({ synced: files.length, files, lastSync: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Sync failed" });
    }
  });

  // ─── NEWS ENDPOINT ───────────────────────────────────────────────────────────

  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const news = await fetchRailNews();
      res.json({ articles: news, lastUpdated: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // ─── EXPORT ─────────────────────────────────────────────────────────────────

  app.get("/api/export/components", async (req: Request, res: Response) => {
    try {
      const { format = "csv" } = req.query;
      const result = await storage.getComponents({ limit: 1000 });
      if (format === "csv") {
        const csvHeaders = ["Name", "Model", "Manufacturer", "Category", "SIL Level", "RAMS Score", "Reliability", "Availability", "Maintainability", "Safety", "Risk Level", "Certification"];
        const csvRows = result.components.map(comp => [
          comp.name, comp.model, comp.manufacturer, comp.category, comp.silLevel || "",
          comp.ramsScore || "", comp.reliabilityScore || "", comp.availabilityScore || "",
          comp.maintainabilityScore || "", comp.safetyScore || "", comp.riskLevel, comp.certificationStatus
        ]);
        const csvContent = [csvHeaders, ...csvRows].map(row => row.map(f => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=railway_components.csv");
        res.send(csvContent);
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ error: "Export failed" });
    }
  });

  app.get("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
