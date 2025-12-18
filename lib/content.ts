import { Language } from "@/types";

export const content = {
  en: {
    hero: {
      designation: "Candidate for Member – Telangana State Bar Council",
    },
    about: {
      title: "About the Advocate",
      text: "I am a practicing advocate with experience across courts in Telangana. My objective is to uphold the dignity of the legal profession and work for the welfare of advocates.",
    },
    experience: {
      title: "Experience & Service",
      years: "Years of Practice",
      courts: "Courts Practiced",
      service: "Service to Advocates",
    },
    vision: {
      title: "Vision & Commitment",
      bullets: [
        "Transparency in Bar Council functioning",
        "Support for young advocates",
        "Welfare and dignity of advocates",
        "Strong representation of advocate issues",
      ],
    },
    support: {
      button: "I Will Vote / Support",
      quickSupport: {
        title: "I Support This Candidate",
        addDetails: "Add My Details",
        skip: "Skip",
      },
      form: {
        title: "Support Details",
        name: "Full Name",
        enrollment: "Enrollment Number",
        district: "District",
        barAssociation: "Bar Association",
        submit: "I Will Vote",
        required: "This field is required",
      },
      image: {
        supporting: "I am supporting",
        downloadPNG: "Download PNG",
        downloadJPEG: "Download JPEG",
        shareWhatsApp: "Share on WhatsApp",
      },
    },
    disclaimer: "Support expressed here is voluntary and for informational purposes only.",
  },
  te: {
    hero: {
      designation: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ సభ్యుడిగా అభ్యర్థి",
    },
    about: {
      title: "న్యాయవాది పరిచయం",
      text: "నేను తెలంగాణ రాష్ట్రంలోని వివిధ న్యాయస్థానాల్లో ప్రాక్టీస్ చేస్తున్న న్యాయవాదిని. న్యాయవృత్తి గౌరవం కాపాడటం, న్యాయవాదుల సంక్షేమం కోసం పని చేయడమే నా లక్ష్యం.",
    },
    experience: {
      title: "అనుభవం మరియు సేవ",
      years: "ప్రాక్టీస్ అనుభవం",
      courts: "ప్రాక్టీస్ చేసిన కోర్టులు",
      service: "న్యాయవాదుల కోసం సేవ",
    },
    vision: {
      title: "దృష్టి మరియు కట్టుబాటు",
      bullets: [
        "బార్ కౌన్సిల్ పనితీరులో పారదర్శకత",
        "యువ న్యాయవాదులకు మద్దతు",
        "న్యాయవాదుల సంక్షేమం",
        "న్యాయవాదుల సమస్యలపై గట్టిగా నిలబడటం",
      ],
    },
    support: {
      button: "నేను ఓటు వేస్తాను / మద్దతు",
      quickSupport: {
        title: "నేను ఈ అభ్యర్థికి మద్దతు ఇస్తున్నాను",
        addDetails: "నా వివరాలను జోడించండి",
        skip: "దాటవేయి",
      },
      form: {
        title: "మద్దతు వివరాలు",
        name: "పూర్తి పేరు",
        enrollment: "నమోదు సంఖ్య",
        district: "జిల్లా",
        barAssociation: "బార్ అసోసియేషన్",
        submit: "నేను ఓటు వేస్తాను",
        required: "ఈ ఫీల్డ్ తప్పనిసరి",
      },
      image: {
        supporting: "నేను మద్దతు ఇస్తున్నాను",
        downloadPNG: "PNG డౌన్‌లోడ్ చేయండి",
        downloadJPEG: "JPEG డౌన్‌లోడ్ చేయండి",
        shareWhatsApp: "WhatsAppలో షేర్ చేయండి",
      },
    },
    disclaimer: "ఇక్కడ వ్యక్తం చేసిన మద్దతు స్వచ్ఛందంగా మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే.",
  },
};

export const getContent = (lang: Language) => content[lang];

