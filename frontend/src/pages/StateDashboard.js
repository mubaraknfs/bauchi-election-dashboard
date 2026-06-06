import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function StateDashboard() {

  const [summary, setSummary] =
    useState(null);

  const fetchSummary =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/state-summary`
          );

        setSummary(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchSummary();

    const interval =
      setInterval(
        fetchSummary,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  if (!summary) {

    return (
      <div style={{ padding: "20px" }}>
        Loading...
      </div>
    );
  }

  const turnout =

    summary.total_registered_voters > 0

      ?

      (
        (
          summary.total_accredited_voters /
          summary.total_registered_voters
        ) * 100
      ).toFixed(2)

      : 0;

  return (

    <div style={{ padding: "20px" }}>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: "20px"
        }}
      >

        <h1>
          Bauchi State Live Dashboard
        </h1>

        <strong>
          {
            new Date()
              .toLocaleString()
          }
        </strong>

      </div>

      {/* SUMMARY CARDS */}

      <div style={summaryGrid}>

        <Card
          title="Registered"
          value={
            summary.total_registered_voters
          }
        />

        <Card
          title="Accredited"
          value={
            summary.total_accredited_voters
          }
        />

        <Card
          title="Votes Cast"
          value={
            summary.total_votes_cast
          }
        />

        <Card
          title="Valid Votes"
          value={
            summary.total_valid_votes
          }
        />

        <Card
          title="Polling Units"
          value={
            summary.polling_units_reported
          }
        />

        <Card
          title="Turnout %"
          value={`${turnout}%`}
        />

      </div>

      {/* LEADING PARTY */}

      <div style={winnerCard}>

        <h2>
          STATE LEADING PARTY
        </h2>

        <h1
          style={{
            color: "#16a34a",
            fontSize: "48px"
          }}
        >
          {
            summary.leading_party
          }
        </h1>

      </div>

      {/* PARTY TABLE */}

      <div style={tableContainer}>

        <h2>
          Party Ranking
        </h2>

        <table style={tableStyle}>

          <thead>

            <tr>

              <th style={headerStyle}>
                Party
              </th>

              <th style={headerStyle}>
                Votes
              </th>

            </tr>

          </thead>

          <tbody>

            {

              [

                ["AAC", summary.aac],
                ["ADC", summary.adc],
                ["ADP", summary.adp],
                ["APC", summary.apc],
                ["APGA", summary.apga],
                ["APM", summary.apm],
                ["APP", summary.app],
                ["BP", summary.bp],
                ["LP", summary.lp],
                ["NDC", summary.ndc],
                ["NNPP", summary.nnpp],
                ["NRM", summary.nrm],
                ["PDP", summary.pdp],
                ["PRP", summary.prp],
                ["SDP", summary.sdp],
                ["YPP", summary.ypp],
                ["ZLP", summary.zlp]

              ]

                .sort(
                  (a, b) =>
                    Number(b[1]) -
                    Number(a[1])
                )

                .map(
                  ([party, votes]) => (

                    <tr key={party}>

                      <td
                        style={cellStyle}
                      >
                        {party}
                      </td>

                      <td
                        style={cellStyle}
                      >
                        {votes}
                      </td>

                    </tr>
                  )
                )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Card({

  title,
  value

}) {

  return (

    <div style={cardStyle}>

      <h4>{title}</h4>

      <h2>{value}</h2>

    </div>
  );
}

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "15px",

  marginBottom: "25px"
};

const cardStyle = {

  backgroundColor: "#fff",

  padding: "20px",

  borderRadius: "10px",

  textAlign: "center",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)"
};

const winnerCard = {

  backgroundColor: "#fff",

  padding: "30px",

  borderRadius: "10px",

  textAlign: "center",

  marginBottom: "25px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)"
};

const tableContainer = {

  backgroundColor: "#fff",

  padding: "20px",

  borderRadius: "10px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)"
};

const tableStyle = {

  width: "100%",

  borderCollapse: "collapse"
};

const headerStyle = {

  backgroundColor: "#0f172a",

  color: "#fff",

  padding: "12px",

  border: "1px solid #334155"
};

const cellStyle = {

  padding: "10px",

  border: "1px solid #e5e7eb",

  textAlign: "center"
};

export default StateDashboard;