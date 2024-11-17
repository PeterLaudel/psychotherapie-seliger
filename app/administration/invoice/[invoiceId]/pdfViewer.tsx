"use client";

export default function PDFViewer({ data }: { data: string }) {
  const out = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const blob = new Blob([out], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return <iframe src={url} className="w-full h-full" />;
}
