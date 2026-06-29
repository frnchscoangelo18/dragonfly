import { NextRequest, NextResponse } from "next/server";
import { generatePdf } from "@/lib/apis/pdf/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pdfBytes = await generatePdf(body);
    const fileName = `${body.projectName || "report"}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
