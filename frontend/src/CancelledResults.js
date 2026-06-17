import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function CancelledResults() {

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  /*
  ====================================
  FETCH CANCELLED RESULTS
  ====================================
  */

  useEffect(() => {

    fetchResults();

  }, []);

  const fetchResults =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(

            `${API_URL}/api/cancelled-results`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setResults(
          response.data
        );

      } catch (error) {

        console.error(
          "Failed to fetch cancelled elections",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  ====================================
  FILTER
  ====================================
  */

  const filteredResults =
    results.filter((row) =>

      row.ward
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      row.polling_unit
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      row.cancellation_reason
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /*
  ====================================
  LOADING
  ====================================
  */

  if (loading) {

    return (

      <div style={pageStyle}>

        <h2>
          Loading cancelled elections...
        </h2>

      </div>
    );
  }

  return (

    <div style={pageStyle}>

      <h1 style={titleStyle}>
        🚫 Cancelled Elections
      </h1>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>

          <h4>
            Total Cancelled Polling Units
          </h4>

          <h1>
            {results.length}
          </h1>

        </div>

      </div>

      {/* SEARCH */}

      <div
        style={{
          marginBottom: "20px"
        }}
      >

        <input
          type="text"
          placeholder="Search ward, polling unit or reason..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={searchStyle}
        />

      </div>

      {/* TABLE */}

      <div style={tableContainer}>

        <table style={tableStyle}>

          <thead>

            <tr>

              <th style={thStyle}>
                Ward
              </th>

              <th style={thStyle}>
                Polling Unit
              </th>

              <th style={thStyle}>
                Cancellation Reason
              </th>

              <th style={thStyle}>
                Detailed Comment
              </th>

              <th style={thStyle}>
                Party Agent
              </th>

              <th style={thStyle}>
                Phone Number
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredResults.length === 0

                ?

                (

                  <tr>

                    <td
                      colSpan="6"
                      style={
                        emptyStyle
                      }
                    >

                      No cancelled elections found

                    </td>

                  </tr>

                )

                :

                filteredResults.map(

                  (
                    row,
                    index
                  ) => (

                    <tr

                      key={row.id}

                      style={{

                        backgroundColor:

                          index % 2 === 0

                            ? "#ffffff"

                            : "#f8fafc"
                      }}
                    >

                      <td style={tdStyle}>
                        {row.ward}
                      </td>

                      <td style={tdStyle}>
                        {row.polling_unit}
                      </td>

                      <td style={tdStyle}>

                        <span
                          style={
                            reasonBadge
                          }
                        >

                          {
                            row.cancellation_reason
                          }

                        </span>

                      </td>

                      <td style={tdStyle}>
                        {
                          row.cancellation_comment
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          row.party_agent
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          row.phone_number
                        }
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

/*
====================================
PAGE
====================================
*/

const pageStyle = {

  padding: "20px"
};

const titleStyle = {

  marginBottom: "20px",

  fontSize: "32px",

  fontWeight: "700"
};

/*
====================================
SUMMARY
====================================
*/

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",

  gap: "15px",

  marginBottom: "20px"
};

const summaryCard = {

  backgroundColor:
    "#ffffff",

  padding: "20px",

  borderRadius: "10px",

  textAlign: "center",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

/*
====================================
SEARCH
====================================
*/

const searchStyle = {

  width: "350px",

  padding: "10px",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "8px",

  outline: "none"
};

/*
====================================
TABLE
====================================
*/

const tableContainer = {

  backgroundColor:
    "#ffffff",

  borderRadius:
    "10px",

  overflowX:
    "auto",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const tableStyle = {

  width: "100%",

  borderCollapse:
    "collapse"
};

const thStyle = {

  backgroundColor:
    "#0f172a",

  color:
    "#ffffff",

  padding:
    "14px",

  border:
    "1px solid #334155",

  textAlign:
    "left",

  whiteSpace:
    "nowrap"
};

const tdStyle = {

  padding:
    "12px",

  border:
    "1px solid #e5e7eb",

  verticalAlign:
    "top"
};

const emptyStyle = {

  textAlign:
    "center",

  padding:
    "40px",

  color:
    "#64748b",

  fontWeight:
    "500"
};

const reasonBadge = {

  backgroundColor:
    "#dc2626",

  color:
    "#ffffff",

  padding:
    "6px 12px",

  borderRadius:
    "20px",

  fontSize:
    "12px",

  fontWeight:
    "bold",

  display:
    "inline-block"
};

export default CancelledResults;