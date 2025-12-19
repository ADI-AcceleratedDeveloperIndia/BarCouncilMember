import { Language } from "@/types";

interface GenerateImageParams {
  candidateName: string;
  candidatePhoto: string;
  language: Language;
  supporterName?: string;
  enrollmentNumber?: string;
  district?: string;
  barAssociation?: string;
  mobileNumber?: string;
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

// Helper function to wrap text and return the new Y position
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  draw: boolean = true
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const word = words[n];
    const testLine = line + (line ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line !== "") {
      // Current line is full, draw it and start a new line with current word
      if (draw) ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
      
      // If the single word itself is still too wide, we might need to force a wrap
      // but for 100 chars max, a single word won't likely exceed 1080px.
    } else {
      line = testLine;
    }
  }
  
  if (line) {
    if (draw) ctx.fillText(line, x, currentY);
    currentY += lineHeight;
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
    mobileNumber,
    customMessage,
  } = params;

  const photoUrl = candidatePhoto.startsWith("http")
    ? candidatePhoto
    : `${window.location.origin}${candidatePhoto}`;

  const loadedImg = await loadImage(photoUrl);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Configuration
  const padding = 120; // Increased padding for safer margins
  const contentWidth = canvas.width - padding * 2;
  const photoSize = 450;
  
  // Calculate Total Height first to center vertically
  let totalHeight = 0;
  
  // Photo + spacing
  totalHeight += photoSize + 60;
  
  // Candidate Name
  ctx.font = "bold 80px system-ui, -apple-system, sans-serif";
  totalHeight += 100; // Rough estimate for name
  
  // Designation
  ctx.font = "32px system-ui, -apple-system, sans-serif";
  const designationText = language === "en" 
    ? "Candidate for Member – Telangana State Bar Council" 
    : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో పోటీ చేస్తున్న న్యాయవాది";
  let tempY = wrapText(ctx, designationText, 0, 0, contentWidth, 45, false);
  totalHeight += tempY + 60;

  // Support lines
  totalHeight += 100; // "I am supporting..."
  totalHeight += 80;  // "You also please..."
  totalHeight += 100; // Spacing
  
  // Custom Message
  if (customMessage?.trim()) {
    ctx.font = "italic 34px system-ui, -apple-system, sans-serif";
    tempY = wrapText(ctx, customMessage.trim().substring(0, 100), 0, 0, contentWidth, 45, false);
    totalHeight += tempY + 60;
  }
  
  // Supporter Details
  if (supporterName) {
    totalHeight += 120; // Name + spacing
    if (enrollmentNumber) totalHeight += 45;
    if (district) totalHeight += 45;
    if (barAssociation) totalHeight += 45;
    if (mobileNumber) totalHeight += 45;
  }

  // Draw background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGradient.addColorStop(0, "#000000");
  bgGradient.addColorStop(0.5, "#0a0a0a");
  bgGradient.addColorStop(1, "#000000");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Borders
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 15;
  ctx.strokeRect(20, 20, 1040, 1880);
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 990, 1830);

  // Start Drawing
  let currentY = (canvas.height - totalHeight) / 2;
  if (currentY < 100) currentY = 100; // Minimum top margin

  // Photo
  const photoX = (canvas.width - photoSize) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, currentY + photoSize / 2, photoSize / 2 - 5, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(loadedImg, photoX, currentY, photoSize, photoSize);
  ctx.restore();
  
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, currentY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  currentY += photoSize + 80;

  // Candidate Name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 80px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(candidateName, 540, currentY);
  currentY += 100;

  // Designation
  ctx.font = "32px system-ui, -apple-system, sans-serif";
  currentY = wrapText(ctx, designationText, 540, currentY, contentWidth, 45, true);
  currentY += 80;

  // Support Message
  const supportText = language === "en" ? "I am supporting this candidate" : "నేను ఈ అభ్యర్థికి మద్దతుగా ఉన్నాను";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 60px system-ui, -apple-system, sans-serif";
  ctx.fillText(supportText, 540, currentY);
  currentY += 85;

  const pleaseSupportText = language === "en" ? "You also please support" : "మీరు కూడా మద్దతు ఇవ్వండి";
  ctx.font = "bold 50px system-ui, -apple-system, sans-serif";
  ctx.fillText(pleaseSupportText, 540, currentY);
  currentY += 120;

  // Custom Message
  if (customMessage?.trim()) {
    ctx.font = "italic 34px system-ui, -apple-system, sans-serif";
    currentY = wrapText(ctx, customMessage.trim().substring(0, 100), 540, currentY, contentWidth, 45, true);
    currentY += 50;
  }

  // Supporter Details
  if (supporterName) {
    const supporterNameText = language === "en" ? `- ${supporterName}, Advocate` : `- ${supporterName}, న్యాయవాది`;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px system-ui, -apple-system, sans-serif";
    ctx.fillText(supporterNameText, 540, currentY);
    currentY += 60;

    ctx.font = "30px system-ui, -apple-system, sans-serif";
    if (enrollmentNumber) {
      const enrollmentText = language === "en" ? `Enrollment No: ${enrollmentNumber}` : `ఎన్‌రోల్మెంట్ నం: ${enrollmentNumber}`;
      ctx.fillText(enrollmentText, 540, currentY);
      currentY += 40;
    }
    if (district) {
      const districtText = language === "en" ? `District: ${district}` : `జిల్లా: ${district}`;
      ctx.fillText(districtText, 540, currentY);
      currentY += 40;
    }
    if (barAssociation) {
      const barText = language === "en" ? `Bar Association: ${barAssociation}` : `బార్ అసోసియేషన్: ${barAssociation}`;
      currentY = wrapText(ctx, barText, 540, currentY, contentWidth, 38, true);
    }
    if (mobileNumber) {
      const mobileText = language === "en" ? `Mobile: ${mobileNumber}` : `మొబైల్: ${mobileNumber}`;
      ctx.fillText(mobileText, 540, currentY);
      currentY += 40;
    }
  }

  // Footer
  const footerText = language === "en" ? "Telangana State Bar Council Elections" : "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికలు";
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText(footerText, 540, 1840);

  return canvas.toDataURL("image/png", 1.0);
}
