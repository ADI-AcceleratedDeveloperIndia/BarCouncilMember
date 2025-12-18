import { Language } from "@/types";

interface GenerateImageParams {
  candidateName: string;
  candidatePhoto: string;
  language: Language;
  supporterName?: string;
  enrollmentNumber?: string;
  district?: string;
  barAssociation?: string;
  customMessage?: string;
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

// Helper function to wrap text with character limit per line
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxCharsPerLine?: number
): number {
  let currentY = y;
  
  if (maxCharsPerLine) {
    // Split by character limit
    const chars = text.split("");
    let line = "";
    
    for (let i = 0; i < chars.length; i++) {
      line += chars[i];
      
      if (line.length >= maxCharsPerLine || i === chars.length - 1) {
        ctx.fillText(line.trim(), x, currentY);
        line = "";
        currentY += lineHeight;
      }
    }
  } else {
    // Original word-based wrapping
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
  }
  
  return currentY;
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
    customMessage,
  } = params;

  // Convert relative path to absolute URL
  const photoUrl = candidatePhoto.startsWith("http")
    ? candidatePhoto
    : `${window.location.origin}${candidatePhoto}`;

  // Pre-load the image first
  const loadedImg = await loadImage(photoUrl);

  // Create canvas - 1080x1920 for WhatsApp/Instagram/Facebook Stories (9:16 ratio)
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 1080, 1920);

  // Draw gold border
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 1070, 1910);

  // Draw candidate photo (circular) - optimized size
  const photoSize = 220;
  const photoX = (1080 - photoSize) / 2;
  const photoY = 60;

  // Draw circular clipping path
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    photoX + photoSize / 2,
    photoY + photoSize / 2,
    photoSize / 2 - 4,
    0,
    Math.PI * 2
  );
  ctx.clip();

  // Draw gold border circle
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Draw the image
  ctx.drawImage(loadedImg, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // Candidate name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const nameY = photoY + photoSize + 25;
  ctx.fillText(candidateName, 540, nameY);

  // Candidate designation
  const designationText =
    language === "en"
      ? "Candidate for Member – Telangana State Bar Council"
      : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో పోటీ చేస్తున్న న్యాయవాది";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px system-ui, -apple-system, sans-serif";
  const designationY = nameY + 45;
  const maxDesignationWidth = 1000;
  let currentY = wrapText(
    ctx,
    designationText,
    540,
    designationY,
    maxDesignationWidth,
    28
  );

  // Main support line (Big, Centered)
  const supportText =
    language === "en"
      ? "I am supporting this candidate"
      : "నేను ఈ అభ్యర్థికి మద్దతుగా ఉన్నాను";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 40px system-ui, -apple-system, sans-serif";
  currentY += 35;
  ctx.fillText(supportText, 540, currentY);

  // "You also please support" line
  const pleaseSupportText =
    language === "en"
      ? "You also please support"
      : "మీరు కూడా మద్దతు ఇవ్వండి";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
  currentY += 55;
  ctx.fillText(pleaseSupportText, 540, currentY);

  currentY += 40;

  // Custom message (if provided) - limited characters per line
  if (customMessage && customMessage.trim()) {
    const trimmedMessage = customMessage.trim().substring(0, 100);
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    // Limit to 35 characters per line for better fit
    const maxCharsPerLine = 35;
    currentY = wrapText(
      ctx,
      trimmedMessage,
      540,
      currentY,
      1000,
      32,
      maxCharsPerLine
    );
    currentY += 25;
  }

  // Supporter details (if provided)
  if (supporterName) {
    // Supporter name with dash before name (without Adv. prefix)
    const supporterNameText =
      language === "en"
        ? `- ${supporterName}, Advocate`
        : `- ${supporterName}, న్యాయవాది`;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(supporterNameText, 540, currentY);
    currentY += 35;

    if (enrollmentNumber) {
      const enrollmentText =
        language === "en"
          ? `Enrollment No: ${enrollmentNumber}`
          : `ఎన్‌రోల్మెంట్ నం: ${enrollmentNumber}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "22px system-ui, -apple-system, sans-serif";
      ctx.fillText(enrollmentText, 540, currentY);
      currentY += 32;
    }

    if (district) {
      const districtText =
        language === "en" ? `District: ${district}` : `జిల్లా: ${district}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "22px system-ui, -apple-system, sans-serif";
      ctx.fillText(districtText, 540, currentY);
      currentY += 32;
    }

    if (barAssociation) {
      const barText =
        language === "en"
          ? `Bar Association: ${barAssociation}`
          : `బార్ అసోసియేషన్: ${barAssociation}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "22px system-ui, -apple-system, sans-serif";
      ctx.fillText(barText, 540, currentY);
      currentY += 35;
    }
  }

  // Calculate remaining space and position footer
  // Ensure footer is always near bottom but content doesn't overflow
  const footerY = Math.max(currentY + 50, 1870);
  
  // Footer line (subtle, at bottom)
  const footerText =
    language === "en"
      ? "Telangana State Bar Council Elections"
      : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికలు";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "18px system-ui, -apple-system, sans-serif";
  ctx.fillText(footerText, 540, footerY);

  // Convert canvas to PNG
  return canvas.toDataURL("image/png", 1.0);
}
