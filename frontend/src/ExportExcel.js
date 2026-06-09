import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ExportExcel({

  stateSummary = {},

  lgaSummaries = [],

  wardSummaries = [],

  pollingResults = [],

  auditLogs = []

}) {

  const exportExcel = () => {

    const workbook =
      XLSX.utils.book_new();

    const metadataSheet =
      XLSX.utils.json_to_sheet([{

        Report:
          "Bauchi State Election Report",

        Generated:
          new Date().toLocaleString()

      }]);

    XLSX.utils.book_append_sheet(
      workbook,
      metadataSheet,
      "Report Info"
    );

    const stateSheet =
      XLSX.utils.json_to_sheet([{

        State:
          stateSummary.state_name,

        Winner:
          stateSummary.leading_party,

        TotalVotes:
          stateSummary.total_votes_cast,

        ValidVotes:
          stateSummary.total_valid_votes,

        PollingUnits:
          stateSummary.polling_units_reported

      }]);

    XLSX.utils.book_append_sheet(
      workbook,
      stateSheet,
      "State Summary"
    );

    const lgaSheet =
      XLSX.utils.json_to_sheet(
        lgaSummaries
      );

    XLSX.utils.book_append_sheet(
      workbook,
      lgaSheet,
      "LGA Summary"
    );

    const wardSheet =
      XLSX.utils.json_to_sheet(
        wardSummaries
      );

    XLSX.utils.book_append_sheet(
      workbook,
      wardSheet,
      "Ward Summary"
    );

    const pollingSheet =
      XLSX.utils.json_to_sheet(
        pollingResults
      );

    XLSX.utils.book_append_sheet(
      workbook,
      pollingSheet,
      "Polling Units"
    );

    const auditSheet =
      XLSX.utils.json_to_sheet(
        auditLogs
      );

    XLSX.utils.book_append_sheet(
      workbook,
      auditSheet,
      "Audit Logs"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array"
        }
      );

    const data =
      new Blob(
        [excelBuffer],
        {
          type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      );

    saveAs(

      data,

      `Bauchi_Election_Report_${
        new Date().getTime()
      }.xlsx`
    );
  };

  return (

    <button
      onClick={exportExcel}
      style={buttonStyle}
    >
      Export Excel Report
    </button>

  );
}

const buttonStyle = {

  padding: "12px 20px",

  backgroundColor: "#047857",

  color: "#fff",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  fontWeight: "bold"
};

export default ExportExcel;