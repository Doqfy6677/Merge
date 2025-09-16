import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function Home() {
  const [mergedUrl, setMergedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const mergePDFs = async (files) => {
    setLoading(true);
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    setMergedUrl(URL.createObjectURL(blob));
    setLoading(false);
  };

  const handleFiles = (e) => {
    const files = [...e.target.files];
    if (files.length > 0) {
      mergePDFs(files);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">PDF Merge Tool</h1>
        <p className="text-gray-600 mb-6">Select multiple PDF files to merge them into one.</p>

        <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition">
          <span className="text-gray-500">Click to select PDFs</span>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        {loading && <p className="mt-4 text-blue-500">Merging PDFs...</p>}

        {mergedUrl && (
          <a
            href={mergedUrl}
            download="merged.pdf"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download Merged PDF
          </a>
        )}
      </div>
    </div>
  );
}