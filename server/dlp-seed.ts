import { db } from "./db";
import { dlpVendors, dlpSystems, dlpItems, dlpTools, dlpTransactions, dlpAlerts } from "@shared/schema";

export async function seedDlpData() {
  console.log("Seeding DLP data...");

  // ─── VENDORS ──────────────────────────────────────────────────────────────
  await db.delete(dlpVendors);
  await db.insert(dlpVendors).values([
    { vendorId: "VEND-001", vendorName: "M/s MELCO", vendorCode: "MELCO-001", contactPerson: "Mr. Rajesh Kumar", email: "rajesh@melco.co.in", phone: "+91-22-1234-5678", country: "India", paymentTerms: "Net 30", deliveryDays: 14, qualityRating: "Excellent" },
    { vendorId: "VEND-002", vendorName: "KBI Brake", vendorCode: "KBI-001", contactPerson: "Mr. Vikram Singh", email: "vikram@kbibrake.com", phone: "+91-22-2345-6789", country: "India", paymentTerms: "Net 30", deliveryDays: 10, qualityRating: "Excellent" },
    { vendorId: "VEND-003", vendorName: "Tecknoware", vendorCode: "TECK-001", contactPerson: "Mr. Ashok Patel", email: "ashok@tecknoware.com", phone: "+91-80-3456-7890", country: "India", paymentTerms: "Net 45", deliveryDays: 21, qualityRating: "Good" },
    { vendorId: "VEND-004", vendorName: "Stemmann-Technic", vendorCode: "STEM-001", contactPerson: "Mr. Heinrich Vogel", email: "support@stemmann.com", phone: "+49-89-4567-8901", country: "Germany", paymentTerms: "Net 60", deliveryDays: 30, qualityRating: "Excellent" },
    { vendorId: "VEND-005", vendorName: "Mafelec", vendorCode: "MAFE-001", contactPerson: "Mr. Jean Pierre", email: "jp@mafelec.com", phone: "+33-1-5678-9012", country: "France", paymentTerms: "Net 30", deliveryDays: 21, qualityRating: "Good" },
    { vendorId: "VEND-006", vendorName: "Faiveley", vendorCode: "FAIV-001", contactPerson: "Mr. Michel Dupont", email: "sales@faiveley.co.in", phone: "+91-22-6789-0123", country: "India", paymentTerms: "Net 30", deliveryDays: 14, qualityRating: "Excellent" },
    { vendorId: "VEND-007", vendorName: "Televic", vendorCode: "TELE-001", contactPerson: "Mr. Tom Richardson", email: "contact@televic.com", phone: "+33-2-7890-1234", country: "France", paymentTerms: "Net 45", deliveryDays: 30, qualityRating: "Good" },
    { vendorId: "VEND-008", vendorName: "SAFT", vendorCode: "SAFT-001", contactPerson: "Mr. Patrick Blanc", email: "sales@saft.fr", phone: "+33-1-8901-2345", country: "France", paymentTerms: "Net 60", deliveryDays: 45, qualityRating: "Excellent" },
    { vendorId: "VEND-009", vendorName: "SEMA", vendorCode: "SEMA-001", contactPerson: "Mr. Klaus Mueller", email: "info@sema.com", phone: "+49-89-9012-3456", country: "Germany", paymentTerms: "Net 30", deliveryDays: 21, qualityRating: "Good" },
    { vendorId: "VEND-010", vendorName: "River Engineering", vendorCode: "RIVE-001", contactPerson: "Mr. Ravi Shankar", email: "contact@rivereng.co.in", phone: "+91-22-0123-4567", country: "India", paymentTerms: "Net 30", deliveryDays: 7, qualityRating: "Excellent" },
  ]);

  // ─── SYSTEMS ──────────────────────────────────────────────────────────────
  await db.delete(dlpSystems);
  await db.insert(dlpSystems).values([
    { systemId: "SYS-001", systemName: "Traction Motor & Inverter", primaryVendor: "M/s MELCO", totalItems: 2, totalReceived: 8, totalConsumed: 2, totalAvailable: 6, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-002", systemName: "Brake System", primaryVendor: "KBI Brake", totalItems: 4, totalReceived: 52, totalConsumed: 29, totalAvailable: 23, criticalStatus: true, maintenanceFrequency: "High" },
    { systemId: "SYS-003", systemName: "APS (Auxiliary Power Supply)", primaryVendor: "M/s MELCO", totalItems: 2, totalReceived: 5, totalConsumed: 1, totalAvailable: 4, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-004", systemName: "TMS (Train Management System)", primaryVendor: "M/s MELCO", totalItems: 2, totalReceived: 3, totalConsumed: 2, totalAvailable: 1, criticalStatus: true, maintenanceFrequency: "Medium" },
    { systemId: "SYS-005", systemName: "Lighting System", primaryVendor: "Tecknoware", totalItems: 2, totalReceived: 18, totalConsumed: 6, totalAvailable: 12, criticalStatus: false, maintenanceFrequency: "Medium" },
    { systemId: "SYS-006", systemName: "Current Collector", primaryVendor: "Stemmann-Technic", totalItems: 2, totalReceived: 13, totalConsumed: 4, totalAvailable: 9, criticalStatus: false, maintenanceFrequency: "High" },
    { systemId: "SYS-007", systemName: "VAC System", primaryVendor: "Faiveley", totalItems: 2, totalReceived: 5, totalConsumed: 1, totalAvailable: 4, criticalStatus: false, maintenanceFrequency: "High" },
    { systemId: "SYS-008", systemName: "PAPIS & CCTV System", primaryVendor: "Televic", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-009", systemName: "Saloon Door System", primaryVendor: "KBI", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "High" },
    { systemId: "SYS-010", systemName: "Battery System", primaryVendor: "SAFT", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-011", systemName: "Coupler System", primaryVendor: "Faiveley", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Medium" },
    { systemId: "SYS-012", systemName: "Fire Detection System", primaryVendor: "SEMA", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-013", systemName: "Junction Boxes & Terminal Boards", primaryVendor: "River Engineering", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Low" },
    { systemId: "SYS-014", systemName: "Vehicle Control & Connectors", primaryVendor: "River Engineering", totalItems: 2, totalReceived: 0, totalConsumed: 0, totalAvailable: 0, criticalStatus: false, maintenanceFrequency: "Low" },
  ]);

  // ─── ITEMS ─────────────────────────────────────────────────────────────────
  await db.delete(dlpItems);
  await db.insert(dlpItems).values([
    { itemId: "DLP-001", partNumber: "II91919/02105", description: "Safety Valve - Brake System", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Piece", receivedQty: 15, consumedQty: 8, availableQty: 7, recommendedQty: 10, reorderLevel: 5, status: "ACTIVE", criticalFlag: true, notes: "Critical safety component" },
    { itemId: "DLP-002", partNumber: "II91919/02106", description: "Ballcock Assembly - Brake", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Piece", receivedQty: 12, consumedQty: 5, availableQty: 7, recommendedQty: 8, reorderLevel: 4, status: "ACTIVE", notes: "Standard wear item" },
    { itemId: "DLP-003", partNumber: "AM5007", description: "Traction Motor Unit - 300KW", category: "Traction", systemType: "Traction Motor & Inverter", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 4, consumedQty: 1, availableQty: 3, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Rarely replaced" },
    { itemId: "DLP-004", partNumber: "AM5008", description: "Inverter Module - Gate Circuit", category: "Traction", systemType: "Traction Motor & Inverter", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 4, consumedQty: 1, availableQty: 3, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Planned replacement" },
    { itemId: "DLP-005", partNumber: "KS1001", description: "Brake Cylinder - Type A", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Piece", receivedQty: 20, consumedQty: 12, availableQty: 8, recommendedQty: 15, reorderLevel: 8, status: "ACTIVE", notes: "Routine maintenance" },
    { itemId: "DLP-006", partNumber: "KS1002", description: "Brake Control Board - Main", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Unit", receivedQty: 8, consumedQty: 3, availableQty: 5, recommendedQty: 5, reorderLevel: 3, status: "ACTIVE", notes: "Standard replacement" },
    { itemId: "DLP-007", partNumber: "TR1001", description: "Rail Collector - Carbon", category: "Current_Collector", systemType: "Current Collector", vendorName: "Stemmann-Technic", unitOfMeasure: "Piece", receivedQty: 10, consumedQty: 4, availableQty: 6, recommendedQty: 8, reorderLevel: 4, status: "ACTIVE", criticalFlag: true, notes: "Critical for collection" },
    { itemId: "DLP-008", partNumber: "TR1002", description: "Collector Shoe Support - Steel", category: "Current_Collector", systemType: "Current Collector", vendorName: "Stemmann-Technic", unitOfMeasure: "Set", receivedQty: 5, consumedQty: 2, availableQty: 3, recommendedQty: 4, reorderLevel: 2, status: "ACTIVE", notes: "Routine wear" },
    { itemId: "DLP-009", partNumber: "BRK001", description: "Emergency Ballcock", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Piece", receivedQty: 18, consumedQty: 10, availableQty: 8, recommendedQty: 12, reorderLevel: 6, status: "ACTIVE", notes: "Emergency backup" },
    { itemId: "DLP-010", partNumber: "BRK002", description: "Brake Valve - Pilot", category: "Brake", systemType: "Brake System", vendorName: "KBI Brake", unitOfMeasure: "Piece", receivedQty: 14, consumedQty: 6, availableQty: 8, recommendedQty: 10, reorderLevel: 5, status: "ACTIVE", notes: "Maintenance item" },
    { itemId: "DLP-011", partNumber: "APS001", description: "APS Battery Charger Unit", category: "APS", systemType: "APS", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 2, consumedQty: 0, availableQty: 2, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Charging unit" },
    { itemId: "DLP-012", partNumber: "APS002", description: "APS Power Module", category: "APS", systemType: "APS", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 3, consumedQty: 1, availableQty: 2, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Power supply" },
    { itemId: "DLP-013", partNumber: "TMS001", description: "TMS Central Control Unit", category: "TMS", systemType: "TMS", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 1, consumedQty: 0, availableQty: 1, recommendedQty: 1, reorderLevel: 1, status: "CRITICAL", criticalFlag: true, notes: "Central processing" },
    { itemId: "DLP-014", partNumber: "TMS002", description: "TMS Communication Node", category: "TMS", systemType: "TMS", vendorName: "M/s MELCO", unitOfMeasure: "Unit", receivedQty: 2, consumedQty: 1, availableQty: 1, recommendedQty: 1, reorderLevel: 1, status: "ACTIVE", notes: "System communication" },
    { itemId: "DLP-015", partNumber: "LIT001", description: "Saloon Light Fixture - LED", category: "Lighting", systemType: "Lighting", vendorName: "Tecknoware", unitOfMeasure: "Unit", receivedQty: 6, consumedQty: 2, availableQty: 4, recommendedQty: 5, reorderLevel: 3, status: "ACTIVE", notes: "Energy efficient LED" },
    { itemId: "DLP-016", partNumber: "LIT002", description: "Light Diffuser Panel", category: "Lighting", systemType: "Lighting", vendorName: "Tecknoware", unitOfMeasure: "Piece", receivedQty: 12, consumedQty: 4, availableQty: 8, recommendedQty: 10, reorderLevel: 5, status: "ACTIVE", notes: "Light diffusion" },
    { itemId: "DLP-017", partNumber: "CC001", description: "Current Collector Rail - Pantograph", category: "Current_Collector", systemType: "Current Collector", vendorName: "Stemmann-Technic", unitOfMeasure: "Piece", receivedQty: 8, consumedQty: 3, availableQty: 5, recommendedQty: 6, reorderLevel: 3, status: "ACTIVE", notes: "Power collection" },
    { itemId: "DLP-018", partNumber: "CC002", description: "Insulator Set - Ceramic", category: "Current_Collector", systemType: "Current Collector", vendorName: "Stemmann-Technic", unitOfMeasure: "Set", receivedQty: 4, consumedQty: 1, availableQty: 3, recommendedQty: 3, reorderLevel: 2, status: "ACTIVE", notes: "Electrical insulation" },
    { itemId: "DLP-019", partNumber: "VAC001", description: "VAC Compressor Unit", category: "VAC", systemType: "VAC System", vendorName: "Faiveley", unitOfMeasure: "Unit", receivedQty: 2, consumedQty: 0, availableQty: 2, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Compression system" },
    { itemId: "DLP-020", partNumber: "VAC002", description: "VAC Condenser Assembly", category: "VAC", systemType: "VAC System", vendorName: "Faiveley", unitOfMeasure: "Unit", receivedQty: 3, consumedQty: 1, availableQty: 2, recommendedQty: 2, reorderLevel: 1, status: "ACTIVE", notes: "Heat rejection system" },
  ]);

  // ─── SAMPLE TRANSACTIONS ──────────────────────────────────────────────────
  await db.delete(dlpTransactions);
  await db.insert(dlpTransactions).values([
    { transactionType: "RECEIPT", itemName: "Safety Valve - Brake System", partNumber: "II91919/02105", quantity: 15, toLocation: "Central Store", referenceType: "PO", referenceId: "PO-2026-001", remarks: "Initial stock receipt", initiatedBy: "Admin" },
    { transactionType: "ISSUE", itemName: "Safety Valve - Brake System", partNumber: "II91919/02105", quantity: 8, fromLocation: "Central Store", toLocation: "Maintenance Area", referenceType: "JOB_CARD", referenceId: "JC-2026-042", remarks: "Brake maintenance TS#05", initiatedBy: "Admin" },
    { transactionType: "RECEIPT", itemName: "Traction Motor Unit - 300KW", partNumber: "AM5007", quantity: 4, toLocation: "Central Store", referenceType: "PO", referenceId: "PO-2026-002", remarks: "Planned procurement", initiatedBy: "Admin" },
    { transactionType: "ISSUE", itemName: "Traction Motor Unit - 300KW", partNumber: "AM5007", quantity: 1, fromLocation: "Central Store", toLocation: "Workshop", referenceType: "NCR", referenceId: "NCR-2026-018", remarks: "Motor replacement TS#12", initiatedBy: "Admin" },
    { transactionType: "RECEIPT", itemName: "Brake Cylinder - Type A", partNumber: "KS1001", quantity: 20, toLocation: "Central Store", referenceType: "PO", referenceId: "PO-2026-003", remarks: "Routine stock replenishment", initiatedBy: "Admin" },
    { transactionType: "ISSUE", itemName: "Brake Cylinder - Type A", partNumber: "KS1001", quantity: 12, fromLocation: "Central Store", toLocation: "Maintenance Area", referenceType: "JOB_CARD", referenceId: "JC-2026-051", remarks: "Periodic brake overhaul", initiatedBy: "Admin" },
    { transactionType: "RETURN", itemName: "Rail Collector - Carbon", partNumber: "TR1001", quantity: 2, fromLocation: "Maintenance Area", toLocation: "Central Store", referenceType: "OTHER", referenceId: "RTN-2026-007", remarks: "Unused stock returned", initiatedBy: "Admin" },
    { transactionType: "ISSUE", itemName: "TMS Central Control Unit", partNumber: "TMS001", quantity: 0, fromLocation: "Central Store", toLocation: "Maintenance Area", referenceType: "NCR", referenceId: "NCR-2026-020", remarks: "Reserved for emergency use", initiatedBy: "Admin" },
  ]);

  // ─── ALERTS ───────────────────────────────────────────────────────────────
  await db.delete(dlpAlerts);
  await db.insert(dlpAlerts).values([
    { alertType: "CRITICAL", itemName: "TMS Central Control Unit", message: "Critical item at minimum stock level (1 unit). Recommend immediate procurement.", severity: "critical" },
    { alertType: "LOW_STOCK", itemName: "TMS Communication Node", message: "Stock at reorder level. Available: 1, Reorder Level: 1.", severity: "high" },
    { alertType: "LOW_STOCK", itemName: "Brake Cylinder - Type A", message: "Available qty (8) approaching reorder level (8). Consider raising PO.", severity: "medium" },
    { alertType: "LOW_STOCK", itemName: "Collector Shoe Support - Steel", message: "Available qty (3) at reorder threshold. Long lead time from Germany.", severity: "high" },
  ]);

  // ─── TOOLS (first 50 from CSV) ─────────────────────────────────────────────
  await db.delete(dlpTools);
  await db.insert(dlpTools).values([
    { toolId: "TL-001", toolName: "Digital Multimeter", toolNumber: "TL-001", category: "Electrical", location: "Tool Room", condition: "Good", calibrationDue: "2026-06-30", remarks: "Fluke 87V", qty: 1, consumable: false },
    { toolId: "TL-002", toolName: "Torque Wrench (50-300 Nm)", toolNumber: "TL-002", category: "Mechanical", location: "Tool Room", condition: "Good", calibrationDue: "2026-09-30", qty: 1, consumable: false },
    { toolId: "TL-003", toolName: "Oscilloscope (100 MHz)", toolNumber: "TL-003", category: "Electrical", location: "Electronics Lab", condition: "Good", calibrationDue: "2026-12-31", remarks: "Rigol DS1102E", qty: 1, consumable: false },
    { toolId: "TL-004", toolName: "Insulation Resistance Tester", toolNumber: "TL-004", category: "Electrical", location: "Tool Room", condition: "Good", calibrationDue: "2026-06-30", remarks: "Megger MIT430", qty: 1, consumable: false },
    { toolId: "TL-005", toolName: "Hydraulic Jack (20T)", toolNumber: "TL-005", category: "Mechanical", location: "Pit Area", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-006", toolName: "Laser Alignment Tool", toolNumber: "TL-006", category: "Precision", location: "Tool Room", condition: "Good", calibrationDue: "2026-03-31", qty: 1, consumable: false },
    { toolId: "TL-007", toolName: "Borescope Camera", toolNumber: "TL-007", category: "Inspection", location: "Tool Room", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-008", toolName: "Infrared Thermometer", toolNumber: "TL-008", category: "Measurement", location: "Tool Room", condition: "Good", calibrationDue: "2026-09-30", remarks: "Fluke 568", qty: 1, consumable: false },
    { toolId: "TL-009", toolName: "Cable Crimping Tool", toolNumber: "TL-009", category: "Electrical", location: "Tool Room", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-010", toolName: "Pneumatic Drill", toolNumber: "TL-010", category: "Mechanical", location: "Workshop", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-011", toolName: "AC Power Quality Analyzer", toolNumber: "TL-011", category: "Electrical", location: "Electronics Lab", condition: "Good", calibrationDue: "2026-06-30", remarks: "Fluke 435-II", qty: 1, consumable: false },
    { toolId: "TL-012", toolName: "Wheel Profile Gauge", toolNumber: "TL-012", category: "Measurement", location: "Wheel Shop", condition: "Good", calibrationDue: "2026-12-31", qty: 1, consumable: false },
    { toolId: "TL-013", toolName: "Brake Disc Micrometer", toolNumber: "TL-013", category: "Measurement", location: "Workshop", condition: "Good", calibrationDue: "2026-09-30", qty: 1, consumable: false },
    { toolId: "TL-014", toolName: "TCMS Laptop (Diagnostic)", toolNumber: "TL-014", category: "Diagnostic", location: "Electronics Lab", condition: "Good", remarks: "Mitsubishi licensed", qty: 1, consumable: false },
    { toolId: "TL-015", toolName: "Door System Diagnostic Kit", toolNumber: "TL-015", category: "Diagnostic", location: "Tool Room", condition: "Good", remarks: "Faiveley proprietary", qty: 1, consumable: false },
    { toolId: "TL-016", toolName: "Clamp Meter (AC/DC)", toolNumber: "TL-016", category: "Electrical", location: "Tool Room", condition: "Good", calibrationDue: "2026-06-30", remarks: "Fluke 376", qty: 1, consumable: false },
    { toolId: "TL-017", toolName: "Impact Wrench", toolNumber: "TL-017", category: "Mechanical", location: "Workshop", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-018", toolName: "Vibration Analyzer", toolNumber: "TL-018", category: "Measurement", location: "Tool Room", condition: "Good", calibrationDue: "2026-12-31", qty: 1, consumable: false },
    { toolId: "TL-019", toolName: "Paint Thickness Gauge", toolNumber: "TL-019", category: "Measurement", location: "Tool Room", condition: "Good", calibrationDue: "2026-09-30", qty: 1, consumable: false },
    { toolId: "TL-020", toolName: "Loctite Dispenser Kit", toolNumber: "TL-020", category: "Mechanical", location: "Workshop", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-021", toolName: "X5 Connector PAPIS", toolNumber: "TL-021", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 7", qty: 18, consumable: true },
    { toolId: "TL-022", toolName: "External CCTV Camera Cover", toolNumber: "TL-022", category: "Inspection", location: "Almirah 01 Rack 01", condition: "Good", qty: 1, consumable: true },
    { toolId: "TL-023", toolName: "MOXA Connector (M12) 18 Pin", toolNumber: "TL-023", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 6", qty: 4, consumable: true },
    { toolId: "TL-024", toolName: "Camera Tools", toolNumber: "TL-024", category: "Inspection", location: "Almirah 01 Rack 01", condition: "Good", qty: 6, consumable: false },
    { toolId: "TL-025", toolName: "Dummy Cap (Male Connector cap)", toolNumber: "TL-025", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 6", qty: 12, consumable: true },
    { toolId: "TL-026", toolName: "Dust Cap", toolNumber: "TL-026", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 2", qty: 60, consumable: true },
    { toolId: "TL-027", toolName: "Stinger Box (Open & Close Sticker)", toolNumber: "TL-027", category: "Safety", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 3", qty: 42, consumable: true },
    { toolId: "TL-028", toolName: "Sticker (Spare) Plate", toolNumber: "TL-028", category: "Safety", location: "Almirah 01 Rack 01", condition: "Good", remarks: "Box 3", qty: 18, consumable: true },
    { toolId: "TL-029", toolName: "Bracket (FDS-HMI)", toolNumber: "TL-029", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", qty: 2, consumable: false },
    { toolId: "TL-030", toolName: "Auto Dimmer (Taknoware)", toolNumber: "TL-030", category: "Electrical", location: "Almirah 01 Rack 01", condition: "Good", qty: 1, consumable: false },
    { toolId: "TL-046", toolName: "Wago Female Connector", toolNumber: "TL-046", category: "Electrical", location: "Almirah 01 Rack 02", condition: "Good", remarks: "Box 2", qty: 166, consumable: true },
    { toolId: "TL-047", toolName: "WAGO TB 280", toolNumber: "TL-047", category: "Electrical", location: "Almirah 01 Rack 02", condition: "Good", qty: 100, consumable: true },
    { toolId: "TL-050", toolName: "WAGO 279", toolNumber: "TL-050", category: "Electrical", location: "Almirah 01 Rack 02", condition: "Good", qty: 88, consumable: true },
    { toolId: "TL-054", toolName: "Walkie Talkie", toolNumber: "TL-054", category: "Communication", location: "Almirah 01 Rack 02", condition: "Good", qty: 5, consumable: false },
    { toolId: "TL-072", toolName: "Polyester Putty", toolNumber: "TL-072", category: "Consumable", location: "Almirah 01 Rack 04", condition: "Good", remarks: "Box 2", qty: 100, consumable: true },
    { toolId: "TL-087", toolName: "Small Shim (3TD15782801)", toolNumber: "TL-087", category: "Mechanical", location: "Almirah 01 Rack 04", condition: "Good", qty: 140, consumable: true },
    { toolId: "TL-088", toolName: "Big Shim (3TD15776R02)", toolNumber: "TL-088", category: "Mechanical", location: "Almirah 01 Rack 04", condition: "Good", qty: 208, consumable: true },
    { toolId: "TL-100", toolName: "MRD-2 (Faulty from SEMA)", toolNumber: "TL-100", category: "Diagnostic", location: "Almirah 01 Rack 02", condition: "Faulty", qty: 1, consumable: false },
    { toolId: "TL-102", toolName: "Welding Rod (AWS A5.9: ER 308L)", toolNumber: "TL-102", category: "Consumable", location: "Almirah 01 Rack 05", condition: "Good", remarks: "12.5 Kg", qty: 1, consumable: true },
  ]);

  console.log("DLP data seeded successfully!");
}
