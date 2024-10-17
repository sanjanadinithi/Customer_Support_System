import React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer = ({ url }) => {
  return (
    <div style={{ height: "750px" }}>
      <Viewer fileUrl={url} />
    </div>
  );
};

export default PDFViewer;
