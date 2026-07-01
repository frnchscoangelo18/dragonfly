import { PDFDocument, StandardFonts } from "pdf-lib";

// Function to sanitize text to ASCII-only (WinAnsi compliant)
function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  // Remove any character with a value greater than 127
  return text.replace(/[^\x00-\x7F]/g, "");
}

export async function generatePdf(data: { projectName: string; items: any[] }) {
  const pdfDoc = await PDFDocument.create();

  // Embed the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([600, 800]); // A4-ish dimensions
  const { height } = page.getSize();
  const fontSize = 12;

  // Title - Sanitize projectName
  page.drawText(sanitizeText(`Specs Calculation Report: ${data.projectName}`), {
    x: 50,
    y: height - 50,
    size: 20,
    font: boldFont,
  });

  // Summary Table (Top)
  let yPosition = height - 100;
  page.drawText(sanitizeText("Component Summary"), {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  yPosition -= 25;

  data.items.forEach((item: any, index: number) => {
    const text = sanitizeText(
      `${index + 1}. ${item.componentName} | Qty: ${item.qty || 1} | ${item.computedSpecs}`,
    );
    page.drawText(text, { x: 50, y: yPosition, size: fontSize, font: font });
    yPosition -= 15;
  });

  // Detailed Calculations (Bottom)
  yPosition -= 40;
  page.drawText(sanitizeText("Detailed Calculations & Reasoning"), {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
  });
  yPosition -= 25;

  data.items.forEach((item: any, index: number) => {
    if (yPosition < 50) return;

    page.drawText(sanitizeText(`${index + 1}. ${item.componentName}`), {
      x: 50,
      y: yPosition,
      size: fontSize,
      font: boldFont,
    });
    yPosition -= 15;

    if (item.calculation) {
      page.drawText(
        sanitizeText(
          `Calc: ${item.calculation.formula} = ${item.calculation.result}`,
        ),
        { x: 70, y: yPosition, size: fontSize, font: font },
      );
      yPosition -= 15;
    }

    page.drawText(sanitizeText(`Reasoning: ${item.reasoning}`), {
      x: 70,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
