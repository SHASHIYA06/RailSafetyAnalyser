import { db } from "./db";
import { 
  standards, 
  components, 
  componentStandards, 
  standardClauses,
  suppliers,
  componentSuppliers 
} from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    await db.delete(componentSuppliers);
    await db.delete(componentStandards);
    await db.delete(standardClauses);
    await db.delete(components);
    await db.delete(suppliers);
    await db.delete(standards);

    // Seed Standards
    console.log("📋 Seeding standards...");
    const standardsData = [
      {
        code: "EN 50126-1",
        title: "Railway applications - The specification and demonstration of Reliability, Availability, Maintainability and Safety (RAMS) - Part 1: Generic RAMS process",
        description: "Defines the RAMS process and lifecycle for railway applications, providing requirements for management throughout all lifecycle phases.",
        category: "RAMS",
        status: "active",
        version: "2017+A1:2024",
        pdfUrl: "https://www.en-standard.eu/bs-en-50126-1-2017-railway-applications",
        publishedDate: new Date("2017-12-01"),
      },
      {
        code: "EN 50155",
        title: "Railway applications - Electronic equipment used on rolling stock",
        description: "Specifies test conditions and test methods for electronic equipment used on railway rolling stock.",
        category: "Rolling Stock",
        status: "active", 
        version: "2017",
        pdfUrl: "https://standards.globalspec.com/std/14403651/en-50155",
        publishedDate: new Date("2017-06-01"),
      },
      {
        code: "EN 50121-3-2",
        title: "Railway applications - Electromagnetic compatibility - Part 3-2: Rolling stock - Apparatus",
        description: "Defines EMC requirements for apparatus used on railway rolling stock.",
        category: "EMC",
        status: "active",
        version: "2016",
        pdfUrl: "https://standards.globalspec.com/std/13302501/en-50121-4",
        publishedDate: new Date("2016-03-01"),
      },
      {
        code: "EN 50716",
        title: "Railway applications - Requirements for software development",
        description: "Supersedes EN 50128 and EN 50657, defining requirements for software development in railway applications with enhanced cybersecurity.",
        category: "Software",
        status: "active",
        version: "2023",
        pdfUrl: "https://www.en-standard.eu/bs-en-50716-2023-railway-applications",
        publishedDate: new Date("2023-12-01"),
      },
      {
        code: "EN 50129",
        title: "Railway applications - Communication, signaling and processing systems - Safety related electronic systems for signaling",
        description: "Defines requirements for acceptance of safety-related electronic systems in railway signaling.",
        category: "Signaling",
        status: "active",
        version: "2018",
        pdfUrl: "https://standards.globalspec.com/std/14317747/en-50128",
        publishedDate: new Date("2018-08-01"),
      },
      {
        code: "EN 45545-2",
        title: "Railway applications - Fire protection on railway vehicles - Part 2: Requirements for fire behaviour of materials and components",
        description: "Specifies fire behaviour requirements for materials and components used in railway vehicles.",
        category: "Fire Protection",
        status: "active",
        version: "2020",
        pdfUrl: "https://www.en-standard.eu/bs-en-45545-2-2020",
        publishedDate: new Date("2020-05-01"),
      },
      {
        code: "IEC 62443-4-2",
        title: "Security for industrial automation and control systems - Part 4-2: Technical security requirements for IACS components",
        description: "Provides cybersecurity requirements for industrial automation and control systems, applicable to railway systems.",
        category: "Cybersecurity",
        status: "active",
        version: "2019",
        pdfUrl: "https://webstore.iec.ch/publication/33615",
        publishedDate: new Date("2019-02-01"),
      }
    ];

    const insertedStandards = await db.insert(standards).values(standardsData).returning();
    console.log(`✅ Inserted ${insertedStandards.length} standards`);

    // Seed Standard Clauses
    console.log("📑 Seeding standard clauses...");
    const clausesData = [
      {
        standardId: insertedStandards[0].id, // EN 50126-1
        clauseNumber: "4.3.1",
        title: "RAMS Policy",
        content: "The supplier shall establish, document and maintain a RAMS policy that defines the organization's commitment to achieving the required RAMS levels.",
        requirements: { type: "mandatory", evidence: "documented_policy" },
        ramsCategory: "Reliability",
        silRelevance: 2,
        criticalityLevel: "high"
      },
      {
        standardId: insertedStandards[0].id, // EN 50126-1
        clauseNumber: "8.2.4.26.1",
        title: "Hazard Log",
        content: "The Hazard Log shall include all hazards throughout the system life cycle and shall be maintained throughout all lifecycle phases.",
        requirements: { type: "mandatory", evidence: "hazard_log" },
        ramsCategory: "Safety",
        silRelevance: 4,
        criticalityLevel: "critical"
      },
      {
        standardId: insertedStandards[1].id, // EN 50155
        clauseNumber: "4.2",
        title: "Temperature Classes",
        content: "Equipment shall be designed to operate within specified temperature ranges (T1: -25°C to +70°C, T2: -40°C to +70°C, etc.)",
        requirements: { type: "mandatory", evidence: "test_report" },
        ramsCategory: "Reliability",
        silRelevance: 1,
        criticalityLevel: "medium"
      }
    ];

    const insertedClauses = await db.insert(standardClauses).values(clausesData).returning();
    console.log(`✅ Inserted ${insertedClauses.length} standard clauses`);

    // Seed Suppliers
    console.log("🏢 Seeding suppliers...");
    const suppliersData = [
      {
        name: "Siemens Mobility",
        country: "Germany",
        certifications: { iso9001: true, iris: true, en15085: true },
        contactInfo: { website: "https://www.mobility.siemens.com", email: "info@siemens.com" },
        irsCertified: true,
        qualityRating: 4.8,
        lastAudit: new Date("2024-06-15")
      },
      {
        name: "Alstom Transport",
        country: "France", 
        certifications: { iso9001: true, iris: true, en15085: true },
        contactInfo: { website: "https://www.alstom.com", email: "contact@alstom.com" },
        irsCertified: true,
        qualityRating: 4.7,
        lastAudit: new Date("2024-05-20")
      },
      {
        name: "Bosch Security Systems",
        country: "Germany",
        certifications: { iso9001: true, iris: false, en45545: true },
        contactInfo: { website: "https://www.boschsecurity.com", email: "info@boschsecurity.com" },
        irsCertified: false,
        qualityRating: 4.5,
        lastAudit: new Date("2024-07-10")
      }
    ];

    const insertedSuppliers = await db.insert(suppliers).values(suppliersData).returning();
    console.log(`✅ Inserted ${insertedSuppliers.length} suppliers`);

    // Seed Components
    console.log("⚙️ Seeding components...");
    const componentsData = [
      {
        name: "Siemens SIBAS 32 Traction Motor Controller",
        model: "SIBAS-32-TMC-V3.2",
        manufacturer: "Siemens Mobility",
        category: "Power & Electrical Systems",
        subcategory: "Traction Control",
        description: "Advanced traction motor control system for metro and light rail applications with integrated safety functions and energy recovery capabilities.",
        technicalSpecs: {
          voltage: "1500V DC / 25kV AC",
          power: "2.5 MW",
          efficiency: "96%",
          dimensions: "800x600x300mm",
          weight: "120kg",
          coolingType: "forced_air"
        },
        operatingConditions: {
          temperature: { min: -40, max: 70, unit: "°C" },
          humidity: { max: 95, unit: "%" },
          altitude: { max: 2000, unit: "m" }
        },
        certificationStatus: "certified",
        silLevel: 3,
        ramsScore: 96.5,
        reliabilityScore: 97.2,
        availabilityScore: 98.1,
        maintainabilityScore: 95.3,
        safetyScore: 96.8,
        riskLevel: "low"
      },
      {
        name: "Alstom ATLAS 200 ETCS Onboard Unit",
        model: "ATLAS-200-OBU-L3",
        manufacturer: "Alstom Transport",
        category: "Control & Signaling",
        subcategory: "Train Control",
        description: "ETCS Level 2/3 onboard unit with advanced train protection and automatic train operation capabilities for high-speed and urban rail.",
        technicalSpecs: {
          etcsLevel: "2/3",
          maxSpeed: "350 km/h",
          processingUnit: "dual_redundant",
          interfaces: ["DMI", "STM", "Radio", "Odometry"],
          memoryType: "ECC_RAM"
        },
        operatingConditions: {
          temperature: { min: -25, max: 70, unit: "°C" },
          humidity: { max: 95, unit: "%" },
          vibration: "EN 61373 Category 1"
        },
        certificationStatus: "certified",
        silLevel: 4,
        ramsScore: 98.1,
        reliabilityScore: 99.0,
        availabilityScore: 98.5,
        maintainabilityScore: 97.2,
        safetyScore: 98.7,
        riskLevel: "very low"
      },
      {
        name: "Bosch FPA-5000 Fire Detection Panel",
        model: "FPA-5000-RWY-V2.1",
        manufacturer: "Bosch Security Systems",
        category: "Safety Systems",
        subcategory: "Fire Protection",
        description: "Advanced fire detection and alarm system for metro stations and tunnels with intelligent smoke detection and automated suppression interface.",
        technicalSpecs: {
          detectionTypes: ["smoke", "heat", "flame", "gas"],
          zones: 250,
          loops: 4,
          display: "touchscreen_7inch",
          networkProtocol: "TCP/IP"
        },
        operatingConditions: {
          temperature: { min: -10, max: 55, unit: "°C" },
          humidity: { max: 95, unit: "%" },
          ipRating: "IP54"
        },
        certificationStatus: "certified",
        silLevel: 2,
        ramsScore: 89.7,
        reliabilityScore: 92.3,
        availabilityScore: 89.5,
        maintainabilityScore: 85.2,
        safetyScore: 93.8,
        riskLevel: "medium"
      },
      {
        name: "Siemens TRAINGUARD MT CBTC System",
        model: "TG-MT-V4.0",
        manufacturer: "Siemens Mobility",
        category: "Control & Signaling",
        subcategory: "CBTC",
        description: "Communication-based train control system providing automatic train supervision, protection, and operation for metro lines.",
        technicalSpecs: {
          communicationType: "radio",
          frequency: "2.4 GHz ISM",
          headway: "90 seconds",
          ato_grade: "GoA4",
          redundancy: "triple_modular"
        },
        operatingConditions: {
          temperature: { min: -40, max: 70, unit: "°C" },
          humidity: { max: 95, unit: "%" },
          availability: "99.999%"
        },
        certificationStatus: "certified",
        silLevel: 4,
        ramsScore: 97.8,
        reliabilityScore: 98.5,
        availabilityScore: 99.2,
        maintainabilityScore: 96.1,
        safetyScore: 97.4,
        riskLevel: "low"
      }
    ];

    const insertedComponents = await db.insert(components).values(componentsData).returning();
    console.log(`✅ Inserted ${insertedComponents.length} components`);

    // Seed Component-Standard relationships
    console.log("🔗 Seeding component-standard relationships...");
    const componentStandardsData = [
      // Siemens Traction Controller
      {
        componentId: insertedComponents[0].id,
        standardId: insertedStandards[0].id, // EN 50126-1
        complianceStatus: "compliant",
        complianceScore: 96.5,
        certificationDate: new Date("2024-01-15"),
        verifiedBy: "TÜV SÜD Rail"
      },
      {
        componentId: insertedComponents[0].id,
        standardId: insertedStandards[1].id, // EN 50155
        complianceStatus: "compliant", 
        complianceScore: 98.2,
        certificationDate: new Date("2024-02-10"),
        verifiedBy: "TÜV SÜD Rail"
      },
      {
        componentId: insertedComponents[0].id,
        standardId: insertedStandards[2].id, // EN 50121-3-2
        complianceStatus: "compliant",
        complianceScore: 94.8,
        certificationDate: new Date("2024-03-05"),
        verifiedBy: "DEKRA Rail"
      },
      // Alstom ETCS Unit
      {
        componentId: insertedComponents[1].id,
        standardId: insertedStandards[0].id, // EN 50126-1
        complianceStatus: "compliant",
        complianceScore: 98.1,
        certificationDate: new Date("2024-01-20"),
        verifiedBy: "CERTIFER"
      },
      {
        componentId: insertedComponents[1].id,
        standardId: insertedStandards[3].id, // EN 50716
        complianceStatus: "compliant",
        complianceScore: 97.5,
        certificationDate: new Date("2024-02-25"),
        verifiedBy: "CERTIFER"
      },
      {
        componentId: insertedComponents[1].id,
        standardId: insertedStandards[4].id, // EN 50129
        complianceStatus: "compliant",
        complianceScore: 98.8,
        certificationDate: new Date("2024-03-15"),
        verifiedBy: "CERTIFER"
      },
      // Bosch Fire Detection
      {
        componentId: insertedComponents[2].id,
        standardId: insertedStandards[5].id, // EN 45545-2
        complianceStatus: "compliant",
        complianceScore: 93.2,
        certificationDate: new Date("2024-04-10"),
        verifiedBy: "EXOVA BM TRADA"
      },
      {
        componentId: insertedComponents[2].id,
        standardId: insertedStandards[0].id, // EN 50126-1
        complianceStatus: "partial",
        complianceScore: 87.5,
        certificationDate: new Date("2024-05-01"),
        verifiedBy: "TÜV NORD"
      }
    ];

    const insertedComponentStandards = await db.insert(componentStandards).values(componentStandardsData).returning();
    console.log(`✅ Inserted ${insertedComponentStandards.length} component-standard relationships`);

    // Seed Component-Supplier relationships
    console.log("🤝 Seeding component-supplier relationships...");
    const componentSuppliersData = [
      {
        componentId: insertedComponents[0].id,
        supplierId: insertedSuppliers[0].id, // Siemens
        supplierPartNumber: "SIBAS32-TMC-001",
        leadTime: 16,
        priceRange: "€50,000-70,000",
        availability: "available"
      },
      {
        componentId: insertedComponents[1].id,
        supplierId: insertedSuppliers[1].id, // Alstom
        supplierPartNumber: "ATLAS200-OBU-001",
        leadTime: 20,
        priceRange: "€80,000-120,000", 
        availability: "available"
      },
      {
        componentId: insertedComponents[2].id,
        supplierId: insertedSuppliers[2].id, // Bosch
        supplierPartNumber: "FPA5000-RWY-001",
        leadTime: 12,
        priceRange: "€15,000-25,000",
        availability: "available"
      }
    ];

    const insertedComponentSuppliers = await db.insert(componentSuppliers).values(componentSuppliersData).returning();
    console.log(`✅ Inserted ${insertedComponentSuppliers.length} component-supplier relationships`);

    console.log("🎉 Database seed completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed if this file is executed directly
if (import.meta.main) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seed process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed process failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
