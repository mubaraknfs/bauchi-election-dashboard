import React, {
  useState
} from "react";

import * as XLSX from "xlsx";

function ResultImportCenter() {

  const [rows, setRows] =
    useState([]);

  const [fileName, setFileName] =
    useState("");

  const handleFile = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader =
      new FileReader();

    reader.onload = (evt) => {

      const data =
        evt.target.result;

      const workbook =
        XLSX.read(data, {
          type: "binary"
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[
          sheetName
        ];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      setRows(jsonData);
    };

    reader.readAsBinaryString(
      file
    );
  };

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      <h1>
        Result Import Center
      </h1>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
      />

      <p>
        Selected File:
        {" "}
        {fileName}
      </p>

      <h3>
        Preview
      </h3>

      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          maxHeight: "400px",
          overflow: "auto"
        }}
      >

        <pre>
          {
            JSON.stringify(
              rows.slice(0, 10),
              null,
              2
            )
          }
        </pre>

      </div>

    </div>

  );
}

export default ResultImportCenter;