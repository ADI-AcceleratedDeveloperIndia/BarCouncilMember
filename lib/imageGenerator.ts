import { Language } from "@/types";

interface GenerateImageParams {
  candidateName: string;
  candidatePhoto: string;
  language: Language;
  supporterName?: string;
  enrollmentNumber?: string;
  district?: string;
  barAssociation?: string;
}

// Helper function to load image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.error("Failed to load image:", src, error);
      reject(error);
    };
    img.src = src;
  });
}

export async function generateSupportImage(
  params: GenerateImageParams
): Promise<string> {
  const {
    candidateName,
    candidatePhoto,
    language,
    supporterName,
    enrollmentNumber,
    district,
    barAssociation,
  } = params;

  // Convert relative path to absolute URL
  const photoUrl = candidatePhoto.startsWith("http")
    ? candidatePhoto
    : `${window.location.origin}${candidatePhoto}`;

  // Pre-load the image first
  const loadedImg = await loadImage(photoUrl);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 800, 1000);

  // Draw gold border
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 792, 992);

  // Draw candidate photo (circular)
  const photoSize = 200;
  const photoX = (800 - photoSize) / 2;
  const photoY = 60;

  // Draw circular clipping path
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    photoX + photoSize / 2,
    photoY + photoSize / 2,
    photoSize / 2 - 3,
    0,
    Math.PI * 2
  );
  ctx.clip();

  // Draw gold border circle
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Draw the image
  ctx.drawImage(loadedImg, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // Candidate name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const nameY = photoY + photoSize + 30;
  ctx.fillText(candidateName, 400, nameY);

  // Candidate designation
  const designationText =
    language === "en"
      ? "Candidate for Member – Telangana State Bar Council"
      : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో పోటీ చేస్తున్న న్యాయవాది";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "18px system-ui, -apple-system, sans-serif";
  const designationY = nameY + 45;
  ctx.fillText(designationText, 400, designationY);

  // Main support line (Big, Centered) with dash
  const supportText =
    language === "en"
      ? "- I am supporting this candidate"
      : "- నేను ఈ అభ్యర్థికి మద్దతుగా ఉన్నాను";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  const supportY = designationY + 60;
  ctx.fillText(supportText, 400, supportY);

  // "You also please support" line
  const pleaseSupportText =
    language === "en"
      ? "You also please support"
      : "మీరు కూడా మద్దతు ఇవ్వండి";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  const pleaseSupportY = supportY + 50;
  ctx.fillText(pleaseSupportText, 400, pleaseSupportY);

  let currentY = pleaseSupportY + 60;

  // Supporter details (if provided)
  if (supporterName) {
    // Supporter name (without Adv. prefix)
    const supporterNameText =
      language === "en"
        ? `${supporterName}, Advocate`
        : `${supporterName}, న్యాయవాది`;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(supporterNameText, 400, currentY);
    currentY += 40;

    if (enrollmentNumber) {
      const enrollmentText =
        language === "en"
          ? `Enrollment No: ${enrollmentNumber}`
          : `ఎన్‌రోల్మెంట్ నం: ${enrollmentNumber}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px system-ui, -apple-system, sans-serif";
      ctx.fillText(enrollmentText, 400, currentY);
      currentY += 35;
    }

    if (district) {
      const districtText =
        language === "en" ? `District: ${district}` : `జిల్లా: ${district}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px system-ui, -apple-system, sans-serif";
      ctx.fillText(districtText, 400, currentY);
      currentY += 35;
    }

    if (barAssociation) {
      const barText =
        language === "en"
          ? `Bar Association: ${barAssociation}`
          : `బార్ అసోసియేషన్: ${barAssociation}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px system-ui, -apple-system, sans-serif";
      ctx.fillText(barText, 400, currentY);
      currentY += 40;
    }
  }

  // Footer line (subtle, at bottom)
  const footerText =
    language === "en"
      ? "Telangana State Bar Council Elections"
      : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికలు";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  ctx.fillText(footerText, 400, 950);

  // Convert canvas to PNG
  return canvas.toDataURL("image/png", 1.0);
}
