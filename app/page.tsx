"use client";

import dynamic from "next/dynamic";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Dynamically import PDF viewer with SSR disabled to avoid canvas issues
const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

export default function Home() {
  return (
    <div
      className="fixed inset-0 h-screen w-screen bg-gray-100 notranslate"
      translate="no"
    >
      <PDFViewer />
    </div>
  );
}
