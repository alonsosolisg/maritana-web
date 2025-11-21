"use client";

import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Spanish localization
const spanishLocalization = {
  "Go to first page": "Ir a la primera página",
  "Go to previous page": "Ir a la página anterior",
  "Go to next page": "Ir a la página siguiente",
  "Go to last page": "Ir a la última página",
  "Current page": "Página actual",
  "Go to page": "Ir a la página",
  "Total pages": "Total de páginas",
  "Zoom in": "Acercar",
  "Zoom out": "Alejar",
  "Rotate clockwise": "Rotar en sentido horario",
  "Rotate counterclockwise": "Rotar en sentido antihorario",
  "Hand tool": "Herramienta de mano",
  "Text selection tool": "Herramienta de selección de texto",
  "Scrolling hand tool": "Herramienta de desplazamiento",
  Download: "Descargar",
  Print: "Imprimir",
  Search: "Buscar",
  "Find in document": "Buscar en el documento",
  "Match case": "Coincidir mayúsculas y minúsculas",
  "Whole words": "Palabras completas",
  "Current zoom": "Zoom actual",
  "Enter full screen": "Pantalla completa",
  "Exit full screen": "Salir de pantalla completa",
  "More actions": "Más acciones",
};

// Use local worker for better performance and reliability
const workerUrl = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function Home() {
  // Create plugin instance at component level (not in useMemo to avoid hook violations)
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
    <div className="fixed inset-0 h-screen w-screen bg-gray-100">
      <Worker workerUrl={workerUrl}>
        <div className="h-full w-full">
          <Viewer
            fileUrl="/catalogo.pdf"
            plugins={[defaultLayoutPluginInstance]}
            localization={spanishLocalization}
            defaultScale={SpecialZoomLevel.PageWidth}
            renderError={(error) => {
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
    </div>
  );
}
