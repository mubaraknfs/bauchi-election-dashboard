import * as XLSX from "xlsx";

import { saveAs }
from "file-saver";

function ExportExcel({

  stateSummary,
  lgaSummaries,
  wardSummaries,
  pollingResults,
  auditLogs

}) {

  /*
  ====================================
  EXPORT EXCEL
  ====================================
  */

  const exportExcel = () => {

    /*
    ====================================
    CREATE WORKBOOK
    ====================================
    */

    const workbook =
      XLSX.utils.book_new();

    /*
    ====================================
    STATE SUMMARY
    ====================================
    */

    const stateData = [

      {

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
      }
    ];

    const stateSheet =
      XLSX.utils.json_to_sheet(
        stateData
      );

    XLSX.utils.book_append_sheet(

      workbook,

      stateSheet,

      "State Summary"
    );

    /*
    ====================================
    LGA SUMMARY
    ====================================
    */

    const lgaSheet =
      XLSX.utils.json_to_sheet(
        lgaSummaries
      );

    XLSX.utils.book_append_sheet(

      workbook,

      lgaSheet,

      "LGA Summary"
    );

    /*
    ====================================
    WARD SUMMARY
    ====================================
    */

    const wardSheet =
      XLSX.utils.json_to_sheet(
        wardSummaries
      );

    XLSX.utils.book_append_sheet(

      workbook,

      wardSheet,

      "Ward Summary"
    );

    /*
    ====================================
    POLLING UNIT RESULTS
    ====================================
    */

    const pollingSheet =
      XLSX.utils.json_to_sheet(
        pollingResults
      );

    XLSX.utils.book_append_sheet(

      workbook,

      pollingSheet,

      "Polling Results"
    );

    /*
    ====================================
    AUDIT LOGS
    ====================================
    */

    const auditSheet =
      XLSX.utils.json_to_sheet(
        auditLogs
      );

    XLSX.utils.book_append_sheet(

      workbook,

      auditSheet,

      "Audit Logs"
    );

    /*
    ====================================
    GENERATE FILE
    ====================================
    */

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

    /*
    ====================================
    SAVE FILE
    ====================================
    */

    saveAs(

      data,

      "Bauchi_Election_Report.xlsx"
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

/*
====================================
STYLE
====================================
*/

const buttonStyle = {

  padding: "12px 20px",

  backgroundColor: "#047857",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  marginBottom: "20px",

  marginRight: "15px",

  fontWeight: "bold"
};

export default ExportExcel;