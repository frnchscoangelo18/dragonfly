const API_BASE = "/api/v2/pdf";

export async function downloadReport(data: { projectName: string; items: any[] }, returnBytes: boolean = false) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate report: ${response.statusText}`);
  }
  
  const bytes = await response.arrayBuffer();
  
  if (returnBytes) return bytes;

  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.projectName}-report.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
