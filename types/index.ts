export type Language = "en" | "te";

export type LayoutVariant = "left" | "center" | "right";

export type SupportType = "Quick Support" | "Strong Support";

export interface SupportFormData {
  name: string;
  enrollmentNumber: string;
  district: string;
  barAssociation: string;
  mobileNumber?: string;
}

export interface SupportSubmission {
  supportType: SupportType;
  detailsProvided: "Yes" | "No";
  name?: string;
  enrollmentNumber?: string;
  district?: string;
  barAssociation?: string;
  mobileNumber?: string;
  language: Language;
  imageGenerated: "Yes";
  imageDownloaded: "Yes" | "No";
}

