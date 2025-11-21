"use client";

import { useEffect, useState } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import es_ES from "@react-pdf-viewer/locales/lib/es_ES.json";

// Use CDN worker with proper protocol
const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function PDFViewer() {
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Set timeout to detect if PDF is taking too long to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadTimeout(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, []);
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            GoToPreviousPage,
            GoToNextPage,
            NumberOfPages,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div style={{ padding: "0 4px" }}>
                <ZoomOut />
              </div>
              <div style={{ padding: "0 4px" }}>
                <ZoomIn />
              </div>
              <div style={{ padding: "0 4px", marginLeft: "16px" }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: "0 4px", width: "4rem" }}>
                <CurrentPageInput />
              </div>
              <div style={{ padding: "0 4px" }}>
                / <NumberOfPages />
              </div>
              <div style={{ padding: "0 4px" }}>
                <GoToNextPage />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <Worker workerUrl={workerUrl}>
      <div className="h-full w-full">
        <Viewer
          fileUrl="/catalogo-m.pdf"
          plugins={[defaultLayoutPluginInstance]}
          localization={es_ES}
          defaultScale={SpecialZoomLevel.PageWidth}
          initialPage={0}
          renderLoader={(percentages) => {
            if (loadTimeout && percentages < 5) {
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                      Carga lenta
                    </h2>
                    <p className="text-gray-600 mb-4">
                      El catálogo está tardando en cargar. Por favor, verifica
                      tu conexión.
                    </p>
                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-600 mb-2">
                    Cargando catálogo... {Math.round(percentages)}%
                  </div>
                  <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${percentages}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          }}
          onDocumentLoad={(e) => {
            // Reset timeout when document loads
            setLoadTimeout(false);
            console.log("PDF loaded successfully", e);
          }}
          renderError={(error) => {
            setLoadTimeout(true);
            console.error("Error loading PDF:", error);
            const errorName = error.name || "";
            const errorMessage =
              error.message || "No se pudo cargar el catálogo.";
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {errorName === "InvalidPDFException"
                      ? "Archivo PDF inválido"
                      : "Error al cargar el PDF"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {errorName === "InvalidPDFException"
                      ? "El archivo del catálogo no es válido o está corrupto."
                      : errorMessage}
                  </p>
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>
    </Worker>
  );
}
