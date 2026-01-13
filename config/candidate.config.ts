export const candidateConfig = {
  name: "ADVOCATE NAME",
  designation: "Candidate for Member – Telangana State Bar Council",
  photo: "/candidate/candidate.png",
  layoutVariant: "center" as "left" | "center" | "right",
  defaultLanguage: "en" as "en" | "te",
  googleSheetId: "1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA",
  serialNumber: "111", // Client's election serial number (3 digits, e.g., "111", "005", "024")
  slogan: "", // Optional client slogan/motto
  whatsappShareText: {
    en: "I support this candidate for Telangana State Bar Council elections.\nPlease visit: ",
    te: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో ఈ అభ్యర్థికి నా మద్దతు ఉంది.\nవివరాలకు ఈ లింక్ చూడండి: ",
  },
  // Firebase Cloud Messaging (FCM) Configuration
  // Environment variables in Vercel will override these values
  firebaseConfig: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bar-council-8a238",
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BGTvsS1SepQ9sAMLRKQJDdI_VhD1JUUoRWjjAtsxT4QDDGWeOn9jtxsZzBcbYwO1aRSh-9i1oI7Ovk50MWQ6Rd8",
  },
};

