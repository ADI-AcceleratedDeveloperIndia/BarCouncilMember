export type Language = "en" | "te";

export type LayoutVariant = "left" | "center" | "right";

export type SupportType = "Quick Support" | "Detailed Support";

export interface SupportFormData {
  name: string;
  enrollmentNumber: string;
  district: string;
  barAssociation: string;
}

export interface SupportSubmission {
  supportType: SupportType;
  detailsProvided: "Yes" | "No";
  name?: string;
  enrollmentNumber?: string;
  district?: string;
  barAssociation?: string;
  language: Language;
  imageGenerated: "Yes";
  imageDownloaded: "Yes" | "No";
}

