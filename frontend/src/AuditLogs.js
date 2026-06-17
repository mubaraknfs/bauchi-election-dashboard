import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard-jjkdrh8lz.vercel.app";

function AuditLogs() {

  const [logs, setLogs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  /*
  ====================================
  FETCH LOGS
  ====================================
  */

  const fetchLogs =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(

            `${API_URL}/api/audit-logs`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setLogs(
          response.data
        );

      } catch (error) {

        console.error(
          "AUDIT LOG ERROR:",
          error
        );
      }
    };

  /*
  ====================================
  AUTO REFRESH
  ====================================
  */

  useEffect(() => {

    fetchLogs();

    const interval =
      setInterval(
        fetchLogs,
        10000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  /*
  ====================================
  FILTER
  ====================================
  */

  const filteredLogs =
    logs.filter(
      (log) =>
        JSON.stringify(log)
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /*
  ====================================
  ACTION COLOR
  ====================================
  */

  const getActionColor =
    (action) => {

      switch (action) {

        case "APPROVE_RESULT":
          return "#16a34a";

        case "REJECT_RESULT":
          return "#dc2626";

        case "SUBMIT_RESULT":
          return "#2563eb";

        case "CREATE_USER":
          return "#7c3aed";

        case "LOGIN":
          return "#0891b2";

        default:
          return "#475569";
      }
    };

  return (

    <div style={pageStyle}>

      <h1
        style={{
          marginBottom: "20px"
        }}
      >
        Audit Logs
      </h1>

      {/* SUMMARY */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <h4>Total Logs</h4>
          <h2>
            {logs.length}
          </h2>
        </div>

        <div style={summaryCard}>
          <h4>Submissions</h4>
          <h2>
            {
              logs.filter(
                (l) =>
                  l.action_type ===
                  "SUBMIT_RESULT"
              ).length
            }
          </h2>
        </div>

        <div style={summaryCard}>
          <h4>Approvals</h4>
          <h2>
            {
              logs.filter(
                (l) =>
                  l.action_type ===
                  "APPROVE_RESULT"
              ).length
            }
          </h2>
        </div>

        <div style={summaryCard}>
          <h4>Rejections</h4>
          <h2>
            {
              logs.filter(
                (l) =>
                  l.action_type ===
                  "REJECT_RESULT"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <div
        style={{
          marginBottom: "15px"
        }}
      >

        <input
          type="text"
          placeholder="Search logs..."
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

              <th style={headerStyle}>
                ID
              </th>

              <th style={headerStyle}>
                User ID
              </th>

              <th style={headerStyle}>
                Role
              </th>

              <th style={headerStyle}>
                Action
              </th>

              <th style={headerStyle}>
                Description
              </th>

              <th style={headerStyle}>
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredLogs.map(
                (
                  log,
                  index
                ) => (

                  <tr
                    key={log.id}
                    style={{
                      backgroundColor:

                        index % 2 === 0

                          ? "#ffffff"

                          : "#f8fafc"
                    }}
                  >

                    <td style={cellStyle}>
                      {log.id}
                    </td>

                    <td style={cellStyle}>
                      {log.user_id}
                    </td>

                    <td style={cellStyle}>
                      {log.user_role}
                    </td>

                    <td style={cellStyle}>

                      <span
                        style={{
                          backgroundColor:
                            getActionColor(
                              log.action_type
                            ),

                          color:
                            "#fff",

                          padding:
                            "6px 12px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "12px",

                          fontWeight:
                            "bold",

                          whiteSpace:
                            "nowrap"
                        }}
                      >

                        {
                          log.action_type
                        }

                      </span>

                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        minWidth:
                          "450px",
                        textAlign:
                          "left"
                      }}
                    >
                      {
                        log.action_description
                      }
                    </td>

                    <td style={cellStyle}>

                      {

                        new Date(
                          log.created_at
                        ).toLocaleString()

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

/*
====================================
SUMMARY
====================================
*/

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "15px",

  marginBottom: "20px"
};

const summaryCard = {

  backgroundColor:
    "#ffffff",

  borderRadius:
    "10px",

  padding: "20px",

  textAlign:
    "center",

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

  overflowY:
    "auto",

  maxHeight:
    "700px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const tableStyle = {

  width: "100%",

  borderCollapse:
    "collapse"
};

const headerStyle = {

  position:
    "sticky",

  top: 0,

  backgroundColor:
    "#0f172a",

  color:
    "#ffffff",

  padding:
    "12px",

  border:
    "1px solid #334155",

  whiteSpace:
    "nowrap",

  zIndex: 10
};

const cellStyle = {

  padding:
    "12px",

  border:
    "1px solid #e5e7eb",

  textAlign:
    "center"
};

export default AuditLogs;