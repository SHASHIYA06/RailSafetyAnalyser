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
    await db.delete(componentSuppliers);
    await db.delete(componentStandards);
    await db.delete(standardClauses);
    await db.delete(components);
    await db.delete(suppliers);
    await db.delete(standards);

    console.log("📋 Seeding standards...");
    const standardsData = [
      { code: "EN 50126-1", title: "Railway applications - RAMS - Part 1: Generic RAMS process", description: "Defines the RAMS process and lifecycle for railway applications.", category: "RAMS", status: "active", version: "2017+A1:2024", pdfUrl: "https://www.en-standard.eu/bs-en-50126-1-2017", publishedDate: new Date("2017-12-01") },
      { code: "EN 50126-2", title: "Railway applications - RAMS - Part 2: Systems approach to safety", description: "Systems approach to safety within the RAMS framework.", category: "RAMS", status: "active", version: "2017", pdfUrl: "https://standards.globalspec.com/std/10115699/en-50126-2", publishedDate: new Date("2017-12-01") },
      { code: "EN 50128", title: "Railway applications - Software for railway control and protection systems", description: "Specifies requirements and recommendations for development of software for railway control and protection systems.", category: "Software", status: "superseded", version: "2011+A1:2020", pdfUrl: "https://standards.globalspec.com/std/14317747/en-50128", publishedDate: new Date("2011-10-01") },
      { code: "EN 50129", title: "Railway applications - Safety related electronic systems for signaling", description: "Defines requirements for acceptance of safety-related electronic systems in railway signaling.", category: "Signaling", status: "active", version: "2018", pdfUrl: "https://standards.globalspec.com/std/14317747/en-50129", publishedDate: new Date("2018-08-01") },
      { code: "EN 50155", title: "Railway applications - Electronic equipment used on rolling stock", description: "Specifies test conditions and test methods for electronic equipment used on railway rolling stock.", category: "Rolling Stock", status: "active", version: "2017", pdfUrl: "https://standards.globalspec.com/std/14403651/en-50155", publishedDate: new Date("2017-06-01") },
      { code: "EN 50121-1", title: "Railway applications - Electromagnetic compatibility - Part 1: General", description: "General requirements for EMC in railway applications.", category: "EMC", status: "active", version: "2017", pdfUrl: "https://standards.globalspec.com/std/en-50121-1", publishedDate: new Date("2017-01-01") },
      { code: "EN 50121-3-2", title: "Railway applications - EMC - Part 3-2: Rolling stock - Apparatus", description: "Defines EMC requirements for apparatus used on railway rolling stock.", category: "EMC", status: "active", version: "2016", pdfUrl: "https://standards.globalspec.com/std/13302501/en-50121-4", publishedDate: new Date("2016-03-01") },
      { code: "EN 50121-4", title: "Railway applications - EMC - Part 4: Emission and immunity of signalling and telecommunications apparatus", description: "EMC requirements for signaling and telecom apparatus.", category: "EMC", status: "active", version: "2016", pdfUrl: "https://standards.globalspec.com/std/13302501/en-50121-4", publishedDate: new Date("2016-03-01") },
      { code: "EN 50124-1", title: "Railway applications - Insulation coordination - Part 1: Basic requirements", description: "Basic requirements and rules for insulation coordination in railway applications.", category: "Electrical", status: "active", version: "2017", pdfUrl: "https://standards.globalspec.com/std/en-50124-1", publishedDate: new Date("2017-05-01") },
      { code: "EN 50125-1", title: "Railway applications - Environmental conditions for equipment - Part 1: Rolling stock equipment", description: "Environmental conditions and testing for rolling stock equipment.", category: "Rolling Stock", status: "active", version: "2014", pdfUrl: "https://standards.globalspec.com/std/en-50125-1", publishedDate: new Date("2014-04-01") },
      { code: "EN 50127", title: "Railway applications - Fixed installations - Electrical DC switchgear", description: "Requirements for DC switchgear in fixed railway installations.", category: "Fixed Installations", status: "active", version: "2011", pdfUrl: "https://standards.globalspec.com/std/en-50127", publishedDate: new Date("2011-06-01") },
      { code: "EN 50159", title: "Railway applications - Safety-related communication in railway systems", description: "Requirements and methods for safety-related communication in railway systems.", category: "Communication", status: "active", version: "2010+A1:2020", pdfUrl: "https://standards.globalspec.com/std/en-50159", publishedDate: new Date("2010-09-01") },
      { code: "EN 50716", title: "Railway applications - Requirements for software development", description: "Supersedes EN 50128, defining requirements for software development with enhanced cybersecurity.", category: "Software", status: "active", version: "2023", pdfUrl: "https://www.en-standard.eu/bs-en-50716-2023", publishedDate: new Date("2023-12-01") },
      { code: "EN 45545-2", title: "Railway applications - Fire protection - Part 2: Fire behaviour requirements", description: "Specifies fire behaviour requirements for materials and components in railway vehicles.", category: "Fire Protection", status: "active", version: "2020", pdfUrl: "https://www.en-standard.eu/bs-en-45545-2-2020", publishedDate: new Date("2020-05-01") },
      { code: "EN 45545-3", title: "Railway applications - Fire protection - Part 3: Fire resistance requirements", description: "Fire resistance requirements for fire barriers in railway vehicles.", category: "Fire Protection", status: "active", version: "2013", pdfUrl: "https://www.en-standard.eu/bs-en-45545-3", publishedDate: new Date("2013-08-01") },
      { code: "IEC 62278", title: "Railway applications - Specification and demonstration of RAMS", description: "Specification and demonstration of Reliability, Availability, Maintainability and Safety.", category: "RAMS", status: "active", version: "2002", pdfUrl: "https://webstore.iec.ch/publication/6747", publishedDate: new Date("2002-10-01") },
      { code: "IEC 62279", title: "Railway applications - Software for railway control and protection systems", description: "IEC equivalent of EN 50128 for international railway software certification.", category: "Software", status: "active", version: "2015", pdfUrl: "https://webstore.iec.ch/publication/22745", publishedDate: new Date("2015-06-01") },
      { code: "IEC 62425", title: "Railway applications - Communication, signaling and processing systems - Safety related electronic systems", description: "Safety related electronic systems for signaling.", category: "Signaling", status: "active", version: "2007", pdfUrl: "https://webstore.iec.ch/publication/7007", publishedDate: new Date("2007-06-01") },
      { code: "IEC 62443-4-2", title: "Security for IACS components - Technical security requirements", description: "Cybersecurity requirements for industrial automation and control systems applicable to railway.", category: "Cybersecurity", status: "active", version: "2019", pdfUrl: "https://webstore.iec.ch/publication/33615", publishedDate: new Date("2019-02-01") },
      { code: "CLC/TS 50701", title: "Railway applications - Cybersecurity", description: "Cybersecurity requirements specific to railway applications.", category: "Cybersecurity", status: "active", version: "2021", pdfUrl: "https://standards.globalspec.com/std/clc-ts-50701", publishedDate: new Date("2021-03-01") },
      { code: "EN 50163", title: "Railway applications - Supply voltages of traction systems", description: "Specifies supply voltage ranges for traction systems.", category: "Electrical", status: "active", version: "2004+A1:2007", pdfUrl: "https://standards.globalspec.com/std/en-50163", publishedDate: new Date("2004-01-01") },
      { code: "EN 50206-1", title: "Railway applications - Pantographs - Part 1: Pantographs for main line vehicles", description: "Requirements for pantographs used on main line vehicles.", category: "Rolling Stock", status: "active", version: "2010", pdfUrl: "https://standards.globalspec.com/std/en-50206-1", publishedDate: new Date("2010-11-01") },
      { code: "EN 50215", title: "Railway applications - Testing of rolling stock on completion of construction and before entry into service", description: "Testing procedures for rolling stock before entering service.", category: "Testing", status: "active", version: "1999", pdfUrl: "https://standards.globalspec.com/std/en-50215", publishedDate: new Date("1999-05-01") },
      { code: "EN 50238-1", title: "Railway applications - Compatibility between rolling stock and train detection systems - Part 1: General", description: "General compatibility requirements between rolling stock and train detection systems.", category: "Compatibility", status: "active", version: "2016", pdfUrl: "https://standards.globalspec.com/std/en-50238-1", publishedDate: new Date("2016-07-01") },
      { code: "EN 50325-5", title: "Industrial communication subsystem based on ISO 11898 for controller area networks - Part 5: CANopen Safety", description: "CANopen Safety protocol for safety-related communication in industrial systems including railways.", category: "Communication", status: "active", version: "2010", pdfUrl: "https://standards.globalspec.com/std/en-50325-5", publishedDate: new Date("2010-06-01") },
      { code: "EN 50553", title: "Railway applications - Requirements for running capability in case of fire on board rolling stock", description: "Requirements ensuring trains can keep running during a fire for safe evacuation.", category: "Fire Protection", status: "active", version: "2012", pdfUrl: "https://standards.globalspec.com/std/en-50553", publishedDate: new Date("2012-09-01") },
      { code: "EN 61373", title: "Railway applications - Rolling stock equipment - Shock and vibration tests", description: "Shock and vibration test requirements for railway rolling stock equipment.", category: "Testing", status: "active", version: "2010", pdfUrl: "https://standards.globalspec.com/std/en-61373", publishedDate: new Date("2010-03-01") },
      { code: "EN 62290-1", title: "Railway applications - UGTMS - Part 1: System principles and fundamental concepts", description: "Urban Guided Transport Management and Command/Control Systems fundamentals.", category: "CBTC", status: "active", version: "2006+A1:2012", pdfUrl: "https://standards.globalspec.com/std/en-62290-1", publishedDate: new Date("2006-08-01") },
      { code: "EN 62290-2", title: "Railway applications - UGTMS - Part 2: Functional requirements specification", description: "Functional requirements for Urban Guided Transport Management Systems.", category: "CBTC", status: "active", version: "2014", pdfUrl: "https://standards.globalspec.com/std/en-62290-2", publishedDate: new Date("2014-02-01") },
      { code: "TSI OPE", title: "Technical Specification for Interoperability - Operation and Traffic Management", description: "TSI relating to operation and traffic management in the EU rail system.", category: "Interoperability", status: "active", version: "2023", pdfUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1694", publishedDate: new Date("2023-08-01") },
    ];

    const insertedStandards = await db.insert(standards).values(standardsData).returning();
    console.log(`✅ Inserted ${insertedStandards.length} standards`);

    console.log("📑 Seeding standard clauses...");
    const clausesData = [
      { standardId: insertedStandards[0].id, clauseNumber: "4.3.1", title: "RAMS Policy", content: "The supplier shall establish, document and maintain a RAMS policy.", requirements: { type: "mandatory", evidence: "documented_policy" }, ramsCategory: "Reliability", silRelevance: 2, criticalityLevel: "high" },
      { standardId: insertedStandards[0].id, clauseNumber: "8.2.4.26.1", title: "Hazard Log", content: "The Hazard Log shall include all hazards throughout the system life cycle.", requirements: { type: "mandatory", evidence: "hazard_log" }, ramsCategory: "Safety", silRelevance: 4, criticalityLevel: "critical" },
      { standardId: insertedStandards[4].id, clauseNumber: "4.2", title: "Temperature Classes", content: "Equipment shall be designed to operate within specified temperature ranges.", requirements: { type: "mandatory", evidence: "test_report" }, ramsCategory: "Reliability", silRelevance: 1, criticalityLevel: "medium" },
    ];

    const insertedClauses = await db.insert(standardClauses).values(clausesData).returning();
    console.log(`✅ Inserted ${insertedClauses.length} standard clauses`);

    console.log("🏢 Seeding suppliers...");
    const suppliersData = [
      { name: "Siemens Mobility", country: "Germany", certifications: { iso9001: true, iris: true, en15085: true }, contactInfo: { website: "https://www.mobility.siemens.com", email: "info@siemens.com" }, irsCertified: true, qualityRating: 4.8, lastAudit: new Date("2024-06-15") },
      { name: "Alstom Transport", country: "France", certifications: { iso9001: true, iris: true, en15085: true }, contactInfo: { website: "https://www.alstom.com", email: "contact@alstom.com" }, irsCertified: true, qualityRating: 4.7, lastAudit: new Date("2024-05-20") },
      { name: "Bosch Security Systems", country: "Germany", certifications: { iso9001: true, iris: false, en45545: true }, contactInfo: { website: "https://www.boschsecurity.com", email: "info@boschsecurity.com" }, irsCertified: false, qualityRating: 4.5, lastAudit: new Date("2024-07-10") },
      { name: "Thales Group", country: "France", certifications: { iso9001: true, iris: true, en50129: true }, contactInfo: { website: "https://www.thalesgroup.com", email: "transport@thalesgroup.com" }, irsCertified: true, qualityRating: 4.9, lastAudit: new Date("2024-04-12") },
      { name: "Knorr-Bremse Rail", country: "Germany", certifications: { iso9001: true, iris: true }, contactInfo: { website: "https://www.knorr-bremse.com", email: "rail@knorr-bremse.com" }, irsCertified: true, qualityRating: 4.6, lastAudit: new Date("2024-08-01") },
      { name: "Faiveley Transport", country: "France", certifications: { iso9001: true, iris: true }, contactInfo: { website: "https://www.wabteccorp.com", email: "info@faiveley.com" }, irsCertified: true, qualityRating: 4.4, lastAudit: new Date("2024-03-18") },
      { name: "Schaltbau Group", country: "Germany", certifications: { iso9001: true, iris: false }, contactInfo: { website: "https://www.schaltbau.com", email: "info@schaltbau.com" }, irsCertified: false, qualityRating: 4.2, lastAudit: new Date("2024-09-05") },
      { name: "ABB Rail", country: "Switzerland", certifications: { iso9001: true, iris: true, iec61508: true }, contactInfo: { website: "https://www.abb.com/transportation", email: "rail@abb.com" }, irsCertified: true, qualityRating: 4.7, lastAudit: new Date("2024-06-30") },
    ];

    const insertedSuppliers = await db.insert(suppliers).values(suppliersData).returning();
    console.log(`✅ Inserted ${insertedSuppliers.length} suppliers`);

    console.log("⚙️ Seeding components...");
    const componentsData = [
      {
        name: "Siemens SIBAS 32 Traction Motor Controller",
        model: "SIBAS-32-TMC-V3.2",
        manufacturer: "Siemens Mobility",
        category: "Power & Electrical Systems",
        subcategory: "Traction Control",
        description: "Advanced traction motor control system for metro and light rail with integrated safety functions and energy recovery.",
        technicalSpecs: { voltage: "1500V DC / 25kV AC", power: "2.5 MW", efficiency: "96%", dimensions: "800x600x300mm", weight: "120kg" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 95, unit: "%" }, altitude: { max: 2000, unit: "m" } },
        certificationStatus: "certified", silLevel: 3, ramsScore: 96.5, reliabilityScore: 97.2, availabilityScore: 98.1, maintainabilityScore: 95.3, safetyScore: 96.8, riskLevel: "low"
      },
      {
        name: "Alstom ATLAS 200 ETCS Onboard Unit",
        model: "ATLAS-200-OBU-L3",
        manufacturer: "Alstom Transport",
        category: "Control & Signaling",
        subcategory: "Train Control",
        description: "ETCS Level 2/3 onboard unit with advanced train protection and automatic train operation for high-speed and urban rail.",
        technicalSpecs: { etcsLevel: "2/3", maxSpeed: "350 km/h", processingUnit: "dual_redundant", interfaces: ["DMI", "STM", "Radio"] },
        operatingConditions: { temperature: { min: -25, max: 70, unit: "°C" }, humidity: { max: 95, unit: "%" }, vibration: "EN 61373 Category 1" },
        certificationStatus: "certified", silLevel: 4, ramsScore: 98.1, reliabilityScore: 99.0, availabilityScore: 98.5, maintainabilityScore: 97.2, safetyScore: 98.7, riskLevel: "very low"
      },
      {
        name: "Bosch FPA-5000 Fire Detection Panel",
        model: "FPA-5000-RWY-V2.1",
        manufacturer: "Bosch Security Systems",
        category: "Safety Systems",
        subcategory: "Fire Protection",
        description: "Advanced fire detection and alarm system for metro stations and tunnels with intelligent smoke detection.",
        technicalSpecs: { detectionTypes: ["smoke", "heat", "flame", "gas"], zones: 250, loops: 4, networkProtocol: "TCP/IP" },
        operatingConditions: { temperature: { min: -10, max: 55, unit: "°C" }, humidity: { max: 95, unit: "%" }, ipRating: "IP54" },
        certificationStatus: "certified", silLevel: 2, ramsScore: 89.7, reliabilityScore: 92.3, availabilityScore: 89.5, maintainabilityScore: 85.2, safetyScore: 93.8, riskLevel: "medium"
      },
      {
        name: "Siemens TRAINGUARD MT CBTC System",
        model: "TG-MT-V4.0",
        manufacturer: "Siemens Mobility",
        category: "Control & Signaling",
        subcategory: "CBTC",
        description: "Communication-based train control system providing automatic train supervision, protection, and operation for metro lines.",
        technicalSpecs: { communicationType: "radio", frequency: "2.4 GHz ISM", headway: "90 seconds", ato_grade: "GoA4" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 4, ramsScore: 97.8, reliabilityScore: 98.5, availabilityScore: 99.2, maintainabilityScore: 96.1, safetyScore: 97.4, riskLevel: "low"
      },
      {
        name: "Thales SelTrac CBTC Wayside Controller",
        model: "SELTRAC-WC-G8",
        manufacturer: "Thales Group",
        category: "Control & Signaling",
        subcategory: "CBTC",
        description: "Wayside controller for SelTrac CBTC systems providing zone controller functionality for urban metro operations.",
        technicalSpecs: { radioProtocol: "IEEE 802.11p", redundancy: "hot_standby", processingCapacity: "120 trains/hour" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 4, ramsScore: 98.5, reliabilityScore: 99.1, availabilityScore: 99.4, maintainabilityScore: 97.5, safetyScore: 98.9, riskLevel: "very low"
      },
      {
        name: "Knorr-Bremse EP2002 Brake Control Unit",
        model: "EP2002-BCU-V5.1",
        manufacturer: "Knorr-Bremse Rail",
        category: "Mechanical Systems",
        subcategory: "Braking Systems",
        description: "Electronic brake control unit for metro and regional trains with integrated diagnostics and anti-skid functionality.",
        technicalSpecs: { brakeTypes: ["regenerative", "friction", "magnetic"], maxDeceleration: "1.3 m/s²", interfaces: ["TCMS", "WTB"] },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 95, unit: "%" }, ipRating: "IP65" },
        certificationStatus: "certified", silLevel: 3, ramsScore: 94.2, reliabilityScore: 95.8, availabilityScore: 96.1, maintainabilityScore: 92.5, safetyScore: 94.7, riskLevel: "low"
      },
      {
        name: "ABB BORDLINE CC750 Auxiliary Converter",
        model: "BORDLINE-CC750-V2",
        manufacturer: "ABB Rail",
        category: "Power & Electrical Systems",
        subcategory: "Auxiliary Power",
        description: "Static auxiliary converter for rolling stock providing 400V AC and 110V DC supplies from 750V DC or 1500V DC catenary.",
        technicalSpecs: { inputVoltage: "750V / 1500V DC", outputPower: "120 kVA", efficiency: "94%", weight: "280kg" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, altitude: { max: 3000, unit: "m" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 91.3, reliabilityScore: 93.5, availabilityScore: 92.8, maintainabilityScore: 89.7, safetyScore: 90.4, riskLevel: "medium"
      },
      {
        name: "Siemens SIRIUS 3RV Circuit Breaker",
        model: "3RV2041-4JA10",
        manufacturer: "Siemens Mobility",
        category: "Power & Electrical Systems",
        subcategory: "Protection Devices",
        description: "Motor protection circuit breaker for railway applications rated for harsh environmental conditions.",
        technicalSpecs: { ratedCurrent: "30A", breakingCapacity: "100kA", protection: "IP20", standard: "IEC 60947-2" },
        operatingConditions: { temperature: { min: -25, max: 55, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 1, ramsScore: 87.5, reliabilityScore: 90.2, availabilityScore: 88.7, maintainabilityScore: 85.0, safetyScore: 86.8, riskLevel: "medium"
      },
      {
        name: "Alstom ONIX 800 Traction Inverter",
        model: "ONIX-800-TI-V3",
        manufacturer: "Alstom Transport",
        category: "Power & Electrical Systems",
        subcategory: "Traction Inverters",
        description: "IGBT-based traction inverter for electric multiple units with regenerative braking capability.",
        technicalSpecs: { power: "800 kW", voltage: "1500V DC", frequency: "0-300Hz", coolingType: "water_cooled" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 93.6, reliabilityScore: 95.1, availabilityScore: 94.3, maintainabilityScore: 91.8, safetyScore: 93.2, riskLevel: "low"
      },
      {
        name: "Faiveley Transport Pantograph WBL 88",
        model: "WBL-88-1800",
        manufacturer: "Faiveley Transport",
        category: "Current Collection Systems",
        subcategory: "Pantographs",
        description: "Single-arm pantograph for high-speed rail with automatic adjustment and ice detection system.",
        technicalSpecs: { workingHeight: "1800mm", contactForce: "60-90N", maxSpeed: "380 km/h", material: "carbon_strip" },
        operatingConditions: { temperature: { min: -40, max: 60, unit: "°C" }, iceProtection: true },
        certificationStatus: "certified", silLevel: 1, ramsScore: 88.9, reliabilityScore: 91.4, availabilityScore: 90.2, maintainabilityScore: 85.7, safetyScore: 88.2, riskLevel: "medium"
      },
      {
        name: "Thales VACMA Vigilance System",
        model: "VACMA-SIL4-V2",
        manufacturer: "Thales Group",
        category: "Safety Systems",
        subcategory: "Vigilance & Deadman",
        description: "SIL 4 vigilance control and management system ensuring driver alertness throughout train operations.",
        technicalSpecs: { silLevel: 4, responseTime: "< 2.5s", interface: "CAN", displayType: "LED" },
        operatingConditions: { temperature: { min: -25, max: 70, unit: "°C" }, vibration: "EN 61373 Category 1B" },
        certificationStatus: "certified", silLevel: 4, ramsScore: 97.2, reliabilityScore: 98.1, availabilityScore: 97.8, maintainabilityScore: 95.9, safetyScore: 99.1, riskLevel: "very low"
      },
      {
        name: "Schaltbau C146 Door Control Unit",
        model: "C146-DCU-V4.2",
        manufacturer: "Schaltbau Group",
        category: "Passenger Systems",
        subcategory: "Door Systems",
        description: "Electronic door control unit for metro and regional trains supporting plug and sliding door configurations.",
        technicalSpecs: { doorTypes: ["sliding", "plug", "bi-parting"], maxDoors: 8, communicationBus: "MVB", obstacleDetection: "laser" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 90.8, reliabilityScore: 92.5, availabilityScore: 91.3, maintainabilityScore: 89.2, safetyScore: 90.5, riskLevel: "medium"
      },
      {
        name: "Siemens SICAM A8000 RTU",
        model: "SICAM-A8000-CP-8050",
        manufacturer: "Siemens Mobility",
        category: "Control & Signaling",
        subcategory: "Remote Terminal Units",
        description: "Remote terminal unit for railway substation and infrastructure monitoring with IEC 61850 support.",
        technicalSpecs: { protocol: "IEC 61850", ios: 512, redundancy: "dual_port_ethernet", enclosure: "19inch_rack" },
        operatingConditions: { temperature: { min: -25, max: 55, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 92.1, reliabilityScore: 94.3, availabilityScore: 93.7, maintainabilityScore: 90.2, safetyScore: 91.5, riskLevel: "low"
      },
      {
        name: "ABB ACS880 Railway Drive",
        model: "ACS880-07-1100A-7",
        manufacturer: "ABB Rail",
        category: "Power & Electrical Systems",
        subcategory: "Variable Speed Drives",
        description: "All-compatible drive for railway applications supporting RDFI, ABB industrial drives functionalities.",
        technicalSpecs: { power: "630 kW", voltage: "690V", efficiency: "97%", coolingType: "forced_air" },
        operatingConditions: { temperature: { min: -15, max: 40, unit: "°C" }, altitude: { max: 4000, unit: "m" } },
        certificationStatus: "pending", silLevel: 1, ramsScore: 85.4, reliabilityScore: 87.2, availabilityScore: 86.5, maintainabilityScore: 83.8, safetyScore: 84.9, riskLevel: "medium"
      },
      {
        name: "Alstom PRIMA II Electric Locomotive",
        model: "PRIMA-II-6MW-AC",
        manufacturer: "Alstom Transport",
        category: "Rolling Stock",
        subcategory: "Locomotives",
        description: "6MW AC electric locomotive for mainline freight and passenger service with regenerative braking.",
        technicalSpecs: { power: "6 MW", maxSpeed: "200 km/h", axleLoad: "22.5t", tractionForce: "300kN" },
        operatingConditions: { temperature: { min: -40, max: 50, unit: "°C" }, altitude: { max: 2500, unit: "m" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 92.7, reliabilityScore: 94.5, availabilityScore: 93.8, maintainabilityScore: 91.3, safetyScore: 91.9, riskLevel: "low"
      },
      {
        name: "Knorr-Bremse ESRA 2 Braking System",
        model: "ESRA-2-HS-V3",
        manufacturer: "Knorr-Bremse Rail",
        category: "Mechanical Systems",
        subcategory: "Braking Systems",
        description: "Electronic Slip-Slide Protection and Rail Adhesion system for high-speed trains up to 350 km/h.",
        technicalSpecs: { maxSpeed: "350 km/h", axles: 16, sensorType: "rotary_encoder", brakeTypes: ["pneumatic", "regenerative"] },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 98, unit: "%" } },
        certificationStatus: "certified", silLevel: 3, ramsScore: 95.3, reliabilityScore: 96.8, availabilityScore: 95.9, maintainabilityScore: 93.7, safetyScore: 96.1, riskLevel: "low"
      },
      {
        name: "Siemens SIRIUS 3TK2845 Safety Relay",
        model: "3TK2845-1CB30",
        manufacturer: "Siemens Mobility",
        category: "Safety Systems",
        subcategory: "Safety Relays",
        description: "Safety relay module for SIL 3 / PLe emergency stop and safety door monitoring applications.",
        technicalSpecs: { silLevel: 3, supplyVoltage: "24V DC", responseTime: "< 20ms", contacts: "3NO+1NC" },
        operatingConditions: { temperature: { min: -25, max: 60, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 3, ramsScore: 96.8, reliabilityScore: 97.5, availabilityScore: 97.1, maintainabilityScore: 95.8, safetyScore: 98.2, riskLevel: "very low"
      },
      {
        name: "Thales SELTRAC S40 ATC System",
        model: "SELTRAC-S40-ATC",
        manufacturer: "Thales Group",
        category: "Control & Signaling",
        subcategory: "Automatic Train Control",
        description: "Automatic train control system for fully driverless metro operations (GoA4) with integrated ATO, ATP, and ATS.",
        technicalSpecs: { goaLevel: 4, headway: "75 seconds", communicationType: "radio", trainCapacity: 1000 },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 4, ramsScore: 98.9, reliabilityScore: 99.3, availabilityScore: 99.5, maintainabilityScore: 98.2, safetyScore: 99.4, riskLevel: "very low"
      },
      {
        name: "Faiveley HVAC Climate Control Unit",
        model: "FT-CCU-60-R290",
        manufacturer: "Faiveley Transport",
        category: "Passenger Systems",
        subcategory: "HVAC Systems",
        description: "Roof-mounted HVAC unit for metro cars using R290 natural refrigerant with EN 50155 compliance.",
        technicalSpecs: { coolingCapacity: "30 kW", heatingCapacity: "24 kW", refrigerant: "R290", airflow: "8000 m³/h" },
        operatingConditions: { temperature: { min: -40, max: 55, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 1, ramsScore: 86.3, reliabilityScore: 88.9, availabilityScore: 87.4, maintainabilityScore: 84.1, safetyScore: 85.6, riskLevel: "medium"
      },
      {
        name: "Siemens VESYS Railway Wiring System",
        model: "VESYS-8.0-RWY",
        manufacturer: "Siemens Mobility",
        category: "Communications & Electronics",
        subcategory: "Wiring Systems",
        description: "Electrical wiring design and manufacturing tool optimized for railway vehicle applications with LCM integration.",
        technicalSpecs: { cableTypes: ["PVC", "XLPE", "Silicone"], voltage: "Up to 3kV", fireClass: "EN 45545 HL3" },
        operatingConditions: { temperature: { min: -40, max: 90, unit: "°C" }, flameRetardant: true },
        certificationStatus: "certified", silLevel: 1, ramsScore: 84.7, reliabilityScore: 87.3, availabilityScore: 85.9, maintainabilityScore: 82.5, safetyScore: 83.8, riskLevel: "medium"
      },
      {
        name: "ABB BORDLINE ESS Energy Storage",
        model: "BORDLINE-ESS-V1.2",
        manufacturer: "ABB Rail",
        category: "Power & Electrical Systems",
        subcategory: "Energy Storage",
        description: "Lithium-ion energy storage system for catenary-free operation and energy peak shaving in metro applications.",
        technicalSpecs: { capacity: "100 kWh", peakPower: "500 kW", cellType: "LFP", cycleLife: 10000 },
        operatingConditions: { temperature: { min: -20, max: 45, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 91.5, reliabilityScore: 93.2, availabilityScore: 92.7, maintainabilityScore: 89.5, safetyScore: 91.0, riskLevel: "medium"
      },
      {
        name: "Knorr-Bremse FLEXtra Bogies",
        model: "FLEXtra-B5000",
        manufacturer: "Knorr-Bremse Rail",
        category: "Mechanical Systems",
        subcategory: "Bogies & Wheelsets",
        description: "Modular bogie design for regional and metro trains with active tilting and condition monitoring integration.",
        technicalSpecs: { maxSpeed: "200 km/h", axleLoad: "20t", gauges: ["1435mm", "1668mm"], tiltingAngle: "8°" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 1, ramsScore: 89.4, reliabilityScore: 91.7, availabilityScore: 90.8, maintainabilityScore: 87.3, safetyScore: 88.5, riskLevel: "medium"
      },
      {
        name: "Alstom ONIS Onboard Information System",
        model: "ONIS-HD-V5.0",
        manufacturer: "Alstom Transport",
        category: "Passenger Systems",
        subcategory: "Passenger Information",
        description: "Passenger information system with HD displays, real-time GTFS integration, and multi-language support.",
        technicalSpecs: { displaySize: "21.5 inch", resolution: "1920x1080", communicationProtocol: "Ethernet", languages: 32 },
        operatingConditions: { temperature: { min: -25, max: 60, unit: "°C" }, humidity: { max: 95, unit: "%" } },
        certificationStatus: "certified", silLevel: 0, ramsScore: 82.1, reliabilityScore: 85.4, availabilityScore: 83.7, maintainabilityScore: 80.2, safetyScore: 81.5, riskLevel: "low"
      },
      {
        name: "Thales Rail Communication Gateway",
        model: "RCG-4G-LTE-TETRA",
        manufacturer: "Thales Group",
        category: "Communications & Electronics",
        subcategory: "Communication Systems",
        description: "Multi-mode communication gateway supporting GSM-R, LTE, TETRA, and WiFi for comprehensive train-ground communication.",
        technicalSpecs: { protocols: ["GSM-R", "LTE", "TETRA", "WiFi"], antennas: 6, redundancy: "dual_modem", encryption: "AES-256" },
        operatingConditions: { temperature: { min: -40, max: 70, unit: "°C" }, humidity: { max: 100, unit: "%" } },
        certificationStatus: "certified", silLevel: 2, ramsScore: 93.4, reliabilityScore: 95.0, availabilityScore: 94.6, maintainabilityScore: 91.7, safetyScore: 92.8, riskLevel: "low"
      },
    ];

    const insertedComponents = await db.insert(components).values(componentsData).returning();
    console.log(`✅ Inserted ${insertedComponents.length} components`);

    console.log("🔗 Seeding component-standard relationships...");
    const componentStandardsData = [
      // Siemens Traction Controller
      { componentId: insertedComponents[0].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 96.5, certificationDate: new Date("2024-01-15"), verifiedBy: "TÜV SÜD Rail" },
      { componentId: insertedComponents[0].id, standardId: insertedStandards[4].id, complianceStatus: "compliant", complianceScore: 98.2, certificationDate: new Date("2024-02-10"), verifiedBy: "TÜV SÜD Rail" },
      { componentId: insertedComponents[0].id, standardId: insertedStandards[6].id, complianceStatus: "compliant", complianceScore: 94.8, certificationDate: new Date("2024-03-05"), verifiedBy: "DEKRA Rail" },
      // Alstom ETCS Unit
      { componentId: insertedComponents[1].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 98.1, certificationDate: new Date("2024-01-20"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[1].id, standardId: insertedStandards[12].id, complianceStatus: "compliant", complianceScore: 97.5, certificationDate: new Date("2024-02-25"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[1].id, standardId: insertedStandards[3].id, complianceStatus: "compliant", complianceScore: 98.8, certificationDate: new Date("2024-03-15"), verifiedBy: "CERTIFER" },
      // Bosch Fire Detection
      { componentId: insertedComponents[2].id, standardId: insertedStandards[13].id, complianceStatus: "compliant", complianceScore: 93.2, certificationDate: new Date("2024-04-10"), verifiedBy: "EXOVA BM TRADA" },
      { componentId: insertedComponents[2].id, standardId: insertedStandards[0].id, complianceStatus: "partial", complianceScore: 87.5, certificationDate: new Date("2024-05-01"), verifiedBy: "TÜV NORD" },
      // Siemens CBTC
      { componentId: insertedComponents[3].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 97.8, certificationDate: new Date("2024-01-10"), verifiedBy: "TÜV SÜD Rail" },
      { componentId: insertedComponents[3].id, standardId: insertedStandards[27].id, complianceStatus: "compliant", complianceScore: 96.5, certificationDate: new Date("2024-02-01"), verifiedBy: "TÜV SÜD Rail" },
      { componentId: insertedComponents[3].id, standardId: insertedStandards[12].id, complianceStatus: "compliant", complianceScore: 98.0, certificationDate: new Date("2024-03-01"), verifiedBy: "TÜV SÜD Rail" },
      // Thales CBTC Wayside
      { componentId: insertedComponents[4].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 98.5, certificationDate: new Date("2024-01-25"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[4].id, standardId: insertedStandards[3].id, complianceStatus: "compliant", complianceScore: 99.0, certificationDate: new Date("2024-02-15"), verifiedBy: "CERTIFER" },
      // Knorr-Bremse Brake
      { componentId: insertedComponents[5].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 94.2, certificationDate: new Date("2024-03-20"), verifiedBy: "TÜV NORD" },
      { componentId: insertedComponents[5].id, standardId: insertedStandards[4].id, complianceStatus: "compliant", complianceScore: 95.8, certificationDate: new Date("2024-04-05"), verifiedBy: "TÜV NORD" },
      // Thales Vigilance SIL4
      { componentId: insertedComponents[10].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 97.2, certificationDate: new Date("2024-01-30"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[10].id, standardId: insertedStandards[3].id, complianceStatus: "compliant", complianceScore: 98.5, certificationDate: new Date("2024-02-20"), verifiedBy: "CERTIFER" },
      // Thales ATC
      { componentId: insertedComponents[17].id, standardId: insertedStandards[0].id, complianceStatus: "compliant", complianceScore: 98.9, certificationDate: new Date("2024-01-08"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[17].id, standardId: insertedStandards[3].id, complianceStatus: "compliant", complianceScore: 99.1, certificationDate: new Date("2024-02-08"), verifiedBy: "CERTIFER" },
      { componentId: insertedComponents[17].id, standardId: insertedStandards[27].id, complianceStatus: "compliant", complianceScore: 98.7, certificationDate: new Date("2024-03-08"), verifiedBy: "CERTIFER" },
    ];

    const insertedComponentStandards = await db.insert(componentStandards).values(componentStandardsData).returning();
    console.log(`✅ Inserted ${insertedComponentStandards.length} component-standard relationships`);

    console.log("🤝 Seeding component-supplier relationships...");
    const componentSuppliersData = [
      { componentId: insertedComponents[0].id, supplierId: insertedSuppliers[0].id, supplierPartNumber: "SIBAS32-TMC-001", leadTime: 16, priceRange: "€50,000-70,000", availability: "available" },
      { componentId: insertedComponents[1].id, supplierId: insertedSuppliers[1].id, supplierPartNumber: "ATLAS200-OBU-001", leadTime: 20, priceRange: "€80,000-120,000", availability: "available" },
      { componentId: insertedComponents[2].id, supplierId: insertedSuppliers[2].id, supplierPartNumber: "FPA5000-RWY-001", leadTime: 12, priceRange: "€15,000-25,000", availability: "available" },
      { componentId: insertedComponents[3].id, supplierId: insertedSuppliers[0].id, supplierPartNumber: "TGMT-V40-001", leadTime: 24, priceRange: "€500,000-800,000", availability: "available" },
      { componentId: insertedComponents[4].id, supplierId: insertedSuppliers[3].id, supplierPartNumber: "STR-WC-G8-001", leadTime: 18, priceRange: "€200,000-350,000", availability: "available" },
      { componentId: insertedComponents[5].id, supplierId: insertedSuppliers[4].id, supplierPartNumber: "EP2002-BCU-001", leadTime: 14, priceRange: "€25,000-40,000", availability: "available" },
      { componentId: insertedComponents[6].id, supplierId: insertedSuppliers[7].id, supplierPartNumber: "BCC750-V2-001", leadTime: 16, priceRange: "€35,000-55,000", availability: "available" },
      { componentId: insertedComponents[8].id, supplierId: insertedSuppliers[1].id, supplierPartNumber: "ONIX800-TI-001", leadTime: 20, priceRange: "€45,000-65,000", availability: "available" },
      { componentId: insertedComponents[9].id, supplierId: insertedSuppliers[5].id, supplierPartNumber: "WBL88-1800-001", leadTime: 10, priceRange: "€8,000-15,000", availability: "available" },
      { componentId: insertedComponents[10].id, supplierId: insertedSuppliers[3].id, supplierPartNumber: "VACMA-SIL4-001", leadTime: 12, priceRange: "€12,000-18,000", availability: "available" },
      { componentId: insertedComponents[11].id, supplierId: insertedSuppliers[6].id, supplierPartNumber: "C146-DCU-001", leadTime: 8, priceRange: "€5,000-10,000", availability: "available" },
      { componentId: insertedComponents[17].id, supplierId: insertedSuppliers[3].id, supplierPartNumber: "STR-S40-ATC-001", leadTime: 30, priceRange: "€1,000,000-2,000,000", availability: "limited" },
    ];

    const insertedComponentSuppliers = await db.insert(componentSuppliers).values(componentSuppliersData).returning();
    console.log(`✅ Inserted ${insertedComponentSuppliers.length} component-supplier relationships`);

    console.log("🎉 Database seed completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

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
