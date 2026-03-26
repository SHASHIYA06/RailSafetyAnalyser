export interface Component {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  category: string;
  subcategory?: string;
  description?: string;
  technicalSpecs?: Record<string, any>;
  operatingConditions?: Record<string, any>;
  certificationStatus: string;
  silLevel?: number;
  ramsScore: string | number;
  reliabilityScore?: string | number;
  availabilityScore?: string | number;
  maintainabilityScore?: string | number;
  safetyScore?: string | number;
  riskLevel: string;
  lastUpdated?: Date;
  createdAt?: Date;
}

export interface Standard {
  id: number;
  code: string;
  title: string;
  description?: string;
  pdfUrl?: string;
  category: string;
  status: string;
  version?: string;
  publishedDate?: Date;
  lastUpdated?: Date;
}

export interface Supplier {
  id: number;
  name: string;
  country?: string;
  certifications?: Record<string, boolean>;
  contactInfo?: { website?: string; email?: string };
  irsCertified: boolean;
  qualityRating: string | number;
  lastAudit?: Date;
}

export interface DashboardStats {
  totalComponents: number;
  totalStandards: number;
  certifiedSuppliers: number;
  averageRAMSScore?: string | number;
  complianceRate?: number;
  sil4Count?: number;
}

export interface ComponentsResponse {
  components: Component[];
  total: number;
}

export interface StandardsResponse {
  standards: Standard[];
  total: number;
}

export interface DlpItem {
  id: number;
  itemId: string;
  partNumber: string;
  description: string;
  category: string;
  systemType: string;
  vendorName?: string;
  vendorId?: number;
  unitOfMeasure: string;
  receivedQty: number;
  consumedQty: number;
  availableQty: number;
  recommendedQty: number;
  reorderLevel: number;
  status: string;
  criticalFlag: boolean;
  notes?: string;
  lastUpdated?: Date;
  createdAt?: Date;
}

export interface DlpTransaction {
  id: number;
  transactionType: string;
  itemId?: number;
  itemName?: string;
  partNumber?: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  referenceType?: string;
  referenceId?: string;
  remarks?: string;
  initiatedBy?: string;
  status: string;
  transactionDate?: Date;
  createdAt?: Date;
}

export interface DlpVendor {
  id: number;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  country?: string;
  paymentTerms?: string;
  deliveryDays?: number;
  qualityRating?: string;
  isActive: boolean;
  createdAt?: Date;
}

export interface DlpSystem {
  id: number;
  systemId: string;
  systemName: string;
  primaryVendor?: string;
  totalItems: number;
  totalReceived: number;
  totalConsumed: number;
  totalAvailable: number;
  criticalStatus: boolean;
  maintenanceFrequency?: string;
  lastUpdated?: Date;
}

export interface DlpTool {
  id: number;
  toolId: string;
  toolName: string;
  toolNumber?: string;
  category: string;
  location?: string;
  condition: string;
  calibrationDue?: string;
  issuedTo?: string;
  issuedDate?: string;
  remarks?: string;
  qty: number;
  consumable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DlpAlert {
  id: number;
  alertType: string;
  itemId?: number;
  itemName?: string;
  message: string;
  severity: string;
  isResolved: boolean;
  createdAt?: Date;
  resolvedAt?: Date;
}

export interface DlpStats {
  totalItems: number;
  totalTools: number;
  totalVendors: number;
  totalSystems: number;
  activeAlerts: number;
  availableUnits: number;
  lowStockItems: number;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink: string;
  category?: string;
}

export interface DriveFilesResponse {
  files: DriveFile[];
  folderId?: string;
  folderUrl?: string;
}
