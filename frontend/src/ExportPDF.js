import jsPDF from "jspdf";

import autoTable from
"jspdf-autotable";

function ExportPDF({

  stateSummary

}) {

  /*
  ====================================
  EXPORT FUNCTION
  ====================================
  */

  const exportPDF = () => {

    const doc =
      new jsPDF();

    /*
    ====================================
    TITLE
    ====================================
    */

    doc.setFontSize(18);

    doc.text(

      "Bauchi State Election Report 2027",

      14,

      20
    );

    /*
    ====================================
    DATE
    ====================================
    */

    doc.setFontSize(11);

    doc.text(

      `Generated: ${new Date().toLocaleString()}`,

      14,

      30
    );

    /*
    ====================================
    SUMMARY TABLE
    ====================================
    */

    autoTable(doc, {

      startY: 40,

      head: [[

        "State",
        "Winner",
        "Total Votes",
        "Valid Votes",
        "PUs Reported"
      ]],

      body: [[

        stateSummary.state_name,

        stateSummary.leading_party,

        stateSummary.total_votes_cast,

        stateSummary.total_valid_votes,

        stateSummary.polling_units_reported
      ]]
    });

    /*
    ====================================
    PARTY RESULTS
    ====================================
    */

    autoTable(doc, {

      startY:
        doc.lastAutoTable.finalY + 15,

      head: [[

        "Party",
        "Votes"
      ]],

      body: [

        ["AAC", stateSummary.aac],
        ["ADC", stateSummary.adc],
        ["ADP", stateSummary.adp],
        ["APC", stateSummary.apc],
        ["APGA", stateSummary.apga],
        ["APM", stateSummary.apm],
        ["APP", stateSummary.app],
        ["BP", stateSummary.bp],
        ["LP", stateSummary.lp],
        ["NDC", stateSummary.ndc],
        ["NNPP", stateSummary.nnpp],
        ["NRM", stateSummary.nrm],
        ["PDP", stateSummary.pdp],
        ["PRP", stateSummary.prp],
        ["SDP", stateSummary.sdp],
        ["YPP", stateSummary.ypp],
        ["ZLP", stateSummary.zlp]
      ]
    });

    /*
    ====================================
    SAVE PDF
    ====================================
    */

    doc.save(

      "Bauchi_State_Election_Report.pdf"
    );
  };

  return (

    <button

      onClick={exportPDF}

      style={buttonStyle}
    >

      Export State Report PDF

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

  backgroundColor: "#1e3a8a",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  marginBottom: "20px",

  fontWeight: "bold"
};

export default ExportPDF;